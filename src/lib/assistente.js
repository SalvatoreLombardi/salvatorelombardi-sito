import { supabase } from './supabase'

/** L'assistente è acceso solo dove VITE_ASSISTENTE è impostata (in locale; online dopo aver attivato la funzione). */
export const ASSISTENTE_ATTIVO = Boolean(import.meta.env.VITE_ASSISTENTE)

/** Apre la chat da un altro punto del sito (menu, contatti): la chat ascolta questo evento. */
export const apriAssistente = () => window.dispatchEvent(new Event('apri-assistente'))

/* ============================================================================
   ASSISTENTE AI — chiamata al server.
   Online la richiesta va alla funzione `assistente` su Supabase (che tiene la
   chiave di Gemini); in locale la serve Vite su /api/assistente (vite.config.js).
   Restituisce { testo } oppure { errore }: il sito non si rompe mai, al massimo
   l'assistente dice che non è disponibile.
   ========================================================================== */
export async function chiediAssistente(messaggi) {
  try {
    if (import.meta.env.DEV) {
      const r = await fetch('/api/assistente', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messaggi }) })
      return await r.json()
    }
    if (!supabase) return { errore: 'non-disponibile' }
    const { data, error } = await supabase.functions.invoke('assistente', { body: { messaggi } })
    if (error || !data) return { errore: error?.context?.status === 429 ? 'limite' : 'non-disponibile' }
    return data
  } catch {
    return { errore: 'non-disponibile' }
  }
}
