import { useRef } from 'react'
import { motion } from 'motion/react'

/* ============================================================================
   BOTTONE CTA
   Bottone principale del sito. Nel gusto dei siti americani più curati:
   - bordo di luce turchese che gira intorno alla pillola e un alone dietro;
   - corpo scuro con un riflesso che scorre sopra la scritta ogni pochi secondi;
   - faro di luce che segue il mouse dentro il bottone;
   - freccia in un cerchio turchese che scorre al passaggio e si preme al clic.
   Gli stili (.cta-*) sono in index.css. Con "riduci movimento" restano fermi.
   ========================================================================== */
export function BottoneCta({ href, onClick, children = 'Richiedi il tuo preventivo', className = '' }) {
  const ref = useRef(null)

  // Il faro segue il mouse: si scrivono le coordinate in due variabili CSS
  const seguiMouse = (e) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    ref.current.style.setProperty('--mx', `${e.clientX - r.left}px`)
    ref.current.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  return (
    <motion.a
      ref={ref}
      href={href}
      onClick={onClick}
      onPointerMove={seguiMouse}
      className={`cta group ${className}`}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 420, damping: 26 }}
    >
      <span className="cta-corpo">
        <span className="cta-faro" aria-hidden="true" />
        <span className="cta-testo">{children}</span>
        <span className="cta-freccia" aria-hidden="true">
          <svg
            viewBox="0 0 20 20"
            className="size-[1.1rem]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10 3.5v13m0 0-5-5m5 5 5-5" />
          </svg>
        </span>
      </span>
    </motion.a>
  )
}
