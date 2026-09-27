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
      name: 'emails',
      label: 'Emails',
      type: 'group',
      admin: {
        description: 'Who gets notified, and the email new newsletter subscribers receive.',
      },
      fields: [
        {
          name: 'notifyEmail',
          label: 'Send notifications to',
          type: 'email',
          defaultValue: 'marlina_serd@yahoo.com',
          admin: { description: 'New subscribers and contact-form messages are emailed here.' },
        },
        { name: 'notifyOnSubscribe', label: 'Email me when someone subscribes', type: 'checkbox', defaultValue: true },
        { name: 'sendWelcome', label: 'Send a welcome email to new subscribers', type: 'checkbox', defaultValue: true },
        { name: 'welcomeSubject', label: 'Welcome email subject', type: 'text' },
        {
          name: 'welcomeMessage',
          label: 'Welcome email message',
          type: 'textarea',
          admin: { description: 'Leave a blank line between paragraphs.' },
        },
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
