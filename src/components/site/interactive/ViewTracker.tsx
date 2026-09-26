'use client'
import { useEffect } from 'react'

/** Counts one read per article per browser session (for "Most read") */
export function ViewTracker({ id }: { id: number }) {
  useEffect(() => {
    const key = `ee-viewed-${id}`
    try {
      if (sessionStorage.getItem(key)) return
      sessionStorage.setItem(key, '1')
    } catch {}
    const t = setTimeout(() => {
      fetch('/next/view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
        keepalive: true,
      }).catch(() => {})
    }, 3000) // only count people who stay at least a few seconds
    return () => clearTimeout(t)
  }, [id])
  return null
}
