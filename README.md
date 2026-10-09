# The Everyday Economics

An FT-style news and blogging website built with **Next.js 16** and **Payload CMS 3** (Postgres).
The public site and the writing dashboard live in the same app:

- **Website:** `/` (homepage), `/economy` (sections), `/article/<slug>`, `/author/<slug>`, `/search`, `/about`…
- **Dashboard:** `/admin`, where articles are written, scheduled and published

---

## What's included

**Public site**
- Newspaper homepage: lead story, top stories, latest grid, opinion strip, newsletter box, one block per section
- Section pages with pagination, article pages (standfirst, byline, reading time, share links, tags, author box, related articles)
- Author profile pages, search (plus topic/tag pages), About/Contact/Privacy pages
- Mobile menu and responsive layouts
- SEO: page titles and descriptions, social share images, `sitemap.xml`, `robots.txt`, RSS at `/feed.xml`, NewsArticle structured data
- Newsletter sign-up (emails are saved in the dashboard under *Newsletter subscribers*)

**Interactive features**
- Sticky menu bar (shows a compact site name once you scroll), reading progress bar on articles
- Dark mode button (remembers each reader's choice, follows their device setting by default)
- "Save for later" on articles plus a **Saved** page (kept in the reader's own browser), "Copy link" button
- Search-as-you-type on the search page (arrow keys + Enter work too)
- **Most read** list on the homepage, based on real reads (one per reader per visit, after a few seconds on the page)
- Markets ticker under the menu. Edit it in **Dashboard → Site settings → Markets ticker** (switch on, add items like `USD/PKR · 281.50 · +0.2%`). Hidden until switched on.

**Dashboard (Payload CMS)**
- Rich-text editor with headings, quotes, lists, links and images (type `/` for the menu)
- Autosaving drafts, version history, **Preview** button (shows the draft on the real site)
- Scheduling: set a future *Publish date* and the article stays hidden until then
- "Lead story" and "Opinion piece" switches
- Sections, pages and site settings (name, tagline, newsletter text, social links) are all editable
- Roles: **Admin** (everything), **Editor** (all articles), **Author** (own articles only)

---

## Run it on your computer

You need **Node.js 20+**, **pnpm** (`npm i -g pnpm`) and a Postgres database. Docker is the easiest way to get Postgres.

```bash
pnpm install
cp .env.example .env          # then edit .env (see below)
docker compose up -d          # starts Postgres on port 5432 (skip if you have your own)
pnpm dev                      # http://localhost:3000
```

In `.env`, set `PAYLOAD_SECRET` to a long random string (`openssl rand -hex 32`).

**Sample content (optional):** in a second terminal run

```bash
pnpm seed
```

This adds 6 sections, 3 sample authors, 19 sample articles and the About/Contact/Privacy pages, plus an admin login:
`admin@example.com` / `ChangeMe123!`. **Change this password straight away** (Dashboard → Authors & Users).
To pick your own login instead, set `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` in `.env` before seeding.
If you skip seeding, opening `/admin` asks you to create the first user.

> In development, Payload updates the database tables automatically when you change a collection.
> If you change collections, run `pnpm payload migrate:create <name>` before deploying so production gets the change too.

---

## Deploy (Vercel + Neon, free tiers work)

1. **Push the code to GitHub.**
2. **Create a database:** make a free Postgres database at [neon.tech](https://neon.tech) and copy its connection string.
3. **Import the repo in [Vercel](https://vercel.com/new).** Add these environment variables:
   - `DATABASE_URL`: the Neon connection string
   - `PAYLOAD_SECRET`: a long random string
   - `NEXT_PUBLIC_SERVER_URL`: your site address, e.g. `https://everydayeconomics.com`
4. **Image storage:** in the Vercel project go to *Storage → Create → Blob* and connect it to the project.
   This adds `BLOB_READ_WRITE_TOKEN` automatically. (Vercel doesn't keep uploaded files on disk, so this is required.)
5. **Deploy.** The database tables are created automatically on the first start (`src/migrations`).
6. Visit `/admin`, create the first admin user, then add sections and articles.
7. Add a custom domain in Vercel → *Settings → Domains*, then update `NEXT_PUBLIC_SERVER_URL` and redeploy.

To load the sample content into production, log in to `/admin` as an Admin, then open `/next/seed-demo` on the live site. It adds 6 sections, 3 sample authors, 19 articles and the About/Contact/Privacy pages. It is safe to open again: anything that already exists is skipped.

---

## Writing and publishing (guide for the site owner)

1. Go to `yoursite.com/admin` and log in.
2. **Articles → Create new.**
3. Fill in the **Title** (headline) and **Standfirst** (the short summary under the headline).
4. Add a **Main image**. Always write the *alt text* (a short description of the picture).
5. Write the article in **Content**. Type `/` to add a heading, quote, list or image. Select text to make a link.
6. In the right-hand column, choose the **Section**, add **Tags**, and tick **Lead story** if it should be the top story on the homepage.
7. Click **Preview** to see it on the real site. Your work saves automatically as a draft.
8. Click **Publish changes**. It appears on the site within a few seconds.
   - **To schedule:** set a future **Publish date** first, then publish. It stays hidden until that time.
   - **To unpublish:** open the ⋮ menu next to *Publish changes* → *Unpublish*.

Other things she can change herself:
- **Sections:** add, rename or reorder the menu (lower *navOrder* comes first). To make a **sub-section** (e.g. Economy → Inflation), create a section and choose its **Parent section** in the right-hand column. Sub-sections appear in a dropdown under their main section, and the main section's page lists their articles too.
- **Pages:** About, Contact, Privacy policy.
- **Site settings:** site name, tagline, newsletter text, social links.
- **Authors & Users:** add writers and give them the *Author* role so they can only edit their own articles.

---

## Where things are (for developers)

```
src/
  collections/        Posts, Categories (sections), Pages, Media, Users, Subscribers
  globals/            Site settings
  access/             Who can read/edit what
  app/(frontend)/     The public website (pages + styles.css)
  app/(payload)/      The dashboard (generated by Payload, rarely edited)
  components/site/    Header, footer, story cards, newsletter, rich text renderer
  components/admin/   Dashboard logo and icon
  lib/                Data fetching and formatting helpers
  seed/               Sample content script
  migrations/         Database migrations for production
```

- **Brand colours and fonts** are the `:root` block at the top of `src/app/(frontend)/styles.css`.
- After changing a collection: `pnpm generate:types`. After adding dashboard components: `pnpm generate:importmap`.
- Pages refresh every 60 seconds, and immediately whenever something is saved in the dashboard.

### Emails (Resend)
The site sends: new-subscriber alerts and contact-form messages to the address in **Dashboard → Site settings → Emails**, a welcome email to new subscribers, and dashboard password-reset emails.

1. Create a free account at [resend.com](https://resend.com) and make an **API key** (API Keys → Create).
2. In Vercel → Settings → Environment Variables add `RESEND_API_KEY` = the key, then redeploy.
3. Until you verify a domain, Resend only delivers to **the email address you signed up to Resend with**. So alerts to that address work straight away, but welcome emails to readers and password resets for other people need step 4.
4. **Verify the site's domain** in Resend (Domains → Add, then add the DNS records it shows at the domain registrar). Then add `EMAIL_FROM` = e.g. `news@yourdomain.com` in Vercel and redeploy.

Optional: `EMAIL_FROM_NAME` (defaults to "The Everyday Economics"). Contact messages are also saved under **Dashboard → Contact messages**. Subscribers can be downloaded as a CSV from **Newsletter subscribers → Download as spreadsheet**.

### Checking picture uploads
Log in to `/admin` as an Admin, then open `/next/check-images`. It uploads a tiny test picture, checks it can be viewed, deletes it, and shows a step-by-step report.

---

## Hosting on Netlify (free plan, commercial use allowed)

The site runs on Netlify with: **Neon** (database), **Cloudflare R2** (pictures), **Resend** (emails). All have free plans.

**Environment variables** (Netlify → Site configuration → Environment variables):

| Name | What it is |
|---|---|
| `DATABASE_URL` | Neon connection string (pooled), without `&channel_binding=require` |
| `PAYLOAD_SECRET` | Long random string – keep the same one forever |
| `NEXT_PUBLIC_SERVER_URL` | The site address, e.g. `https://herdomain.com` (no slash at the end) |
| `R2_ACCOUNT_ID` | Cloudflare account ID |
| `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` | R2 API token (Object Read & Write on the bucket) |
| `R2_BUCKET` | Bucket name, e.g. `everyday-media` |
| `R2_PUBLIC_URL` | The bucket's public address, e.g. `https://pub-xxxx.r2.dev` or a custom domain |
| `RESEND_API_KEY` | Resend API key (optional) |
| `EMAIL_FROM` | e.g. `news@herdomain.com` once the domain is verified in Resend (optional) |
| `OLD_MEDIA_BASE_URL` | Only for moving pictures from Vercel Blob (see below) |

**Moving from Vercel:**
1. Neon → *Projects* → **Import Data Assistant**: paste the old `DATABASE_URL`, choose region **AWS us-east-2 (Ohio)** (Netlify's free plan runs server code in Ohio).
2. Create the R2 bucket, enable its public access, create an API token.
3. Create the Netlify site from the GitHub repo, add the variables above, set `OLD_MEDIA_BASE_URL` to the old Vercel Blob address (`https://xxxx.public.blob.vercel-storage.com`), deploy.
4. Log in at `/admin`, open `/next/copy-images` and refresh until it says *All pictures copied*.
5. Open `/next/check-images` to confirm uploads work. Remove `OLD_MEDIA_BASE_URL` afterwards.
6. Point the domain at Netlify, update `NEXT_PUBLIC_SERVER_URL`, redeploy. Then switch off the Vercel project.

Free plan limits: about 300 credits a month (each deploy uses ~15, traffic ~20 per GB). If they run out the site pauses until the next month.

### Ideas for phase 2
- Paywall / memberships (Stripe + a `subscriber` role, with an `isPremium` switch on articles)
- Sending newsletters from the dashboard (for now, export the CSV into Mailchimp or Brevo)
- Comments, dark mode, live preview side-by-side in the editor
