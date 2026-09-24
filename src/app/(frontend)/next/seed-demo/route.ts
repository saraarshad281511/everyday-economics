import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { getPayloadClient } from '@/lib/payload'
import { seedContent } from '@/seed/content'

// Creating the sample images can take a little while
export const maxDuration = 60

const page = (title: string, body: string) =>
  new Response(
    `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${title}</title>
<body style="font-family:system-ui;max-width:560px;margin:60px auto;padding:0 16px;line-height:1.5">
<h1 style="font-family:Georgia,serif">${title}</h1>${body}</body>`,
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } },
  )

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

  try {
    const result = await seedContent(payload)
    revalidatePath('/', 'layout')
    return page(
      'Sample content added',
      `<p>${result.articlesCreated} new articles were added (${result.totalArticles} sample articles in total).</p>
       <p><a href="/">View the website →</a></p>
       <p style="color:#666">If some are missing, refresh this page once. It will carry on where it stopped.</p>`,
    )
  } catch (err) {
    payload.logger.error(err)
    return page(
      'Something went wrong',
      `<p>Refresh this page to try again. It will carry on where it stopped.</p><pre style="white-space:pre-wrap;color:#a00">${String(
        (err as Error)?.message || err,
      ).replace(/</g, '&lt;')}</pre>`,
    )
  }
}
