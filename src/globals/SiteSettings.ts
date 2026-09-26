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
      name: 'ticker',
      label: 'Markets ticker',
      type: 'group',
      admin: {
        description:
          'The scrolling strip of market figures under the menu. Only shown when switched on and at least one item is filled in.',
      },
      fields: [
        { name: 'show', label: 'Show the ticker', type: 'checkbox', defaultValue: false },
        {
          name: 'items',
          type: 'array',
          labels: { singular: 'Item', plural: 'Items' },
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'label', type: 'text', required: true, admin: { placeholder: 'USD/PKR', width: '34%' } },
                { name: 'value', type: 'text', required: true, admin: { placeholder: '281.50', width: '33%' } },
                {
                  name: 'change',
                  type: 'text',
                  admin: { placeholder: '+0.2%', width: '33%', description: 'Start with + or −' },
                },
              ],
            },
          ],
        },
        { name: 'note', type: 'text', admin: { placeholder: 'Updated daily' } },
      ],
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
