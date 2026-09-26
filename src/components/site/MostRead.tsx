import type { Post } from '@/payload-types'
import Link from 'next/link'
import React from 'react'

export function MostRead({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null
  return (
    <section className="most-read" aria-labelledby="most-read-h">
      <h2 id="most-read-h" className="rule-heading">
        Most read
      </h2>
      <ol>
        {posts.map((p) => (
          <li key={p.id}>
            <Link href={`/article/${p.slug}`} className="headline headline--sm">
              {p.title}
            </Link>
          </li>
        ))}
      </ol>
    </section>
  )
}
