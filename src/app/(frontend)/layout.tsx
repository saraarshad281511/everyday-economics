import '@fontsource-variable/source-serif-4'
import '@fontsource-variable/inter'
import './styles.css'

import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import React from 'react'
import { Footer } from '@/components/site/Footer'
import { Header } from '@/components/site/Header'
import { siteURL } from '@/lib/format'
import { getCategories, getFooterPages, getSiteSettings } from '@/lib/payload'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return {
    metadataBase: new URL(siteURL()),
    title: { default: settings.siteName, template: `%s | ${settings.siteName}` },
    description: settings.tagline || undefined,
    alternates: { types: { 'application/rss+xml': '/feed.xml' } },
    openGraph: { siteName: settings.siteName, type: 'website' },
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [settings, categories, pages, draft] = await Promise.all([
    getSiteSettings(),
    getCategories(),
    getFooterPages(),
    draftMode(),
  ])

  return (
    <html lang="en">
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {draft.isEnabled && (
          <div className="preview-bar">
            You are previewing unpublished changes. <a href="/next/exit-preview">Exit preview</a>
          </div>
        )}
        <Header siteName={settings.siteName} tagline={settings.tagline} categories={categories} />
        <main id="main">{children}</main>
        <Footer settings={settings} categories={categories} pages={pages} />
      </body>
    </html>
  )
}
