import { useEffect, useRef } from 'react'

/* ============================================================================
   MENU — lato chiaro.
   Si apre dal cerchio in alto a destra: uno schermo scuro, come l'ingresso, che
   si allarga dal punto del bottone. Le voci sono titoli grandi in contorno che
   si riempiono al passaggio, come i titoli del sito. A sinistra corre una linea
   a mano, la stessa dell'ingresso: ondula piano e ogni voce ha il suo cerchietto
   sulla linea. Esc o il cerchio con la X lo chiudono.
   ========================================================================== */
const VOCI = [
  { id: 'chi-sono', nome: 'Chi sono' },
  { id: 'servizi', nome: 'Servizi' },
  { id: 'lavori', nome: 'Lavori' },
  { id: 'video', nome: 'Video' },
  { id: 'preventivo', nome: 'Preventivo' },
  { id: 'contatti', nome: 'Contatti' },
]

const LARGHEZZA_LINEA = 44 // px: la colonna a sinistra dove corre la linea
const LUNGHEZZA_ONDA = 260
const VELOCITA_ONDA = 2.1

/** La linea con i cerchietti: disegnata su canvas, sempre in movimento mentre il menu è aperto. */
function LineaTempo({ aperto, elenco, vociRef, attivaRef }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!aperto) return
    const canvas = ref.current
    const c = canvas.getContext('2d')
    const ridotto = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const clamp = (v, a, b) => Math.min(Math.max(v, a), b)
    const esce = (u) => 1 - Math.pow(1 - clamp(u, 0, 1), 3)
    // Fasi fisse: la linea è irregolare ma parte sempre uguale
    let seme = 33
    const rnd = () => {
      seme = (seme * 16807) % 2147483647
      return (seme - 1) / 2147483646
    }
    const f = Array.from({ length: 8 }, () => rnd() * 6.28)
    const K = (Math.PI * 2) / LUNGHEZZA_ONDA

    let altezza = 0
    let centri = [] // altezza del centro di ogni voce, rispetto alla colonna
    const misura = () => {
      const r = elenco.current.getBoundingClientRect()
      altezza = r.height
      centri = [...vociRef.current].map((el) => {
        const v = el.getBoundingClientRect()
        return v.top - r.top + v.height / 2
      })
      canvas.style.height = `${altezza}px`
      canvas.width = Math.round(LARGHEZZA_LINEA * dpr)
      canvas.height = Math.round(altezza * dpr)
    }
    misura()
    const osservatore = new ResizeObserver(misura)
    osservatore.observe(elenco.current)

    const xa = (y, t) => {
      const u = y / Math.max(altezza, 1)
      const onda = ridotto ? 0 : 5 * Math.pow(1 - u, 0.5) * Math.sin(VELOCITA_ONDA * t - K * y)
      const storta = (2.4 * Math.sin(u * 5 + f[0]) + 1.6 * Math.sin(u * 12 + f[1])) * (0.4 + u * 0.6)
      return LARGHEZZA_LINEA / 2 + storta + onda
    }

    const tInizio = performance.now()
    const disegna = (t) => {
      c.setTransform(dpr, 0, 0, dpr, 0, 0)
      c.clearRect(0, 0, LARGHEZZA_LINEA, altezza)
      c.strokeStyle = '#e6e4dd'
      c.lineWidth = 1.2
      c.lineCap = 'round'
      c.lineJoin = 'round'

      // la linea si traccia dall'alto verso il basso appena il menu si apre
      const quota = ridotto ? 1 : esce((t - 0.5) / 1.5)
      const fino = altezza * quota
      c.globalAlpha = 0.9
      c.beginPath()
      c.moveTo(xa(0, t), 0)
      for (let y = 4; y <= fino; y += 4) c.lineTo(xa(y, t), y)
      c.stroke()

      // un cerchietto a mano per ogni voce, attaccato alla linea; quello sotto il mouse si riempie
      centri.forEach((y, i) => {
        if (y > fino) return
        const attiva = attivaRef.current === i
        const x = xa(y, t)
        const r = attiva ? 11 : 8.5
        c.globalAlpha = clamp((fino - y) / 40, 0, 1)
        c.beginPath()
        const inizio = f[2] + i * 1.7
        for (let k = 0; k <= 22; k++) {
          const a = inizio + (k / 20) * Math.PI * 2
          const d = 1 + 0.07 * Math.sin(3 * a + f[3] + i)
          const px = x + Math.cos(a) * r * d
          const py = y + Math.sin(a) * r * d
          if (k === 0) c.moveTo(px, py)
          else c.lineTo(px, py)
        }
        if (attiva) {
          c.fillStyle = '#e6e4dd'
          c.fill()
        }
        c.stroke()
      })
      c.globalAlpha = 1
    }

    if (ridotto) {
      disegna(99)
      const ridisegna = () => disegna(99)
      window.addEventListener('pointermove', ridisegna)
      return () => {
        osservatore.disconnect()
        window.removeEventListener('pointermove', ridisegna)
      }
    }
    let frame = 0
    const giro = (ora) => {
      frame = requestAnimationFrame(giro)
      disegna((ora - tInizio) / 1000)
    }
    frame = requestAnimationFrame(giro)
    return () => {
      cancelAnimationFrame(frame)
      osservatore.disconnect()
    }
  }, [aperto, elenco, vociRef, attivaRef])

  return <canvas ref={ref} className="h-menu-linea" width={LARGHEZZA_LINEA} aria-hidden="true" />
}

