import { draftMode, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'

/** The dashboard's "Preview" button lands here. Only logged-in users can preview drafts. */
export async function GET(request: Request) {
  const path = new URL(request.url).searchParams.get('path') || '/'
  if (!path.startsWith('/') || path.startsWith('//')) return new Response('Invalid path', { status: 400 })

  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: await headers() })
  if (!user) return new Response('Please log in to the dashboard to preview drafts.', { status: 403 })

  ;(await draftMode()).enable()
  redirect(path)
}
