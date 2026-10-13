import { useEffect, useRef } from 'react'
import { useInView, useReducedMotion } from 'motion/react'

/* ============================================================================
   GOMITOLO DELL'ASSISTENTE — il filo a matita sopra la conversazione.
   Un solo filo: arriva dal bordo sinistro e finisce in un gomitolo a destra, come nell'ingresso
   (stesso disegno, stesso seme, stessa giunzione addolcita; qui il gomitolo è specchiato).
   - quiete:   il gomitolo ondeggia piano, il filo ondeggia dal bordo
   - pensa:    il gomitolo gira e si stringe, il filo freme
   - sbroglia: arriva la risposta, TUTTI i giri si sciolgono e il filo diventa una linea
               dritta dal bordo fino a una freccia a destra (la stessa di "Chi sono");
               sotto, la risposta si scrive (la fase la decide la sezione)
   Canvas 2D: leggero anche sul telefono, si ferma quando la sezione non si vede.
   ========================================================================== */
const GIRI = 7
const N = GIRI * 64
const TOT = Math.PI * 2 * GIRI
const clamp = (v, a, b) => Math.min(Math.max(v, a), b)
const lerp = (a, b, u) => a + (b - a) * u

// Fasi fisse: il disegno è irregolare ma parte sempre uguale
const fasi = (() => {
  let seme = 21
  const rnd = () => {
    seme = (seme * 16807) % 2147483647
    return (seme - 1) / 2147483646
  }
  return Array.from({ length: 12 }, () => rnd() * 6.28)
})()

