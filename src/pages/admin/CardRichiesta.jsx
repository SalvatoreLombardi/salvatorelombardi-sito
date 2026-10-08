import { motion } from 'motion/react'
import { ETICHETTE } from '../../components/configuratore/steps'

/* ============================================================================
   CARD DI UNA SINGOLA RICHIESTA
   ========================================================================== */

// Aspetto del badge in base allo stato della richiesta
const STILI_STATO = {
  nuova: 'bg-accent-50 text-accent-700 border-accent-200',
  letta: 'bg-ink-100 text-ink-600 border-ink-200',
  chiusa: 'bg-ink-950 text-white border-ink-950',
}

/** Traduce un valore salvato nella sua etichetta leggibile */
const leggibile = (valore) => (valore ? (ETICHETTE[valore] ?? valore) : '—')

/** Data in formato italiano */
const dataIta = (valore) =>
  valore
    ? new Date(valore).toLocaleDateString('it-IT', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '—'

export function CardRichiesta({ richiesta, onCambiaStato, onElimina }) {
  const righe = [
    ['Progetto', leggibile(richiesta.tipo_progetto)],
    ['Stile', leggibile(richiesta.stile)],
    ['Palette', leggibile(richiesta.palette)],
    ['Angoli', leggibile(richiesta.angoli)],
    ['Foto', leggibile(richiesta.foto)],
    ['Testi', leggibile(richiesta.testi)],
    ['Logo', leggibile(richiesta.logo)],
    ['Budget', leggibile(richiesta.budget)],
    ['Scadenza', dataIta(richiesta.scadenza)],
  ]

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col rounded-xl border border-ink-200 bg-white p-6 shadow-soft"
    >
      {/* --- Intestazione: contatto + stato --- */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate font-display text-[1.125rem] font-semibold tracking-[-0.02em] text-ink-950">
            {richiesta.nome}
          </h3>
          <a
            href={`mailto:${richiesta.email}`}
            className="mt-0.5 block truncate text-[0.875rem] text-accent-600 hover:underline"
          >
            {richiesta.email}
          </a>
        </div>

        <span
          className={`shrink-0 rounded-full border px-2.5 py-1 text-[0.6875rem] font-medium uppercase tracking-[0.08em] ${
            STILI_STATO[richiesta.stato] ?? STILI_STATO.nuova
          }`}
        >
          {richiesta.stato}
        </span>
      </div>

      <p className="mt-1 text-[0.8125rem] text-ink-400">
        Ricevuta il {dataIta(richiesta.creato_il)}
      </p>

      {/* --- Risposte del configuratore --- */}
      <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2.5 border-t border-ink-100 pt-5">
        {righe.map(([etichetta, valore]) => (
          <div key={etichetta} className="min-w-0">
            <dt className="text-[0.6875rem] uppercase tracking-[0.08em] text-ink-400">
              {etichetta}
            </dt>
            <dd className="truncate text-[0.875rem] text-ink-800">{valore}</dd>
          </div>
        ))}
      </dl>

      {/* --- Azioni --- */}
      <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-ink-100 pt-5">
        {['nuova', 'letta', 'chiusa'].map((stato) => (
          <button
            key={stato}
            type="button"
            onClick={() => onCambiaStato(richiesta.id, stato)}
            disabled={richiesta.stato === stato}
            className={`rounded-full px-3 py-1.5 text-[0.8125rem] transition-colors duration-200 ${
              richiesta.stato === stato
                ? 'cursor-default bg-ink-950 text-white'
                : 'bg-ink-50 text-ink-600 hover:bg-ink-100 hover:text-ink-950'
            }`}
          >
            {stato}
          </button>
        ))}

        <button
          type="button"
          onClick={() => onElimina(richiesta.id)}
          className="ml-auto rounded-full px-3 py-1.5 text-[0.8125rem] text-ink-400
                     transition-colors duration-200 hover:bg-red-50 hover:text-red-600"
        >
          Elimina
        </button>
      </div>
    </motion.article>
  )
}
