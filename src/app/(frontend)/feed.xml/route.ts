import { asCategory, siteURL } from '@/lib/format'
import { findPosts, getSiteSettings } from '@/lib/payload'

export const revalidate = 600

const esc = (s = '') => s.replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c]!)

export async function GET() {
  const [settings, posts] = await Promise.all([getSiteSettings(), findPosts({ limit: 30 })])
  const base = siteURL()
  const items = posts.docs
    .map((p) => {
      const cat = asCategory(p.category)
      return `<item><title>${esc(p.title)}</title><link>${base}/article/${p.slug}</link><guid>${base}/article/${p.slug}</guid>${
        p.publishedAt ? `<pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate>` : ''
      }${cat ? `<category>${esc(cat.title)}</category>` : ''}<description>${esc(p.standfirst || '')}</description></item>`
    })
    .join('')
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${esc(settings.siteName)}</title><link>${base}</link><description>${esc(settings.tagline || '')}</description>${items}</channel></rss>`
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } })
}
