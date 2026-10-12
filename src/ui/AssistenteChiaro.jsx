import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLingua } from '../i18n/LinguaChiaro.jsx'
import { chiediAssistente } from '../lib/assistente.js'
import { vaiAllaSezione } from '../lib/scroll.js'

/* ============================================================================
   ASSISTENTE AI — lato chiaro.
   Un cerchio disegnato a mano in basso a sinistra apre una piccola chat: chi
   visita il sito può fare domande su servizi e preventivo, e così vede come
   funzionerebbe un assistente sul sito di un cliente. Risponde in italiano o
   in inglese. Se il server non risponde (anche a gratis finito) la chat lo dice
   e manda ai contatti: il sito non si rompe. La chiamata sta in `lib/assistente.js`,
   le regole dell'assistente in `supabase/functions/assistente`.
   ========================================================================== */
const MAX_DOMANDE = 10 // per visita: poi si rimanda ai contatti

export function AssistenteChiaro() {
  const { t } = useLingua()
  const a = t.assistente
  const [aperto, setAperto] = useState(false)
  const [messaggi, setMessaggi] = useState([]) // { ruolo: 'utente' | 'assistente', testo, avviso? }
  const [testo, setTesto] = useState('')
  const [attesa, setAttesa] = useState(false)
  const fine = useRef(null)
  const campo = useRef(null)
  const domande = messaggi.filter((m) => m.ruolo === 'utente').length
  const finito = domande >= MAX_DOMANDE

  // Dal menu o dai contatti la chat si apre con un evento
  useEffect(() => {
    const apri = () => setAperto(true)
    window.addEventListener('apri-assistente', apri)
    return () => window.removeEventListener('apri-assistente', apri)
  }, [])

  // Esc chiude; all'apertura il cursore va nel campo (non su telefono, dove aprirebbe la tastiera)
  useEffect(() => {
    if (!aperto) return
    const suTasto = (e) => e.key === 'Escape' && setAperto(false)
    window.addEventListener('keydown', suTasto)
    if (window.matchMedia('(pointer: fine)').matches) campo.current?.focus({ preventScroll: true })
    return () => window.removeEventListener('keydown', suTasto)
  }, [aperto])

  // Ogni nuovo messaggio scorre in fondo
  useEffect(() => {
    fine.current?.scrollIntoView({ block: 'end' })
  }, [messaggi, attesa, aperto])

  const invia = async (domanda) => {
    const pulita = domanda.trim().slice(0, 500)
    if (!pulita || attesa || finito) return
    const storia = [...messaggi.filter((m) => !m.avviso), { ruolo: 'utente', testo: pulita }]
    setMessaggi((m) => [...m, { ruolo: 'utente', testo: pulita }])
    setTesto('')
    setAttesa(true)
    const r = await chiediAssistente(storia)
    setAttesa(false)
    if (r.testo) setMessaggi((m) => [...m, { ruolo: 'assistente', testo: r.testo }])
    else setMessaggi((m) => [...m, { ruolo: 'assistente', testo: r.errore === 'limite' ? a.limite : a.nonDisponibile, avviso: true }])
  }

  const alContatti = (e) => {
    setAperto(false)
    vaiAllaSezione(e, 'contatti')
  }

  return (
    <>
      <button type="button" className="h-as-btn" onClick={() => setAperto((v) => !v)} aria-label={aperto ? a.chiudi : a.apri} aria-expanded={aperto} title={a.apri} data-cursore="">
        <svg viewBox="0 0 100 100" aria-hidden="true">
          <path d="M50 4C76 3 97 24 96 51C95 77 75 97 49 96C23 95 3 76 4 49C5 25 24 5 52 5" />
        </svg>
        <svg viewBox="0 0 100 100" aria-hidden="true">
          <path d="M30 36C30 31 34 29 39 29L62 29C67 29 70 32 70 37L70 54C70 59 67 62 62 62L48 62L36 72L38 62C33 62 30 59 30 54Z" />
          <path d="M42 42L58 42" />
          <path d="M42 50L53 50" />
        </svg>
      </button>

      <section className={`h-as ${aperto ? 'h-as-aperto' : ''}`} role="dialog" aria-label={a.titolo} inert={aperto ? undefined : true}>
        <header className="h-as-testata">
          <strong>{a.titolo}</strong>
          <button type="button" onClick={() => setAperto(false)} aria-label={a.chiudi}>
            ×
          </button>
        </header>

        <div className="h-as-corpo" aria-live="polite">
          <p className="h-as-msg h-as-bot">{a.benvenuto}</p>
          {messaggi.length === 0 && (
            <div className="h-as-sugg">
              {a.suggerimenti.map((s) => (
                <button key={s} type="button" onClick={() => invia(s)}>
                  {s}
                </button>
              ))}
            </div>
          )}
          {messaggi.map((m, i) => (
            <p key={i} className={`h-as-msg ${m.ruolo === 'utente' ? 'h-as-io' : 'h-as-bot'}`}>
              {m.testo}
              {m.avviso && (
                <>
                  {' '}
                  <a href="#contatti" onClick={alContatti}>
                    {a.contatti} →
                  </a>
                </>
              )}
            </p>
          ))}
          {attesa && <p className="h-as-msg h-as-bot h-as-attesa">{a.pensa}</p>}
          <div ref={fine} />
        </div>

        <form
          className="h-as-form"
          onSubmit={(e) => {
            e.preventDefault()
            invia(testo)
          }}
        >
          <input ref={campo} value={testo} onChange={(e) => setTesto(e.target.value)} placeholder={a.segnaposto} maxLength={500} disabled={finito} aria-label={a.segnaposto} />
          <button type="submit" disabled={!testo.trim() || attesa || finito} aria-label={a.invia}>
            →
          </button>
        </form>
        <p className="h-as-nota">
          {a.avviso} <Link to="/privacy">{a.privacy}</Link>
        </p>
      </section>
    </>
  )
}
