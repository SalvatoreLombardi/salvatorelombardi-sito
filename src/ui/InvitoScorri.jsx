import { motion, useReducedMotion } from 'motion/react'
import { vaiAllaSezione } from '../lib/scroll'

/* ============================================================================
   INVITO A SCORRERE
   In fondo alla prima schermata: etichetta "Scorri" e una linea verticale
   sottile con un puntino turchese che scende e si dissolve. Un clic porta alla
   sezione successiva.
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
      className="group absolute inset-x-0 top-[calc(100svh-8.75rem)] mx-auto hidden w-fit flex-col items-center gap-4 sm:flex"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className="text-[0.75rem] font-medium uppercase tracking-[0.34em] text-white/75 transition-colors duration-300 group-hover:text-accent-400">
        Scorri
      </span>

      {/* Linea sottile con il puntino che scende */}
      <span className="relative block h-[4.5rem] w-px overflow-hidden bg-white/20">
        <motion.span
          className="absolute inset-x-0 top-0 block h-6 bg-gradient-to-b from-transparent via-accent-400 to-accent-400
                     shadow-[0_0_8px_1px_rgb(45_212_191/0.8)]"
          animate={ridotto ? undefined : { y: ['-100%', '300%'] }}
          transition={{ duration: 1.8, ease: 'easeInOut', repeat: Infinity, repeatDelay: 0.2 }}
        />
      </span>
    </motion.a>
  )
}
