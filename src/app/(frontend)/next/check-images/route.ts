import { headers } from 'next/headers'
import sharp from 'sharp'
import { getPayloadClient } from '@/lib/payload'

export const maxDuration = 30

const esc = (s: string) => s.replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' })[c]!)
const page = (title: string, body: string) =>
  new Response(
    `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${title}</title>
<body style="font-family:system-ui;max-width:640px;margin:60px auto;padding:0 16px;line-height:1.5">
<h1 style="font-family:Georgia,serif">${title}</h1>${body}</body>`,
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } },
  )

/**
 * Picture health check: uploads a tiny test picture, checks it can be viewed, then deletes it.
 * Open /next/check-images while logged in as an Admin.
 */
export async function GET() {
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: await headers() })
  if (!user || (user as { role?: string }).role !== 'admin') {
    return page('Please log in first', '<p>Log in to the <a href="/admin">dashboard</a> as an Admin, then open this page again.</p>')
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN || ''
  const lines: string[] = []
  lines.push(`Blob token present: ${token ? 'yes' : 'NO'}`)
  if (token) {
    const looksRight = /^vercel_blob_rw_[a-z\d]+_[a-z\d]+$/i.test(token)
    lines.push(`Blob token format OK: ${looksRight ? 'yes' : 'NO (check for quotes or spaces around it)'}`)
  }

  const logged: string[] = []
  const logger = payload.logger as unknown as { error: (...args: unknown[]) => void }
  const originalError = logger.error
  logger.error = (...args: unknown[]) => {
    logged.push(args.map((a) => (a instanceof Error ? a.message : typeof a === 'object' ? JSON.stringify(a)?.slice(0, 300) : String(a))).join(' '))
    originalError.apply(payload.logger, args)
  }

  let ok = false
  let testId: number | undefined
  try {
    const img = await sharp({ create: { width: 64, height: 36, channels: 3, background: '#0f3d3e' } }).jpeg().toBuffer()
    lines.push('Picture processing (sharp): OK')
    const doc = await payload.create({
      collection: 'media',
      data: { alt: 'Upload test (safe to delete)' },
      file: { data: img, mimetype: 'image/jpeg', name: `upload-test-${Date.now()}.jpg`, size: img.length },
      context: { disableRevalidate: true },
    })
    testId = doc.id
    lines.push('Upload: OK')
    const url = doc.url?.startsWith('http') ? doc.url : new URL(doc.url || '', process.env.NEXT_PUBLIC_SERVER_URL).toString()
    lines.push(`Picture address: ${url}`)
    const res = await fetch(url, { cache: 'no-store' })
    lines.push(`Viewing the picture: ${res.ok ? 'OK' : `FAILED (status ${res.status})`}`)
    ok = res.ok
  } catch (err) {
    lines.push(`FAILED: ${(err as Error)?.message || err}`)
  } finally {
    if (testId) await payload.delete({ collection: 'media', id: testId, context: { disableRevalidate: true } }).catch(() => {})
    logger.error = originalError
  }
  if (logged.length) lines.push('', 'Details:', ...logged.slice(0, 8))

  return page(
    ok ? 'Pictures are working ✓' : 'Pictures are not working yet',
    `${ok ? '<p>Open <a href="/next/seed-demo">/next/seed-demo</a> to add the sample pictures.</p>' : '<p>Send this report to your developer:</p>'}
     <pre style="white-space:pre-wrap;background:#f5f5f5;padding:12px;font-size:13px">${esc(lines.join('\n'))}</pre>`,
  )
}
