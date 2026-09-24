import type { Category, Page, SiteSetting } from '@/payload-types'
import Link from 'next/link'
import React from 'react'

export function Footer({
  settings,
  categories,
  pages,
}: {
  settings: SiteSetting
  categories: Category[]
  pages: Pick<Page, 'id' | 'title' | 'slug'>[]
}) {
  const social = settings.social ?? {}
  return (
    <footer className="site-footer">
      <div className="container footer__grid">
        <div>
          <p className="footer__name">{settings.siteName}</p>
          {settings.tagline && <p className="footer__tagline">{settings.tagline}</p>}
        </div>
        <div>
          <h2 className="footer__heading">Sections</h2>
          <ul>
            {categories.map((c) => (
              <li key={c.id}>
                <Link href={`/${c.slug}`}>{c.title}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="footer__heading">About</h2>
          <ul>
            {pages.map((p) => (
              <li key={p.id}>
                <Link href={`/${p.slug}`}>{p.title}</Link>
              </li>
            ))}
            <li>
              <a href="/feed.xml">RSS feed</a>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="footer__heading">Follow</h2>
          <ul>
            {social.x && <li><a href={social.x}>X / Twitter</a></li>}
            {social.linkedin && <li><a href={social.linkedin}>LinkedIn</a></li>}
            {social.instagram && <li><a href={social.instagram}>Instagram</a></li>}
            <li><a href="#newsletter">Newsletter</a></li>
          </ul>
        </div>
      </div>
      <div className="container footer__legal">
        © {new Date().getFullYear()} {settings.siteName}. All rights reserved.
      </div>
    </footer>
  )
}
