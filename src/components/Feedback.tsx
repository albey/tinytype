import { useState, type FormEvent } from 'react'
import type { Language } from '../words'

// Web3Forms emails each message to the TinyType author. The key is public by design:
// it can only send to the address it was created for.
const WEB3FORMS_KEY = 'd9b9a08f-4754-4a99-b27e-024c896879d8'

type Props = {
  language: Language
  onClose: () => void
}

type Status = 'idle' | 'sending' | 'sent' | 'error'

// A small popup for grown-ups to send feedback.
export function Feedback({ language, onClose }: Props) {
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [botcheck, setBotcheck] = useState(false) // hidden; only bots tick it
  const [status, setStatus] = useState<Status>('idle')

  async function send(e: FormEvent) {
    e.preventDefault()
    if (!message.trim() || status === 'sending') return
    setStatus('sending')
    // Sent as a plain form (not JSON) so the browser doesn't need a CORS pre-check first.
    const form = new FormData()
    form.append('access_key', WEB3FORMS_KEY)
    form.append('subject', 'TinyType feedback')
    form.append('from_name', 'TinyType')
    form.append('message', message.trim())
    if (email.trim()) form.append('email', email.trim())
    form.append('language', language)
    if (botcheck) form.append('botcheck', 'on')
    try {
      const response = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: form })
      const result = await response.json()
      setStatus(result.success ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="overlay centred" onClick={onClose} onKeyDown={(e) => e.key === 'Escape' && onClose()}>
      <form className="feedback" onClick={(e) => e.stopPropagation()} onSubmit={send}>
        <header>
          <h2>Send feedback</h2>
          <button type="button" className="tool" onClick={onClose}>
            Close
          </button>
        </header>

        {status === 'sent' ? (
          <>
            <p>Thank you! Your message is on its way.</p>
            <button type="button" className="tool active" onClick={onClose} autoFocus>
              Back to TinyType
            </button>
          </>
        ) : (
          <>
            <p className="hint">What does your child like? What's missing or not working? Any words or languages you'd like?</p>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Your message"
              rows={5}
              maxLength={3000}
              autoFocus
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={254}
              placeholder="Your email, if you'd like a reply (optional)"
            />
            <input
              type="checkbox"
              className="botcheck"
              tabIndex={-1}
              aria-hidden="true"
              checked={botcheck}
              onChange={(e) => setBotcheck(e.target.checked)}
            />
            {status === 'error' && <p className="feedback-error">Sending failed. Check the connection and try again.</p>}
            <button className="tool active" disabled={!message.trim() || status === 'sending'}>
              {status === 'sending' ? 'Sending…' : 'Send'}
            </button>
          </>
        )}
      </form>
    </div>
  )
}
