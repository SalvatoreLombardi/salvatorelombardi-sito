import { Suspense, createContext, lazy, useContext, useEffect, useRef, useState } from 'react'
import { animate, motion, useInView, useMotionValue, useReducedMotion, useScroll, useTransform } from 'motion/react'
import '@fontsource-variable/bodoni-moda'
import '@fontsource-variable/bodoni-moda/wght-italic.css'
import './chiaro.css'
import { ServiziChiaro } from './ServiziChiaro.jsx'
import { LavoriChiaro } from './LavoriChiaro.jsx'
import { VideoChiaro } from './VideoChiaro.jsx'
import { PreventivoChiaro } from './PreventivoChiaro.jsx'
import { ContattiChiaro } from './ContattiChiaro.jsx'
import { AvvisoRichieste } from '../ui/AvvisoRichieste'
import { LogoInterruttore } from '../ui/LogoInterruttore.jsx'
import { TornaSuChiaro } from '../ui/TornaSuChiaro.jsx'
import { MenuChiaro } from './MenuChiaro.jsx'
import { useLingua } from '../i18n/LinguaChiaro.jsx'
import { suonoPannelli, suonoScatto } from '../lib/suonoScatto.js'
import { accendiMusica, analizzatoreMusica, sbloccaMusica, riprendiMusica, sospendiMusica, spegniMusica } from '../lib/musica.js'
import { FrecciaMatita, disegnaFrecciaOnda } from '../ui/FrecciaMatita.jsx'

const CuboChiaro = lazy(() => import('../ui/CuboChiaro'))
const InterruttoreChiaro = lazy(() => import('../ui/InterruttoreChiaro'))

/* ============================================================================
   LATO CHIARO — la home (indirizzo: /#/chiaro)
   Una sola scena a schermo intero. Il tuo nome in titoli enormi, un cubo di
   vetro al centro con il tuo ritratto, e lo scroll che lo fa girare.
   Le altre sezioni arrivano dopo, una alla volta.
   ========================================================================== */

const EASE = [0.16, 1, 0.3, 1]
const CHIAVE_SALTA_INGRESSO = 'salta-ingresso'

/** Vero quando l'ingresso (interruttore e pannelli) si è aperto: solo allora i titoli della home entrano. */
const PortaAperta = createContext(true)

/** Titolo che sale da una maschera. L'osservatore sta sul contenitore fermo. */
function Riga({ children, delay = 0, className = '' }) {
  const ridotto = useReducedMotion()
  const ref = useRef(null)
  const inVista = useInView(ref, { once: true })
  const porta = useContext(PortaAperta)
  const visibile = inVista && porta
  return (
    <span ref={ref} className={`h-riga ${className}`}>
      <motion.span
        className="h-riga-dentro"
        initial={ridotto ? false : { y: '110%' }}
        animate={{ y: visibile || ridotto ? 0 : '110%' }}
        transition={{ duration: 1.1, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  )
}

/** Un cerchio che segue il mouse e si allarga sopra link e bottoni (solo con il mouse). */
function Cursore() {
  const ref = useRef(null)
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    const el = ref.current
    let x = -100
    let y = -100
    let px = x
    let py = y
    let frame = 0
    const muovi = (e) => {
      x = e.clientX
      y = e.clientY
      el.classList.add('h-cursore-visibile')
      el.classList.toggle('h-cursore-su', !!e.target.closest?.('a, button, [data-cursore]'))
      el.classList.toggle('h-cursore-chiaro', !!e.target.closest?.('.h-ct'))
    }
    const giro = () => {
      px += (x - px) * 0.18
      py += (y - py) * 0.18
      el.style.transform = `translate(${px}px, ${py}px)`
      frame = requestAnimationFrame(giro)
    }
    window.addEventListener('pointermove', muovi)
    giro()
    return () => {
      window.removeEventListener('pointermove', muovi)
      cancelAnimationFrame(frame)
    }
  }, [])
  return (
    <div ref={ref} className="h-cursore" aria-hidden="true">
      <svg viewBox="0 0 100 100">
        <path d="M50 4C76 3 97 24 96 51C95 77 75 97 49 96C23 95 3 76 4 49C5 25 24 5 52 5" />
      </svg>
    </div>
  )
}

