import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import {
  type JSXConvertersFunction,
  LinkJSXConverter,
  RichText as PayloadRichText,
} from '@payloadcms/richtext-lexical/react'
import type { DefaultNodeTypes, SerializedLinkNode, SerializedUploadNode } from '@payloadcms/richtext-lexical'
import React from 'react'
import type { Media } from '@/payload-types'
import { Img } from './Img'

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const { value, relationTo } = linkNode.fields.doc ?? {}
  const slug = value && typeof value === 'object' ? (value as { slug?: string }).slug : ''
  if (relationTo === 'posts') return `/article/${slug}`
  if (relationTo === 'users') return `/author/${slug}`
  return `/${slug}`
}

const converters: JSXConvertersFunction<DefaultNodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...LinkJSXConverter({ internalDocToHref }),
  upload: ({ node }: { node: SerializedUploadNode }) => {
    const media = typeof node.value === 'object' ? (node.value as Media) : null
    if (!media) return null
    return (
      <figure className="figure">
        <Img media={media} size="hero" sizes="(max-width: 768px) 100vw, 700px" />
        {(media.caption || media.credit) && (
          <figcaption>
            {media.caption} {media.credit && <span className="credit">{media.credit}</span>}
          </figcaption>
        )}
      </figure>
    )
  },
})

export function RichText({ data, className }: { data?: unknown; className?: string }) {
  if (!data) return null
  return (
    <PayloadRichText
      data={data as SerializedEditorState}
      converters={converters}
      className={className}
      disableContainer={false}
    />
  )
}
