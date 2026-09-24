import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'
import { editorsOrOwnPosts, loggedIn, publishedOrLoggedIn } from '../access'
import { minutesToRead } from '../utilities/readingTime'
import { revalidateAfterChange, revalidateAfterDelete } from '../utilities/revalidate'

const siteURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

/** Blog posts / articles */
export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: 'Article', plural: 'Articles' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', '_status', 'publishedAt', 'featured'],
    group: 'Content',
    listSearchableFields: ['title', 'standfirst'],
    preview: (doc) =>
      doc?.slug
        ? `${siteURL}/next/preview?path=${encodeURIComponent(`/article/${doc.slug}`)}`
        : null,
  },
  defaultSort: '-publishedAt',
  versions: {
    drafts: { autosave: { interval: 2000 } },
    maxPerDoc: 25,
  },
  access: {
    read: publishedOrLoggedIn,
    create: loggedIn,
    update: editorsOrOwnPosts,
    delete: editorsOrOwnPosts,
  },
  hooks: {
    beforeChange: [
      ({ data, req, operation }) => {
        if (data.content) data.readingTime = minutesToRead(data.content)
        // Default the author to whoever is writing the article
        if (operation === 'create' && req.user && (!data.authors || data.authors.length === 0)) {
          data.authors = [req.user.id]
        }
        // Set the publish date the first time the article goes live
        if (data._status === 'published' && !data.publishedAt) {
          data.publishedAt = new Date().toISOString()
        }
        return data
      },
    ],
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
  },
  fields: [
    { name: 'title', type: 'text', required: true, admin: { description: 'The headline.' } },
    {
      name: 'standfirst',
      type: 'textarea',
      maxLength: 280,
      admin: {
        description:
          'The one or two-line summary shown under the headline and on the homepage.',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Article',
          fields: [
            { name: 'heroImage', label: 'Main image', type: 'upload', relationTo: 'media' },
            {
              name: 'content',
              type: 'richText',
              required: true,
              admin: {
                description:
                  'Tip: type "/" for headings, quotes, lists and images. Select text to add links.',
              },
            },
          ],
        },
        {
          label: 'SEO & Sharing',
          fields: [
            {
              name: 'metaTitle',
              type: 'text',
              admin: { description: 'Optional. Title for Google & social media (defaults to the headline).' },
            },
            {
              name: 'metaDescription',
              type: 'textarea',
              admin: { description: 'Optional. Defaults to the standfirst.' },
            },
          ],
        },
      ],
    },

    // ---------- Sidebar ----------
    slugField({ position: 'sidebar' }),
    {
      name: 'category',
      label: 'Section',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'authors',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'publishedAt',
      label: 'Publish date',
      type: 'date',
      index: true,
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime' },
        description:
          'Set a future date to schedule it: the article stays hidden until then. Leave empty to use the moment you publish.',
      },
    },
    {
      name: 'featured',
      label: 'Lead story',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Show as the big story at the top of the homepage (the newest one wins).',
      },
    },
    {
      name: 'isOpinion',
      label: 'Opinion piece',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Adds an "Opinion" label and author photo.' },
    },
    {
      name: 'tags',
      type: 'text',
      hasMany: true,
      admin: { position: 'sidebar', description: 'Press Enter after each tag.' },
    },
    {
      name: 'readingTime',
      type: 'number',
      admin: { position: 'sidebar', readOnly: true, description: 'Minutes (calculated automatically).' },
    },
  ],
}