/** Interruttore del suono. Il browser non fa partire l'audio da solo: serve un clic, poi sfuma dentro. La musica sta in `lib/musica.js`. */
function Suono({ analisi, comando }) {
  const { t } = useLingua()
  const [acceso, setAcceso] = useState(false)
  // Il bottone compare solo se il brano esiste davvero
  const [disponibile, setDisponibile] = useState(false)
  useEffect(() => {
    let attivo = true
    fetch('/audio/atmosfera.mp3', { method: 'HEAD' })
      .then((r) => attivo && setDisponibile(r.ok && (r.headers.get('content-type') || '').includes('audio')))
      .catch(() => attivo && setDisponibile(false))
    return () => {
      attivo = false
    }
  }, [])

  // Lasciando la pagina la musica si spegne
  useEffect(
    () => () => {
      spegniMusica()
      analisi.current = null
    },
    [analisi],
  )

  // Ingresso: al clic sull'interruttore la musica parte già dal gestore del clic; qui si aggiorna solo il bottone.
  // Tornando da un'altra pagina parte al primo clic, tocco o tasto.
  useEffect(() => {
    if (comando === 'attesa' || comando === 'muto') return
    if (comando === 'suono') {
      setAcceso(true)
      return
    }
    const scelta = { fatta: false } // se l'utente usa il bottone, non lo scavalchiamo
    const accendi = () => {
      if (scelta.fatta) return
      accendiMusica()
      setAcceso(true)
    }
    if (navigator.userActivation?.hasBeenActive) accendi()
    const suInterazione = (e) => {
      if (e.target.closest?.('.h-suono')) {
        scelta.fatta = true
        return
      }
      accendi()
      togli()
    }
    const eventi = ['pointerdown', 'keydown', 'touchend']
    const togli = () => eventi.forEach((nome) => window.removeEventListener(nome, suInterazione, true))
    eventi.forEach((nome) => window.addEventListener(nome, suInterazione, true))
    return togli
  }, [comando])

  // Le onde seguono il suono vero: servono l'analizzatore della musica
  useEffect(() => {
    analisi.current = acceso ? analizzatoreMusica() : analisi.current
  }, [acceso, analisi])

  // Scheda in secondo piano: il suono si ferma
  useEffect(() => {
    const suVisibilita = () => (document.hidden ? sospendiMusica() : riprendiMusica())
    document.addEventListener('visibilitychange', suVisibilita)
    return () => document.removeEventListener('visibilitychange', suVisibilita)
  }, [])

  const alternaSuono = () => {
    if (acceso) {
      spegniMusica()
      setAcceso(false)
    } else {
      accendiMusica() // dentro il clic, così il telefono lo permette
      setAcceso(true)
    }
  }

  if (!disponibile) return null
  return (
    <button
      type="button"
      className={`h-suono ${acceso ? 'h-suono-on' : ''}`}
      aria-pressed={acceso}
      onClick={alternaSuono}
    >
      <span className="h-onde" aria-hidden="true">
        <i /><i /><i /><i />
      </span>
      <span className="h-suono-testo">{acceso ? t.suono.acceso : t.suono.spento}</span>
    </button>
  )
}

/** Onde a tutta larghezza dietro al cubo: seguono il suono vero del brano. Ferme e invisibili se il suono è spento. */
function OndeMusica({ analisi }) {
  const ref = useRef(null)
  useEffect(() => {
    const canvas = ref.current
    const c = canvas.getContext('2d')
    let frame = 0
    let livello = 0
    let picco = 0.05 // guadagno automatico: le onde si vedono bene anche con musica piano
    const dati = new Uint8Array(1024)
    const adatta = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = canvas.clientWidth * dpr
      canvas.height = canvas.clientHeight * dpr
      c.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    adatta()
    window.addEventListener('resize', adatta)

    const disegna = () => {
      frame = requestAnimationFrame(disegna)
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      c.clearRect(0, 0, w, h)
      const an = analisi.current
      if (!an) return
      an.getByteTimeDomainData(dati)
      let somma = 0
      let massimo = 0
      for (let i = 0; i < dati.length; i++) {
        const v = (dati[i] - 128) / 128
        somma += v * v
        massimo = Math.max(massimo, Math.abs(v))
      }
      const rms = Math.sqrt(somma / dati.length)
      picco = Math.max(picco * 0.996, massimo, 0.04)
      const acceso = rms > 0.0015 ? 1 : 0 // silenzio vero: la linea sparisce
      livello += (acceso - livello) * 0.06 // morbido: sale e scende piano
      if (livello < 0.01) return

      const y0 = h / 2
      const ampiezza = h * 0.16 * livello
      const passo = Math.max(2, Math.floor(dati.length / (w / 3)))
      for (const [scala, fase, spessore, alfa] of [
        [1, 0, 1.4, 0.55],
        [0.55, 90, 1, 0.3],
      ]) {
        c.beginPath()
        c.lineWidth = spessore
        c.strokeStyle = `rgba(11, 12, 14, ${alfa * livello})`
        for (let x = 0; x <= w; x += 3) {
          const i = Math.floor((x / w) * (dati.length - 1) / passo) * passo
          const v = (dati[(i + fase) % dati.length] - 128) / 128 / picco
          // le onde si spengono verso i bordi: restano nel cuore della pagina
          const bordo = Math.sin((x / w) * Math.PI)
          const y = y0 + v * ampiezza * scala * bordo
          if (x === 0) c.moveTo(x, y)
          else c.lineTo(x, y)
        }
        c.stroke()
      }
    }
    disegna()
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', adatta)
    }
  }, [analisi])
  return <canvas ref={ref} className="h-onde-musica" aria-hidden="true" />
}

