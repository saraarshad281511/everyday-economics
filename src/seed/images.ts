import sharp from 'sharp'

/** Generates simple abstract "editorial" illustrations so the demo site has pictures. */
export async function makeArt(seed: number, palette: [string, string, string], w = 1600, h = 900) {
  const rnd = (() => {
    let s = seed * 9301 + 49297
    return () => ((s = (s * 9301 + 49297) % 233280) / 233280)
  })()
  const [bg, a, b] = palette
  let shapes = ''
  const kind = seed % 3
  if (kind === 0) {
    // bar chart
    const n = 9
    for (let i = 0; i < n; i++) {
      const bh = 120 + rnd() * (h - 300)
      shapes += `<rect x="${140 + i * 150}" y="${h - 90 - bh}" width="96" height="${bh}" fill="${i % 3 === 0 ? b : a}" opacity="${0.75 + rnd() * 0.25}"/>`
    }
    shapes += `<rect x="100" y="${h - 90}" width="${w - 200}" height="6" fill="${b}"/>`
  } else if (kind === 1) {
    // line chart
    let d = `M 80 ${h * 0.7}`
    let y = h * 0.7
    for (let x = 80; x <= w - 80; x += 60) {
      y = Math.min(h - 120, Math.max(120, y + (rnd() - 0.5) * 160))
      d += ` L ${x} ${y}`
    }
    for (let i = 1; i < 5; i++) shapes += `<rect x="80" y="${i * (h / 5)}" width="${w - 160}" height="2" fill="${a}" opacity=".35"/>`
    shapes += `<path d="${d}" fill="none" stroke="${b}" stroke-width="14" stroke-linejoin="round" stroke-linecap="round"/>`
  } else {
    // circles / coins
    for (let i = 0; i < 14; i++) {
      const r = 50 + rnd() * 190
      shapes += `<circle cx="${rnd() * w}" cy="${rnd() * h}" r="${r}" fill="${i % 2 ? a : b}" opacity="${0.55 + rnd() * 0.4}"/>`
    }
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="100%" height="100%" fill="${bg}"/>${shapes}</svg>`
  return sharp(Buffer.from(svg)).jpeg({ quality: 82 }).toBuffer()
}

export async function makeAvatar(initials: string, color: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="400" height="400" fill="${color}"/><text x="200" y="245" text-anchor="middle" font-family="Georgia, serif" font-size="150" font-weight="700" fill="#f6f1e7">${initials}</text></svg>`
  return sharp(Buffer.from(svg)).jpeg({ quality: 85 }).toBuffer()
}
