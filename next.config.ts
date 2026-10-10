import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

// Addresses this deploy can be opened on (Netlify / Vercel set these while building).
// The dashboard only accepts saves from known addresses, so these are added to the allow-list.
const host = (h?: string) => (h ? (h.startsWith('http') ? h : `https://${h}`) : '')
const siteAddresses = [
  process.env.URL,
  process.env.DEPLOY_PRIME_URL,
  process.env.SITE_NAME ? `${process.env.SITE_NAME}.netlify.app` : '',
  process.env.VERCEL_PROJECT_PRODUCTION_URL,
  process.env.VERCEL_BRANCH_URL,
  process.env.VERCEL_URL,
]
  .map(host)
  .filter(Boolean)
  .join(',')

const nextConfig: NextConfig = {
  // SITE_PASSWORD is baked in while building, so the lock works on every host
  env: { SITE_ADDRESSES: siteAddresses, SITE_PASSWORD: process.env.SITE_PASSWORD || '' },
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
