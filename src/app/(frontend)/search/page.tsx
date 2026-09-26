import type { Metadata } from 'next'
import type { Where } from 'payload'
import React from 'react'
import { LiveSearch } from '@/components/site/interactive/LiveSearch'
import { Pagination } from '@/components/site/Pagination'
import { StoryCard } from '@/components/site/StoryCard'
import { findPosts } from '@/lib/payload'

export const metadata: Metadata = { title: 'Search', robots: { index: false } }

type Props = { searchParams: Promise<{ q?: string; tag?: string; page?: string }> }

export default async function SearchPage({ searchParams }: Props) {
  const sp = await searchParams
  const q = (sp.q || '').trim().slice(0, 100)
  const tag = (sp.tag || '').trim().slice(0, 60)
  const pageNum = Math.max(1, Number(sp.page) || 1)

  let where: Where | null = null
  if (tag) where = { tags: { in: [tag] } }
  else if (q) where = { or: [{ title: { like: q } }, { standfirst: { like: q } }, { tags: { in: [q] } }] }

  const results = where ? await findPosts({ where, limit: 15, page: pageNum }) : null
  const base = tag ? `/search?tag=${encodeURIComponent(tag)}` : `/search?q=${encodeURIComponent(q)}`

  return (
    <div className="container">
      <header className="page-header">
        <h1 className="page-header__title">{tag ? `Topic: ${tag}` : 'Search'}</h1>
        <LiveSearch initial={q} autoFocus={!q && !tag} />
      </header>
      {results && (
        <>
          <p className="meta">
            {results.totalDocs} result{results.totalDocs === 1 ? '' : 's'}
            {q && !tag ? ` for “${q}”` : ''}
          </p>
          <div className="stream">
            {results.docs.map((p) => (
              <StoryCard key={p.id} post={p} variant="row" />
            ))}
          </div>
          <Pagination page={pageNum} totalPages={results.totalPages} base={base} />
        </>
      )}
    </div>
  )
}
