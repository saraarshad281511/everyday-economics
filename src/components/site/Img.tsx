import type { Media } from '@/payload-types'
import React from 'react'

type Size = 'thumb' | 'card' | 'hero' | 'square'

/** Responsive image using the sizes Payload generates on upload */
export function Img({
  media,
  size = 'card',
  className,
  sizes = '(max-width: 768px) 100vw, 50vw',
  priority,
}: {
  media?: Media | null
  size?: Size
  className?: string
  sizes?: string
  priority?: boolean
}) {
  if (!media?.url) return <div className={`img-placeholder ${className ?? ''}`} aria-hidden />
  const s = media.sizes ?? {}
  const src = s[size]?.url || media.url
  const srcSet = (['thumb', 'card', 'hero'] as const)
    .map((k) => (s[k]?.url && s[k]?.width ? `${s[k]!.url} ${s[k]!.width}w` : null))
    .filter(Boolean)
    .join(', ')
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={className}
      src={src}
      srcSet={size === 'square' ? undefined : srcSet || undefined}
      sizes={size === 'square' ? undefined : sizes}
      alt={media.alt || ''}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      style={{ objectPosition: `${media.focalX ?? 50}% ${media.focalY ?? 50}%` }}
    />
  )
}
