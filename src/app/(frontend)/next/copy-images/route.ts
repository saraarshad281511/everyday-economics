import { HeadObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { getPayloadClient } from '@/lib/payload'
import { r2, r2Endpoint, storageKey, useR2 } from '@/lib/storage'

// Netlify allows up to 60 seconds; stop well before that and continue on the next refresh
export const maxDuration = 60
const TIME_BUDGET_MS = 40_000

const esc = (s: string) => s.replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' })[c]!)
const page = (title: string, body: string) =>
  new Response(
    `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${title}</title>
<body style="font-family:system-ui;max-width:640px;margin:60px auto;padding:0 16px;line-height:1.5">
<h1 style="font-family:Georgia,serif">${title}</h1>${body}</body>`,
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } },
  )

/**
 * One-time move of pictures from the old storage (Vercel Blob) to Cloudflare R2.
 * Needs OLD_MEDIA_BASE_URL (e.g. https://xxxx.public.blob.vercel-storage.com) and the R2_* settings.
 * Open /next/copy-images while logged in as an Admin; refresh until it says everything is copied.
 */
export async function GET() {
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: await headers() })
  if (!user || (user as { role?: string }).role !== 'admin') {
    return page('Please log in first', '<p>Log in to the <a href="/admin">dashboard</a> as an Admin, then open this page again.</p>')
  }
  const oldBase = (process.env.OLD_MEDIA_BASE_URL || '').replace(/\/+$/, '')
  if (!useR2 || !oldBase) {
    return page(
      'Not set up yet',
      `<p>This page needs these settings on the hosting (Netlify → Site configuration → Environment variables):</p>
       <ul><li>R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_PUBLIC_URL ${useR2 ? '✓' : '✗ missing'}</li>
       <li>OLD_MEDIA_BASE_URL ${oldBase ? '✓' : '✗ missing'}</li></ul>`,
    )
  }

  const client = new S3Client({
    endpoint: r2Endpoint(),
    region: 'auto',
    forcePathStyle: true,
    credentials: { accessKeyId: r2.accessKeyId, secretAccessKey: r2.secretAccessKey },
    requestChecksumCalculation: 'WHEN_REQUIRED',
    responseChecksumValidation: 'WHEN_REQUIRED',
  })
  const exists = async (Key: string) => {
    try {
      await client.send(new HeadObjectCommand({ Bucket: r2.bucket, Key }))
      return true
    } catch {
      return false
    }
  }

  const started = Date.now()
  const media = await payload.find({ collection: 'media', limit: 0, pagination: false, depth: 0 })
  let copied = 0
  let already = 0
  let pending = 0
  const missing: string[] = []

  for (const m of media.docs) {
    const doc = m as unknown as { filename?: string | null; mimeType?: string | null; prefix?: string | null; _objectKey?: string | null; sizes?: Record<string, { filename?: string | null; mimeType?: string | null }> }
    const files = [
      { filename: doc.filename, mimeType: doc.mimeType },
      ...Object.values(doc.sizes ?? {}).map((s) => ({ filename: s?.filename, mimeType: s?.mimeType })),
    ].filter((f): f is { filename: string; mimeType: string | null } => Boolean(f.filename))

    for (const f of files) {
      const key = storageKey(f.filename, doc)
      if (Date.now() - started > TIME_BUDGET_MS) {
        pending++
        continue
      }
      if (await exists(key)) {
        already++
        continue
      }
      const res = await fetch(`${oldBase}/${key.split('/').map(encodeURIComponent).join('/')}`, { cache: 'no-store' })
      if (!res.ok) {
        missing.push(key)
        continue
      }
      const body = Buffer.from(await res.arrayBuffer())
      await client.send(
        new PutObjectCommand({
          Bucket: r2.bucket,
          Key: key,
          Body: body,
          ContentType: f.mimeType || res.headers.get('content-type') || 'application/octet-stream',
          CacheControl: 'public, max-age=31536000',
        }),
      )
      copied++
    }
  }

  if (copied) revalidatePath('/', 'layout')
  const done = pending === 0
  return page(
    done ? 'All pictures copied ✓' : 'Copying pictures…',
    `<p>${copied} copied now · ${already} were already there${pending ? ` · <strong>${pending} still to go – refresh this page to continue</strong>` : ''}.</p>
     ${
       missing.length
         ? `<p>${missing.length} file(s) could not be found in the old storage (they were probably never uploaded – you can re-add those pictures in the dashboard or with /next/seed-demo):</p>
            <pre style="white-space:pre-wrap;font-size:12px;background:#f5f5f5;padding:10px">${esc(missing.slice(0, 30).join('\n'))}${missing.length > 30 ? '\n…' : ''}</pre>`
         : ''
     }
     ${done ? '<p><a href="/">View the website →</a></p>' : ''}`,
  )
}
