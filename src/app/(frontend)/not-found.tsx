import Link from 'next/link'
import React from 'react'

export default function NotFound() {
  return (
    <div className="container empty">
      <h1 className="headline headline--xl">Page not found</h1>
      <p>
        The page you were looking for doesn’t exist or has moved. <Link href="/">Back to the homepage</Link> or{' '}
        <Link href="/search">search our articles</Link>.
      </p>
    </div>
  )
}
