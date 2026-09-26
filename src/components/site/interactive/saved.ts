/** "Save for later" list, kept in this browser only */
export type SavedArticle = { slug: string; title: string; standfirst?: string | null; section?: string; savedAt: number }

const KEY = 'ee-saved'
export const SAVED_EVENT = 'ee-saved-change'

export function readSaved(): SavedArticle[] {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || '[]')
    return Array.isArray(v) ? v : []
  } catch {
    return []
  }
}

export function writeSaved(list: SavedArticle[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, 200)))
  } catch {}
  window.dispatchEvent(new Event(SAVED_EVENT))
}