export function MenuChiaro({ aperto, chiudi, vai }) {
  const chiudiRef = useRef(null)
  const elencoRef = useRef(null)
  const vociRef = useRef([])
  const attivaRef = useRef(-1)

  // Esc chiude; con il menu aperto la pagina sotto non scorre e il focus va sul bottone di chiusura
  useEffect(() => {
    if (!aperto) return
    const suTasto = (e) => e.key === 'Escape' && chiudi()
    window.addEventListener('keydown', suTasto)
    const prima = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    chiudiRef.current?.focus({ preventScroll: true })
    return () => {
      window.removeEventListener('keydown', suTasto)
      document.body.style.overflow = prima
    }
  }, [aperto, chiudi])

  return (
    <div
      className={`h-menu ${aperto ? 'h-menu-aperto' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      inert={aperto ? undefined : true}
    >
      <div className="h-menu-fondo h-pannello-v" />
      <button ref={chiudiRef} type="button" className="h-cerchio h-menu-chiudi" onClick={chiudi} aria-label="Chiudi il menu">
        <svg viewBox="0 0 100 100" aria-hidden="true">
          <path d="M50 4C76 3 97 24 96 51C95 77 75 97 49 96C23 95 3 76 4 49C5 25 24 5 52 5" />
        </svg>
        <svg className="h-cerchio-linee" viewBox="0 0 100 100" aria-hidden="true">
          <path d="M35 38C40 41 44 43 49 49C54 54 59 57 65 62" />
          <path d="M62 35C58 41 55 45 50 50C45 56 42 60 37 66" />
        </svg>
      </button>

      <nav className="h-menu-voci" aria-label="Sezioni del sito">
        <LineaTempo aperto={aperto} elenco={elencoRef} vociRef={vociRef} attivaRef={attivaRef} />
        <ol ref={elencoRef}>
          {VOCI.map((voce, i) => (
            <li key={voce.id} style={{ '--i': i }} ref={(el) => (vociRef.current[i] = el)}>
              <a
                href={`#${voce.id}`}
                className="h-menu-voce"
                onClick={(e) => (e.preventDefault(), vai(voce.id))}
                onMouseEnter={() => (attivaRef.current = i)}
                onMouseLeave={() => (attivaRef.current = -1)}
                onFocus={() => (attivaRef.current = i)}
                onBlur={() => (attivaRef.current = -1)}
                data-cursore=""
              >
                <span className="h-menu-titolo">
                  <span className="h-menu-contorno" aria-hidden="true">
                    {voce.nome}
                  </span>
                  <span className="h-menu-riempimento">{voce.nome}</span>
                </span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  )
}
