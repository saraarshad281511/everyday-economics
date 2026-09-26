'use client'
import React, { useEffect, useRef } from 'react'

/** Thin bar at the top of the screen that fills as you read the article */
export function ReadingProgress({ targetId = 'article-body' }: { targetId?: string }) {
  const bar = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = document.getElementById(targetId)
    if (!el) return
    let frame = 0
    const update = () => {
      frame = 0
      const rect = el.getBoundingClientRect()
      const total = rect.height - window.innerHeight * 0.6
      const done = Math.min(1, Math.max(0, -rect.top / Math.max(1, total)))
      if (bar.current) bar.current.style.transform = `scaleX(${done})`
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [targetId])
  return (
    <div className="progress" aria-hidden>
      <div ref={bar} className="progress__bar" />
    </div>
  )
}
