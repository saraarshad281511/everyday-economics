'use server'
import { headers } from 'next/headers'
import { emailLayout, escapeHtml, getEmailSettings, paragraphs, safeSend } from '@/lib/email'
import { getPayloadClient } from '@/lib/payload'
import { siteURL } from '@/lib/format'

export type SubscribeState = { ok: boolean; message: string } | null
export type ContactState = { ok: boolean; message: string; errors?: Record<string, string> } | null

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function subscribe(_prev: SubscribeState, formData: FormData): Promise<SubscribeState> {
  // Simple bot trap: real people never fill in the hidden "website" field
  if (formData.get('website')) return { ok: true, message: 'Thanks!' }
  const email = String(formData.get('email') || '').trim().toLowerCase()
  if (!EMAIL_RE.test(email) || email.length > 200) {
    return { ok: false, message: 'Please enter a valid email address.' }
  }
  const payload = await getPayloadClient()
  const existing = await payload.find({
    collection: 'subscribers',
    where: { email: { equals: email } },
    limit: 1,
    depth: 0,
  })
  let welcomeSent = false
  if (existing.totalDocs === 0) {
    await payload.create({ collection: 'subscribers', data: { email } })

    const s = await getEmailSettings(payload)
    const total = await payload.count({ collection: 'subscribers' })
    const [, welcome] = await Promise.all([
      s.notifyOnSubscribe && s.notifyEmail
        ? safeSend(payload, {
            to: s.notifyEmail,
            subject: `New subscriber: ${email}`,
            html: emailLayout(
              s.siteName,
              'You have a new newsletter subscriber',
              `<p style="margin:0 0 14px"><strong>${escapeHtml(email)}</strong> just signed up.</p>
               <p style="margin:0 0 14px">You now have <strong>${total.totalDocs}</strong> subscriber${total.totalDocs === 1 ? '' : 's'}.</p>
               <p style="margin:0"><a href="${siteURL()}/admin/collections/subscribers" style="color:#1d3f8f">See all subscribers in the dashboard</a></p>`,
            ),
            text: `${email} just subscribed. Total subscribers: ${total.totalDocs}.`,
          })
        : null,
      s.sendWelcome
        ? safeSend(payload, {
            to: email,
            subject: s.welcomeSubject,
            html: emailLayout(s.siteName, s.welcomeSubject, paragraphs(s.welcomeMessage) +
              `<p style="margin:18px 0 0"><a href="${siteURL()}" style="display:inline-block;background:#1d3f8f;color:#ffffff;text-decoration:none;padding:10px 16px;border-radius:8px;font-weight:bold">Read the latest stories</a></p>`),
            text: `${s.welcomeMessage}\n\n${siteURL()}`,
          })
        : null,
    ])
    welcomeSent = welcome === true
  }
  return {
    ok: true,
    message: welcomeSent
      ? 'You’re on the list. Check your inbox for a welcome email.'
      : 'You’re on the list. Look out for our next issue.',
  }
}

export async function sendContactMessage(_prev: ContactState, formData: FormData): Promise<ContactState> {
  // Bot traps: hidden field must be empty, and the form must have been open for a few seconds
  if (formData.get('website')) return { ok: true, message: 'Thanks, your message has been sent.' }

  const name = String(formData.get('name') || '').trim().slice(0, 120)
  const email = String(formData.get('email') || '').trim().toLowerCase().slice(0, 200)
  const subject = String(formData.get('subject') || '').trim().slice(0, 160) || 'Message from the website'
  const message = String(formData.get('message') || '').trim().slice(0, 5000)

  const errors: Record<string, string> = {}
  if (!name) errors.name = 'Please enter your name.'
  if (!EMAIL_RE.test(email)) errors.email = 'Please enter a valid email address.'
  if (message.length < 10) errors.message = 'Please write a little more (at least 10 characters).'
  if (Object.keys(errors).length) return { ok: false, message: 'Please check the highlighted fields.', errors }

  const startedAt = Number(formData.get('startedAt') || 0)
  if (!startedAt || Date.now() - startedAt < 3000) {
    return { ok: false, message: 'Please take a moment to check your message, then press Send again.' }
  }

  const payload = await getPayloadClient()
  const recent = await payload.count({
    collection: 'messages',
    where: { and: [{ email: { equals: email } }, { createdAt: { greater_than: new Date(Date.now() - 10 * 60 * 1000).toISOString() } }] },
  })
  if (recent.totalDocs >= 3) {
    return { ok: false, message: 'You’ve sent several messages already. Please wait a few minutes.' }
  }

  const doc = await payload.create({ collection: 'messages', data: { name, email, subject, message } })
  const s = await getEmailSettings(payload)
  const ip = (await headers()).get('x-forwarded-for')?.split(',')[0] || ''
  if (s.notifyEmail) {
    await safeSend(payload, {
      to: s.notifyEmail,
      replyTo: email,
      subject: `Contact form: ${subject}`,
      html: emailLayout(
        s.siteName,
        subject,
        `<p style="margin:0 0 6px"><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>
         <div style="margin:16px 0;padding:14px 16px;background:#f4f5f7;border-radius:8px">${paragraphs(message)}</div>
         <p style="margin:0 0 6px;font-size:14px;color:#636b7c">Just press Reply to answer ${escapeHtml(name)} directly.</p>
         <p style="margin:0;font-size:14px"><a href="${siteURL()}/admin/collections/messages/${doc.id}" style="color:#1d3f8f">Open in the dashboard</a></p>`,
      ),
      text: `From: ${name} <${email}>\n\n${message}\n\n(${ip})`,
    })
  }
  return { ok: true, message: `Thanks ${name.split(' ')[0]}, your message has been sent. We’ll get back to you soon.` }
}
