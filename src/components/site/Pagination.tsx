import Link from 'next/link'
import React from 'react'

export function Pagination({ page, totalPages, base }: { page: number; totalPages: number; base: string }) {
  if (totalPages <= 1) return null
  const join = base.includes('?') ? '&' : '?'
  const href = (p: number) => (p === 1 ? base : `${base}${join}page=${p}`)
  return (
    <nav className="pagination" aria-label="Pages">
      {page > 1 ? <Link href={href(page - 1)}>‹ Newer</Link> : <span />}
      <span>
        Page {page} of {totalPages}
      </span>
      {page < totalPages ? <Link href={href(page + 1)}>Older ›</Link> : <span />}
    </nav>
  )
}
