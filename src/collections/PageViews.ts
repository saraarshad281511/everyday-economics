import type { CollectionConfig } from 'payload'

/** How many times each article has been read. Powers the "Most read" list. Hidden from the dashboard menu. */
export const PageViews: CollectionConfig = {
  slug: 'page-views',
  admin: { hidden: true },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: () => false,
    update: () => false,
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    { name: 'post', type: 'relationship', relationTo: 'posts', unique: true, index: true },
    { name: 'count', type: 'number', defaultValue: 0, index: true },
  ],
}
