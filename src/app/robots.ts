import type { MetadataRoute } from 'next'
import { siteURL } from '@/lib/format'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/next/'] },
    sitemap: `${siteURL()}/sitemap.xml`,
  }
}
