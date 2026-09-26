import type { Category, SiteSetting } from '@/payload-types'
import Link from 'next/link'
import React from 'react'
import { SavedLink } from './interactive/SavedLink'
import { StickyWatcher } from './interactive/StickyWatcher'
import { ThemeToggle } from './interactive/ThemeToggle'
import { MobileMenu } from './MobileMenu'
import { Ticker } from './Ticker'

export function Header({
  siteName,
  tagline,
  categories,
  ticker,
}: {
  siteName: string
  tagline?: string | null
  categories: Category[]
  ticker?: SiteSetting['ticker']
}) {
  const today = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Karachi',
  }).format(new Date())

  return (
    <>
      <StickyWatcher />
      <div className="topbar-wrap">
        <div className="topbar container">
          <MobileMenu categories={categories} />
          <span className="topbar__date">{today}</span>
          <Link href="/" className="topbar__brand" tabIndex={-1} aria-hidden>
            {siteName}
          </Link>
          <div className="topbar__actions">
            <Link href="/search" className="topbar__link" aria-label="Search">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <span className="hide-sm">Search</span>
            </Link>
            <SavedLink />
            <ThemeToggle />
            <a href="#newsletter" className="btn btn--small hide-xs">
              Subscribe
            </a>
          </div>
        </div>
      </div>
      <header className="site-header">
        <div className="masthead container">
          <Link href="/" className="masthead__name">
            {siteName}
          </Link>
          {tagline && <p className="masthead__tagline">{tagline}</p>}
        </div>
      </header>
      <nav className="mainnav" aria-label="Sections">
        <div className="container mainnav__inner">
          <Link href="/" className="mainnav__brand" tabIndex={-1} aria-hidden>
            {siteName}
          </Link>
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
            {categories.map((c) => (
              <li key={c.id}>
                <Link href={`/${c.slug}`}>{c.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      <Ticker ticker={ticker} />
    </>
  )
}
