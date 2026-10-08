import { useEffect, useRef } from 'react'

/* ============================================================================
   RETE DI NODI — sfondo cinematografico di tutto il sito
   Canvas 2D disegnato interamente a mano: nessun modello esterno, nessun
   motore 3D. Il canvas resta fisso dietro l'intera pagina (montato una sola
   volta in App.jsx); il resto del sito scorre sopra di lui.

   Il volo NON è un timer che gira da solo: la distanza percorsa dalla camera
   è calcolata direttamente dallo scroll della pagina. Fermo se non scrolli,
   avanza scrollando giù, torna indietro scrollando su.

   Ogni nodo ha una posizione fissa (x, y, z0); la sua distanza "effettiva"
   dalla camera si ottiene con un modulo su z0 - distanzaCamera, così i nodi
   si susseguono in loop senza mai dover essere ricreati: la stessa identica
   formula funziona avanti e indietro, reversibile in ogni momento.
   ========================================================================== */

const COLORE_SFONDO = '#08080a' // --color-ink-950
const ACCENTO = [20, 184, 166] // --color-accent-500, in RGB per poter variare l'alpha

const PROFONDITA = 26 // lunghezza del "tunnel": dopo tanta distanza i nodi si ripetono
const VICINO = 0.35 // distanza minima dalla camera (evita divisioni per ~0)
const PX_PER_UNITA = 85 // quanti pixel di scroll servono per 1 unità di profondità
const VELOCITA_RIDOTTA = 0.6 // deriva lenta e costante per chi ha "riduci movimento"

