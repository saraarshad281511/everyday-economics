/**
 * Fills the database with sample sections, authors, articles and pages.
 * Run with:  pnpm seed
 * (Or, on the live site, log in as admin and open /next/seed-demo)
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'
import { seedContent } from './content'

try {
  const payload = await getPayload({ config })

  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@example.com'
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'ChangeMe123!'
  const anyAdmin = await payload.count({ collection: 'users', where: { role: { equals: 'admin' } } })
  if (!anyAdmin.totalDocs) {
    payload.logger.info('Creating admin user…')
    await payload.create({
      collection: 'users',
      data: { email: adminEmail, password: adminPassword, name: 'Site Admin', slug: 'site-admin', role: 'admin' },
      context: { disableRevalidate: true },
    })
    payload.logger.info(`Admin login: ${adminEmail} / ${adminPassword} (change it!)`)
  }

  const result = await seedContent(payload, (m) => payload.logger.info(m))
  payload.logger.info(`Done! ${result.articlesCreated} new articles added.`)
  process.exit(0)
} catch (err) {
  console.error(err)
  process.exit(1)
}
