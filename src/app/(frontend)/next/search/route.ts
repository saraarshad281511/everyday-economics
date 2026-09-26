import { asCategory } from '@/lib/format'
import { findPosts } from '@/lib/payload'

/** Quick search used by the "search as you type" box. */
export async function GET(request: Request) {
  const q = (new URL(request.url).searchParams.get('q') || '').trim().slice(0, 100)
  if (q.length < 2) return Response.json({ results: [] })
  const res = await findPosts({
    where: { or: [{ title: { like: q } }, { standfirst: { like: q } }, { tags: { in: [q] } }] },
    limit: 6,
  })
  return Response.json(
    {
      results: res.docs.map((p) => ({
        title: p.title,
        slug: p.slug,
        section: p.isOpinion ? 'Opinion' : asCategory(p.category)?.title || '',
      })),
    },
    { headers: { 'Cache-Control': 'public, s-maxage=30' } },
  )
}
