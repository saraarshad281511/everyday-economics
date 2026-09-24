/** Tiny helpers to build Lexical rich-text JSON for sample content */
const text = (t: string, format = 0) => ({ type: 'text', text: t, format, style: '', mode: 'normal', detail: 0, version: 1 })
const block = (type: string, children: unknown[], extra: Record<string, unknown> = {}) => ({
  type, children, format: '', indent: 0, version: 1, direction: 'ltr', ...extra,
})

export const p = (t: string) => block('paragraph', [text(t)], { textFormat: 0, textStyle: '' })
export const h2 = (t: string) => block('heading', [text(t)], { tag: 'h2' })
export const quote = (t: string) => block('quote', [text(t)])
export const ul = (items: string[]) =>
  block('list', items.map((t, i) => block('listitem', [text(t)], { value: i + 1 })), { listType: 'bullet', start: 1, tag: 'ul' })

export const doc = (...children: unknown[]) => ({
  root: { type: 'root', format: '', indent: 0, version: 1, direction: 'ltr', children },
})
