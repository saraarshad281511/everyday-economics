'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useId, useRef, useState } from 'react'

type Result = { title: string; slug: string; section: string }

/** Search box that shows matching articles while you type. Enter shows the full results page. */
export function LiveSearch({ initial = '', autoFocus = false }: { initial?: string; autoFocus?: boolean }) {
  const [q, setQ] = useState(initial)
  const [results, setResults] = useState<Result[]>([])
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const listId = useId()
  const lastQuery = useRef('')

  useEffect(() => {
    const term = q.trim()
    if (term.length < 2 || term === initial.trim()) {
      setResults([])
      setLoading(false)
      return
    }
    setLoading(true)
    const ctrl = new AbortController()
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/next/search?q=${encodeURIComponent(term)}`, { signal: ctrl.signal })
        const data = (await res.json()) as { results: Result[] }
        lastQuery.current = term
        setResults(data.results)
        setOpen(true)
        setActive(-1)
      } catch {
        /* typing again cancels the previous search */
      } finally {
        setLoading(false)
      }
    }, 250)
    return () => {
      clearTimeout(t)
      ctrl.abort()
    }
  }, [q, initial])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open || results.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => (a + 1) % results.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => (a <= 0 ? results.length - 1 : a - 1))
    } else if (e.key === 'Enter' && active >= 0) {
      e.preventDefault()
      router.push(`/article/${results[active].slug}`)
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  const showList = open && q.trim().length >= 2 && q.trim() !== initial.trim()

  return (
    <form className="search-form live-search" action="/search" role="search" onSubmit={() => setOpen(false)}>
      <label htmlFor="q" className="sr-only">
        Search articles
      </label>
      <div className="live-search__field">
        <input
          id="q"
          name="q"
          type="search"
          value={q}
          onChange={(e) => {
            setQ(e.target.value)
            setOpen(true)
          }}
          onKeyDown={onKeyDown}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onFocus={() => results.length && setOpen(true)}
          placeholder="Search articles…"
          autoComplete="off"
          autoFocus={autoFocus}
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
        />
        {showList && (
          <ul id={listId} className="live-search__list" role="listbox">
            {loading && results.length === 0 && <li className="live-search__empty">Searching…</li>}
            {!loading && results.length === 0 && lastQuery.current && (
              <li className="live-search__empty">No articles found. Press Enter to search everything.</li>
            )}
            {results.map((r, i) => (
              <li key={r.slug} id={`${listId}-${i}`} role="option" aria-selected={i === active}>
                <Link href={`/article/${r.slug}`} className={i === active ? 'is-active' : ''} onClick={() => setOpen(false)}>
                  {r.section && <span className="kicker">{r.section}</span>}
                  <span>{r.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
      <button className="btn">Search</button>
    </form>
  )
}
