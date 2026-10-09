import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

/* ============================================================================
   TORNA SU
   Bottone fisso in basso a destra che riporta in cima alla pagina. Compare
   solo dopo aver scrollato un po'. L'immagine è public/torna-su.png.
   ========================================================================== */

const SOGLIA = 600 // px di scroll dopo i quali compare

export function TornaSu() {
  const [visibile, setVisibile] = useState(false)

  useEffect(() => {
    const controlla = () => setVisibile(window.scrollY > SOGLIA)
    controlla()
    window.addEventListener('scroll', controlla, { passive: true })
    return () => window.removeEventListener('scroll', controlla)
  }, [])

  const vaiSu = () =>
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    })

  return (
    <AnimatePresence>
      {visibile && (
        <motion.button
          type="button"
          onClick={vaiSu}
          aria-label="Torna su"
          className="fixed bottom-4 right-4 z-40 size-10 sm:bottom-6 sm:right-6 sm:size-14 drop-shadow-[0_10px_24px_rgb(20_184_166/0.55)]"
          initial={{ opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.9 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Bolla di vetro con la freccia: PNG con sfondo trasparente */}
          <img src="/torna-su.png" alt="" draggable="false" className="size-full select-none object-contain" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
