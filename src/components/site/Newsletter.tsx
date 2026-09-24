'use client'
import React, { useActionState } from 'react'
import { subscribe, type SubscribeState } from './actions'

export function Newsletter({ heading, text }: { heading?: string | null; text?: string | null }) {
  const [state, action, pending] = useActionState<SubscribeState, FormData>(subscribe, null)
  return (
    <section id="newsletter" className="newsletter" aria-labelledby="newsletter-heading">
      <div>
        <p className="kicker">Newsletter</p>
        <h2 id="newsletter-heading" className="newsletter__heading">
          {heading || 'Our newsletter'}
        </h2>
        {text && <p className="newsletter__text">{text}</p>}
      </div>
      {state?.ok ? (
        <p className="newsletter__done" role="status">
          {state.message}
        </p>
      ) : (
        <form action={action} className="newsletter__form">
          <label htmlFor="nl-email" className="sr-only">
            Email address
          </label>
          <input id="nl-email" name="email" type="email" required placeholder="Your email address" autoComplete="email" />
          <input name="website" tabIndex={-1} autoComplete="off" className="hp" aria-hidden />
          <button className="btn" disabled={pending}>
            {pending ? 'Signing up…' : 'Sign up'}
          </button>
          {state && !state.ok && (
            <p className="newsletter__error" role="alert">
              {state.message}
            </p>
          )}
        </form>
      )}
    </section>
  )
}
