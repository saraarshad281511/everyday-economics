import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'
import { adminsOrEditors, anyone } from '../access'
import { revalidateAfterChange, revalidateAfterDelete } from '../utilities/revalidate'

/** The site's sections, e.g. Economy, Markets. They appear in the top navigation. */
export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: { singular: 'Section', plural: 'Sections' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'navOrder', 'showOnHomepage'],
    group: 'Content',
  },
  defaultSort: 'navOrder',
  access: { read: anyone, create: adminsOrEditors, update: adminsOrEditors, delete: adminsOrEditors },
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField(),
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
      admin: { position: 'sidebar', description: 'Show a block for this section on the homepage.' },
    },
  ],
}
