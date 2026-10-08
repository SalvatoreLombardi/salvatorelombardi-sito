import { motion } from 'motion/react'

/* ============================================================================
   BOTTONE IMMAGINE
   Usa il PNG in public/bottone-preventivo.png, dove il testo è già disegnato
   dentro. Vale solo per la CTA "Richiedi il tuo preventivo": per le altre
   etichette (Avanti, Invia richiesta...) resta il bottone normale.

   `alt` e `aria-label` riportano il testo dell'immagine, altrimenti per Google
   e per i lettori di schermo il bottone sarebbe muto.
   ========================================================================== */
export function BottoneImmagine({
  href,
  onClick,
  etichetta = 'Richiedi il tuo preventivo',
  className = '',
}) {
  return (
    <motion.a
      href={href}
      onClick={onClick}
      aria-label={etichetta}
      className={`inline-block rounded-full ${className}`}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
    >
      <img
        src="/bottone-preventivo.png"
        alt={etichetta}
        // Larghezza fissa, altezza libera: ogni immagine (anche future, con
        // proporzioni diverse) occupa sempre lo stesso ingombro sulla pagina.
        className="h-auto w-56 sm:w-64 lg:w-72"
      />
    </motion.a>
  )
}