/** Titolo che sale dalla maschera quando `mostra` diventa vero e ci ridiscende quando torna falso. */
function RigaSe({ mostra, delay = 0, children }) {
  const ridotto = useReducedMotion()
  return (
    // Quando il titolo è nascosto sparisce del tutto (dopo che è sceso): altrimenti accenti e punti delle lettere sporgono dal bordo della maschera
    <span
      className="h-riga"
      style={{ visibility: mostra ? 'visible' : 'hidden', transition: mostra ? 'visibility 0s' : `visibility 0s linear ${ridotto ? 0 : 1.1}s` }}
    >
      <motion.span
        className="h-riga-dentro"
        initial={false}
        animate={{ y: mostra ? 0 : '110%' }}
        transition={{ duration: ridotto ? 0 : 1, delay: mostra && !ridotto ? delay : 0, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  )
}


/** Interruttore a linee sottili: la leva scatta in basso quando è acceso. */
function Interruttore({ acceso }) {
  return (
    <svg className={`h-interruttore ${acceso ? 'h-interruttore-giu' : ''}`} viewBox="0 0 120 180" fill="none" aria-hidden="true">
      <rect x="18" y="8" width="84" height="164" rx="8" />
      <circle cx="60" cy="28" r="6" />
      <path d="M56 24l8 8" />
      <circle cx="60" cy="152" r="6" />
      <path d="M56 148l8 8" />
      <rect x="44" y="52" width="32" height="76" rx="16" />
      <g className="h-leva">
        <path d="M60 90V50" />
        <path d="M54 90h12" />
        <ellipse cx="60" cy="44" rx="11" ry="9" />
      </g>
    </svg>
  )
}


/** Gomitolo a matita: una dozzina di giri ovali sovrapposti, ognuno si muove e si deforma per conto suo. */
function CerchioMatita({ className }) {
  const ref = useRef(null)
  useEffect(() => {
    const canvas = ref.current
    const c = canvas.getContext('2d')
    const ridotto = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    // Numeri sempre uguali: il gomitolo è irregolare ma ogni volta ha la stessa forma di partenza
    let seme = 5
    const rnd = () => {
      seme = (seme * 16807) % 2147483647
      return (seme - 1) / 2147483646
    }
    const tra = (a, b) => a + rnd() * (b - a)
    const giri = Array.from({ length: 12 }, () => ({
      cx: tra(-0.18, 0.18), // centro
      cy: tra(-0.18, 0.18),
      rx: tra(0.42, 0.78), // raggi dell'ovale
      ry: tra(0.42, 0.78),
      rot: tra(0, Math.PI),
      inizio: tra(0, Math.PI * 2),
      giro: tra(1.02, 1.12) * Math.PI * 2, // quanto sborda oltre il punto di partenza
      // velocità e fasi di ogni movimento: tutte diverse, così non si ripete mai uguale
      v: Array.from({ length: 6 }, () => tra(-0.5, 0.5)),
      f: Array.from({ length: 6 }, () => tra(0, 6.28)),
      deform: [tra(0.02, 0.06), tra(0.01, 0.04)],
      fd: [tra(0, 6.28), tra(0, 6.28)],
      alpha: tra(0.55, 0.95),
    }))
    const disegna = (t) => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      if (canvas.width !== Math.round(w * dpr)) {
        canvas.width = Math.round(w * dpr)
        canvas.height = Math.round(h * dpr)
      }
      c.setTransform(dpr, 0, 0, dpr, 0, 0)
      c.clearRect(0, 0, w, h)
      c.strokeStyle = '#e6e4dd'
      c.lineWidth = 1.1
      c.lineCap = 'round'
      c.lineJoin = 'round'
      const R = Math.min(w, h) / 2 - 8
      giri.forEach((g) => {
        c.globalAlpha = g.alpha
        c.beginPath()
        const cx = w / 2 + (g.cx + Math.sin(t * g.v[0] + g.f[0]) * 0.1) * R
        const cy = h / 2 + (g.cy + Math.sin(t * g.v[1] + g.f[1]) * 0.1) * R
        const rx = R * g.rx * (1 + Math.sin(t * g.v[2] + g.f[2]) * 0.1)
        const ry = R * g.ry * (1 + Math.sin(t * g.v[3] + g.f[3]) * 0.1)
        const rot = g.rot + Math.sin(t * g.v[4] + g.f[4]) * 0.6 + t * g.v[5] * 0.15
        const inizio = g.inizio + t * g.v[5] * 0.3
        const cr = Math.cos(rot)
        const sr = Math.sin(rot)
        const n = 80
        for (let k = 0; k <= n; k++) {
          const a = inizio + (k / n) * g.giro
          const d = 1 + g.deform[0] * Math.sin(3 * a + g.fd[0] + t * g.v[2]) + g.deform[1] * Math.sin(5 * a + g.fd[1] - t * g.v[3])
          const x0 = Math.cos(a) * rx * d
          const y0 = Math.sin(a) * ry * d
          const x = cx + x0 * cr - y0 * sr
          const y = cy + x0 * sr + y0 * cr
          if (k === 0) c.moveTo(x, y)
          else c.lineTo(x, y)
        }
        c.stroke()
      })
      c.globalAlpha = 1
    }
    if (ridotto) {
      disegna(0)
      return
    }
    let frame = 0
    const t0 = performance.now()
    const giro = (ora) => {
      frame = requestAnimationFrame(giro)
      disegna((ora - t0) / 1000)
    }
    frame = requestAnimationFrame(giro)
    return () => cancelAnimationFrame(frame)
  }, [])
  return <canvas ref={ref} className={className} aria-hidden="true" />
}

/** Filo a matita dell'ingresso: a sinistra la linea che porta alla freccia; a destra un filo che arriva dal bordo e finisce in un gomitolo (un solo filo con tanti giri storti, il capo resta dentro). Il gomitolo non gira, ondeggia; da ogni bordo parte un'onda che corre lungo il filo e si spegne vicino al gomitolo e alla freccia. */
function FiloMatita({ acceso }) {
  const ref = useRef(null)
  const accesoRef = useRef(acceso)
  accesoRef.current = acceso
  useEffect(() => {
    const canvas = ref.current
    const c = canvas.getContext('2d')
    const ridotto = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const clamp = (v, a, b) => Math.min(Math.max(v, a), b)
    const esce = (u) => 1 - Math.pow(1 - clamp(u, 0, 1), 3)
    // Fasi fisse: il disegno è irregolare ma parte sempre uguale
    let seme = 21
    const rnd = () => {
      seme = (seme * 16807) % 2147483647
      return (seme - 1) / 2147483646
    }
    const f = Array.from({ length: 12 }, () => rnd() * 6.28)
    const GIRI = 7
    const TOT = Math.PI * 2 * GIRI

    /** Il gomitolo: un solo filo, giri ovali di misure diverse che vagano; parte dal centro e si allarga fino all'ultimo giro in alto. */
    const groviglio = (cx, cy, R) => {
      const pts = []
      const n = GIRI * 64
      for (let k = 0; k <= n; k++) {
        const u = k / n
        const th = -Math.PI / 2 + u * TOT
        const cresce = 0.3 + 0.7 * Math.pow(u, 0.75)
        const rr = cresce * (0.78 + 0.22 * Math.sin(u * 17 + f[0]) + 0.1 * Math.sin(u * 41 + f[1]))
        const ex = 1.25 + 0.3 * Math.sin(u * 11 + f[2])
        const ey = 0.82 + 0.2 * Math.sin(u * 9 + f[3])
        const rot = 0.65 * Math.sin(u * 8 + f[4])
        const dx = (0.26 * Math.sin(u * 13 + f[5]) + 0.14 * Math.sin(u * 31 + f[6])) * cresce
        const dy = (0.24 * Math.sin(u * 10 + f[7]) + 0.1 * Math.sin(u * 27 + f[8])) * cresce
        const x0 = Math.cos(th) * rr * ex
        const y0 = Math.sin(th) * rr * ey
        const cr = Math.cos(rot)
        const sr = Math.sin(rot)
        pts.push([cx + R * (dx + x0 * cr - y0 * sr), cy + R * (dy + x0 * sr + y0 * cr)])
      }
      return pts
    }

    const traccia = (pts, quota, alpha) => {
      const fino = Math.floor(clamp(quota, 0, 1) * (pts.length - 1))
      if (fino < 1) return
      c.globalAlpha = alpha
      c.beginPath()
      c.moveTo(pts[0][0], pts[0][1])
      for (let i = 1; i <= fino; i++) c.lineTo(pts[i][0], pts[i][1])
      c.stroke()
    }

    const aSx = 1 // freccia e linea di sinistra restano visibili anche dopo il clic
    const t0 = performance.now()
    const disegna = (t, finito) => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
        canvas.width = Math.round(w * dpr)
        canvas.height = Math.round(h * dpr)
      }
      c.setTransform(dpr, 0, 0, dpr, 0, 0)
      c.clearRect(0, 0, w, h)
      c.strokeStyle = '#e6e4dd'
      c.lineWidth = 1.15
      c.lineCap = 'round'
      c.lineJoin = 'round'
      const Y = h / 2
      const bottone = canvas.parentElement?.querySelector('.h-ing-bottone')
      const bw = bottone ? bottone.getBoundingClientRect().width : 200
      const vw = window.innerWidth
      const gap = clamp(vw * 0.01, 4, 16)
      const K = (Math.PI * 2) / 240 // lunghezza d'onda ~240px
      const OM = 2.3 // velocità dell'onda

      // ---- sinistra: linea quasi dritta con la freccia; l'onda parte dal bordo e si spegne vicino alla punta
      if (aSx > 0.01) {
        disegnaFrecciaOnda(c, { xe: w / 2 - bw / 2 - gap - 2, Y, t, ridotto, alpha: aSx * 0.95, vw, fasi: f })
      }

      // ---- destra: gomitolo che ondeggia + filo che arriva dal bordo
      const g = vw < 761 ? Math.max(vw * 0.145, 50) : clamp(vw * 0.14, 120, 200)
      const d = vw < 761 ? 4 : clamp(vw * 0.03, 14, 48)
      const R = g * 0.62
      const cx = w / 2 + bw / 2 + d + g * 0.62
      const cy = Y + R * 0.4
      const sc = R / 84
      const vista = 1
      // ondeggiamento: ogni punto si sposta in base a dove si trova, così il gomitolo si piega senza girare
      const sposta = (p) => {
        if (ridotto) return p
        const x = p[0]
        const y = p[1]
        return [
          x + sc * (4.5 * Math.sin(t * 1.2 + y * 0.045 + f[0]) + 2.5 * Math.sin(t * 0.7 + x * 0.03 + f[1])),
          y + sc * (4.5 * Math.sin(t * 1.0 + x * 0.045 + f[2]) + 2.5 * Math.sin(t * 0.8 + y * 0.035 + f[3])),
        ]
      }
      const gomitolo = groviglio(cx, cy, R).map(sposta)
      // il capo del filo (bordo destro) è fermo; arriva all'ultimo giro e ne segue il movimento
      const fine = gomitolo[gomitolo.length - 1]
      const prima = gomitolo[gomitolo.length - 8]
      let tx = fine[0] - prima[0]
      let ty = fine[1] - prima[1]
      const lt = Math.hypot(tx, ty) || 1
      tx /= lt
      ty /= lt
      const D = w - fine[0]
      const p1 = [fine[0] + tx * D * 0.45, fine[1] + ty * D * 0.45]
      const p2 = [w - D * 0.35, Y]
      const filo = []
      const m = 130
      for (let k = 0; k <= m; k++) {
        const u = k / m // 0 = gomitolo, 1 = bordo
        const v = 1 - u
        const x = v * v * v * fine[0] + 3 * v * v * u * p1[0] + 3 * v * u * u * p2[0] + u * u * u * w
        const yBase = v * v * v * fine[1] + 3 * v * v * u * p1[1] + 3 * v * u * u * p2[1] + u * u * u * Y
        // onda dal bordo verso il gomitolo: piena al bordo, nulla attaccata al gomitolo
        const onda = ridotto ? 0 : 5 * Math.pow(u, 0.6) * Math.sin(OM * t - K * (u * D))
        filo.push([x, yBase + (2 * Math.sin(u * 6 + f[10]) + 1.5 * Math.sin(u * 13 + f[11])) * u + onda])
      }
      // un solo filo: gomitolo + filo uniti, poi la zona di unione viene addolcita così non resta nessun angolo
      const J = gomitolo.length - 1
      let tutto = gomitolo.concat(filo.slice(1))
      for (let passo = 0; passo < 4; passo++) {
        const copia = tutto.map((q) => q.slice())
        const da = Math.max(J - 40, 3)
        const a = Math.min(J + 60, tutto.length - 4)
        for (let i = da; i <= a; i++) {
          let sx = 0
          let sy = 0
          for (let j = -3; j <= 3; j++) {
            sx += copia[i + j][0]
            sy += copia[i + j][1]
          }
          tutto[i] = [sx / 7, sy / 7]
        }
      }
      traccia(tutto.slice(0, J + 1), 1, 0.95 * vista)
      traccia(tutto.slice(J).reverse(), 1, 0.95)
      c.globalAlpha = 1
    }
    if (ridotto) {
      disegna(0, true)
      return
    }
    let frame = 0
    const giro = (ora) => {
      frame = requestAnimationFrame(giro)
      disegna((ora - t0) / 1000, false)
    }
    frame = requestAnimationFrame(giro)
    return () => cancelAnimationFrame(frame)
  }, [])
  return <canvas ref={ref} className="h-filo" aria-hidden="true" />
}

