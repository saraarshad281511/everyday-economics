import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'
import { adminsOrEditors, anyone } from '../access'
import { revalidateAfterChange, revalidateAfterDelete } from '../utilities/revalidate'

/** Simple standalone pages: About, Contact, Privacy policy… served at /<slug> */
export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: 'Page', plural: 'Pages' },
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'slug', 'showInFooter'], group: 'Content' },
  access: { read: anyone, create: adminsOrEditors, update: adminsOrEditors, delete: adminsOrEditors },
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField({ position: 'sidebar' }),
    { name: 'intro', type: 'textarea' },
    { name: 'content', type: 'richText' },
    { name: 'showInFooter', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
  ],
}
