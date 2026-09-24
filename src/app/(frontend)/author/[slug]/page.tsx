import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'
import { Img } from '@/components/site/Img'
import { Pagination } from '@/components/site/Pagination'
import { StoryCard } from '@/components/site/StoryCard'
import { asMedia } from '@/lib/format'
import { findPosts, getPayloadClient } from '@/lib/payload'

export const revalidate = 60

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ page?: string }> }

async function getAuthor(slug: string) {
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'users', where: { slug: { equals: slug } }, limit: 1, depth: 1 })
  return res.docs[0] ?? null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const author = await getAuthor((await params).slug)
  return author ? { title: author.name, description: author.bio || undefined } : {}
}

export default async function AuthorPage({ params, searchParams }: Props) {
  const author = await getAuthor((await params).slug)
  if (!author) notFound()
  const pageNum = Math.max(1, Number((await searchParams).page) || 1)
  const posts = await findPosts({ where: { authors: { contains: author.id } }, limit: 12, page: pageNum })
  const photo = asMedia(author.photo)

  return (
    <div className="container">
      <header className="page-header author-header">
        {photo && <Img media={photo} size="square" className="avatar avatar--lg" priority />}
        <div>
          <h1 className="page-header__title">{author.name}</h1>
          {author.jobTitle && <p className="kicker">{author.jobTitle}</p>}
          {author.bio && <p className="page-header__desc">{author.bio}</p>}
        </div>
      </header>
      <div className="stream">
        {posts.docs.map((p) => (
          <StoryCard key={p.id} post={p} variant="row" />
        ))}
        {posts.docs.length === 0 && <p className="empty">No articles yet.</p>}
      </div>
      <Pagination page={pageNum} totalPages={posts.totalPages} base={`/author/${author.slug}`} />
    </div>
  )
}
