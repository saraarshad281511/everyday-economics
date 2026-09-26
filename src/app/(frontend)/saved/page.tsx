import type { Metadata } from 'next'
import React from 'react'
import { SavedList } from '@/components/site/interactive/SavedList'

export const metadata: Metadata = { title: 'Saved articles', robots: { index: false } }

export default function SavedPage() {
  return (
    <div className="container">
      <header className="page-header">
        <h1 className="page-header__title">Saved articles</h1>
        <p className="page-header__desc">Articles you saved to read later on this device.</p>
      </header>
      <SavedList />
    </div>
  )
}
