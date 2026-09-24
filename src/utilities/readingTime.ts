/** Walks a Lexical rich-text tree and counts the words in it. */
export function countWords(node: unknown): number {
  if (!node || typeof node !== 'object') return 0
  const n = node as { text?: string; children?: unknown[]; root?: unknown }
  let total = 0
  if (typeof n.text === 'string') total += n.text.trim().split(/\s+/).filter(Boolean).length
  if (n.root) total += countWords(n.root)
  if (Array.isArray(n.children)) for (const child of n.children) total += countWords(child)
  return total
}

export const minutesToRead = (content: unknown) => Math.max(1, Math.round(countWords(content) / 230))
