import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Optional password lock for the public website (e.g. before launch).
 *
 * Set SITE_PASSWORD in the hosting settings to lock the site: visitors get a
 * password box (any username works). Remove SITE_PASSWORD to open the site to everyone.
 * The dashboard (/admin) is never locked, so writers can keep working.
 */
export function proxy(request: NextRequest) {
  const password = process.env.SITE_PASSWORD
  if (!password) return NextResponse.next()

  const header = request.headers.get('authorization') || ''
  if (header.startsWith('Basic ')) {
    try {
      const decoded = atob(header.slice(6))
      const given = decoded.slice(decoded.indexOf(':') + 1)
      if (given === password) return NextResponse.next()
    } catch {
      // fall through to the password box
    }
  }

  return new NextResponse('This site is not open yet.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="The Everyday Economics", charset="UTF-8"',
      'Cache-Control': 'no-store',
    },
  })
}

export const config = {
  // Everything except the dashboard, its API, and Next.js build files
  matcher: ['/((?!admin|api|_next/static|_next/image|favicon.ico).*)'],
}
