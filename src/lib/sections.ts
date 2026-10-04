import type { Category } from '@/payload-types'

export type SectionNode = Category & { children: Category[] }

const parentId = (c: Category) => (c.parent && typeof c.parent === 'object' ? c.parent.id : (c.parent ?? null))

/** Turns the flat list of sections into main sections with their sub-sections */
export function buildSectionTree(categories: Category[]): SectionNode[] {
  const top = categories.filter((c) => !parentId(c))
  return top.map((t) => ({ ...t, children: categories.filter((c) => parentId(c) === t.id) }))
}

/** The ids to include when listing a section's articles: the section itself plus its sub-sections */
export function sectionAndChildIds(category: Category, categories: Category[]) {
  return [category.id, ...categories.filter((c) => parentId(c) === category.id).map((c) => c.id)]
}

export function findParent(category: Category, categories: Category[]) {
  const pid = parentId(category)
  return pid ? (categories.find((c) => c.id === pid) ?? null) : null
}