/** Schermata d'ingresso: sfondo scuro, "accendi il tuo progetto", interruttore. Al clic la leva scatta, parte la musica e i due pannelli si aprono. I testi si scambiano da soli, una volta. */
function Ingresso({ fase, suClic }) {
  const { t, lingua } = useLingua()
  const acceso = fase !== 'attesa'
  // Una volta sola, da soli: "Accendi" si svuota da sinistra a destra, "il tuo progetto" si riempie da destra a sinistra
  const [scambio, setScambio] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setScambio(true), 1400)
    return () => clearTimeout(t)
  }, [])
  return (
    <div className={`h-ingresso h-ingresso-${fase}`} data-lingua={lingua} role="dialog" aria-modal="true" aria-label={t.ingresso.etichetta}>
      <div className="h-pannello-v h-pannello-sx" />
      <div className="h-pannello-v h-pannello-dx" />
      <div className="h-ingresso-contenuto">
        <h2 className="h-sr">{t.ingresso.etichetta}</h2>
        <p className={`h-ing-riga h-ing-svuota ${scambio ? 'h-ing-scambiato' : ''}`} aria-hidden="true">
          <span className="h-ing-contorno">{t.ingresso.riga1}</span>
          <span className="h-ing-riempimento">{t.ingresso.riga1}</span>
        </p>
        <div className="h-ing-centro">
          <button type="button" className="h-ing-bottone" onClick={suClic} disabled={acceso} aria-label={t.ingresso.bottone} autoFocus>
            <Suspense fallback={null}>
              <InterruttoreChiaro giu={acceso} alternativa={<Interruttore acceso={acceso} />} />
            </Suspense>
          </button>
          <FiloMatita acceso={acceso} />
          <div className="h-clicca" aria-hidden="true">
            <span>{t.ingresso.cliccaQui}</span>
          </div>
        </div>
        <p className={`h-ing-riga h-ing-riempi ${scambio ? 'h-ing-scambiato' : ''}`} aria-hidden="true">
          <span className="h-ing-contorno">{t.ingresso.riga2}</span>
          <span className="h-ing-riempimento">{t.ingresso.riga2}</span>
        </p>
      </div>
    </div>
  )
}

