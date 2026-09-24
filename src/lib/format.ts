import type { Category, Media, Post, User } from '@/payload-types'

export const formatDate = (iso?: string | null, withTime = false) => {
  if (!iso) return ''
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...(withTime ? { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Karachi' } : {}),
  }).format(new Date(iso))
}

export const timeAgo = (iso?: string | null) => {
  if (!iso) return ''
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000)
  if (mins < 60) return `${Math.max(1, mins)} min ago`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  const days = Math.round(hours / 24)
  if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`
  return formatDate(iso)
}

export const asCategory = (c: Post['category'] | undefined) =>
  c && typeof c === 'object' ? (c as Category) : null

export const asMedia = (m: unknown) => (m && typeof m === 'object' ? (m as Media) : null)

export const asAuthors = (a: Post['authors']) =>
  (a ?? []).filter((x): x is User => Boolean(x) && typeof x === 'object')

export const siteURL = () => process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
