import { FormEvent, useState } from 'react'

const DEMO_EMAIL = 'reviewer@asops.dev'
const DEMO_PASSWORD = 'Frontend2026!'

type Props = {
  onLogin: () => void
}

export function LoginScreen({ onLogin }: Props) {
  const [email, setEmail] = useState(DEMO_EMAIL)
  const [password, setPassword] = useState(DEMO_PASSWORD)
  const [error, setError] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (!email.trim() || !password.trim()) {
      setError('Email and password are required.')
      return
    }

    if (email !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
      setError('Use the demo credentials shown below.')
      return
    }

    localStorage.setItem('asops-session', 'authenticated')
    onLogin()
  }

  return (
    <main className="login-shell">
      <section className="login-brand-panel" aria-label="Application introduction">
        <div className="brand-lockup">
          <span className="brand-mark">AS</span>
          <span>AS / OPS</span>
        </div>
        <div className="login-brand-copy">
          <p className="eyebrow">FRONT-END ENGINEER · SKILL TEST</p>
          <h1>Product operations, without the clutter.</h1>
          <p>
            A focused product operations dashboard built with React, TypeScript, and the DummyJSON REST API.
          </p>
        </div>
        <div className="login-footnote">01 / LOGIN</div>
      </section>

      <section className="login-form-panel">
        <form className="login-card" onSubmit={handleSubmit} noValidate>
          <div>
            <p className="eyebrow">REVIEWER ACCESS</p>
            <h2>Welcome back.</h2>
            <p className="muted">Sign in with the reviewer account to open the dashboard.</p>
          </div>

          <label>
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
            />
          </label>

          <label>
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
            />
          </label>

          {error && <div className="form-error" role="alert">{error}</div>}

          <button className="primary-button" type="submit">Enter dashboard <span>↗</span></button>

          <div className="demo-credentials">
            <div>
              <span>Email</span>
              <strong>{DEMO_EMAIL}</strong>
            </div>
            <div>
              <span>Password</span>
              <strong>{DEMO_PASSWORD}</strong>
            </div>
          </div>
        </form>
      </section>
    </main>
  )
}
