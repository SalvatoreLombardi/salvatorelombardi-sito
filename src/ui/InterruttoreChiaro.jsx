import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

/* ============================================================================
   INTERRUTTORE — interruttore a bilanciere, in 3D ma disegnato a matita:
   solo linee sottili beige, irregolari e a tratto singolo, come il gomitolo. Dietro le linee ci sono volumi dello stesso colore dello
   sfondo: servono solo a nascondere le linee che nella realtà sarebbero dietro.
   Il tasto è un rettangolo che si inclina: parte abbassato e al click
   scatta in alto con un piccolo rimbalzo.
   ========================================================================== */

const GIU = -0.4 // tasto abbassato: la parte bassa è in avanti (posizione di partenza)
const SU = 0.4 // tasto alzato: la parte alta è in avanti (dopo il click)
const SFONDO = 0x0b0c0e
const BEIGE = 0xe6e4dd

const rimbalzo = (t) => {
  const c1 = 2.2
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
}

/** Numeri casuali sempre uguali: il disegno è irregolare ma identico a ogni apertura. */
function casuale(seme) {
  let a = seme
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export default function InterruttoreChiaro({ giu, alternativa, colore = BEIGE, trasparente = false }) {
  const contenitoreRef = useRef(null)
  const giuRef = useRef(giu)
  const [senzaWebGL, setSenzaWebGL] = useState(false)
  giuRef.current = giu

  useEffect(() => {
    const contenitore = contenitoreRef.current
    if (!contenitore) return

    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    } catch {
      setSenzaWebGL(true)
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setClearColor(0x000000, 0)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.domElement.style.cssText = 'display:block;width:100%;height:100%'
    contenitore.appendChild(renderer.domElement)

    const scena = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 50)
    camera.position.set(0, 0, 9)

    const inclina = new THREE.Group()
    inclina.rotation.set(0.08, 0.3, 0) // posa fissa
    scena.add(inclina)
    const gruppo = new THREE.Group()
    inclina.add(gruppo)

    const rnd = casuale(11)
    // `trasparente`: i volumi servono solo a nascondere le linee dietro, senza colorare lo sfondo (logo su qualsiasi colore)
    const matCoprente = new THREE.MeshBasicMaterial({
      color: SFONDO,
      colorWrite: !trasparente,
      toneMapped: false,
      polygonOffset: true,
      polygonOffsetFactor: 1.5,
      polygonOffsetUnits: 1.5,
    })
    // Una sola linea (non ripassata), sottile come quella del gomitolo
    const matLinee = [new THREE.LineBasicMaterial({ color: colore, transparent: true, opacity: 0.9, toneMapped: false })]
    const geometrie = []

    /** Un volume che copre le linee dietro di sé. */
    const coprente = (geo, madre, pos = [0, 0, 0]) => {
      geometrie.push(geo)
      const m = new THREE.Mesh(geo, matCoprente)
      m.position.set(...pos)
      madre.add(m)
    }

    /** Disegna una linea a mano: una sola passata, punti con un po' di tremore, tratto che sborda alle estremità. */
    const tratto = (punti, madre, { chiusa = false, tremore = 0.014, sbordo = 0.05 } = {}) => {
      matLinee.forEach((mat) => {
        const v = punti.map((p) => new THREE.Vector3(...p))
        if (chiusa) v.push(v[0].clone().add(new THREE.Vector3((rnd() - 0.5) * 0.04, (rnd() - 0.5) * 0.04, 0)))
        const pts = []
        const deriva = new THREE.Vector3((rnd() - 0.5) * 0.02, (rnd() - 0.5) * 0.02, (rnd() - 0.5) * 0.01)
        for (let i = 0; i < v.length - 1; i++) {
          const a = v[i]
          const b = v[i + 1]
          const n = Math.max(1, Math.ceil(a.distanceTo(b) / 0.2))
          for (let k = 0; k < n; k++) {
            const p = a.clone().lerp(b, k / n)
            p.add(deriva).add(new THREE.Vector3((rnd() - 0.5) * tremore, (rnd() - 0.5) * tremore, (rnd() - 0.5) * tremore * 0.5))
            pts.push(p)
          }
        }
        pts.push(v[v.length - 1].clone().add(deriva))
        if (!chiusa && sbordo) {
          // le linee aperte superano un poco i loro estremi, come con la matita
          pts[0].add(pts[0].clone().sub(pts[1]).normalize().multiplyScalar(rnd() * sbordo))
          const u = pts.length - 1
          pts[u].add(pts[u].clone().sub(pts[u - 1]).normalize().multiplyScalar(rnd() * sbordo))
        }
        const g = new THREE.BufferGeometry().setFromPoints(pts)
        geometrie.push(g)
        madre.add(new THREE.Line(g, mat))
      })
    }

    const rett = (w, h, z) => [
      [-w / 2, -h / 2, z],
      [w / 2, -h / 2, z],
      [w / 2, h / 2, z],
      [-w / 2, h / 2, z],
    ]
    /** Scatola disegnata: due rettangoli e i quattro spigoli che li uniscono. */
    const scatola = (w, h, z0, z1, madre, sbordo = 0.02) => {
      tratto(rett(w, h, z1), madre, { chiusa: true })
      tratto(rett(w, h, z0), madre, { chiusa: true })
      rett(w, h, 0).forEach(([x, y]) =>
        tratto(
          [
            [x, y, z1],
            [x, y, z0],
          ],
          madre,
          { sbordo },
        ),
      )
    }
    const cerchio = (r, centro) => {
      const n = 20
      const inizio = rnd() * Math.PI * 2
      const out = []
      for (let i = 0; i <= n * 1.07; i++) {
        const a = inizio + (i / n) * Math.PI * 2
        out.push([centro[0] + Math.cos(a) * r * (1 + (rnd() - 0.5) * 0.05), centro[1] + Math.sin(a) * r * (1 + (rnd() - 0.5) * 0.05), centro[2]])
      }
      return out
    }

    // Placca
    const L = 2.3
    const A = 3.5
    const P = 0.22
    const f = P / 2
    coprente(new THREE.BoxGeometry(L - 0.01, A - 0.01, P - 0.01), gruppo)
    scatola(L, A, -f, f, gruppo)

    // Cornice rialzata
    const lc = L - 0.5
    const ac = A - 0.5
    const hc = 0.07
    coprente(new THREE.BoxGeometry(lc - 0.01, ac - 0.01, hc - 0.005), gruppo, [0, 0, f + hc / 2])
    scatola(lc, ac, f, f + hc, gruppo)
    const zf = f + hc

    // Apertura rettangolare per il tasto, con un po' di tratteggio dentro come ombra a matita
    const aw = 0.78
    const ah = 1.9
    tratto(rett(aw, ah, zf), gruppo, { chiusa: true })
    for (let i = 0; i < 9; i++) {
      const y = -0.8 + i * 0.2
      tratto(
        [
          [-0.34, y, zf],
          [-0.2, y + 0.14, zf],
        ],
        gruppo,
        { sbordo: 0, tremore: 0.01 },
      )
    }

    // Viti
    for (const y of [A / 2 - 0.42, -A / 2 + 0.42]) {
      tratto(cerchio(0.1, [0, y, zf]), gruppo)
      tratto(
        [
          [-0.07, y - 0.05, zf],
          [0.07, y + 0.05, zf],
        ],
        gruppo,
        { sbordo: 0 },
      )
    }

    // Tasto rettangolare: gira attorno al suo centro
    const tasto = new THREE.Group()
    tasto.position.set(0, 0, zf + 0.08)
    gruppo.add(tasto)
    const tw = 0.6
    const th = 1.5
    const td = 0.2
    coprente(new THREE.BoxGeometry(tw - 0.01, th - 0.01, td - 0.01), tasto)
    scatola(tw, th, -td / 2, td / 2, tasto)
    // tre righe sul tasto, come l'impugnatura
    ;[-0.35, 0, 0.35].forEach((y) =>
      tratto(
        [
          [-0.2, y, td / 2],
          [0.2, y + 0.01, td / 2],
        ],
        tasto,
        { sbordo: 0.02 },
      ),
    )
    tasto.rotation.x = GIU

    const adatta = () => {
      const { clientWidth: w, clientHeight: h } = contenitore
      if (!w || !h) return
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    const osservatore = new ResizeObserver(adatta)
    osservatore.observe(contenitore)
    adatta()

    const orologio = new THREE.Clock()
    let tInizio = null
    let statoPrecedente = false
    let frame = 0
    const disegna = () => {
      frame = requestAnimationFrame(disegna)
      const t = orologio.getElapsedTime()
      const premuto = giuRef.current
      if (premuto && !statoPrecedente) tInizio = t
      statoPrecedente = premuto
      if (premuto) {
        const k = Math.min((t - (tInizio ?? t)) / 0.5, 1)
        tasto.rotation.x = GIU + (SU - GIU) * rimbalzo(k)
      } else {
        tasto.rotation.x = GIU // in attesa sta fermo, abbassato
      }
      renderer.render(scena, camera)
    }
    disegna()

    return () => {
      cancelAnimationFrame(frame)
      osservatore.disconnect()
      geometrie.forEach((g) => g.dispose())
      matCoprente.dispose()
      matLinee.forEach((m) => m.dispose())
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  if (senzaWebGL) return alternativa
  return <div ref={contenitoreRef} className="size-full" aria-hidden="true" />
}
