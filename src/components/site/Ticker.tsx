import type { SiteSetting } from '@/payload-types'
import React from 'react'

/** Scrolling strip of market figures. Edited in Dashboard → Site settings → Markets ticker. */
export function Ticker({ ticker }: { ticker: SiteSetting['ticker'] }) {
  const items = (ticker?.items ?? []).filter((i) => i.label && i.value)
  if (!ticker?.show || items.length === 0) return null

  const row = (hidden: boolean) => (
    <ul className="ticker__row" aria-hidden={hidden || undefined}>
      {items.map((i, n) => {
        const dir = i.change?.trim().startsWith('-') || i.change?.trim().startsWith('−') ? 'down' : i.change ? 'up' : ''
        return (
          <li key={`${i.id ?? n}-${hidden}`}>
            <span className="ticker__label">{i.label}</span>
            <span className="ticker__value">{i.value}</span>
            {i.change && (
              <span className={`ticker__change ticker__change--${dir}`}>
                {dir === 'down' ? '▼' : '▲'} {i.change.replace(/^[+−-]/, '')}
              </span>
            )}
          </li>
        )
      })}
    </ul>
  )

  return (
    <div className="ticker" role="region" aria-label="Markets">
      <div className="ticker__track">
        {row(false)}
        {row(true)}
      </div>
      {ticker.note && <span className="ticker__note">{ticker.note}</span>}
    </div>
  )
}
