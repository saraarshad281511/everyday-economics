import type { Post } from '@/payload-types'
import Link from 'next/link'
import React from 'react'
import { asAuthors, asCategory, asMedia, timeAgo } from '@/lib/format'
import { Img } from './Img'

type Variant = 'lead' | 'image' | 'text' | 'list' | 'opinion' | 'row'

export function Kicker({ post, showSection = true }: { post: Post; showSection?: boolean }) {
  const cat = asCategory(post.category)
  if (post.isOpinion) return <span className="kicker kicker--opinion">Opinion</span>
  if (!showSection || !cat) return null
  return (
    <Link href={`/${cat.slug}`} className="kicker">
      {cat.title}
    </Link>
  )
}

export function StoryCard({
  post,
  variant = 'text',
  showSection = true,
  priority,
}: {
  post: Post
  variant?: Variant
  showSection?: boolean
  priority?: boolean
}) {
  const href = `/article/${post.slug}`
  const image = asMedia(post.heroImage)
  const authors = asAuthors(post.authors)

  if (variant === 'lead') {
    return (
      <article className="card card--lead">
        <div className="card--lead__text">
          <Kicker post={post} showSection={showSection} />
          <h2 className="headline headline--xl">
            <Link href={href}>{post.title}</Link>
          </h2>
          {post.standfirst && <p className="standfirst">{post.standfirst}</p>}
          <p className="meta">{timeAgo(post.publishedAt)}</p>
        </div>
        <Link href={href} className="card--lead__media" tabIndex={-1} aria-hidden>
          <Img media={image} size="hero" sizes="(max-width: 900px) 100vw, 55vw" priority={priority} />
        </Link>
      </article>
    )
  }

  if (variant === 'opinion') {
    const author = authors[0]
    const photo = asMedia(author?.photo)
    return (
      <article className="card card--opinion">
        {photo && <Img media={photo} size="square" className="avatar" />}
        <div>
          {author && <p className="byline-name">{author.name}</p>}
          <h3 className="headline headline--sm">
            <Link href={href}>{post.title}</Link>
          </h3>
        </div>
      </article>
    )
  }

  if (variant === 'row') {
    return (
      <article className="card card--row">
        <div>
          <Kicker post={post} showSection={showSection} />
          <h3 className="headline headline--md">
            <Link href={href}>{post.title}</Link>
          </h3>
          {post.standfirst && <p className="standfirst standfirst--sm">{post.standfirst}</p>}
          <p className="meta">
            {authors.map((a) => a.name).join(', ')}
            {authors.length > 0 && ' · '}
            {timeAgo(post.publishedAt)}
          </p>
        </div>
        <Link href={href} className="card--row__media" tabIndex={-1} aria-hidden>
          <Img media={image} size="thumb" sizes="240px" />
        </Link>
      </article>
    )
  }

  if (variant === 'list') {
    return (
      <article className="card card--list">
        <Kicker post={post} showSection={showSection} />
        <h3 className="headline headline--sm">
          <Link href={href}>{post.title}</Link>
        </h3>
      </article>
    )
  }

  return (
    <article className={`card ${variant === 'image' ? 'card--image' : 'card--text'}`}>
      {variant === 'image' && (
        <Link href={href} className="card__media" tabIndex={-1} aria-hidden>
          <Img media={image} size="card" sizes="(max-width: 768px) 100vw, 25vw" />
        </Link>
      )}
      <Kicker post={post} showSection={showSection} />
      <h3 className={`headline ${variant === 'image' ? 'headline--md' : 'headline--sm'}`}>
        <Link href={href}>{post.title}</Link>
      </h3>
      {variant === 'image' && post.standfirst && <p className="standfirst standfirst--sm">{post.standfirst}</p>}
      <p className="meta">{timeAgo(post.publishedAt)}</p>
    </article>
  )
}
