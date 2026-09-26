'use client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { readSaved, SAVED_EVENT, writeSaved, type SavedArticle } from './saved'

export function SavedList() {
  const [list, setList] = useState<SavedArticle[] | null>(null)
  useEffect(() => {
    const sync = () => setList(readSaved())
    sync()
    window.addEventListener(SAVED_EVENT, sync)
    return () => window.removeEventListener(SAVED_EVENT, sync)
  }, [])

  if (list === null) return null
  if (list.length === 0)
    return (
      <p className="empty-note">
        Nothing saved yet. Tap <strong>Save</strong> on any article to read it later. Saved articles are kept on this
        device only.
      </p>
    )

  return (
    <div className="stream">
      {list.map((a) => (
        <article key={a.slug} className="card card--saved">
          <div>
            {a.section && <span className="kicker">{a.section}</span>}
            <h2 className="headline headline--md">
              <Link href={`/article/${a.slug}`}>{a.title}</Link>
            </h2>
            {a.standfirst && <p className="standfirst standfirst--sm">{a.standfirst}</p>}
          </div>
          <button
            type="button"
            className="pill"
            onClick={() => writeSaved(readSaved().filter((x) => x.slug !== a.slug))}
            aria-label={`Remove “${a.title}” from saved`}
          >
            Remove
          </button>
        </article>
      ))}
    </div>
  )
}
