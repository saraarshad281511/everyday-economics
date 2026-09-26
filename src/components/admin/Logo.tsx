import React from 'react'

export default function Logo() {
  return (
    <div style={{ textAlign: 'center', fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif' }}>
      <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
        The Everyday Economics<span style={{ color: '#c2410c' }}>.</span>
      </div>
      <div style={{ fontSize: 13, opacity: 0.7, marginTop: 6, fontFamily: 'system-ui, sans-serif' }}>
        Newsroom dashboard
      </div>
    </div>
  )
}
