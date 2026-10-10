import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Reveal } from '../ui/Reveal'
import { Button } from '../ui/Button'
import { STEP } from './configuratore/steps'
import { CampoScelta, CampoTesto } from './configuratore/Campi'
import { supabase, supabaseAttivo } from '../lib/supabase'

/* ============================================================================
   CONFIGURATORE PREVENTIVO
   Percorso a step (mini-quiz) invece di un unico form lungo: una domanda per
   schermata, barra di avanzamento in alto, navigazione avanti/indietro.

   L'invio salva la richiesta su Supabase (tabella `richieste`), da dove la
   pagina /admin la legge e la mostra come card.
   ========================================================================== */

const EASE = [0.16, 1, 0.3, 1]

export function Configuratore() {
  const prefersReducedMotion = useReducedMotion()

  const [passo, setPasso] = useState(0)
  // Serve a far entrare la schermata dal lato giusto (+1 avanti, -1 indietro)
  const [direzione, setDirezione] = useState(1)
  const [dati, setDati] = useState({})
  const [inviato, setInviato] = useState(false)
  const [invioInCorso, setInvioInCorso] = useState(false)
  const [errore, setErrore] = useState(null)
  // Presa visione dell'informativa privacy: serve per inviare la richiesta
  const [lettoPrivacy, setLettoPrivacy] = useState(false)

  const stepCorrente = STEP[passo]
  const ultimoPasso = passo === STEP.length - 1
  const avanzamento = ((passo + 1) / STEP.length) * 100

  const aggiornaCampo = (nome, valore) => setDati((precedenti) => ({ ...precedenti, [nome]: valore }))

  // Si può proseguire solo quando tutti i campi obbligatori dello step sono pieni
  const stepCompleto = stepCorrente.campi.every((campo) => {
    if (!campo.obbligatorio) return true
    const valore = dati[campo.nome]
    if (!valore) return false
    // Controllo minimo sull'email: deve almeno somigliare a un indirizzo
    if (campo.tipo === 'email') return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valore)
    return true
  })

  const vaiAvanti = () => {
    if (!stepCompleto) return
    setDirezione(1)
    setPasso((p) => Math.min(p + 1, STEP.length - 1))
  }

  const vaiIndietro = () => {
    setDirezione(-1)
    setPasso((p) => Math.max(p - 1, 0))
  }

  const inviaRichiesta = async (evento) => {
    evento.preventDefault()
    if (!stepCompleto || invioInCorso || !lettoPrivacy) return
    setErrore(null)

    // Se le credenziali non sono ancora configurate lo diciamo chiaramente,
    // invece di far finta che la richiesta sia partita.
    if (!supabaseAttivo) {
      setErrore('Invio non ancora collegato: mancano le credenziali Supabase in .env.local')
      return
    }

    setInvioInCorso(true)

    // I nomi delle colonne seguono lo schema in supabase/schema.sql
    const { error } = await supabase.from('richieste').insert({
      tipo_progetto: dati.tipoProgetto,
      stile: dati.stile,
      palette: dati.palette,
      angoli: dati.angoli,
      foto: dati.foto,
      testi: dati.testi,
      logo: dati.logo,
      nome: dati.nome,
      email: dati.email,
    })

    setInvioInCorso(false)

    if (error) {
      console.error('Errore invio richiesta:', error)
      setErrore('Non sono riuscito a inviare la richiesta. Riprova fra poco.')
      return
    }

    setInviato(true)
  }

  // Distanza dello scorrimento fra una schermata e l'altra
  const scorrimento = prefersReducedMotion ? 0 : 28

  return (
    <section id="configuratore" className="relative">
      <div className="container-site section-y">
        {/* --- Intestazione --- */}
        <div className="mx-auto max-w-2xl text-center">
          <Reveal y={16}>
            <p className="flex items-center justify-center gap-2.5 text-eyebrow uppercase text-white/55">
              <span className="inline-block size-1.5 rounded-full bg-accent-400" />
              Configuratore
            </p>
          </Reveal>

          <Reveal delay={0.1} as="h2" className="mt-7 text-title font-display text-balance">
            <span className="text-white">Cinque domande,</span>{' '}
            <span className="text-white/40">e il preventivo è in arrivo.</span>
          </Reveal>
        </div>

        {/* --- Il pannello del quiz --- */}
        <Reveal delay={0.2} className="mx-auto mt-14 max-w-3xl">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-[0_30px_90px_-30px_rgba(0,0,0,0.6)] backdrop-blur-md">
            {inviato ? (
              <Conferma />
            ) : (
              <>
                {/* ---- Barra di avanzamento ---- */}
                <div className="border-b border-white/10 px-6 pt-6 pb-5 sm:px-10">
                  <div className="flex items-baseline justify-between">
                    <span className="text-eyebrow uppercase text-white/55">
                      {stepCorrente.etichetta}
                    </span>
                    <span className="text-[0.8125rem] tabular-nums text-white/40">
                      {passo + 1} / {STEP.length}
                    </span>
                  </div>

                  <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      className="h-full rounded-full bg-accent-500"
                      initial={false}
                      animate={{ width: `${avanzamento}%` }}
                      transition={{ duration: prefersReducedMotion ? 0 : 0.6, ease: EASE }}
                    />
                  </div>
                </div>

                {/* ---- Schermata dello step ---- */}
                <form onSubmit={inviaRichiesta}>
                  {/* min-h evita che il pannello "salti" fra step di altezza diversa */}
                  <div className="min-h-[24rem] px-6 py-9 sm:px-10">
                    <AnimatePresence mode="wait" initial={false} custom={direzione}>
                      <motion.div
                        key={stepCorrente.id}
                        initial={{ opacity: 0, x: direzione * scorrimento }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: direzione * -scorrimento }}
                        transition={{ duration: prefersReducedMotion ? 0 : 0.4, ease: EASE }}
                      >
                        <h3 className="font-display text-[1.625rem] font-semibold tracking-[-0.022em] text-white text-balance">
                          {stepCorrente.titolo}
                        </h3>
                        <p className="mt-2.5 text-[0.9375rem] text-white/55 text-pretty">
                          {stepCorrente.sottotitolo}
                        </p>

                        {/* I campi si generano da steps.js */}
                        <div className="mt-8 space-y-8">
                          {stepCorrente.campi.map((campo) =>
                            campo.tipo === 'scelta' ? (
                              <CampoScelta
                                key={campo.nome}
                                campo={campo}
                                valore={dati[campo.nome]}
                                onChange={aggiornaCampo}
                              />
                            ) : (
                              <CampoTesto
                                key={campo.nome}
                                campo={campo}
                                valore={dati[campo.nome]}
                                onChange={aggiornaCampo}
                              />
                            ),
                          )}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* ---- Informativa privacy (solo nell'ultimo step, dove si lasciano i dati) ---- */}
                  {ultimoPasso && (
                    <label className="mx-6 mb-6 flex cursor-pointer items-start gap-3 text-[0.8125rem] leading-relaxed text-white/60 sm:mx-10">
                      <input
                        type="checkbox"
                        checked={lettoPrivacy}
                        onChange={(e) => setLettoPrivacy(e.target.checked)}
                        className="mt-0.5 size-4 shrink-0 accent-[#14b8a6]"
                      />
                      <span>
                        Ho letto l'
                        <a
                          href="#/privacy"
                          target="_blank"
                          rel="noreferrer"
                          className="text-white/85 underline underline-offset-2 hover:text-white"
                        >
                          informativa sulla privacy
                        </a>{' '}
                        e so che userete i miei dati per rispondere a questa richiesta di preventivo.
                      </span>
                    </label>
                  )}

                  {/* ---- Eventuale errore di invio ---- */}
                  {errore && (
                    <p
                      role="alert"
                      className="mx-6 mb-1 rounded-md border border-red-500/20 bg-red-500/10 px-4 py-3 text-[0.875rem] text-red-300 sm:mx-10"
                    >
                      {errore}
                    </p>
                  )}

                  {/* ---- Navigazione ---- */}
                  <div className="flex items-center justify-between gap-4 border-t border-white/10 px-6 py-5 sm:px-10">
                    <Button
                      type="button"
                      variant="ghost"
                      size="md"
                      onClick={vaiIndietro}
                      // Al primo step il bottone resta ma non è raggiungibile
                      className={passo === 0 ? 'invisible' : ''}
                    >
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 20 20"
                        className="size-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M16 10H4m0 0 5.5-5.5M4 10l5.5 5.5" />
                      </svg>
                      Indietro
                    </Button>

                    {ultimoPasso ? (
                      <Button
                        type="submit"
                        size="md"
                        variant={!stepCompleto || invioInCorso || !lettoPrivacy ? 'vetro' : 'accent'}
                        disabled={!stepCompleto || invioInCorso || !lettoPrivacy}
                        className={!stepCompleto || invioInCorso || !lettoPrivacy ? 'pointer-events-none opacity-40' : ''}
                      >
                        {invioInCorso ? 'Invio in corso…' : 'Invia richiesta'}
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        size="md"
                        variant={stepCompleto ? 'accent' : 'vetro'}
                        onClick={vaiAvanti}
                        disabled={!stepCompleto}
                        className={!stepCompleto ? 'pointer-events-none opacity-40' : ''}
                      >
                        Avanti
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 20 20"
                          className="size-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M4 10h12m0 0-5.5-5.5M16 10l-5.5 5.5" />
                        </svg>
                      </Button>
                    )}
                  </div>
                </form>
              </>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/** Schermata finale dopo l'invio */
function Conferma() {
  return (
    <div className="flex min-h-[28rem] flex-col items-center justify-center px-6 py-16 text-center">
      <motion.span
        className="flex size-14 items-center justify-center rounded-full bg-accent-500/15 text-accent-400"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <svg
          viewBox="0 0 24 24"
          className="size-7"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m4 12.5 5 5L20 7" />
        </svg>
      </motion.span>

      <h3 className="mt-6 font-display text-[1.625rem] font-semibold tracking-[-0.022em] text-white">
        Richiesta ricevuta
      </h3>
      <p className="mt-3 max-w-sm text-[0.9375rem] text-white/55 text-pretty">
        Ti mando il preventivo entro 24 ore all’indirizzo che hai indicato.
      </p>
    </div>
  )
}
