'use client'
import { useEffect } from 'react'

/** Adds a class to <html> once the big masthead has scrolled out of view, so the menu bar can show a compact title. */
export function StickyWatcher() {
  useEffect(() => {
    const target = document.querySelector('.masthead')
    if (!target) return
    const io = new IntersectionObserver(([entry]) => {
      document.documentElement.classList.toggle('is-scrolled', !entry.isIntersecting)
    })
    io.observe(target)
    return () => io.disconnect()
  }, [])
  return null
}
