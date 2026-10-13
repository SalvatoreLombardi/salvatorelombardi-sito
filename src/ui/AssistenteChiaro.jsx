import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react'
import { useLingua } from '../i18n/LinguaChiaro.jsx'
import { chiediAssistente } from '../lib/assistente.js'
import { GomitoloAssistente } from './GomitoloAssistente.jsx'

/* ============================================================================
   ASSISTENTE AI — lato chiaro.
   Una sezione del sito, dopo il preventivo (e con la sua voce nel menu): chi
   visita può fare domande su servizi e preventivo, e così vede come funzionerebbe
   un assistente sul sito di un cliente. Risponde in italiano o in inglese. Se il
   server non risponde (anche a gratis finito) lo dice e rimanda ai contatti: il
   sito non si rompe. La chiamata sta in `lib/assistente.js`, le regole
   dell'assistente in `supabase/functions/assistente`.
   ========================================================================== */
const MAX_DOMANDE = 10 // per visita: poi si rimanda ai contatti
const EASE = [0.16, 1, 0.3, 1]

/** La risposta si scrive parola per parola, dopo che il filo si è sbrogliato (con "riduci movimento" compare intera). */
function Scrivi({ testo }) {
  const parole = testo.split(/(\s+)/)
  const quante = parole.filter((p) => p.trim()).length
  const passo = Math.min(0.04, 1.8 / quante)
  let n = 0
  return parole.map((p, i) => {
    if (!p.trim()) return p
    const ritardo = 0.55 + n++ * passo
    return (
      <motion.span
        key={i}
        style={{ display: 'inline-block' }}
        initial={{ opacity: 0, y: 7, filter: 'blur(4px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.55, ease: EASE, delay: ritardo }}
      >
        {p}
      </motion.span>
    )
  })
}

/** La conversazione: messaggi, invio, limite di domande. */
function useConversazione() {
  const { t } = useLingua()
  const a = t.assistente
  const [messaggi, setMessaggi] = useState([]) // { ruolo: 'utente' | 'assistente', testo, avviso? }
  const [testo, setTesto] = useState('')
  const [attesa, setAttesa] = useState(false)
  const domande = messaggi.filter((m) => m.ruolo === 'utente').length
  const finito = domande >= MAX_DOMANDE

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

  return { a, messaggi, testo, setTesto, attesa, finito, invia }
}

export function AssistenteChiaro() {
  const { a, messaggi, testo, setTesto, attesa, finito, invia } = useConversazione()
  const ridotto = useReducedMotion()
  const intesta = useRef(null)
  const dentro = useInView(intesta, { once: true, margin: '0px 0px -30% 0px' })
  const corpo = useRef(null)

  // Il filo segue la conversazione: scrive → pensa; arriva la risposta → si sbroglia e poi si riavvolge piano
  const [fase, setFase] = useState('quiete')
  useEffect(() => {
    if (attesa) return setFase('pensa')
    if (messaggi[messaggi.length - 1]?.ruolo === 'assistente') {
      setFase('sbroglia')
      const t = setTimeout(() => setFase('quiete'), 3600)
      return () => clearTimeout(t)
    }
    setFase('quiete')
  }, [attesa, messaggi])

  // Ogni nuovo messaggio scorre in fondo alla conversazione (non la pagina)
  useEffect(() => {
    corpo.current?.scrollTo({ top: corpo.current.scrollHeight, behavior: ridotto ? 'auto' : 'smooth' })
  }, [messaggi, attesa, ridotto])

  const entra = (i = 0) => (ridotto ? {} : { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '0px 0px -10% 0px' }, transition: { duration: 0.9, ease: EASE, delay: i * 0.1 } })

  return (
    <section className="h-ai" id="assistente" aria-labelledby="h-ai-titolo">
      <h2 id="h-ai-titolo" ref={intesta} className="h-sv-intesta h-ai-intesta">
        <span className={`h-sv-riga h-sv-svuota ${dentro ? 'h-sv-scambiato' : ''}`}>
          <span className="h-sv-contorno">{a.titolo1}</span>
          <span className="h-sv-riempimento">{a.titolo1}</span>
        </span>
        <span className={`h-sv-riga h-sv-riempi ${dentro ? 'h-sv-scambiato' : ''}`}>
          <span className="h-sv-contorno">{a.titolo2}</span>
          <span className="h-sv-riempimento">{a.titolo2}</span>
        </span>
      </h2>

      <motion.div className="h-ai-pannello" {...entra()}>
        <div className="h-ai-lato">
          <p className="h-ai-intro">{a.intro}</p>
          <ul className="h-ai-sugg">
            {a.suggerimenti.map((s, i) => (
              <motion.li key={s} {...entra(i + 1)}>
                <button type="button" onClick={() => invia(s)} disabled={attesa || finito} data-cursore="">
                  <span>{s}</span>
                  <span aria-hidden="true">→</span>
                </button>
              </motion.li>
            ))}
          </ul>
        </div>

        <div className="h-ai-chat">
          <GomitoloAssistente fase={fase} />
          <div className="h-ai-corpo" ref={corpo} aria-live="polite">
            <p className="h-ai-msg h-ai-bot">{a.benvenuto}</p>
            <AnimatePresence initial={false}>
              {messaggi.map((m, i) => (
                <motion.p
                  key={i}
                  className={`h-ai-msg ${m.ruolo === 'utente' ? 'h-ai-io' : 'h-ai-bot'}`}
                  initial={ridotto ? false : { opacity: 0, y: 18, clipPath: 'inset(0 0 100% 0)' }}
                  animate={{ opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)' }}
                  transition={{ duration: 0.7, ease: EASE }}
                >
                  {m.ruolo === 'assistente' && !ridotto && i === messaggi.length - 1 ? <Scrivi testo={m.testo} /> : m.testo}
                  {m.avviso && (
                    <>
                      {' '}
                      <a href="#contatti" onClick={(e) => (e.preventDefault(), document.getElementById('contatti')?.scrollIntoView({ behavior: ridotto ? 'auto' : 'smooth' }))}>
                        {a.contatti} →
                      </a>
                    </>
                  )}
                </motion.p>
              ))}
            </AnimatePresence>
            {attesa && (
              <p className="h-sr" role="status">
                {a.pensa}
              </p>
            )}
          </div>

          <form
            className="h-ai-form"
            onSubmit={(e) => {
              e.preventDefault()
              invia(testo)
            }}
          >
            <label>
              <span>{a.etichettaCampo}</span>
              <input value={testo} onChange={(e) => setTesto(e.target.value)} placeholder={a.segnaposto} maxLength={500} disabled={finito} autoComplete="off" data-cursore="" />
            </label>
            <button type="submit" className="h-ai-invia" disabled={!testo.trim() || attesa || finito} aria-label={a.invia} data-cursore="">
              →
            </button>
          </form>
          <p className="h-ai-nota">
            {a.avviso} <Link to="/privacy">{a.privacy}</Link>
          </p>
        </div>
      </motion.div>
    </section>
  )
}
