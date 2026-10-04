import type { CollectionConfig, Where } from 'payload'
import { slugField } from 'payload'
import { adminsOrEditors, anyone } from '../access'
import { revalidateAfterChange, revalidateAfterDelete } from '../utilities/revalidate'

/**
 * The site's sections, e.g. Economy, Markets. They appear in the top navigation.
 * A section with a "Parent section" is a sub-section (e.g. Economy → Inflation) and shows in that section's dropdown.
 */
export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: { singular: 'Section', plural: 'Sections' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'parent', 'slug', 'navOrder', 'showOnHomepage'],
    group: 'Content',
  },
  defaultSort: 'navOrder',
  access: { read: anyone, create: adminsOrEditors, update: adminsOrEditors, delete: adminsOrEditors },
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField(),
    {
      name: 'parent',
      label: 'Parent section',
      type: 'relationship',
      relationTo: 'categories',
      // Only main sections can be parents (one level of sub-sections), and never itself
      filterOptions: ({ id }) => {
        const conditions: Where[] = [{ parent: { exists: false } }]
        if (id) conditions.push({ id: { not_equals: id } })
        return { and: conditions }
      },
      admin: {
        position: 'sidebar',
        description: 'Leave empty for a main section. Pick one to make this a sub-section that appears in its dropdown menu.',
      },
    },
    { name: 'description', type: 'textarea', admin: { description: 'Shown at the top of the section page.' } },
    {
      name: 'navOrder',
      type: 'number',
      defaultValue: 10,
      admin: { position: 'sidebar', description: 'Lower numbers appear first in the menu.' },
    },
    {
      name: 'showOnHomepage',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Main sections only: show a block for this section (including its sub-sections) on the homepage.',
      },
    },
  ],
}
