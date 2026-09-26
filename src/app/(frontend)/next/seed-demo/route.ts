import { sql } from '@payloadcms/db-postgres'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { getPayloadClient } from '@/lib/payload'
import { seedContent } from '@/seed/content'

// Creating the sample images can take a little while
export const maxDuration = 60

const esc = (s: string) => s.replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' })[c]!)

const page = (title: string, body: string) =>
  new Response(
    `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${title}</title>
<body style="font-family:system-ui;max-width:640px;margin:60px auto;padding:0 16px;line-height:1.5">
<h1 style="font-family:Georgia,serif">${title}</h1>${body}</body>`,
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } },
  )

/** Turns whatever Payload logged into readable text */
const describe = (args: unknown[]) =>
  args
    .map((a) => {
      if (a instanceof Error) return `${a.name}: ${a.message}`
      if (a && typeof a === 'object') {
        const o = a as { err?: Error; msg?: string; message?: string }
        if (o.err instanceof Error) return `${o.err.name}: ${o.err.message}`
        return o.msg || o.message || JSON.stringify(a).slice(0, 500)
      }
      return String(a)
    })
    .join(' ')

/**
 * Fills the site with sample articles. Only a logged-in Admin can run it.
 * Visit /next/seed-demo while logged in to the dashboard.
 */
export async function GET() {
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: await headers() })
  if (!user || (user as { role?: string }).role !== 'admin') {
    return page('Please log in first', '<p>Log in to the <a href="/admin">dashboard</a> as an Admin, then open this page again.</p>')
  }

  // Capture the detailed errors Payload logs, so they can be shown on this page
  const logged: string[] = []
  const logger = payload.logger as unknown as { error: (...args: unknown[]) => void }
  const originalError = logger.error
  logger.error = (...args: unknown[]) => {
    logged.push(describe(args))
    originalError.apply(payload.logger, args)
  }

  try {
    // 1. Repair: find pictures whose file can't be loaded (e.g. saved during a failed upload) and remove them,
    //    so they get re-created below. Done directly in the database so nothing tries to delete a missing file.
    let repaired = 0
    const media = await payload.find({ collection: 'media', limit: 500, depth: 0, pagination: false })
    const base = process.env.NEXT_PUBLIC_SERVER_URL || ''
    const broken: number[] = []
    await Promise.all(
      media.docs.map(async (m) => {
        if (!m.url) return broken.push(m.id)
        try {
          const url = m.url.startsWith('http') ? m.url : new URL(m.url, base).toString()
          // Ask for just the first byte of the file – enough to know it exists
          const res = await fetch(url, {
            cache: 'no-store',
            headers: { Range: 'bytes=0-0' },
            signal: AbortSignal.timeout(8000),
          })
          await res.arrayBuffer()
          if (!res.ok) broken.push(m.id)
        } catch {
          broken.push(m.id)
        }
      }),
    )
    if (broken.length) {
      const drizzle = (payload.db as unknown as { drizzle: { execute: (q: unknown) => Promise<unknown> } }).drizzle
      for (const id of broken) {
        // Articles/authors pointing at this picture are cleared automatically by the database
        await drizzle.execute(sql`DELETE FROM "media" WHERE "id" = ${id}`)
        repaired++
      }
    }

    // 2. Fill in anything missing (articles, pictures, pages)
    const result = await seedContent(payload, () => {}, 35_000)
    revalidatePath('/', 'layout')
    const imageNote = result.imageError
      ? `<div style="background:#fff4e5;border:1px solid #f0c27a;padding:12px 16px;margin:16px 0">
           <p><strong>The articles are there, but the pictures couldn't be saved.</strong>
           Send this message to your developer:</p>
           <pre style="white-space:pre-wrap;font-size:13px">${esc(result.imageError)}${
             logged.length ? '\n\nDetails:\n' + esc(logged.join('\n').slice(0, 2000)) : ''
           }</pre>
           <p>Once it's fixed, open this page again to add the missing pictures.</p></div>`
      : ''
    return page(
      'Sample content added',
      `${repaired ? `<p>${repaired} broken pictures were removed and replaced.</p>` : ''}
       <p>${result.articlesCreated} new articles added, ${result.imagesAdded} pictures added
       (${result.totalArticles} sample articles in total).</p>${imageNote}${
         result.imagesPending && !result.imageError
           ? `<p style="background:#eef6ee;border:1px solid #9c9;padding:12px 16px"><strong>${result.imagesPending} pictures still to add.</strong>
              Refresh this page to continue.</p>`
           : ''
       }
       <p><a href="/">View the website →</a></p>`,
    )
  } catch (err) {
    return page(
      'Something went wrong',
      `<p>Refresh this page to try again. It will carry on where it stopped. If it keeps failing, send this to your developer:</p>
       <pre style="white-space:pre-wrap;color:#a00">${esc(String((err as Error)?.message || err))}${
         logged.length ? '\n\nDetails:\n' + esc(logged.join('\n').slice(0, 2000)) : ''
       }</pre>`,
    )
  } finally {
    logger.error = originalError
  }
}
