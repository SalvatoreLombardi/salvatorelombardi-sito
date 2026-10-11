import { useEffect, useRef } from 'react'

/** Linea a matita con la punta di freccia: quasi dritta, parte dal bordo sinistro e finisce in `xe`. Un'onda piccola corre lungo la linea e si spegne vicino alla punta. La usano l'ingresso e la freccia "Chi sono". */
const LUNGHEZZA_ONDA = 240
const VELOCITA_ONDA = 2.3
function tracciaPolilinea(c, pts, alpha) {
  if (pts.length < 2) return
  c.globalAlpha = alpha
  c.beginPath()
  c.moveTo(pts[0][0], pts[0][1])
  for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1])
  c.stroke()
}
export function disegnaFrecciaOnda(c, { xe, Y, t, ridotto, alpha, vw, fasi }) {
  const K = (Math.PI * 2) / LUNGHEZZA_ONDA
  const linea = []
  const n = 110
  for (let k = 0; k <= n; k++) {
    const u = k / n
    const x = u * xe
    const onda = ridotto ? 0 : 5 * Math.pow(1 - u, 0.6) * Math.sin(VELOCITA_ONDA * t - K * x)
    const y = Y + (3 * Math.sin(u * 5 + fasi[9]) + 2 * Math.sin(u * 11 + fasi[10])) * (1 - u) + onda
    linea.push([x, y])
  }
  const yFine = linea[n][1]
  tracciaPolilinea(c, linea, alpha)
  // punta: stesso disegno di sempre
  const hs = Math.min(Math.max(vw * 0.019, vw < 761 ? 13 : 18), 28) / 24
  const punta = []
  const bez = (p0, p1, p2, p3, m) => {
    for (let k = 0; k <= m; k++) {
      const u = k / m
      const v = 1 - u
      punta.push([
        (v * v * v * p0[0] + 3 * v * v * u * p1[0] + 3 * v * u * u * p2[0] + u * u * u * p3[0]) * hs + xe,
        (v * v * v * p0[1] + 3 * v * v * u * p1[1] + 3 * v * u * u * p2[1] + u * u * u * p3[1]) * hs + yFine,
      ])
    }
  }
  bez([-20, -19], [-12, -13], [-4, -7], [0, 0], 14)
  bez([0, 0], [-6, 8], [-12, 15], [-18, 25], 14)
  tracciaPolilinea(c, punta, alpha)
}

/** Freccia "Chi sono": la stessa dell'ingresso, dal bordo sinistro della pagina fino al cubo. */
export function FrecciaMatita({ lunghezza, altezza = 80, className = 'h-freccia-linea' }) {
  const ref = useRef(null)
  useEffect(() => {
    const canvas = ref.current
    const c = canvas.getContext('2d')
    const ridotto = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let seme = 21
    const rnd = () => {
      seme = (seme * 16807) % 2147483647
      return (seme - 1) / 2147483646
    }
    const fasi = Array.from({ length: 12 }, () => rnd() * 6.28)
    const t0 = performance.now()
    const disegna = (t) => {
      // senza `lunghezza` il canvas parte dal bordo sinistro della pagina e arriva al punto d'ancoraggio
      const w = lunghezza ?? Math.max(Math.round(canvas.parentElement.getBoundingClientRect().right), 10)
      const h = altezza
      if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
        canvas.width = Math.round(w * dpr)
        canvas.height = Math.round(h * dpr)
        canvas.style.width = `${w}px`
        canvas.style.height = `${h}px`
      }
      c.setTransform(dpr, 0, 0, dpr, 0, 0)
      c.clearRect(0, 0, w, h)
      c.strokeStyle = '#0b0c0e'
      c.lineWidth = 1.15
      c.lineCap = 'round'
      c.lineJoin = 'round'
      disegnaFrecciaOnda(c, { xe: w - 2, Y: h / 2, t, ridotto, alpha: 0.95, vw: window.innerWidth, fasi })
      c.globalAlpha = 1
    }
    if (ridotto) {
      disegna(0)
      return
    }
    let frame = 0
    const giro = (ora) => {
      frame = requestAnimationFrame(giro)
      disegna((ora - t0) / 1000)
    }
    frame = requestAnimationFrame(giro)
    return () => cancelAnimationFrame(frame)
  }, [lunghezza, altezza])
  return <canvas ref={ref} className={className} aria-hidden="true" />
}
