import { useEffect, useState } from 'react'

/* ============================================================================
   TORNA SU — lato chiaro.
   Un cerchio disegnato a mano con una freccia in su, in basso a destra. Compare
   dopo aver scrollato oltre la prima schermata. Cambia colore da solo: chiaro
   sulla chiusura scura, scuro sul fondo chiaro.
   ========================================================================== */
const SOGLIA = 500 // px di scroll dopo i quali compare

export function TornaSuChiaro() {
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
    <button
      type="button"
      className={`h-su ${visibile ? 'h-su-visibile' : ''}`}
      onClick={vaiSu}
      aria-label="Torna in cima"
      tabIndex={visibile ? 0 : -1}
      data-cursore=""
    >
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <path d="M50 4C76 3 97 24 96 51C95 77 75 97 49 96C23 95 3 76 4 49C5 25 24 5 52 5" />
      </svg>
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <path d="M50 70C49 58 51 46 50 32" />
        <path d="M37 44C42 40 47 35 50 31C54 35 58 39 63 44" />
      </svg>
    </button>
  )
}
