import type { MetadataRoute } from 'next'
import { siteURL } from '@/lib/format'
import { findPosts, getCategories, getPayloadClient } from '@/lib/payload'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteURL()
  const payload = await getPayloadClient()
  const [categories, posts, pages] = await Promise.all([
    getCategories(),
    findPosts({ limit: 1000 }),
    payload.find({ collection: 'pages', limit: 100, depth: 0 }),
  ])
  return [
    { url: base, changeFrequency: 'hourly', priority: 1 },
    ...categories.map((c) => ({ url: `${base}/${c.slug}`, changeFrequency: 'daily' as const })),
    ...posts.docs.map((p) => ({ url: `${base}/article/${p.slug}`, lastModified: p.updatedAt })),
    ...pages.docs.map((p) => ({ url: `${base}/${p.slug}`, lastModified: p.updatedAt })),
  ]
}
