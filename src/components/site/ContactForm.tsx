'use client'
import React, { useActionState, useState } from 'react'
import { sendContactMessage, type ContactState } from './actions'

export function ContactForm() {
  const [state, action, pending] = useActionState<ContactState, FormData>(sendContactMessage, null)
  const [startedAt] = useState(() => Date.now())

  if (state?.ok) {
    return (
      <div className="contact-done" role="status">
        <p>{state.message}</p>
      </div>
    )
  }

  const err = state?.errors ?? {}
  return (
    <form action={action} className="contact-form" noValidate>
      <h2 className="rule-heading">Send us a message</h2>
      <input type="hidden" name="startedAt" value={startedAt} />
      <input name="website" tabIndex={-1} autoComplete="off" className="hp" aria-hidden />
      <div className="contact-form__row">
        <label>
          <span>Your name</span>
          <input name="name" required maxLength={120} autoComplete="name" aria-invalid={Boolean(err.name)} />
          {err.name && <small className="field-error">{err.name}</small>}
        </label>
        <label>
          <span>Your email</span>
          <input name="email" type="email" required maxLength={200} autoComplete="email" aria-invalid={Boolean(err.email)} />
          {err.email && <small className="field-error">{err.email}</small>}
        </label>
      </div>
      <label>
        <span>Subject (optional)</span>
        <input name="subject" maxLength={160} />
      </label>
      <label>
        <span>Message</span>
        <textarea name="message" rows={6} required maxLength={5000} aria-invalid={Boolean(err.message)} />
        {err.message && <small className="field-error">{err.message}</small>}
      </label>
      {state && !state.ok && (
        <p className="field-error" role="alert">
          {state.message}
        </p>
      )}
      <button className="btn" disabled={pending}>
        {pending ? 'Sending…' : 'Send message'}
      </button>
    </form>
  )
}
