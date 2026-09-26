'use client'
import React, { useEffect, useState } from 'react'
import { readSaved, SAVED_EVENT, writeSaved, type SavedArticle } from './saved'

/** Save-for-later and copy-link buttons shown on each article */
export function ArticleActions({ article }: { article: Omit<SavedArticle, 'savedAt'> }) {
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const sync = () => setSaved(readSaved().some((a) => a.slug === article.slug))
    sync()
    window.addEventListener(SAVED_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(SAVED_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [article.slug])

  const toggleSave = () => {
    const list = readSaved().filter((a) => a.slug !== article.slug)
    if (!saved) list.unshift({ ...article, savedAt: Date.now() })
    writeSaved(list)
    setSaved(!saved)
  }

  const copy = async () => {
    const url = window.location.href.split('#')[0]
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      const input = document.createElement('input')
      input.value = url
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      input.remove()
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="article-actions">
      <button type="button" className={`pill ${saved ? 'pill--on' : ''}`} onClick={toggleSave} aria-pressed={saved}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M6 3h12v18l-6-4-6 4z" />
        </svg>
        {saved ? 'Saved' : 'Save'}
      </button>
      <button type="button" className="pill" onClick={copy}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" />
        </svg>
        <span aria-live="polite">{copied ? 'Link copied!' : 'Copy link'}</span>
      </button>
    </div>
  )
}
