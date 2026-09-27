import type { CollectionConfig } from 'payload'
import { adminsOrEditors } from '../access'

/** Messages sent through the Contact page form. A copy is also emailed to the notification address. */
export const Messages: CollectionConfig = {
  slug: 'messages',
  labels: { singular: 'Contact message', plural: 'Contact messages' },
  admin: {
    useAsTitle: 'subject',
    defaultColumns: ['subject', 'name', 'email', 'handled', 'createdAt'],
    group: 'People',
  },
  defaultSort: '-createdAt',
  access: {
    // Messages come in through the site's own contact form, not the public API
    create: () => false,
    read: adminsOrEditors,
    update: adminsOrEditors,
    delete: adminsOrEditors,
  },
  fields: [
    { name: 'subject', type: 'text', admin: { readOnly: true } },
    { type: 'row', fields: [
      { name: 'name', type: 'text', admin: { readOnly: true } },
      { name: 'email', type: 'email', admin: { readOnly: true } },
    ] },
    { name: 'message', type: 'textarea', admin: { readOnly: true } },
    {
      name: 'handled',
      label: 'Replied / done',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
  ],
}