/** Il gomitolo: giri ovali di misure diverse che vagano; parte dal centro e si allarga fino all'ultimo giro in alto. */
function groviglio(cx, cy, R) {
  const f = fasi
  const pts = []
  for (let k = 0; k <= N; k++) {
    const u = k / N
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

export function GomitoloAssistente({ fase }) {
  const ref = useRef(null)
  const faseRef = useRef(fase)
  faseRef.current = fase
  const visibile = useInView(ref, { margin: '120px' })
  const ridotto = useReducedMotion()
  // lo stato che si muove piano verso la fase: s = quanto è sbrogliato, p = quanto "pensa", ang = rotazione del gomitolo
  const stato = useRef({ s: 0, p: 0, ang: 0, t: 0 })

  useEffect(() => {
    const canvas = ref.current
    const c = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const K = (Math.PI * 2) / 240 // lunghezza d'onda ~240px, come nell'ingresso
    const OM = 2.3
    const dolce = (u) => u * u * (3 - 2 * u)

    const disegna = () => {
      const { s, p, ang, t } = stato.current
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      if (!w || !h) return
      if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
        canvas.width = Math.round(w * dpr)
        canvas.height = Math.round(h * dpr)
      }
      c.setTransform(dpr, 0, 0, dpr, 0, 0)
      c.clearRect(0, 0, w, h)
      c.strokeStyle = '#0b0c0e'
      c.lineWidth = 1.15
      c.lineCap = 'round'
      c.lineJoin = 'round'

      const Y = h / 2
      const R = Math.min(h * 0.24, 62) * (1 - 0.1 * p) // mentre gira il gomitolo si allarga fino a ~1,9 R: deve restare dentro il riquadro
      const cx = w - R * 2.1 - 4
      const cy = Y
      const sc = R / 84
      const amp = ridotto ? 0 : 1 - 0.4 * p
      // Il gomitolo, specchiato (il filo esce a sinistra), che gira e ondeggia
      const co = Math.cos(ang)
      const si = Math.sin(ang)
      const gomitolo = groviglio(cx, cy, R).map(([x0, y0]) => {
        const dx = 2 * cx - x0 - cx
        const dy = y0 - cy
        const x = cx + dx * co - dy * si
        const y = cy + dx * si + dy * co
        return [
          x + amp * sc * (4.5 * Math.sin(t * 1.2 + y * 0.045 + fasi[0]) + 2.5 * Math.sin(t * 0.7 + x * 0.03 + fasi[1])),
          y + amp * sc * (4.5 * Math.sin(t * 1.0 + x * 0.045 + fasi[2]) + 2.5 * Math.sin(t * 0.8 + y * 0.035 + fasi[3])),
        ]
      })
      // il capo del filo arriva dal bordo sinistro e raggiunge l'ultimo giro lungo la sua tangente
      const fine = gomitolo[gomitolo.length - 1]
      const prima = gomitolo[gomitolo.length - 8]
      let tx = fine[0] - prima[0]
      let ty = fine[1] - prima[1]
      const lt = Math.hypot(tx, ty) || 1
      tx /= lt
      ty /= lt
      const D = fine[0]
      const L = Math.min(D * 0.45, R * 2.2) // il filo lascia il gomitolo lungo la tangente, ma il riquadro è basso: poi si piega verso il bordo
      const p1 = [fine[0] + tx * L, fine[1] + ty * L]
      const p2 = [D * 0.35, Y]
      const filo = []
      const m = 130
      for (let k = 1; k <= m; k++) {
        const u = k / m // 0 = gomitolo, 1 = bordo sinistro
        const v = 1 - u
        const x = v * v * v * fine[0] + 3 * v * v * u * p1[0] + 3 * v * u * u * p2[0]
        const yBase = v * v * v * fine[1] + 3 * v * v * u * p1[1] + 3 * v * u * u * p2[1] + u * u * u * Y
        // onda dal bordo verso il gomitolo: piena al bordo, nulla attaccata al gomitolo
        const onda = ridotto ? 0 : (5 + 4 * p) * Math.pow(u, 0.6) * Math.sin(OM * t * (1 + 1.2 * p) - K * (u * D))
        filo.push([x, clamp(yBase + (2 * Math.sin(u * 6 + fasi[10]) + 1.5 * Math.sin(u * 13 + fasi[11])) * u + onda, 4, h - 4)])
      }
      // un solo filo: gomitolo + filo uniti, poi la zona di unione viene addolcita così non resta nessun angolo
      const J = gomitolo.length - 1
      const tutto = gomitolo.concat(filo)
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

      // Si sbroglia: ogni punto del filo scivola sulla linea dritta (partendo dal bordo, i giri vengono tirati fuori uno a uno)
      let punta = null
      if (s > 0.001) {
        const margine = 26 // spazio per la punta della freccia
        const xe = w - margine
        const lung = [0]
        for (let i = 1; i < tutto.length; i++) lung.push(lung[i - 1] + Math.hypot(tutto[i][0] - tutto[i - 1][0], tutto[i][1] - tutto[i - 1][1]))
        const totale = lung[lung.length - 1] || 1
        const ultimoIdx = tutto.length - 1
        for (let i = 0; i <= ultimoIdx; i++) {
          const xT = xe * (1 - lung[i] / totale) // il capo interno del gomitolo (indice 0) va a destra, il bordo a sinistra
          const uT = xT / xe
          const yT = Y + (ridotto ? 0 : 5 * Math.pow(1 - uT, 0.6) * Math.sin(OM * t - K * xT))
          const si_ = dolce(clamp(s * 1.7 - (1 - i / ultimoIdx) * 0.7, 0, 1))
          tutto[i] = [lerp(tutto[i][0], xT, si_), lerp(tutto[i][1], yT, si_)]
        }
        punta = { x: tutto[0][0], y: tutto[0][1], alfa: clamp((s - 0.78) / 0.22, 0, 1) }
      }

      c.globalAlpha = 0.95
      c.beginPath()
      c.moveTo(tutto[0][0], tutto[0][1])
      for (let i = 1; i < tutto.length; i++) c.lineTo(tutto[i][0], tutto[i][1])
      c.stroke()

      // la punta: la freccia di "Chi sono", sulla fine del filo teso
      if (punta && punta.alfa > 0) {
        const hs = Math.min(Math.max(window.innerWidth * 0.019, window.innerWidth < 761 ? 13 : 18), 28) / 24
        c.globalAlpha = 0.95 * punta.alfa
        c.beginPath()
        const bez = (p0, q1, q2, q3, n, primo) => {
          for (let k = 0; k <= n; k++) {
            const u = k / n
            const v = 1 - u
            const x = (v * v * v * p0[0] + 3 * v * v * u * q1[0] + 3 * v * u * u * q2[0] + u * u * u * q3[0]) * hs + punta.x
            const y = (v * v * v * p0[1] + 3 * v * v * u * q1[1] + 3 * v * u * u * q2[1] + u * u * u * q3[1]) * hs + punta.y
            if (primo && k === 0) c.moveTo(x, y)
            else c.lineTo(x, y)
          }
        }
        bez([-20, -19], [-12, -13], [-4, -7], [0, 0], 14, true)
        bez([0, 0], [-6, 8], [-12, 15], [-18, 25], 14, false)
        c.stroke()
      }
      c.globalAlpha = 1
    }

    if (ridotto) {
      stato.current.s = faseRef.current === 'sbroglia' ? 1 : 0
      stato.current.p = 0
      disegna()
      return
    }
    if (!visibile) return

    let frame = 0
    let ultimo = performance.now()
    const giro = (ora) => {
      frame = requestAnimationFrame(giro)
      const dt = Math.min((ora - ultimo) / 1000, 0.05)
      ultimo = ora
      const st = stato.current
      const f = faseRef.current
      // verso dove vanno: si sbroglia in ~1,4s, si riavvolge piano in ~2,4s
      const verso = (v, meta, su, giu) => v + clamp(meta - v, -dt / giu, dt / su)
      st.s = verso(st.s, f === 'sbroglia' ? 1 : 0, 1.4, 2.4)
      st.p = verso(st.p, f === 'pensa' ? 1 : 0, 0.5, 0.9)
      st.ang += dt * (0.18 + 4.2 * st.p)
      st.t += dt
      disegna()
    }
    frame = requestAnimationFrame(giro)
    return () => cancelAnimationFrame(frame)
  }, [visibile, ridotto, ridotto ? fase : null]) // con "riduci movimento" non c'è animazione: il disegno cambia di colpo con la fase

  return <canvas ref={ref} className="h-ai-gomitolo" aria-hidden="true" />
}
