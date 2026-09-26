'use client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { readSaved, SAVED_EVENT } from './saved'

/** Header link to the reader's saved articles, with a count */
export function SavedLink() {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const sync = () => setCount(readSaved().length)
    sync()
    window.addEventListener(SAVED_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(SAVED_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])
  return (
    <Link href="/saved" className="topbar__link" aria-label={`Saved articles (${count})`}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M6 3h12v18l-6-4-6 4z" />
      </svg>
      <span className="hide-sm">Saved</span>
      {count > 0 && <span className="badge">{count}</span>}
    </Link>
  )
}
