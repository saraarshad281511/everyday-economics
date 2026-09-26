import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'
import { Img } from '@/components/site/Img'
import { ArticleActions } from '@/components/site/interactive/ArticleActions'
import { ReadingProgress } from '@/components/site/interactive/ReadingProgress'
import { ViewTracker } from '@/components/site/interactive/ViewTracker'
import { draftMode } from 'next/headers'
import { RichText } from '@/components/site/RichText'
import { StoryCard } from '@/components/site/StoryCard'
import { asAuthors, asCategory, asMedia, formatDate, siteURL } from '@/lib/format'
import { findPosts, getPostBySlug, getRecentSlugs, getSiteSettings } from '@/lib/payload'

export const revalidate = 60

// Pre-build the latest articles; any others are built on first visit and then saved
export async function generateStaticParams() {
  return getRecentSlugs(50)
}

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}
  const image = asMedia(post.heroImage)
  const description = post.metaDescription || post.standfirst || undefined
  return {
    title: post.metaTitle || post.title,
    description,
    alternates: { canonical: `/article/${post.slug}` },
    openGraph: {
      type: 'article',
      title: post.metaTitle || post.title,
      description,
      publishedTime: post.publishedAt || undefined,
      images: image?.sizes?.hero?.url ? [{ url: image.sizes.hero.url }] : undefined,
    },
    twitter: { card: 'summary_large_image' },
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  const [settings, draft] = await Promise.all([getSiteSettings(), draftMode()])
  const category = asCategory(post.category)
  const authors = asAuthors(post.authors)
  const image = asMedia(post.heroImage)
  const related = category
    ? (
        await findPosts({
          where: { and: [{ category: { equals: category.id } }, { id: { not_equals: post.id } }] },
          limit: 4,
        })
      ).docs
    : []

  const url = `${siteURL()}/article/${post.slug}`
  const shareText = encodeURIComponent(post.title)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': post.isOpinion ? 'OpinionNewsArticle' : 'NewsArticle',
    headline: post.title,
    description: post.standfirst,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    image: image?.url ? [new URL(image.url, siteURL()).toString()] : undefined,
    author: authors.map((a) => ({ '@type': 'Person', name: a.name, url: `${siteURL()}/author/${a.slug}` })),
    publisher: { '@type': 'Organization', name: settings.siteName },
    mainEntityOfPage: url,
  }

  return (
    <article className="article">
      <ReadingProgress />
      {!draft.isEnabled && <ViewTracker id={post.id} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="article__header container container--narrow">
        <p>
          {post.isOpinion ? (
            <span className="kicker kicker--opinion">Opinion</span>
          ) : (
            category && (
              <Link href={`/${category.slug}`} className="kicker">
                {category.title}
              </Link>
            )
          )}
        </p>
        <h1 className="headline headline--article">{post.title}</h1>
        {post.standfirst && <p className="standfirst standfirst--lg">{post.standfirst}</p>}
      </header>

      {image && (
        <figure className="article__hero container">
          <Img media={image} size="hero" sizes="(max-width: 1100px) 100vw, 1100px" priority />
          {(image.caption || image.credit) && (
            <figcaption>
              {image.caption} {image.credit && <span className="credit">{image.credit}</span>}
            </figcaption>
          )}
        </figure>
      )}

      <div className="container container--narrow">
        <div className="byline">
          <div className="byline__people">
            {authors.map((a) => {
              const photo = asMedia(a.photo)
              return (
                <Link key={a.id} href={`/author/${a.slug}`} className="byline__person">
                  {photo && <Img media={photo} size="square" className="avatar avatar--sm" />}
                  <span>{a.name}</span>
                </Link>
              )
            })}
          </div>
          <p className="meta">
            <time dateTime={post.publishedAt || undefined}>{formatDate(post.publishedAt, true)}</time>
            {post.readingTime ? ` · ${post.readingTime} min read` : ''}
          </p>
          <ArticleActions
            article={{
              slug: post.slug as string,
              title: post.title,
              standfirst: post.standfirst,
              section: post.isOpinion ? 'Opinion' : category?.title,
            }}
          />
          <div className="share" aria-label="Share this article">
            <a href={`https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer">X</a>
            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href={`https://wa.me/?text=${shareText}%20${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
            <a href={`mailto:?subject=${shareText}&body=${encodeURIComponent(url)}`}>Email</a>
          </div>
        </div>

        <div id="article-body">
          <RichText data={post.content} className="prose" />
        </div>

        {post.tags && post.tags.length > 0 && (
          <ul className="tags" aria-label="Topics">
            {post.tags.map((t) => (
              <li key={t}>
                <Link href={`/search?tag=${encodeURIComponent(t)}`}>{t}</Link>
              </li>
            ))}
          </ul>
        )}

        {authors.map((a) => (
          <aside key={a.id} className="author-box">
            {asMedia(a.photo) && <Img media={asMedia(a.photo)} size="square" className="avatar" />}
            <div>
              <p className="author-box__name">
                <Link href={`/author/${a.slug}`}>{a.name}</Link>
                {a.jobTitle && <span> · {a.jobTitle}</span>}
              </p>
              {a.bio && <p>{a.bio}</p>}
            </div>
          </aside>
        ))}
      </div>

      {related.length > 0 && (
        <section className="container related" aria-labelledby="related-h">
          <h2 id="related-h" className="rule-heading">
            More from {category?.title}
          </h2>
          <div className="grid-4">
            {related.map((p) => (
              <StoryCard key={p.id} post={p} variant="image" showSection={false} />
            ))}
          </div>
        </section>
      )}
    </article>
  )
}
