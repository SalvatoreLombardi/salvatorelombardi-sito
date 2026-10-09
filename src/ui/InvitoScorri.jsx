import { motion, useReducedMotion } from 'motion/react'
import { vaiAllaSezione } from '../lib/scroll'

/* ============================================================================
   INVITO A SCORRERE
   In fondo alla prima schermata: etichetta "Scorri", una capsula a vetro con
   una pallina turchese che scende (come la rotella del mouse) e due frecce che
   si accendono a cascata. Un clic porta alla sezione successiva.
   È ancorato al fondo della prima schermata (100svh), non al fondo dell'hero,
   che su alcuni schermi è più alto e lo spingerebbe fuori vista.
   ========================================================================== */

export function InvitoScorri({ verso = 'servizi' }) {
  const ridotto = useReducedMotion()

  return (
    <motion.a
      href={`#${verso}`}
      onClick={(e) => vaiAllaSezione(e, verso)}
      aria-label="Scorri verso i servizi"
      className="group absolute inset-x-0 top-[calc(100svh-8.75rem)] mx-auto hidden w-fit flex-col items-center gap-3 sm:flex"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className="text-[0.75rem] font-medium uppercase tracking-[0.34em] text-white/75 transition-colors duration-300 group-hover:text-accent-400">
        Scorri
      </span>

      {/* Capsula a vetro con la pallina che scende */}
      <span
        className="relative flex h-12 w-7 justify-center rounded-full border border-white/35 bg-white/[0.06]
                   shadow-[0_0_24px_-4px_rgb(45_212_191/0.55),inset_0_1px_0_rgb(255_255_255/0.25)] backdrop-blur-sm
                   transition-colors duration-300 group-hover:border-accent-400"
      >
        <motion.span
          className="mt-2 block size-1.5 rounded-full bg-accent-400 shadow-[0_0_10px_2px_rgb(45_212_191/0.9)]"
          animate={ridotto ? undefined : { y: [0, 20], opacity: [1, 0] }}
          transition={{ duration: 1.7, ease: 'easeInOut', repeat: Infinity, repeatDelay: 0.15 }}
        />
      </span>

      {/* Due frecce che si accendono una dopo l'altra */}
      <span className="-mt-1 hidden flex-col items-center -space-y-2 sm:flex">
        {[0, 0.25].map((ritardo) => (
          <motion.svg
            key={ritardo}
            viewBox="0 0 20 20"
            className="size-4 text-accent-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            animate={ridotto ? undefined : { opacity: [0.15, 1, 0.15] }}
            transition={{ duration: 1.7, ease: 'easeInOut', repeat: Infinity, delay: ritardo }}
          >
            <path d="m4.5 7.5 5.5 5.5 5.5-5.5" />
          </motion.svg>
        ))}
      </span>
    </motion.a>
  )
}
