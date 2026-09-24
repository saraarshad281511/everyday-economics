import type { Category } from '@/payload-types'
import Link from 'next/link'
import React from 'react'
import { MobileMenu } from './MobileMenu'

export function Header({
  siteName,
  tagline,
  categories,
}: {
  siteName: string
  tagline?: string | null
  categories: Category[]
}) {
  const today = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Karachi',
  }).format(new Date())

  return (
    <header className="site-header">
      <div className="topbar container">
        <MobileMenu categories={categories} />
        <span className="topbar__date">{today}</span>
        <div className="topbar__actions">
          <Link href="/search" className="topbar__link" aria-label="Search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <span className="hide-sm">Search</span>
          </Link>
          <a href="#newsletter" className="btn btn--small">
            Subscribe
          </a>
        </div>
      </div>
      <div className="masthead container">
        <Link href="/" className="masthead__name">
          {siteName}
        </Link>
        {tagline && <p className="masthead__tagline">{tagline}</p>}
      </div>
      <nav className="mainnav" aria-label="Sections">
        <ul className="container">
          <li>
            <Link href="/">Home</Link>
          </li>
          {categories.map((c) => (
            <li key={c.id}>
              <Link href={`/${c.slug}`}>{c.title}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
