import { headers } from 'next/headers'
import { getPayloadClient } from '@/lib/payload'

/** Downloads all newsletter subscribers as a CSV file (Admins and Editors only) */
export async function GET() {
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: await headers() })
  const role = (user as { role?: string } | null)?.role
  if (!user || (role !== 'admin' && role !== 'editor')) {
    return new Response('Please log in to the dashboard first.', { status: 403 })
  }
  const res = await payload.find({ collection: 'subscribers', limit: 0, pagination: false, sort: 'createdAt', depth: 0 })
  const cell = (v: string) => `"${v.replace(/"/g, '""')}"`
  const rows = [
    ['Email', 'Subscribed on'],
    ...res.docs.map((s) => [s.email, new Date(s.createdAt).toISOString().slice(0, 10)]),
  ]
  const csv = '﻿' + rows.map((r) => r.map(cell).join(',')).join('\r\n')
  const date = new Date().toISOString().slice(0, 10)
  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="subscribers-${date}.csv"`,
      'Cache-Control': 'no-store',
    },
  })
}
