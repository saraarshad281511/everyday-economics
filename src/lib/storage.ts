/**
 * Where pictures are stored.
 * - Cloudflare R2 (used on Netlify): set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_PUBLIC_URL
 * - Vercel Blob (the original Vercel setup): set BLOB_READ_WRITE_TOKEN
 * - Neither: pictures are saved on the local disk (development only)
 */
export const r2 = {
  accountId: process.env.R2_ACCOUNT_ID || '',
  accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  bucket: process.env.R2_BUCKET || '',
  publicUrl: (process.env.R2_PUBLIC_URL || '').replace(/\/+$/, ''),
  // Lets tests point at a stand-in server instead of Cloudflare
  endpoint: process.env.R2_ENDPOINT || '',
}

export const useR2 = Boolean(r2.accessKeyId && r2.secretAccessKey && r2.bucket && r2.publicUrl && (r2.accountId || r2.endpoint))

export const r2Endpoint = () => r2.endpoint || `https://${r2.accountId}.r2.cloudflarestorage.com`

/** Folder + file name of a stored picture, the same way the storage plugin builds it */
export function storageKey(filename: string, doc: { prefix?: string | null; _objectKey?: string | null }) {
  const clean = (s?: string | null) => (s ?? '').replace(/^\/+|\/+$/g, '')
  const folder = [clean(doc.prefix), clean(doc._objectKey)].filter(Boolean).join('/')
  return folder ? `${folder}/${filename}` : filename
}

/** Public address of a stored picture on R2 */
export function r2FileURL(filename: string, prefix?: string) {
  const key = prefix ? `${prefix.replace(/^\/+|\/+$/g, '')}/${encodeURIComponent(filename)}` : encodeURIComponent(filename)
  return `${r2.publicUrl}/${key}`
}
