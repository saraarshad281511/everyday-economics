import type { Payload } from 'payload'
import { siteURL } from './format'

const esc = (s: string) =>
  s.replace(/[<>&"']/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;' })[c]!)

/** Simple branded email layout */
export function emailLayout(siteName: string, title: string, bodyHtml: string) {
  return `<!doctype html><html><body style="margin:0;background:#f4f5f7;font-family:Arial,Helvetica,sans-serif;color:#14171c">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f5f7;padding:24px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden">
<tr><td style="padding:22px 28px;border-bottom:1px solid #dde1e7;font-size:20px;font-weight:800;letter-spacing:-0.02em">${esc(siteName)}<span style="color:#c2410c">.</span></td></tr>
<tr><td style="padding:26px 28px;font-size:16px;line-height:1.6">
<h1 style="font-size:22px;line-height:1.3;margin:0 0 14px">${esc(title)}</h1>${bodyHtml}</td></tr>
<tr><td style="padding:16px 28px;background:#f4f5f7;font-size:12px;color:#636b7c">
<a href="${siteURL()}" style="color:#1d3f8f">${esc(siteURL().replace(/^https?:\/\//, ''))}</a></td></tr>
</table></td></tr></table></body></html>`
}

export const paragraphs = (text: string) =>
  text
    .split(/\n{2,}/)
    .map((p) => `<p style="margin:0 0 14px">${esc(p).replace(/\n/g, '<br>')}</p>`)
    .join('')

export { esc as escapeHtml }

/** Sends an email but never throws – a failed email must not break the page the reader is using */
export async function safeSend(
  payload: Payload,
  message: { to: string; subject: string; html: string; text?: string; replyTo?: string },
) {
  try {
    await payload.sendEmail(message)
    return true
  } catch (err) {
    payload.logger.error({ err, msg: `Email to ${message.to} failed` })
    return false
  }
}

/** Where notifications go, and the welcome email text (edited in Dashboard → Site settings → Emails) */
export async function getEmailSettings(payload: Payload) {
  const s = await payload.findGlobal({ slug: 'site-settings', depth: 0 })
  const e = s.emails ?? {}
  return {
    siteName: s.siteName || 'The Everyday Economics',
    notifyEmail: e.notifyEmail || process.env.NOTIFY_EMAIL || '',
    notifyOnSubscribe: e.notifyOnSubscribe !== false,
    sendWelcome: e.sendWelcome !== false,
    welcomeSubject: e.welcomeSubject || `Welcome to ${s.siteName || 'our newsletter'}`,
    welcomeMessage:
      e.welcomeMessage ||
      'Thanks for subscribing! You will get our best stories on money, markets and the economy, explained in plain English.',
  }
}