export function NetworkCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // Meno nodi su schermi piccoli: stessa resa visiva, molto più leggero
    const contaNodi = () => (window.innerWidth < 640 ? 30 : window.innerWidth < 1024 ? 50 : 75)

    let larghezza = 0
    let altezza = 0
    let dpr = 1

    let nodi = []
    let polvere = []
    let connessioni = []

    /** Un nodo con posizione fissa nello spazio: x,y casuali, z0 in [0, PROFONDITA) */
    function nuovoNodo() {
      return {
        x: (Math.random() * 2 - 1) * 7.5,
        y: (Math.random() * 2 - 1) * 4.4,
        z0: Math.random() * PROFONDITA,
      }
    }

    /** Ogni nodo si lega ai 2 più vicini nello spazio (calcolato una sola volta:
        z0 è fisso, la geometria della rete non cambia nel tempo). */
    function calcolaConnessioni() {
      connessioni = []
      for (let i = 0; i < nodi.length; i++) {
        const distanze = []
        for (let j = 0; j < nodi.length; j++) {
          if (i === j) continue
          const dx = nodi[i].x - nodi[j].x
          const dy = nodi[i].y - nodi[j].y
          const dz = nodi[i].z0 - nodi[j].z0
          distanze.push([j, dx * dx + dy * dy + dz * dz])
        }
        distanze.sort((a, b) => a[1] - b[1])
        for (let k = 0; k < 2; k++) {
          if (distanze[k] && distanze[k][1] < 10) connessioni.push([i, distanze[k][0]])
        }
      }
    }

    function inizializza() {
      const n = contaNodi()
      nodi = Array.from({ length: n }, nuovoNodo)
      polvere = Array.from({ length: Math.round(n * 1.8) }, nuovoNodo)
      calcolaConnessioni()
    }

    function ridimensiona() {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      larghezza = canvas.clientWidth
      altezza = canvas.clientHeight
      canvas.width = larghezza * dpr
      canvas.height = altezza * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    /** Distanza "vera" di un nodo dalla camera in questo istante: si ripete
        ogni PROFONDITA unità, sempre positiva e mai sotto VICINO. */
    function profonditaEffettiva(z0, distanzaCamera) {
      const resto = (((z0 - distanzaCamera) % PROFONDITA) + PROFONDITA) % PROFONDITA
      return resto + VICINO
    }

    /** Proietta un punto sullo schermo (prospettiva semplice) */
    function proietta(z, x, y, focale, cx, cy) {
      const scala = focale / z
      return {
        x: cx + x * scala,
        y: cy + y * scala,
        scala,
        opacita: Math.min(1, Math.max(0, 1 - z / PROFONDITA)),
      }
    }

    // Deriva lenta usata solo quando l'utente preferisce meno movimento:
    // non dipende dallo scroll, così la pagina non "vola" in modo brusco.
    let derivaRidotta = 0

    let raf = null
    let ultimoTempo = performance.now()

    function disegna(ora) {
      const dt = Math.min((ora - ultimoTempo) / 1000, 0.05)
      ultimoTempo = ora

      const distanzaCamera = prefersReduced
        ? (derivaRidotta += VELOCITA_RIDOTTA * dt)
        : window.scrollY / PX_PER_UNITA

      ctx.fillStyle = COLORE_SFONDO
      ctx.fillRect(0, 0, larghezza, altezza)

      const focale = altezza * 0.95
      const cx = larghezza / 2
      const cy = altezza / 2

      // --- Collegamenti ---
      ctx.lineWidth = 1
      for (const [i, j] of connessioni) {
        const a = nodi[i]
        const b = nodi[j]
        const za = profonditaEffettiva(a.z0, distanzaCamera)
        const zb = profonditaEffettiva(b.z0, distanzaCamera)
        // Due nodi vicini in z0 possono aver "girato" il loop in momenti
        // diversi: se la loro distanza salta troppo, la linea si spezzerebbe
        // in modo innaturale, meglio saltarla per quel frame.
        if (Math.abs(za - zb) > PROFONDITA / 2) continue

        const pa = proietta(za, a.x, a.y, focale, cx, cy)
        const pb = proietta(zb, b.x, b.y, focale, cx, cy)
        const op = Math.min(pa.opacita, pb.opacita) * 0.32
        if (op <= 0.01) continue
        ctx.strokeStyle = `rgba(${ACCENTO[0]},${ACCENTO[1]},${ACCENTO[2]},${op})`
        ctx.beginPath()
        ctx.moveTo(pa.x, pa.y)
        ctx.lineTo(pb.x, pb.y)
        ctx.stroke()
      }

      // --- Nodi, con un alone morbido (glow) ---
      for (const nodo of nodi) {
        const z = profonditaEffettiva(nodo.z0, distanzaCamera)
        const p = proietta(z, nodo.x, nodo.y, focale, cx, cy)
        if (p.opacita <= 0.02) continue
        const raggio = Math.max(1, 1.6 * p.scala * 0.018)

        const alone = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, raggio * 5)
        alone.addColorStop(0, `rgba(${ACCENTO[0]},${ACCENTO[1]},${ACCENTO[2]},${p.opacita * 0.9})`)
        alone.addColorStop(1, `rgba(${ACCENTO[0]},${ACCENTO[1]},${ACCENTO[2]},0)`)
        ctx.fillStyle = alone
        ctx.beginPath()
        ctx.arc(p.x, p.y, raggio * 5, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = `rgba(220,255,250,${p.opacita})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, raggio, 0, Math.PI * 2)
        ctx.fill()
      }

      // --- Polvere: punti minuscoli, senza collegamenti ---
      for (const granello of polvere) {
        const z = profonditaEffettiva(granello.z0, distanzaCamera)
        const p = proietta(z, granello.x, granello.y, focale, cx, cy)
        if (p.opacita <= 0.02) continue
        ctx.fillStyle = `rgba(${ACCENTO[0]},${ACCENTO[1]},${ACCENTO[2]},${p.opacita * 0.45})`
        ctx.fillRect(p.x, p.y, 1, 1)
      }

      raf = requestAnimationFrame(disegna)
    }

    ridimensiona()
    inizializza()
    raf = requestAnimationFrame(disegna)

    window.addEventListener('resize', ridimensiona)

    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('resize', ridimensiona)
    }
  }, [])

  return <canvas ref={canvasRef} className="size-full" aria-hidden="true" />
}
