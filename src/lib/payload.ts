import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import { getPayload, type Where } from 'payload'
import { cache } from 'react'

export const getPayloadClient = () => getPayload({ config: configPromise })

/** Only show articles that are published and whose publish date has arrived */
export const liveOnly = (): Where => ({
  and: [
    { _status: { equals: 'published' } },
    { publishedAt: { less_than_equal: new Date().toISOString() } },
  ],
})

export const getSiteSettings = cache(async () => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'site-settings', depth: 0 })
})

export const getCategories = cache(async () => {
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'categories', sort: 'navOrder', limit: 50, depth: 0 })
  return res.docs
})

export const getFooterPages = cache(async () => {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'pages',
    where: { showInFooter: { equals: true } },
    limit: 20,
    depth: 0,
    select: { title: true, slug: true },
  })
  return res.docs
})

type PostQuery = { where?: Where; limit?: number; page?: number; sort?: string }

export async function findPosts({ where, limit = 10, page = 1, sort = '-publishedAt' }: PostQuery = {}) {
  const payload = await getPayloadClient()
  return payload.find({
    collection: 'posts',
    where: where ? { and: [liveOnly(), where] } : liveOnly(),
    limit,
    page,
    sort,
    depth: 2,
    overrideAccess: false,
  })
}

/** Fetch one article. In preview mode, drafts are returned too. */
export const getPostBySlug = cache(async (slug: string) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'posts',
    where: draft ? { slug: { equals: slug } } : { and: [liveOnly(), { slug: { equals: slug } }] },
    draft,
    overrideAccess: draft,
    limit: 1,
    depth: 2,
  })
  return res.docs[0] ?? null
})
