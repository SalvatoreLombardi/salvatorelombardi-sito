import { useEffect, useRef, useState } from 'react'

/* ============================================================================
   LOADER D'INGRESSO (finto)
   1. contatore turchese da 0 a 100% in circa 1,3 secondi
   2. un filo di luce taglia lo schermo in orizzontale
   3. due pannelli neri scorrono (uno su, uno giù) e scoprono il sito

   Si vede una volta per sessione del browser. Con "riduci animazioni" attivo
   nel sistema non compare. Per rivederlo mentre lavori: aggiungi ?loader
   all'indirizzo (es. http://localhost:5173/?loader#/).
   ========================================================================== */
const DURATA_CONTEGGIO = 1300
const DURATA_LINEA = 600
const DURATA_APERTURA = 900
const CHIAVE = 'loader-visto'

function dovreiMostrarlo() {
  try {
    if (window.location.search.includes('loader')) return true
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
    return !sessionStorage.getItem(CHIAVE)
  } catch {
    return false
  }
}

export function Loader() {
  const [attivo, setAttivo] = useState(dovreiMostrarlo)
  const [fase, setFase] = useState('conta') // conta -> linea -> apri
  const [percento, setPercento] = useState(0)
  const canvasRef = useRef(null)
  const taglio = fase !== 'conta'

  useEffect(() => {
    if (!attivo) return
    try {
      sessionStorage.setItem(CHIAVE, '1')
    } catch {
      /* storage non disponibile: pazienza, lo rivedrà */
    }
    document.documentElement.style.overflow = 'hidden'

    let raf
    const inizio = performance.now()
    const passo = (ora) => {
      const t = Math.min((ora - inizio) / DURATA_CONTEGGIO, 1)
      // easeInOut: parte piano, accelera, rallenta sul finale
      const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
      setPercento(Math.round(e * 100))
      if (t < 1) raf = requestAnimationFrame(passo)
      else setFase('linea')
    }
    raf = requestAnimationFrame(passo)

    return () => {
      cancelAnimationFrame(raf)
      document.documentElement.style.overflow = ''
    }
  }, [attivo])

  useEffect(() => {
    if (fase === 'linea') {
      const t = setTimeout(() => setFase('apri'), DURATA_LINEA)
      return () => clearTimeout(t)
    }
    if (fase === 'apri') {
      const t = setTimeout(() => {
        document.documentElement.style.overflow = ''
        setAttivo(false)
      }, DURATA_APERTURA)
      return () => clearTimeout(t)
    }
  }, [fase])

  /* Scintille: partono dalle due punte del filo mentre si allarga e poi
     cadono con la gravità. Disegnate su canvas (leggero, nessun elemento DOM). */
  useEffect(() => {
    if (!taglio || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const w = window.innerWidth
    const h = window.innerHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    ctx.scale(dpr, dpr)

    const scintille = []
    const inizio = performance.now()
    const nasci = (x, forza) => {
      const ang = Math.random() * Math.PI * 2
      const vel = (1.5 + Math.random() * 4.5) * forza
      scintille.push({
        x,
        y: h / 2,
        vx: Math.cos(ang) * vel,
        vy: Math.sin(ang) * vel - 1.5,
        vita: 0,
        durata: 350 + Math.random() * 450,
        r: 0.6 + Math.random() * 1.6,
      })
    }

    let raf
    let ultimo = inizio
    const frame = (ora) => {
      const dt = Math.min(ora - ultimo, 40) / 16.67
      ultimo = ora
      const t = ora - inizio
      if (t < DURATA_LINEA) {
        const p = Math.min(t / DURATA_LINEA, 1)
        const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2
        const mezza = (w / 2) * e
        // Tante scintille al centro, sempre meno man mano che le punte
        // si avvicinano ai bordi (a fine corsa quasi nessuna)
        const quante = 16 * Math.pow(1 - e, 1.6) * dt
        const n = Math.floor(quante) + (Math.random() < quante % 1 ? 1 : 0)
        for (let i = 0; i < n; i++) {
          nasci(w / 2 + mezza, 0.5 + (1 - e))
          nasci(w / 2 - mezza, 0.5 + (1 - e))
        }
      }

      ctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'lighter'
      for (let i = scintille.length - 1; i >= 0; i--) {
        const sc = scintille[i]
        sc.vita += dt * 16.67
        if (sc.vita >= sc.durata) {
          scintille.splice(i, 1)
          continue
        }
        sc.vy += 0.18 * dt
        sc.vx *= 0.985
        sc.x += sc.vx * dt
        sc.y += sc.vy * dt
        const a = 1 - sc.vita / sc.durata
        ctx.beginPath()
        ctx.fillStyle = `rgba(${a > 0.6 ? '220,255,250' : '45,212,191'},${a})`
        ctx.arc(sc.x, sc.y, sc.r, 0, Math.PI * 2)
        ctx.fill()
      }
      if (t < DURATA_LINEA || scintille.length) raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [taglio])

  if (!attivo) return null

  const aperto = fase === 'apri'
  const transizione = `transform ${DURATA_APERTURA}ms cubic-bezier(0.76, 0, 0.24, 1)`

  return (
    <div className="fixed inset-0 z-[100]" aria-hidden="true">
      <div
        className="absolute inset-x-0 top-0 h-1/2 bg-ink-950"
        style={{ transform: aperto ? 'translateY(-100%)' : 'none', transition: transizione }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-1/2 bg-ink-950"
        style={{ transform: aperto ? 'translateY(100%)' : 'none', transition: transizione }}
      />

      {/* Contatore */}
      <div
        className="absolute inset-0 flex items-center justify-center transition-opacity duration-300"
        style={{ opacity: fase === 'conta' ? 1 : 0 }}
      >
        <span
          className="font-semibold tabular-nums text-accent-400"
          style={{
            fontSize: 'clamp(4rem, 2rem + 12vw, 11rem)',
            letterSpacing: '-0.04em',
            textShadow: '0 0 40px rgb(45 212 191 / 0.55)',
          }}
        >
          {percento}%
        </span>
      </div>

      {/* Scintille (le anima l'effetto sopra) */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" style={{ opacity: aperto ? 0 : 1, transition: 'opacity 500ms ease-out' }} />

      {/* Filo di luce che taglia lo schermo */}
      <div
        className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2"
        style={{
          background:
            'linear-gradient(90deg, transparent, var(--color-accent-400) 20%, #fff 50%, var(--color-accent-400) 80%, transparent)',
          boxShadow: '0 0 18px 3px rgb(45 212 191 / 0.7)',
          transform: fase === 'conta' ? 'scaleX(0)' : 'scaleX(1)',
          opacity: aperto ? 0 : 1,
          transition: `transform ${DURATA_LINEA}ms cubic-bezier(0.65, 0, 0.35, 1), opacity 400ms ease-out`,
        }}
      />
    </div>
  )
}
