import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'
import { Pagination } from '@/components/site/Pagination'
import { RichText } from '@/components/site/RichText'
import { StoryCard } from '@/components/site/StoryCard'
import { findPosts, getCategories, getPayloadClient } from '@/lib/payload'

export const revalidate = 60

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ page?: string }> }

/** This one route serves both section pages (/economy) and standalone pages (/about) */
async function resolve(slug: string) {
  const category = (await getCategories()).find((c) => c.slug === slug)
  if (category) return { category, page: null }
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'pages', where: { slug: { equals: slug } }, limit: 1, depth: 1 })
  return { category: null, page: res.docs[0] ?? null }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const { category, page } = await resolve(slug)
  if (category) return { title: category.title, description: category.description || undefined }
  if (page) return { title: page.title, description: page.intro || undefined }
  return {}
}

export default async function SlugPage({ params, searchParams }: Props) {
  const { slug } = await params
  const { category, page } = await resolve(slug)

  if (page) {
    return (
      <article className="container container--narrow static-page">
        <h1 className="headline headline--article">{page.title}</h1>
        {page.intro && <p className="standfirst standfirst--lg">{page.intro}</p>}
        <RichText data={page.content} className="prose" />
      </article>
    )
  }
  if (!category) notFound()

  const pageNum = Math.max(1, Number((await searchParams).page) || 1)
  const posts = await findPosts({ where: { category: { equals: category.id } }, limit: 12, page: pageNum })
  const [first, ...rest] = posts.docs

  return (
    <div className="container">
      <header className="page-header">
        <h1 className="page-header__title">{category.title}</h1>
        {category.description && <p className="page-header__desc">{category.description}</p>}
      </header>
      {!first ? (
        <p className="empty">No articles in this section yet.</p>
      ) : (
        <>
          {pageNum === 1 && <StoryCard post={first} variant="lead" showSection={false} priority />}
          <div className="stream">
            {(pageNum === 1 ? rest : posts.docs).map((p) => (
              <StoryCard key={p.id} post={p} variant="row" showSection={false} />
            ))}
          </div>
          <Pagination page={pageNum} totalPages={posts.totalPages} base={`/${category.slug}`} />
        </>
      )}
    </div>
  )
}
