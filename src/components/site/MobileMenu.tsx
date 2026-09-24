'use client'
import type { Category } from '@/payload-types'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export function MobileMenu({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  useEffect(() => setOpen(false), [pathname])

  return (
    <>
      <button className="menu-btn" aria-expanded={open} aria-controls="drawer" onClick={() => setOpen(!open)}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
        </svg>
        <span>Menu</span>
      </button>
      <div id="drawer" className={`drawer ${open ? 'drawer--open' : ''}`} hidden={!open}>
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>
          {categories.map((c) => (
            <li key={c.id}>
              <Link href={`/${c.slug}`}>{c.title}</Link>
            </li>
          ))}
          <li>
            <Link href="/search">Search</Link>
          </li>
        </ul>
      </div>
    </>
  )
}
