import { postgresAdapter } from '@payloadcms/db-postgres'
import { FixedToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { resendAdapter } from '@payloadcms/email-resend'
import { s3Storage } from '@payloadcms/storage-s3'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { Messages } from './collections/Messages'
import { Pages } from './collections/Pages'
import { PageViews } from './collections/PageViews'
import { Posts } from './collections/Posts'
import { Subscribers } from './collections/Subscribers'
import { Users } from './collections/Users'
import { SiteSettings } from './globals/SiteSettings'
import { migrations } from './migrations'
import { r2, r2Endpoint, r2FileURL, useR2 } from './lib/storage'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || '',
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    avatar: 'default',
    meta: { titleSuffix: ' – The Everyday Economics' },
    components: {
      graphics: {
        Logo: '/components/admin/Logo',
        Icon: '/components/admin/Icon',
      },
    },
  },
  collections: [Posts, Categories, Pages, Media, Users, Subscribers, Messages, PageViews],
  globals: [SiteSettings],
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [...defaultFeatures, FixedToolbarFeature()],
  }),
  // Emails (password resets, new-subscriber alerts, welcome emails, contact form) are sent with Resend.
  // Without RESEND_API_KEY, emails are only written to the server log.
  email: process.env.RESEND_API_KEY
    ? resendAdapter({
        apiKey: process.env.RESEND_API_KEY,
        defaultFromAddress: process.env.EMAIL_FROM || 'onboarding@resend.dev',
        defaultFromName: process.env.EMAIL_FROM_NAME || 'The Everyday Economics',
      })
    : undefined,
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL || '' },
    // Only auto-adjust the database during local development – never on Netlify/Vercel, where migrations are used
    push: process.env.NODE_ENV !== 'production' && !process.env.NETLIFY && !process.env.NETLIFY_DEV && !process.env.VERCEL,
    // In production, database tables are created/updated automatically on start-up
    prodMigrations: migrations,
  }),
  sharp,
  plugins: [
    // Pictures on Cloudflare R2 (Netlify setup) – used when the R2_* settings are present
    s3Storage({
      enabled: useR2,
      alwaysInsertFields: true,
      bucket: r2.bucket,
      collections: {
        media: {
          // Pictures load straight from R2's public address (fast, no extra server work)
          disablePayloadAccessControl: true,
          generateFileURL: ({ filename, prefix }) => r2FileURL(filename, prefix),
        },
      },
      config: {
        endpoint: r2Endpoint(),
        region: 'auto',
        forcePathStyle: true,
        credentials: { accessKeyId: r2.accessKeyId, secretAccessKey: r2.secretAccessKey },
        // Recommended for Cloudflare R2 with recent AWS SDK versions
        requestChecksumCalculation: 'WHEN_REQUIRED',
        responseChecksumValidation: 'WHEN_REQUIRED',
      },
    }),
    // Pictures on Vercel Blob (original Vercel setup) – only when R2 isn't configured
    vercelBlobStorage({
      enabled: !useR2 && Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      // Keep the database columns the same whether or not Blob is switched on
      alwaysInsertFields: true,
      // Pictures load straight from Vercel's image storage (fast, and independent of the site address)
      collections: { media: { disablePayloadAccessControl: true } },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
  ],
})
