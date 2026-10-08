import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { supabase, supabaseAttivo } from '../lib/supabase'
import { Login } from './admin/Login'
import { CardRichiesta } from './admin/CardRichiesta'

/* ============================================================================
   AREA RISERVATA — elenco delle richieste di preventivo
   Protetta dal login Supabase. La sicurezza vera non sta qui ma nelle policy
   RLS del database (supabase/schema.sql): anche chiamando l'API a mano, senza
   login non si legge nulla.
   ========================================================================== */

const FILTRI = ['tutte', 'nuova', 'letta', 'chiusa']

export default function Admin() {
  const [sessione, setSessione] = useState(null)
  const [caricamentoSessione, setCaricamentoSessione] = useState(true)

  const [richieste, setRichieste] = useState([])
  const [caricamento, setCaricamento] = useState(false)
  const [errore, setErrore] = useState(null)
  const [filtro, setFiltro] = useState('tutte')

  /* --- Sessione: la recuperiamo all'avvio e restiamo in ascolto ----------- */
  useEffect(() => {
    if (!supabaseAttivo) {
      setCaricamentoSessione(false)
      return
    }

    supabase.auth.getSession().then(({ data }) => {
      setSessione(data.session)
      setCaricamentoSessione(false)
    })

    // Aggiorna la vista su login, logout e rinnovo del token
    const { data: iscrizione } = supabase.auth.onAuthStateChange((_evento, nuovaSessione) =>
      setSessione(nuovaSessione),
    )

    return () => iscrizione.subscription.unsubscribe()
  }, [])

  /* --- Lettura delle richieste ------------------------------------------- */
  const caricaRichieste = useCallback(async () => {
    setCaricamento(true)
    setErrore(null)

    const { data, error } = await supabase
      .from('richieste')
      .select('*')
      .order('creato_il', { ascending: false })

    setCaricamento(false)

    if (error) {
      console.error(error)
      setErrore('Non riesco a leggere le richieste.')
      return
    }
    setRichieste(data ?? [])
  }, [])

  useEffect(() => {
    if (sessione) caricaRichieste()
  }, [sessione, caricaRichieste])

  /* --- Azioni sulle card -------------------------------------------------- */
  const cambiaStato = async (id, stato) => {
    // Aggiorniamo subito a schermo, poi confermiamo sul database:
    // l'interfaccia resta reattiva anche con connessione lenta.
    setRichieste((elenco) => elenco.map((r) => (r.id === id ? { ...r, stato } : r)))

    const { error } = await supabase.from('richieste').update({ stato }).eq('id', id)
    if (error) {
      console.error(error)
      caricaRichieste() // in caso di errore ripristiniamo lo stato reale
    }
  }

  const elimina = async (id) => {
    if (!confirm('Eliminare questa richiesta? L’operazione non si annulla.')) return

    setRichieste((elenco) => elenco.filter((r) => r.id !== id))

    const { error } = await supabase.from('richieste').delete().eq('id', id)
    if (error) {
      console.error(error)
      caricaRichieste()
    }
  }

  /* --- Schermate di servizio ---------------------------------------------- */
  if (!supabaseAttivo) {
    return (
      <MessaggioCentrale
        titolo="Database non configurato"
        testo="Mancano le credenziali Supabase in .env.local. Copia .env.example e incolla i tuoi valori."
      />
    )
  }

  if (caricamentoSessione) return <MessaggioCentrale titolo="Caricamento…" />

  if (!sessione) return <Login />

  /* --- Area riservata ------------------------------------------------------ */
  const visibili =
    filtro === 'tutte' ? richieste : richieste.filter((r) => r.stato === filtro)

  const nuove = richieste.filter((r) => r.stato === 'nuova').length

  return (
    <div className="min-h-screen bg-ink-50">
      {/* --- Barra in alto --- */}
      <header className="sticky top-0 z-10 border-b border-ink-200 bg-white/80 backdrop-blur-xl">
        <div className="container-site flex h-16 items-center justify-between gap-4">
          <div className="flex items-baseline gap-3">
            <span className="font-display text-[1.0625rem] font-semibold tracking-[-0.02em] text-ink-950">
              Richieste
            </span>
            {nuove > 0 && (
              <span className="rounded-full bg-accent-500 px-2 py-0.5 text-[0.6875rem] font-medium text-white">
                {nuove} nuove
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <a href="#/" className="text-[0.875rem] text-ink-500 hover:text-ink-950">
              Vai al sito
            </a>
            <button
              type="button"
              onClick={() => supabase.auth.signOut()}
              className="text-[0.875rem] text-ink-500 hover:text-ink-950"
            >
              Esci
            </button>
          </div>
        </div>
      </header>

      <main className="container-site py-10">
        {/* --- Filtri per stato --- */}
        <div className="flex flex-wrap gap-2">
          {FILTRI.map((voce) => (
            <button
              key={voce}
              type="button"
              onClick={() => setFiltro(voce)}
              className={`rounded-full px-4 py-2 text-[0.875rem] transition-colors duration-200 ${
                filtro === voce
                  ? 'bg-ink-950 text-white'
                  : 'bg-white text-ink-600 hover:text-ink-950'
              }`}
            >
              {voce}
            </button>
          ))}

          <button
            type="button"
            onClick={caricaRichieste}
            className="ml-auto rounded-full px-4 py-2 text-[0.875rem] text-ink-500 hover:text-ink-950"
          >
            Aggiorna
          </button>
        </div>

        {errore && (
          <p role="alert" className="mt-6 rounded-md bg-red-50 px-4 py-3 text-[0.875rem] text-red-700">
            {errore}
          </p>
        )}

        {/* --- Griglia delle card --- */}
        {caricamento && richieste.length === 0 ? (
          <p className="mt-16 text-center text-ink-400">Caricamento…</p>
        ) : visibili.length === 0 ? (
          <p className="mt-16 text-center text-ink-400">
            {richieste.length === 0
              ? 'Nessuna richiesta ancora.'
              : 'Nessuna richiesta con questo stato.'}
          </p>
        ) : (
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {visibili.map((richiesta) => (
                <CardRichiesta
                  key={richiesta.id}
                  richiesta={richiesta}
                  onCambiaStato={cambiaStato}
                  onElimina={elimina}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  )
}

/** Schermata semplice per stati di attesa o configurazione mancante */
function MessaggioCentrale({ titolo, testo }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-50 px-6 text-center">
      <div className="max-w-sm">
        <h1 className="font-display text-[1.375rem] font-semibold tracking-[-0.022em] text-ink-950">
          {titolo}
        </h1>
        {testo && <p className="mt-3 text-[0.9375rem] text-ink-500">{testo}</p>}
      </div>
    </div>
  )
}
