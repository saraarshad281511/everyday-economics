import type { CollectionConfig } from 'payload'
import { adminsOrEditors } from '../access'

/** Emails collected from the newsletter sign-up box. Export them from here to Mailchimp etc. */
export const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  labels: { singular: 'Newsletter subscriber', plural: 'Newsletter subscribers' },
  admin: { useAsTitle: 'email', defaultColumns: ['email', 'createdAt'], group: 'People' },
  access: {
    // Sign-ups come in through the site's own server action, not the public API
    create: adminsOrEditors,
    read: adminsOrEditors,
    update: adminsOrEditors,
    delete: adminsOrEditors,
  },
  fields: [{ name: 'email', type: 'email', required: true, unique: true }],
}
