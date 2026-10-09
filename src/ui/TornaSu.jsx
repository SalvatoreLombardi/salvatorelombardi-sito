import { Suspense, lazy, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

/* ============================================================================
   TORNA SU
   Widget fisso in basso a destra che riporta in cima alla pagina. È lo stesso
   cubo di vetro dei servizi (CuboServizi, variante "freccia"): freccia in su su
   ogni faccia, stessa rotazione e stesso effetto fluttuante.

   Compare solo dopo aver scrollato un po'. Il cubo 3D si scarica solo in quel
   momento (lazy). Un clic o un tocco (non un trascinamento) riporta in cima.
   ========================================================================== */
const CuboServizi = lazy(() => import('./CuboServizi'))

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
        <motion.div
          className="fixed bottom-2 right-2 z-40 size-24 sm:bottom-4 sm:right-4 sm:size-28"
          initial={{ opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.9 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <Suspense fallback={null}>
            <CuboServizi variante="freccia" onClick={vaiSu} />
          </Suspense>
          {/* Per chi naviga da tastiera: pulsante invisibile che compare quando prende il focus */}
          <button
            type="button"
            onClick={vaiSu}
            className="sr-only focus:not-sr-only focus:absolute focus:inset-0 focus:flex focus:items-center
                       focus:justify-center focus:rounded-full focus:bg-ink-950/80 focus:text-sm focus:text-white"
          >
            Torna su
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
