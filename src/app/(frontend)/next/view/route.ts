import { sql } from '@payloadcms/db-postgres'
import { getPayloadClient, liveOnly } from '@/lib/payload'

/** Counts one read of an article (called by the article page in the reader's browser). */
export async function POST(request: Request) {
  let id: number
  try {
    id = Number((await request.json())?.id)
  } catch {
    return Response.json({ ok: false }, { status: 400 })
  }
  if (!Number.isInteger(id) || id <= 0) return Response.json({ ok: false }, { status: 400 })

  const payload = await getPayloadClient()
  // Only count published, live articles
  const live = await payload.count({ collection: 'posts', where: { and: [liveOnly(), { id: { equals: id } }] } })
  if (!live.totalDocs) return Response.json({ ok: false }, { status: 404 })

  const drizzle = (payload.db as unknown as { drizzle: { execute: (q: unknown) => Promise<{ rows: unknown[] }> } }).drizzle
  const bump = () =>
    drizzle.execute(sql`UPDATE "page_views" SET "count" = COALESCE("count", 0) + 1, "updated_at" = now() WHERE "post_id" = ${id} RETURNING "id"`)

  let res = await bump()
  if (!res.rows.length) {
    try {
      await payload.create({ collection: 'page-views', data: { post: id, count: 1 }, overrideAccess: true })
    } catch {
      // Another reader created the row at the same moment – just count again
      res = await bump()
    }
  }
  return Response.json({ ok: true })
}
