import type { GlobalConfig } from 'payload'
import { adminsOrEditors, anyone } from '../access'
import { revalidateGlobal } from '../utilities/revalidate'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site settings',
  admin: { group: 'Settings' },
  access: { read: anyone, update: adminsOrEditors },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    { name: 'siteName', type: 'text', required: true, defaultValue: 'The Everyday Economics' },
    {
      name: 'tagline',
      type: 'text',
      defaultValue: 'Money, markets and the economy, explained for everyone',
    },
    {
      name: 'newsletterHeading',
      type: 'text',
      defaultValue: 'The Weekly Ledger',
    },
    {
      name: 'newsletterText',
      type: 'textarea',
      defaultValue: 'One email every Sunday: the week’s biggest economic stories, in plain English.',
    },
    {
      name: 'social',
      type: 'group',
      fields: [
        { name: 'x', label: 'X / Twitter URL', type: 'text' },
        { name: 'linkedin', label: 'LinkedIn URL', type: 'text' },
        { name: 'instagram', label: 'Instagram URL', type: 'text' },
      ],
    },
  ],
}
