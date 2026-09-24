import type { Access, FieldAccess, Where } from 'payload'

type Role = 'admin' | 'editor' | 'author'

const hasRole = (user: unknown, roles: Role[]) =>
  Boolean(user && roles.includes((user as { role?: Role }).role as Role))

/** Anyone logged in to the dashboard */
export const loggedIn: Access = ({ req: { user } }) => Boolean(user)

/** Admins only (managing users, site settings) */
export const adminOnly: Access = ({ req: { user } }) => hasRole(user, ['admin'])
export const adminOnlyField: FieldAccess = ({ req: { user } }) => hasRole(user, ['admin'])

/** Admins and editors can touch everything; authors only their own posts */
export const editorsOrOwnPosts: Access = ({ req: { user } }) => {
  if (!user) return false
  if (hasRole(user, ['admin', 'editor'])) return true
  return { authors: { contains: user.id } }
}

export const adminsOrEditors: Access = ({ req: { user } }) => hasRole(user, ['admin', 'editor'])

/**
 * Public can read published posts whose publish date has arrived.
 * Logged-in users can read everything (including drafts).
 */
export const publishedOrLoggedIn: Access = ({ req: { user } }) => {
  if (user) return true
  const where: Where = {
    and: [
      { _status: { equals: 'published' } },
      { publishedAt: { less_than_equal: new Date().toISOString() } },
    ],
  }
  return where
}

export const anyone: Access = () => true
