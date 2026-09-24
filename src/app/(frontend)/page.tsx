import type { Post } from '@/payload-types'
import Link from 'next/link'
import React from 'react'
import { Newsletter } from '@/components/site/Newsletter'
import { StoryCard } from '@/components/site/StoryCard'
import { findPosts, getCategories, getSiteSettings } from '@/lib/payload'

export const revalidate = 60

export default async function HomePage() {
  const [settings, categories, featured, latest, opinion] = await Promise.all([
    getSiteSettings(),
    getCategories(),
    findPosts({ where: { featured: { equals: true } }, limit: 1 }),
    findPosts({ limit: 20 }),
    findPosts({ where: { isOpinion: { equals: true } }, limit: 4 }),
  ])

  const lead: Post | undefined = featured.docs[0] ?? latest.docs[0]
  if (!lead) {
    return (
      <div className="container empty">
        <h1 className="headline headline--xl">Welcome to {settings.siteName}</h1>
        <p>
          No articles yet. <Link href="/admin">Go to the dashboard</Link> to write your first one.
        </p>
      </div>
    )
  }

  const used = new Set<number>([lead.id])
  const take = (list: Post[], n: number) => {
    const out: Post[] = []
    for (const p of list) {
      if (out.length >= n) break
      if (!used.has(p.id)) {
        out.push(p)
        used.add(p.id)
      }
    }
    return out
  }

  const topStories = take(latest.docs, 5)
  const moreStories = take(latest.docs, 4)

  const sectionBlocks = await Promise.all(
    categories
      .filter((c) => c.showOnHomepage)
      .map(async (c) => ({
        category: c,
        posts: (
          await findPosts({
            where: { and: [{ category: { equals: c.id } }, { id: { not_equals: lead.id } }] },
            limit: 4,
          })
        ).docs,
      })),
  )

  return (
    <div className="container home">
      <section className="home-top" aria-label="Top stories">
        <StoryCard post={lead} variant="lead" priority />
        <aside className="home-top__list">
          <h2 className="rule-heading">Top stories</h2>
          {topStories.map((p) => (
            <StoryCard key={p.id} post={p} variant="list" />
          ))}
        </aside>
      </section>

      {moreStories.length > 0 && (
        <section className="grid-4" aria-label="More stories">
          {moreStories.map((p) => (
            <StoryCard key={p.id} post={p} variant="image" />
          ))}
        </section>
      )}

      {opinion.docs.length > 0 && (
        <section className="opinion-strip" aria-labelledby="opinion-h">
          <h2 id="opinion-h" className="rule-heading">
            Opinion
          </h2>
          <div className="grid-4">
            {opinion.docs.map((p) => (
              <StoryCard key={p.id} post={p} variant="opinion" />
            ))}
          </div>
        </section>
      )}

      <Newsletter heading={settings.newsletterHeading} text={settings.newsletterText} />

      {sectionBlocks
        .filter((b) => b.posts.length > 0)
        .map(({ category, posts }) => {
          const [first, ...rest] = posts
          return (
            <section key={category.id} className="section-block" aria-labelledby={`sec-${category.id}`}>
              <h2 id={`sec-${category.id}`} className="rule-heading">
                <Link href={`/${category.slug}`}>
                  {category.title} <span aria-hidden>›</span>
                </Link>
              </h2>
              <div className="grid-4 section-block__grid">
                <StoryCard post={first} variant="image" showSection={false} />
                {rest.map((p) => (
                  <StoryCard key={p.id} post={p} variant="text" showSection={false} />
                ))}
              </div>
            </section>
          )
        })}
    </div>
  )
}
