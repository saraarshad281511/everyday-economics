'use server'
import { getPayloadClient } from '@/lib/payload'

export type SubscribeState = { ok: boolean; message: string } | null

export async function subscribe(_prev: SubscribeState, formData: FormData): Promise<SubscribeState> {
  // Simple bot trap: real people never fill in the hidden "website" field
  if (formData.get('website')) return { ok: true, message: 'Thanks!' }
  const email = String(formData.get('email') || '').trim().toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) {
    return { ok: false, message: 'Please enter a valid email address.' }
  }
  const payload = await getPayloadClient()
  const existing = await payload.find({
    collection: 'subscribers',
    where: { email: { equals: email } },
    limit: 1,
    depth: 0,
  })
  if (existing.totalDocs === 0) {
    await payload.create({ collection: 'subscribers', data: { email } })
  }
  return { ok: true, message: 'You’re on the list. Look out for our next issue.' }
}
