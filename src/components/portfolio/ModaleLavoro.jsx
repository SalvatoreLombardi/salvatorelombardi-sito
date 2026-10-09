import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'

/* ============================================================================
   FINESTRA CON LA DESCRIZIONE COMPLETA DI UN LAVORO
   Si apre da "Leggi di più". Il bordo luminoso che gira intorno è in index.css
   (classe .bordo-luminoso). Si chiude con Esc, cliccando fuori o sulla X.
   ========================================================================== */

export function ModaleLavoro({ lavoro, aperta, onChiudi }) {
  useEffect(() => {
    if (!aperta) return
    const suTasto = (e) => e.key === 'Escape' && onChiudi()
    const overflowPrecedente = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', suTasto)
    return () => {
      window.removeEventListener('keydown', suTasto)
      document.body.style.overflow = overflowPrecedente
    }
  }, [aperta, onChiudi])

  return createPortal(
    <AnimatePresence>
      {aperta && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Sfondo scuro: un clic qui chiude la finestra */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onChiudi}
            aria-hidden="true"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={lavoro.titolo}
            className="bordo-luminoso relative w-full max-w-2xl"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative max-h-[85vh] overflow-y-auto rounded-[inherit] bg-ink-950 p-7 sm:p-10">
              <button
                type="button"
                onClick={onChiudi}
                aria-label="Chiudi"
                className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full
                           bg-white/[0.06] text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              >
                <svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                  <path d="m5 5 10 10M15 5 5 15" />
                </svg>
              </button>

              <p className="text-[0.8125rem] tabular-nums text-white/40">{lavoro.anno}</p>
              <h3 className="mt-1 font-display text-[1.75rem] font-semibold tracking-[-0.022em] text-white">
                {lavoro.titolo}
              </h3>
              <p className="mt-4 text-[1rem] leading-relaxed text-white/65 text-pretty">
                {lavoro.completa.intro}
              </p>

              <ul className="mt-7 space-y-5">
                {lavoro.completa.punti.map(([titolo, testo]) => (
                  <li key={titolo} className="flex gap-3">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent-400" />
                    <p className="text-[0.9375rem] leading-relaxed text-white/55 text-pretty">
                      <strong className="font-medium text-white">{titolo}.</strong> {testo}
                    </p>
                  </li>
                ))}
              </ul>

              {lavoro.link && (
                <a
                  href={lavoro.link}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-9 inline-flex h-11 items-center gap-2 rounded-full bg-accent-500 px-6
                             text-[0.9375rem] font-medium text-white transition-colors hover:bg-accent-600"
                >
                  {lavoro.testoLink ?? 'Visita il sito'}
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