function PaginaChiaro() {
  const { t, lingua } = useLingua()
  useEffect(() => {
    document.title = t.titoloPagina
    document.documentElement.lang = lingua
  }, [t, lingua])
  const ref = useRef(null)
  const analisi = useRef(null)
  const apertoRef = useRef(false)
  const facciaRef = useRef(0)

  // Ingresso: compare a ogni apertura della pagina (anche ricaricando). Chi riduce il movimento lo salta.
  const senzaMovimento = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  // Se si torna dalla Privacy (o da un'altra pagina del sito) l'ingresso non si ripete; a ogni caricamento nuovo sì
  const [tornaDaAltraPagina] = useState(() => {
    try {
      return sessionStorage.getItem(CHIAVE_SALTA_INGRESSO) === '1'
    } catch {
      return false
    }
  })
  const saltaIngresso = senzaMovimento || tornaDaAltraPagina
  useEffect(() => {
    try {
      sessionStorage.removeItem(CHIAVE_SALTA_INGRESSO)
    } catch {
      /* niente da fare */
    }
    // Quando si lascia la home per un'altra pagina (l'indirizzo è già cambiato) si ricorda di saltare l'ingresso al ritorno
    return () => {
      if (window.location.hash !== '#/' && window.location.hash !== '') {
        try {
          sessionStorage.setItem(CHIAVE_SALTA_INGRESSO, '1')
        } catch {
          /* niente da fare */
        }
      }
    }
  }, [])
  const [fase, setFase] = useState(saltaIngresso ? 'fatto' : 'attesa')
  const [comando, setComando] = useState(saltaIngresso ? 'auto' : 'attesa')
  const [portaAperta, setPortaAperta] = useState(fase === 'fatto')
  // Si entra solo cliccando l'interruttore: quel clic fa partire la musica (il browser lo permette)
  const entra = (modo) => {
    if (fase !== 'attesa') return
    setFase('acceso') // la leva scatta e i testi si scambiano
    setTimeout(() => {
      setFase('apre') // i pannelli si aprono
      suonoPannelli() // e parte il loro suono
    }, 1300)
    setTimeout(() => setPortaAperta(true), 1900) // la home inizia a entrare mentre si scopre
    setTimeout(() => {
      setFase('fatto') // home tutta visibile
      setComando(modo)
    }, 3600)
  }
  const [aperto, setAperto] = useState(false)
  const [faccia, setFaccia] = useState(0)
  const vai = (d) => {
    const n = (facciaRef.current + d + t.chiSono.length) % t.chiSono.length
    facciaRef.current = n
    setFaccia(n)
  }
  const ridotto = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const fermo = useMotionValue(0)
  const p = ridotto ? fermo : scrollYProgress // con "riduci movimento" lo scroll non muove niente

  // 0 = home, 1 = "Chi sono" aperto: tutto scivola a sinistra
  const chiusura = useMotionValue(0)
  useEffect(() => {
    apertoRef.current = aperto
    const anim = animate(chiusura, aperto ? 1 : 0, { duration: ridotto ? 0 : 0.9, ease: EASE })
    return () => anim.stop()
  }, [aperto, chiusura, ridotto])

  const xSalvatore = useTransform(p, [0, 1], [0, -14])
  const xLombardi = useTransform(p, [0, 1], [0, 14])
  const opacitaRighe = useTransform(p, [0, 0.25], [1, 0])
  const xNome1 = useTransform([xSalvatore, chiusura], ([a, b]) => `${a - b * 130}vw`)
  const xNome2 = useTransform([xLombardi, chiusura], ([a, b]) => `${a - b * 130}vw`)
  const opRighe = useTransform([opacitaRighe, chiusura], ([o, b]) => o * (1 - b))
  const xRighe = useTransform(chiusura, (b) => `${-b * 130}vw`)
  const opFreccia = useTransform(p, [0.2, 0.28, 0.7, 0.78], [0, 1, 1, 0])

  useEffect(() => {
    const prima = document.body.style.backgroundColor
    document.body.style.backgroundColor = '#E6E4DD'
    window.scrollTo(0, 0)
    return () => {
      document.body.style.backgroundColor = prima
    }
  }, [])

  // Con "Chi sono" aperto la pagina non scorre; Esc lo chiude
  useEffect(() => {
    if (!aperto) return
    // Si blocca il body (non l'html): l'overflow del body passa alla finestra e la scena resta agganciata
    const prima = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const suTasto = (e) => {
      if (e.key === 'Escape') setAperto(false)
      if (e.key === 'ArrowRight') vai(1)
      if (e.key === 'ArrowLeft') vai(-1)
    }
    window.addEventListener('keydown', suTasto)
    return () => {
      document.body.style.overflow = prima
      window.removeEventListener('keydown', suTasto)
    }
  }, [aperto])

  // Finché l'ingresso è chiuso la pagina non scorre
  useEffect(() => {
    if (fase === 'fatto') return
    const prima = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prima
    }
  }, [fase])

  const [menuAperto, setMenuAperto] = useState(false)
  const chiudiMenu = () => setMenuAperto(false)
  /** Dal menu: si chiude e si scorre alla sezione. "Chi sono" riporta in cima e apre il cubo. */
  const vaiAllaVoce = (id) => {
    setMenuAperto(false)
    const liscio = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setTimeout(() => {
      if (id === 'chi-sono') {
        window.scrollTo({ top: 0, behavior: 'auto' })
        setTimeout(() => apri(), 250)
        return
      }
      document.getElementById(id)?.scrollIntoView({ behavior: liscio ? 'smooth' : 'auto', block: 'start' })
    }, 350)
  }

  const apri = () => {
    facciaRef.current = 0
    setFaccia(0)
    setAperto(true)
  }

  return (
    <div className="chiaro">
      <Cursore />
      <MenuChiaro aperto={menuAperto} chiudi={chiudiMenu} vai={vaiAllaVoce} />
      {fase !== 'fatto' && <Ingresso
          fase={fase}
          suClic={() => {
            if (fase === 'attesa') {
              suonoScatto() // il rumore dell'interruttore, subito al clic
              sbloccaMusica() // prepara l'audio dentro il clic, come vuole il telefono
              accendiMusica() // il brano parte subito al clic: così ha il tempo di caricarsi mentre si aprono i pannelli
            }
            entra('suono')
          }}
        />}

      <PortaAperta.Provider value={portaAperta}>
      <div ref={ref} className={`h-corsa ${fase === 'attesa' || fase === 'acceso' ? 'h-corsa-chiusa' : ''}`} inert={fase !== 'fatto' && fase !== 'apre' ? true : undefined}>
        <div className="h-scena">
          <header className="h-testata">
            <span className="h-marchio">
              <LogoInterruttore className="h-logo-int" />
              <span>
                Salvatore
                <br />
                Lombardi
              </span>
            </span>
            <Suono analisi={analisi} comando={comando} />
            <button type="button" className="h-cerchio" aria-label={t.menu.apri} aria-expanded={menuAperto} onClick={() => setMenuAperto(true)}>
              <svg viewBox="0 0 100 100" aria-hidden="true">
                <path d="M50 4C76 3 97 24 96 51C95 77 75 97 49 96C23 95 3 76 4 49C5 25 24 5 52 5" />
              </svg>
              <svg className="h-cerchio-linee" viewBox="0 0 100 100" aria-hidden="true">
                <path d="M35 46C41 44 46 47 51 46C56 45 60 46 65 45" />
                <path d="M47 56C52 55 58 56 65 55" />
              </svg>
            </button>
          </header>

          <OndeMusica analisi={analisi} />

          <motion.p className="h-nome h-nome-1" style={{ x: xNome1 }} aria-hidden="true">
            <Riga delay={0.3}>Salvatore</Riga>
          </motion.p>

          {/* Il nuovo titolo grande: prende il posto dei nomi quando si apre "Chi sono" */}
          <p className="h-titolo h-titolo-1" aria-hidden="true">
            <RigaSe mostra={aperto} delay={0.55}>{t.home.titolo1}</RigaSe>
          </p>
          <p className="h-titolo h-titolo-2" aria-hidden="true">
            <RigaSe mostra={aperto} delay={0.7}>{t.home.titolo2}</RigaSe>
          </p>

          <div
            className={`h-cubo ${aperto ? 'h-cubo-aperto' : ''}`}
            data-cursore=""
            role={aperto ? undefined : 'button'}
            tabIndex={aperto ? undefined : 0}
            aria-label={aperto ? undefined : t.home.apriChiSono}
            onClick={aperto ? () => vai(1) : apri}
            onKeyDown={aperto ? undefined : (e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), apri())}
          >
            <div className="h-ombra" aria-hidden="true" />
            <Suspense fallback={null}>
              <CuboChiaro progresso={ridotto ? undefined : scrollYProgress} apertoRef={apertoRef} facciaRef={facciaRef} testi={t.chiSono} facce={t.home.facce} descrizioneCubo={t.home.cubo} />
            </Suspense>

            {/* Freccia "Chi sono": compare quando arriva il volto */}
            {!aperto && (
              <motion.div className="h-freccia" style={{ opacity: ridotto ? 1 : opFreccia }} aria-hidden="true">
                <FrecciaMatita />
                <span>{t.home.frecciaChiSono}</span>
              </motion.div>
            )}

            {/* Comandi del "Chi sono": il testo sta sulle facce del cubo */}
            <motion.div
              className="h-comandi"
              role="dialog"
              aria-label={t.home.chiSono}
              aria-hidden={!aperto}
              initial={false}
              animate={{ opacity: aperto ? 1 : 0 }}
              transition={{ duration: ridotto ? 0 : 0.5, delay: aperto && !ridotto ? 1.4 : 0 }}
              style={{ pointerEvents: aperto ? 'auto' : 'none' }}
              onClick={(e) => e.stopPropagation()}
            >
              <button type="button" tabIndex={aperto ? 0 : -1} onClick={() => vai(-1)} aria-label={t.home.facciaPrecedente}>←</button>
              <span aria-live="polite">{faccia + 1} / {t.chiSono.length}</span>
              <button type="button" tabIndex={aperto ? 0 : -1} onClick={() => vai(1)} aria-label={t.home.facciaSuccessiva}>→</button>
              <button type="button" className="h-chiudi" tabIndex={aperto ? 0 : -1} onClick={() => setAperto(false)}>
                {t.home.chiudi}
              </button>
              <p className="h-sr">{t.chiSono.map((c) => c.corpo).join(' ')}</p>
            </motion.div>
          </div>

          <h1 className="h-nome-testo">
            <span className="h-sr">{t.home.fraseSr}</span>
          </h1>
          <motion.p className="h-nome h-nome-2" style={{ x: xNome2 }} aria-hidden="true">
            <Riga delay={0.45}>Lombardi</Riga>
          </motion.p>

          <motion.p className="h-frase" style={{ opacity: opRighe, x: xRighe }}>
            <Riga key={lingua} delay={0.9}>{t.home.frase[0]}</Riga>
            <Riga key={lingua + '2'} delay={1}>{t.home.frase[1]}</Riga>
            <span className="h-frase-autore">{t.home.autore}</span>
          </motion.p>

          <motion.p className="h-servizi" style={{ opacity: opRighe, x: xRighe }}>
            <Riga key={lingua} delay={1}>{t.home.servizi}</Riga>
          </motion.p>
        </div>
      </div>
      </PortaAperta.Provider>

      <ServiziChiaro />
      <LavoriChiaro />
      <VideoChiaro />
      <PreventivoChiaro />

      <ContattiChiaro />
      <AvvisoRichieste />
      <TornaSuChiaro />
    </div>
  )
}

export default function Chiaro() {
  return <PaginaChiaro />
}
