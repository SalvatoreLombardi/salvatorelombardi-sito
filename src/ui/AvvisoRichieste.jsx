import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { supabase, supabaseAttivo } from '../lib/supabase'

/* ============================================================================
   AVVISO RICHIESTE NUOVE
   Pillola fluttuante col numero di richieste ancora da leggere.

   Chi la vede: solo chi ha una sessione Supabase attiva, cioè solo tu dopo il
   login. I visitatori non la vedono e non potrebbero comunque leggere il dato:
   le policy RLS bloccano la lettura a chi non è autenticato.
   ========================================================================== */

// Ogni quanto ricontrollare, in millisecondi
const INTERVALLO = 60_000

export function AvvisoRichieste() {
  const prefersReducedMotion = useReducedMotion()

  const [sessione, setSessione] = useState(null)
  const [nuove, setNuove] = useState(0)

  /* --- Sessione --- */
  useEffect(() => {
    if (!supabaseAttivo) return

    supabase.auth.getSession().then(({ data }) => setSessione(data.session))

    const { data: iscrizione } = supabase.auth.onAuthStateChange((_e, s) => setSessione(s))
    return () => iscrizione.subscription.unsubscribe()
  }, [])

  /* --- Conteggio delle richieste in stato "nuova" ---
     `head: true` scarica solo il numero, non i dati: chiamata leggerissima. */
  const conta = useCallback(async () => {
    const { count, error } = await supabase
      .from('richieste')
      .select('id', { count: 'exact', head: true })
      .eq('stato', 'nuova')

    if (!error) setNuove(count ?? 0)
  }, [])

  useEffect(() => {
    if (!sessione) {
      setNuove(0)
      return
    }

    conta()

    // Ricontrolla a intervalli regolari e ogni volta che torni sulla scheda
    const timer = setInterval(conta, INTERVALLO)
    const alRitorno = () => document.visibilityState === 'visible' && conta()
    document.addEventListener('visibilitychange', alRitorno)

    return () => {
      clearInterval(timer)
      document.removeEventListener('visibilitychange', alRitorno)
    }
  }, [sessione, conta])

  return (
    <AnimatePresence>
      {sessione && nuove > 0 && (
        <motion.a
          href="#/admin"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 right-28 z-50 sm:right-36 flex items-center gap-3 rounded-full
                     bg-ink-950 py-3 pl-4 pr-5 text-white shadow-lift
                     transition-transform duration-300 hover:scale-105"
          aria-label={`${nuove} richieste nuove da leggere`}
        >
          {/* Pallino che pulsa: l'alone è un secondo cerchio che si espande */}
          <span className="relative flex size-2.5">
            {!prefersReducedMotion && (
              <motion.span
                className="absolute inline-flex size-full rounded-full bg-accent-400"
                animate={{ scale: [1, 2.4], opacity: [0.7, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
              />
            )}
            <span className="relative inline-flex size-2.5 rounded-full bg-accent-400" />
          </span>

          <span className="text-[0.875rem] font-medium tracking-[-0.011em]">
            {nuove} {nuove === 1 ? 'richiesta nuova' : 'richieste nuove'}
          </span>
        </motion.a>
      )}
    </AnimatePresence>
  )
}
