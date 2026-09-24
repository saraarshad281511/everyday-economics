import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'
import { adminOnly, adminOnlyField, anyone } from '../access'

/**
 * People who can log in to the dashboard. Each user is also an author
 * with a public profile page at /author/<slug>.
 */
export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Author / User', plural: 'Authors & Users' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'role'],
    group: 'People',
  },
  auth: true,
  hooks: {
    beforeChange: [
      // The very first account created on a new site is always an Admin
      async ({ data, operation, req }) => {
        if (operation === 'create') {
          const { totalDocs } = await req.payload.count({ collection: 'users', req })
          if (totalDocs === 0) data.role = 'admin'
        }
        return data
      },
    ],
  },
  access: {
    // Public can see author name/bio/photo (the auth fields are hidden automatically)
    read: anyone,
    create: adminOnly,
    delete: adminOnly,
    update: ({ req: { user }, id }) =>
      Boolean(user && ((user as { role?: string }).role === 'admin' || user.id === id)),
    admin: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    slugField({ useAsSlug: 'name', position: undefined }),
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'author',
      saveToJWT: true,
      access: { update: adminOnlyField },
      options: [
        { label: 'Admin (full control)', value: 'admin' },
        { label: 'Editor (all posts)', value: 'editor' },
        { label: 'Author (own posts only)', value: 'author' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'jobTitle', type: 'text', admin: { description: 'e.g. "Economics Editor"' } },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    { name: 'bio', type: 'textarea' },
  ],
}
