/**
 * Sample content for the demo site (sections, authors, articles, pages).
 * Used by `pnpm seed` and by the /next/seed-demo page.
 * Safe to run more than once: anything that already exists is skipped.
 */
import type { Payload } from 'payload'
import { makeArt, makeAvatar } from './images'
import { doc, h2, p, quote, ul } from './lexical'

const ctx = { disableRevalidate: true }
const slugify = (t: string) => t.toLowerCase().normalize('NFKD').replace(/[’'’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

const SECTIONS = [
  { title: 'Economy', slug: 'economy', description: 'Growth, jobs, prices and the policies that shape them.' },
  { title: 'Markets', slug: 'markets', description: 'Stocks, bonds, currencies and commodities, explained.' },
  { title: 'Business', slug: 'business', description: 'Companies, founders and the forces reshaping industries.' },
  { title: 'Personal Finance', slug: 'personal-finance', description: 'Practical guides to saving, investing and spending well.' },
  { title: 'Technology', slug: 'technology', description: 'How technology is changing work, money and markets.' },
  { title: 'Life & Arts', slug: 'life-arts', description: 'Books, culture and the economics of everyday life.' },
]

const PALETTES: Record<string, [string, string, string]> = {
  economy: ['#e9dfcc', '#0f3d3e', '#9b2c2c'],
  markets: ['#10292a', '#3f8f86', '#e8c9a0'],
  business: ['#efe6d6', '#274c77', '#d17a22'],
  'personal-finance': ['#f3ead8', '#5b7f3a', '#1b1a17'],
  technology: ['#1d2230', '#6c8cff', '#f2c14e'],
  'life-arts': ['#f1e1d6', '#9b2c2c', '#3d5a80'],
}

const AUTHORS = [
  { name: 'Amara Qureshi', jobTitle: 'Economics Editor', color: '#0f3d3e', bio: 'Amara writes about inflation, jobs and central banks, with a focus on what the numbers mean for ordinary households.' },
  { name: 'Daniel Okafor', jobTitle: 'Markets Correspondent', color: '#274c77', bio: 'Daniel covers global markets, from bond yields to commodity prices, and how they ripple through the real economy.' },
  { name: 'Leila Haddad', jobTitle: 'Personal Finance Writer', color: '#9b2c2c', bio: 'Leila helps readers make sense of budgets, savings and investing, one plain-English guide at a time.' },
]

type Seed = {
  title: string
  standfirst: string
  section: string
  author: number
  tags: string[]
  featured?: boolean
  opinion?: boolean
  body: string[]
  quote?: string
  list?: string[]
}

const ARTICLES: Seed[] = [
  {
    title: 'Why your grocery bill still feels high even as inflation cools',
    standfirst: 'Slower price rises are not the same as falling prices. Here is what the headline figures miss about the weekly shop.',
    section: 'economy', author: 0, featured: true, tags: ['Inflation', 'Cost of living'],
    body: [
      'When officials say inflation is “coming down”, they usually mean prices are rising more slowly than before, not that they are going back to where they were. For shoppers, that distinction matters enormously.',
      'Price levels tend to be sticky. Once a supplier has raised the cost of a loaf of bread or a litre of cooking oil, it rarely cuts it again unless competition forces it to. That is why a period of high inflation can leave a lasting mark on household budgets long after the headline rate has calmed.',
      'Wages are the other half of the story. If pay rises faster than prices, people slowly regain the ground they lost. If it does not, the squeeze continues, even in a year that looks calm on paper.',
    ],
    quote: 'Inflation falling means prices are rising more slowly. It does not mean they are going back down.',
    list: ['Compare unit prices, not pack prices', 'Track your own “personal inflation” over a few months', 'Watch wages as closely as prices'],
  },
  {
    title: 'What central banks are really trying to do when they change interest rates',
    standfirst: 'Interest rates are the main lever policymakers pull. A simple guide to how it works, and why it takes so long.',
    section: 'economy', author: 0, tags: ['Interest rates', 'Central banks'],
    body: [
      'Raising interest rates makes borrowing more expensive and saving more attractive. Over time, that cools spending, which in turn eases the pressure on prices.',
      'The catch is timing. Economists often say monetary policy works with “long and variable lags”: a change made today may not be fully felt for a year or more.',
      'That is why central bankers try to look ahead rather than react to the latest figure, and why their decisions can seem out of step with what people feel right now.',
    ],
  },
  {
    title: 'The quiet shift in how young people are finding work',
    standfirst: 'Freelancing, remote contracts and portfolio careers are changing what a “first job” looks like.',
    section: 'economy', author: 2, tags: ['Jobs', 'Remote work'],
    body: [
      'For earlier generations, a first job usually meant an office, a manager and a fixed monthly salary. Today, many graduates start with a patchwork of short contracts and online clients.',
      'The upside is flexibility and access to employers far beyond one’s own city. The downside is less security, fewer benefits and the need to manage income that rises and falls month to month.',
    ],
  },
  {
    title: 'Bond yields, explained without the jargon',
    standfirst: 'When a bond’s price falls, its yield rises. Why that see-saw matters for mortgages, pensions and governments.',
    section: 'markets', author: 1, tags: ['Bonds', 'Explainer'],
    body: [
      'A bond is a loan. The buyer lends money to a government or company and receives regular interest payments in return, plus the original sum back at the end.',
      'Bonds trade after they are issued, and their prices move. Because the interest payment is fixed, a lower price means a higher return, or “yield”, for whoever buys the bond now.',
      'Yields on government bonds act as a benchmark for many other borrowing costs, which is why a move in the bond market can quickly show up in the price of a home loan.',
    ],
  },
  {
    title: 'Why currencies move, and what a weaker rupee means at home',
    standfirst: 'Exchange rates shape the price of fuel, phones and foreign tuition. A look at the forces behind them.',
    section: 'markets', author: 1, tags: ['Currencies', 'Pakistan'],
    body: [
      'A currency’s value reflects demand for it: from exporters, importers, investors and governments. When more people want to sell a currency than buy it, it weakens.',
      'A weaker currency makes imports more expensive, which can push up prices at home. But it also makes a country’s exports cheaper abroad, which can help local businesses compete.',
    ],
  },
  {
    title: 'Gold’s long appeal as a safe haven',
    standfirst: 'In uncertain times investors reach for gold. Is it really a shelter from the storm?',
    section: 'markets', author: 1, tags: ['Gold', 'Commodities'],
    body: [
      'Gold pays no interest and produces no profits, yet it has been treasured for thousands of years. Its appeal lies in scarcity and in the trust people place in it when other assets wobble.',
      'That trust can make gold a useful diversifier. But its price can also swing sharply, and it is not a guaranteed hedge against every kind of crisis.',
    ],
  },
  {
    title: 'How small family businesses are going digital',
    standfirst: 'From WhatsApp catalogues to online payments, local shops are quietly rewriting their playbooks.',
    section: 'business', author: 2, tags: ['Small business', 'Digital'],
    body: [
      'For many small retailers, the first step online was not a website but a phone. Messaging apps became shop windows, order books and customer service desks all at once.',
      'Digital payments followed, cutting the time spent handling cash and making it easier to track sales. The next challenge is turning that data into better decisions about stock and pricing.',
    ],
  },
  {
    title: 'What makes a start-up worth investing in?',
    standfirst: 'Investors talk about “traction” and “unit economics”. Here is what those phrases mean in practice.',
    section: 'business', author: 1, tags: ['Start-ups', 'Investing'],
    body: [
      'Traction is evidence that customers want a product: growing users, repeat purchases, or revenue that keeps climbing.',
      'Unit economics asks a simpler question: does the business make money on each customer once the cost of winning and serving them is counted? A company can grow fast and still lose money on every sale.',
    ],
  },
  {
    title: 'The rise of the four-day week experiment',
    standfirst: 'Some companies say shorter weeks boost productivity. Others are not convinced. What the trials suggest.',
    section: 'business', author: 0, tags: ['Work', 'Productivity'],
    body: [
      'Supporters argue that fewer, more focused days reduce burnout and help companies attract talent. Critics worry about customer service, costs and industries where hours cannot simply be compressed.',
      'The honest answer is that results vary by company and by job. What works for a software team may not work for a hospital ward.',
    ],
  },
  {
    title: 'A beginner’s guide to building an emergency fund',
    standfirst: 'Before investing, most planners say you need a cushion. How big it should be and where to keep it.',
    section: 'personal-finance', author: 2, tags: ['Saving', 'Budgeting'],
    body: [
      'An emergency fund is money set aside for the unexpected: a medical bill, a car repair, or a gap between jobs. Its job is to stop a surprise from turning into debt.',
      'A common rule of thumb is to aim for three to six months of essential expenses, built up gradually. The money should be easy to reach but not so easy that it gets spent on everyday things.',
    ],
    list: ['Start with a small, reachable target', 'Automate a transfer on payday', 'Keep it separate from your spending account'],
  },
  {
    title: 'Compound interest: the idea every student should learn early',
    standfirst: 'Earning returns on your returns sounds dull. Over decades, it is the most powerful force in personal finance.',
    section: 'personal-finance', author: 2, tags: ['Investing', 'Explainer'],
    body: [
      'Compound interest means the interest you earn is added to your savings, so next time you earn interest on a slightly bigger sum. The effect is small at first and dramatic later.',
      'The key ingredient is time. Starting early, even with small amounts, often matters more than finding the perfect investment.',
    ],
    quote: 'The best time to start saving was years ago. The second-best time is today.',
  },
  {
    title: 'How to read a payslip, line by line',
    standfirst: 'Gross pay, deductions, allowances: a quick guide to the document most of us never look at closely.',
    section: 'personal-finance', author: 2, tags: ['Salary', 'Tax'],
    body: [
      'Your gross pay is what you earn before anything is taken off. Your net pay is what actually lands in your account.',
      'The lines in between show taxes, pension contributions and any other deductions. Checking them each month is the easiest way to spot mistakes early.',
    ],
  },
  {
    title: 'Will AI take your job, or change it?',
    standfirst: 'History suggests new technology reshapes work more often than it erases it. But the transition can be painful.',
    section: 'technology', author: 0, tags: ['AI', 'Jobs'],
    body: [
      'Every wave of automation has sparked fears of mass unemployment. In practice, technology has tended to change the tasks within jobs, removing some and creating others.',
      'The harder question is who bears the cost of the transition, and how quickly workers can learn the new skills that are in demand.',
    ],
  },
  {
    title: 'The economics of free apps',
    standfirst: 'If you are not paying for the product, how does it make money? A look at ads, data and subscriptions.',
    section: 'technology', author: 1, tags: ['Tech', 'Business models'],
    body: [
      'Most free apps earn money through advertising, by selling premium features, or by charging businesses that want to reach their users.',
      'Understanding the business model helps explain design choices, from endless feeds to nudges to upgrade.',
    ],
  },
  {
    title: 'Books that explain money better than any textbook',
    standfirst: 'A reading list for anyone who wants to understand the economy without wading through equations.',
    section: 'life-arts', author: 0, tags: ['Books', 'Reading list'],
    body: [
      'Good economics writing tells stories. It follows people, companies and countries through booms and busts and asks why things happened the way they did.',
      'This list mixes history, biography and practical guides, chosen for clarity rather than complexity.',
    ],
  },
  {
    title: 'The real cost of a wedding season',
    standfirst: 'Gifts, outfits, travel and time off: why celebrations weigh so heavily on family budgets.',
    section: 'life-arts', author: 2, tags: ['Culture', 'Budgeting'],
    body: [
      'Weddings are joyful, and often expensive, not only for the couple but for every guest. Outfits, gifts and travel can add up quickly over a busy season.',
      'Planning ahead, setting a clear gift budget and sharing costs within families are some of the ways people keep celebrations from turning into debt.',
    ],
  },
  {
    title: 'We teach children to read. We should teach them to budget too',
    standfirst: 'Financial literacy belongs in every classroom, not as an optional extra.',
    section: 'economy', author: 0, opinion: true, tags: ['Education', 'Financial literacy'],
    body: [
      'Most young people leave school able to solve equations but unsure how a loan works. That gap costs them dearly later in life.',
      'Simple lessons on budgeting, saving and interest could be woven into maths and social studies without adding a single new subject.',
    ],
  },
  {
    title: 'Markets are not the economy, and we should stop pretending they are',
    standfirst: 'A rising stock index can hide a struggling high street. Policymakers should look beyond the ticker.',
    section: 'markets', author: 1, opinion: true, tags: ['Stocks', 'Policy'],
    body: [
      'Stock prices reflect expectations about future company profits. They say little about wages, rents or whether families can afford the weekly shop.',
      'Treating the index as a scoreboard for the whole economy leads to the wrong conclusions, and sometimes the wrong policies.',
    ],
  },
  {
    title: 'Small businesses deserve simpler taxes',
    standfirst: 'Complexity is a hidden tax of its own, and it falls hardest on the smallest firms.',
    section: 'business', author: 2, opinion: true, tags: ['Tax', 'Small business'],
    body: [
      'Large companies can afford accountants and lawyers. A corner shop cannot. Every extra form is time taken away from serving customers.',
      'Simplifying the rules would bring more businesses into the system and could raise more revenue, not less.',
    ],
  },
]

const PAGES = [
  {
    title: 'About us',
    slug: 'about',
    intro: 'The Everyday Economics explains money, markets and the economy in plain English.',
    content: doc(
      p('We believe everyone deserves to understand the forces that shape their pay, their prices and their prospects. Our writers turn complex economic news into clear, useful stories.'),
      p('Replace this text with the real story of the publication from the dashboard: Pages → About us.'),
    ),
  },
  {
    title: 'Contact',
    slug: 'contact',
    intro: 'Tips, corrections and pitches are always welcome.',
    content: doc(p('Email us at hello@example.com. Update this address from the dashboard: Pages → Contact.')),
  },
  {
    title: 'Privacy policy',
    slug: 'privacy',
    intro: 'How we collect and use your information.',
    content: doc(p('We only collect the email address you give us when you sign up to the newsletter, and we never sell it. Replace this placeholder with a full privacy policy before launch.')),
  },
]

export type SeedResult = {
  articlesCreated: number
  imagesAdded: number
  totalArticles: number
  imageError?: string
  /** Pictures not added yet because time ran out – open the page again to continue */
  imagesPending: number
}

export async function seedContent(
  payload: Payload,
  log: (msg: string) => void = () => {},
  /** Stop uploading pictures after this many milliseconds (the rest are added on the next run) */
  imageTimeBudgetMs = Infinity,
): Promise<SeedResult> {
  const deadline = Date.now() + imageTimeBudgetMs
  const findOne = async (collection: 'categories' | 'users' | 'posts' | 'pages', field: string, value: string) => {
    const res = await payload.find({ collection, where: { [field]: { equals: value } }, limit: 1, depth: 0 })
    return res.docs[0] as unknown as ({ id: number } & Record<string, unknown>) | undefined
  }

  // Images are optional: if uploading fails (e.g. storage not set up yet), the articles
  // are still created without pictures. Running the seed again adds the missing images.
  let imageError: string | undefined
  let imagesAdded = 0
  let imagesPending = 0
  const uploadImage = async (alt: string, name: string, make: () => Promise<Buffer>, credit?: string) => {
    if (imageError) return undefined
    if (Date.now() > deadline) {
      imagesPending++
      return undefined
    }
    try {
      const m = await payload.create({
        collection: 'media',
        data: { alt, ...(credit ? { credit } : {}) },
        file: { data: await make(), mimetype: 'image/jpeg', name, size: 0 },
        context: ctx,
      })
      imagesAdded++
      return m.id
    } catch (err) {
      imageError = (err as Error)?.message || String(err)
      return undefined
    }
  }

  log('Sections…')
  const sectionIds: Record<string, number> = {}
  for (const [i, s] of SECTIONS.entries()) {
    const existing = await findOne('categories', 'slug', s.slug)
    sectionIds[s.slug] =
      existing?.id ??
      (await payload.create({
        collection: 'categories',
        data: { ...s, navOrder: (i + 1) * 10, showOnHomepage: true },
        context: ctx,
      })).id
  }

  log('Authors…')
  const authorIds: number[] = []
  for (const [i, a] of AUTHORS.entries()) {
    const email = `author${i + 1}@example.com`
    const existing = await findOne('users', 'email', email)
    const initials = a.name.split(' ').map((w) => w[0]).join('')
    const makePhoto = () =>
      uploadImage(`Portrait of ${a.name}`, `author-${i + 1}.jpg`, () => makeAvatar(initials, a.color))
    if (existing) {
      authorIds.push(existing.id)
      if (!existing.photo) {
        const photo = await makePhoto()
        if (photo) await payload.update({ collection: 'users', id: existing.id, data: { photo }, context: ctx })
      }
      continue
    }
    const photo = await makePhoto()
    const u = await payload.create({
      collection: 'users',
      data: {
        name: a.name,
        slug: slugify(a.name),
        email,
        password: `Author-${Math.random().toString(36).slice(2)}!`,
        role: 'author',
        jobTitle: a.jobTitle,
        bio: a.bio,
        ...(photo ? { photo } : {}),
      },
      context: ctx,
    })
    authorIds.push(u.id)
  }

  log('Articles…')
  const now = Date.now()
  let created = 0
  for (const [i, a] of ARTICLES.entries()) {
    const slug = slugify(a.title)
    const makeImage = () =>
      uploadImage(
        `Illustration for “${a.title}”`,
        `article-${i + 1}.jpg`,
        () => makeArt(i + 3, PALETTES[a.section]),
        'Sample illustration',
      )
    const existing = await findOne('posts', 'slug', slug)
    if (existing) {
      if (!existing.heroImage) {
        const image = await makeImage()
        if (image) await payload.update({ collection: 'posts', id: existing.id, data: { heroImage: image }, context: ctx })
      }
      continue
    }
    const image = await makeImage()
    const [first, ...rest] = a.body
    const children = [
      p(first),
      ...(a.quote ? [quote(a.quote)] : []),
      h2('The bigger picture'),
      ...rest.map(p),
      ...(a.list ? [h2('What you can do'), ul(a.list)] : []),
      p('This is sample content created for the demo site. Edit or delete it from the dashboard.'),
    ]
    await payload.create({
      collection: 'posts',
      data: {
        title: a.title,
        slug,
        standfirst: a.standfirst,
        ...(image ? { heroImage: image } : {}),
        content: doc(...children) as never,
        category: sectionIds[a.section],
        authors: [authorIds[a.author]],
        tags: a.tags,
        featured: Boolean(a.featured),
        isOpinion: Boolean(a.opinion),
        // Spread the sample articles over the past few days
        publishedAt: new Date(now - (i * 5 + 1) * 60 * 60 * 1000).toISOString(),
        _status: 'published',
      },
      context: ctx,
    })
    created++
  }

  log('Pages…')
  for (const pg of PAGES) {
    if (await findOne('pages', 'slug', pg.slug)) continue
    await payload.create({ collection: 'pages', data: { ...pg, content: pg.content as never, showInFooter: true }, context: ctx })
  }

  return { articlesCreated: created, imagesAdded, totalArticles: ARTICLES.length, imageError, imagesPending }
}
