import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Button } from '../../ui/Button'

/* ============================================================================
   LOGIN DELL'AREA RISERVATA
   L'account non si crea da qui: va creato a mano su Supabase
   (Authentication -> Users -> Add user). Così nessuno può registrarsi da solo.
   ========================================================================== */
export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errore, setErrore] = useState(null)
  const [inCorso, setInCorso] = useState(false)

  const accedi = async (evento) => {
    evento.preventDefault()
    setErrore(null)
    setInCorso(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    setInCorso(false)
    // Messaggio volutamente generico: non riveliamo se l'email esiste
    if (error) setErrore('Email o password non corretti.')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-50 px-6">
      <form
        onSubmit={accedi}
        className="w-full max-w-sm rounded-2xl border border-ink-200 bg-white p-8 shadow-soft"
      >
        <h1 className="font-display text-[1.5rem] font-semibold tracking-[-0.022em] text-ink-950">
          Area riservata
        </h1>
        <p className="mt-1.5 text-[0.875rem] text-ink-500">Accedi per vedere le richieste.</p>

        <div className="mt-7 space-y-4">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-ink-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-ink-200 px-4 py-3 text-[0.9375rem]
                         transition-colors duration-300 hover:border-ink-300
                         focus:border-accent-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-ink-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-ink-200 px-4 py-3 text-[0.9375rem]
                         transition-colors duration-300 hover:border-ink-300
                         focus:border-accent-500 focus:outline-none"
            />
          </div>
        </div>

        {errore && (
          <p role="alert" className="mt-4 rounded-md bg-red-50 px-4 py-3 text-[0.875rem] text-red-700">
            {errore}
          </p>
        )}

        <Button
          type="submit"
          size="md"
          className={`mt-7 w-full ${inCorso ? 'pointer-events-none opacity-40' : ''}`}
        >
          {inCorso ? 'Accesso…' : 'Accedi'}
        </Button>
      </form>
    </div>
  )
}
