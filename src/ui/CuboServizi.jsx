import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

/* ============================================================================
   CUBO DEI SERVIZI
   Cubo di vetro turchese con quattro facce (Web, Grafica, Video, Social) e il
   pittogramma sopra e sotto. Gira piano da solo, segue il mouse e si può
   trascinare per farlo ruotare (con inerzia).

   Come è fatto, perché sembra vero:
   - vetro fisico (transmission, spessore, rifrazione) che deforma ciò che c'è
     dentro mentre ruota;
   - un nucleo scuro e le scritte sospese a metà strada fra nucleo e vetro:
     col movimento si crea parallasse e profondità;
   - riflessi da un ambiente da studio fotografico + due luci turchesi sui lati;
   - bordi interni luminosi.

   Per cambiare le scritte: FACCE qui sotto. È caricato a richiesta (lazy) da
   Hero.jsx, così non appesantisce la prima apertura del sito.
   ========================================================================== */

const TURCHESE = '#2dd4bf'

// Quattro facce: etichetta e icona (disegnata come tracciato su canvas, 100x100)
const FACCE = [
  {
    etichetta: 'Web',
    icona: (c) => {
      // finestra del browser con barra in alto e le parentesi </>
      tratto(c, new Path2D('M14 24a8 8 0 0 1 8-8h56a8 8 0 0 1 8 8v52a8 8 0 0 1-8 8H22a8 8 0 0 1-8-8Z M14 36h72'))
      tratto(c, new Path2D('M41 52 31 61l10 9 M59 52l10 9-10 9'))
    },
  },
  {
    etichetta: 'Grafica',
    icona: (c) => {
      // pennino
      tratto(c, new Path2D('M50 12 76 54 50 88 24 54Z M50 12v42'))
      c.beginPath()
      c.arc(50, 58, 5.5, 0, Math.PI * 2)
      c.stroke()
    },
  },
  {
    etichetta: 'Video',
    icona: (c) => {
      // schermo con pulsante play
      tratto(c, new Path2D('M12 26a8 8 0 0 1 8-8h60a8 8 0 0 1 8 8v48a8 8 0 0 1-8 8H20a8 8 0 0 1-8-8Z'))
      tratto(c, new Path2D('M43 36v28l24-14Z'))
    },
  },
  {
    etichetta: 'Social',
    icona: (c) => {
      // nuvoletta di conversazione con tre puntini
      tratto(c, new Path2D('M16 30a10 10 0 0 1 10-10h48a10 10 0 0 1 10 10v30a10 10 0 0 1-10 10H46L28 86V70h-2a10 10 0 0 1-10-10Z'))
      for (const x of [36, 50, 64]) {
        c.beginPath()
        c.arc(x, 45, 3.4, 0, Math.PI * 2)
        c.fill()
      }
    },
  },
]

function tratto(c, path) {
  c.stroke(path)
}

/** Texture di una faccia: icona + parola in bianco su trasparente (poi tinta dal materiale). */
function texturaFaccia(faccia) {
  const lato = 1024
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = lato
  const c = canvas.getContext('2d')
  c.clearRect(0, 0, lato, lato)
  c.fillStyle = '#fff'
  c.strokeStyle = '#fff'

  // icona al centro in alto
  c.save()
  c.translate(lato / 2 - 190, 150)
  c.scale(3.8, 3.8)
  c.lineWidth = 3.4
  c.lineCap = 'round'
  c.lineJoin = 'round'
  faccia.icona(c)
  c.restore()

  // parola
  c.font = '600 190px Inter, system-ui, sans-serif'
  c.textAlign = 'center'
  c.textBaseline = 'alphabetic'
  c.fillText(faccia.etichetta, lato / 2, 800)

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  return tex
}

/** Freccia in su, bianca su trasparente (poi tinta dal materiale): per il widget "Torna su". */
function texturaFreccia() {
  const lato = 1024
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = lato
  const c = canvas.getContext('2d')
  c.strokeStyle = '#fff'
  c.lineWidth = 96
  c.lineCap = 'round'
  c.lineJoin = 'round'
  c.beginPath()
  c.moveTo(lato / 2, 810) // asta
  c.lineTo(lato / 2, 250)
  c.moveTo(lato / 2 - 230, 480) // punta
  c.lineTo(lato / 2, 250)
  c.lineTo(lato / 2 + 230, 480)
  c.stroke()
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  return tex
}

export default function CuboServizi({ variante = 'servizi', onClick }) {
  const contenitoreRef = useRef(null)
  const clicRef = useRef(onClick)
  clicRef.current = onClick

  useEffect(() => {
    const contenitore = contenitoreRef.current
    if (!contenitore) return

    const ridotto = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    } catch {
      return // niente WebGL: il resto del sito funziona lo stesso
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setClearColor(0x000000, 0)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    renderer.domElement.style.cssText = 'display:block;width:100%;height:100%;touch-action:pan-y;cursor:grab'
    contenitore.appendChild(renderer.domElement)

    const scena = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50)
    camera.position.set(0, 0, 9.2)

    // Riflessi: ambiente da studio fotografico
    const pmrem = new THREE.PMREMGenerator(renderer)
    const ambiente = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scena.environment = ambiente

    // Due luci turchesi ai lati + una bianca dall'alto: danno colore ai bordi
    const lucePrincipale = new THREE.DirectionalLight(0xffffff, 1.6)
    lucePrincipale.position.set(3, 5, 6)
    const luceSx = new THREE.PointLight(0x2dd4bf, 90, 22)
    luceSx.position.set(-5.5, 1.5, 3)
    const luceDx = new THREE.PointLight(0x14b8a6, 70, 22)
    luceDx.position.set(5.5, -2, 2.5)
    scena.add(lucePrincipale, luceSx, luceDx)

    const gruppo = new THREE.Group()
    scena.add(gruppo)

    // --- Vetro ---
    const lato = 2.3
    const vetro = new THREE.Mesh(
      new RoundedBoxGeometry(lato, lato, lato, 8, 0.2),
      new THREE.MeshPhysicalMaterial({
        color: 0xbff7ef,
        metalness: 0,
        roughness: 0.04,
        transmission: 1,
        thickness: 1.7,
        ior: 1.5,
        attenuationColor: new THREE.Color(0x14b8a6),
        attenuationDistance: 2.4,
        clearcoat: 1,
        clearcoatRoughness: 0.03,
        specularIntensity: 1,
        envMapIntensity: 1.5,
      }),
    )
    gruppo.add(vetro)

    // --- Nucleo scuro: dà corpo al vetro ---
    const nucleo = new THREE.Mesh(
      new RoundedBoxGeometry(1.5, 1.5, 1.5, 4, 0.12),
      new THREE.MeshStandardMaterial({
        color: 0x062f2b,
        roughness: 0.28,
        metalness: 0.5,
        emissive: new THREE.Color(0x0a8f82),
        emissiveIntensity: 0.38,
      }),
    )
    gruppo.add(nucleo)

    // --- Bordi interni luminosi ---
    const bordi = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(1.86, 1.86, 1.86)),
      new THREE.LineBasicMaterial({ color: 0x5eead4, transparent: true, opacity: 0.55 }),
    )
    gruppo.add(bordi)

    // --- Scritte sulle quattro facce, sospese dentro il vetro ---
    const materialiTesto = []
    const soloFrecce = variante === 'freccia'
    const texture = soloFrecce ? FACCE.map(texturaFreccia) : FACCE.map(texturaFaccia)
    // +z davanti, +x destra, -z dietro, -x sinistra
    const posizioni = [
      { p: [0, 0, 0.9], r: [0, 0, 0] },
      { p: [0.9, 0, 0], r: [0, Math.PI / 2, 0] },
      { p: [0, 0, -0.9], r: [0, Math.PI, 0] },
      { p: [-0.9, 0, 0], r: [0, -Math.PI / 2, 0] },
    ]
    texture.forEach((tex, i) => {
      const mat = new THREE.MeshBasicMaterial({
        map: tex,
        color: new THREE.Color(TURCHESE),
        alphaTest: 0.35,
        alphaToCoverage: true,
        side: THREE.DoubleSide,
        toneMapped: false,
      })
      materialiTesto.push(mat)
      const piano = new THREE.Mesh(new THREE.PlaneGeometry(1.46, 1.46), mat)
      piano.position.set(...posizioni[i].p)
      piano.rotation.set(...posizioni[i].r)
      gruppo.add(piano)
    })

    // --- Sopra e sotto: l'uccello (servizi) oppure la freccia (torna su) ---
    let texUccello
    const piani = (tex) => {
      for (const segno of [1, -1]) {
        const mat = new THREE.MeshBasicMaterial({
          map: tex,
          color: soloFrecce ? new THREE.Color(TURCHESE) : undefined,
          alphaTest: 0.35,
          alphaToCoverage: true,
          side: THREE.DoubleSide,
          toneMapped: false,
        })
        materialiTesto.push(mat)
        const piano = new THREE.Mesh(new THREE.PlaneGeometry(soloFrecce ? 1.46 : 1.1, soloFrecce ? 1.46 : 1.1), mat)
        piano.position.set(0, 0.9 * segno, 0)
        piano.rotation.set((-Math.PI / 2) * segno, 0, 0)
        gruppo.add(piano)
      }
    }
    if (soloFrecce) {
      texUccello = texturaFreccia()
      piani(texUccello)
    } else {
      new THREE.TextureLoader().load('/logo-uccello-piatto.png', (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace
        tex.anisotropy = 8
        texUccello = tex
        piani(tex)
      })
    }

    // --- Interazione ---
    let rotY = -0.62
    let rotX = 0.36
    let velY = ridotto ? 0 : 0.18 // rad/s di rotazione automatica
    const VEL_AUTO = velY
    let trascinando = false
    let spostato = 0
    let ultimoX = 0
    let ultimoY = 0
    let inerziaY = 0
    let inerziaX = 0
    let puntaX = 0 // inclinazione verso il mouse
    let puntaY = 0

    const suDown = (e) => {
      trascinando = true
      spostato = 0
      ultimoX = e.clientX
      ultimoY = e.clientY
      inerziaX = inerziaY = 0
      renderer.domElement.style.cursor = 'grabbing'
      renderer.domElement.setPointerCapture?.(e.pointerId)
    }
    const suMove = (e) => {
      if (trascinando) {
        const dx = e.clientX - ultimoX
        const dy = e.clientY - ultimoY
        spostato += Math.abs(dx) + Math.abs(dy)
        ultimoX = e.clientX
        ultimoY = e.clientY
        inerziaY = dx * 0.012
        inerziaX = dy * 0.012
        rotY += inerziaY
        rotX = THREE.MathUtils.clamp(rotX + inerziaX, -1.1, 1.1)
      }
    }
    const suUp = (e) => {
      if (trascinando && spostato < 6) clicRef.current?.() // un tocco, non un trascinamento
      trascinando = false
      renderer.domElement.style.cursor = 'grab'
      renderer.domElement.releasePointerCapture?.(e.pointerId)
    }
    const suMouseFinestra = (e) => {
      // il cubo "guarda" il mouse con una leggera inclinazione, in tutta la finestra
      puntaY = (e.clientX / window.innerWidth - 0.5) * 0.5
      puntaX = (e.clientY / window.innerHeight - 0.5) * 0.4
    }
    renderer.domElement.addEventListener('pointerdown', suDown)
    window.addEventListener('pointermove', suMove)
    window.addEventListener('pointerup', suUp)
    window.addEventListener('pointermove', suMouseFinestra)

    // --- Misure ---
    const adatta = () => {
      const { clientWidth: w, clientHeight: h } = contenitore
      if (!w || !h) return
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      // Riquadro piccolo (telefono): camera più vicina, il cubo riempie meglio lo spazio
      camera.position.z = Math.min(w, h) < 300 ? 7.6 : 9.2
      camera.updateProjectionMatrix()
    }
    const osservatore = new ResizeObserver(adatta)
    osservatore.observe(contenitore)
    adatta()

    // --- Ciclo di disegno: si ferma se il cubo non è visibile ---
    let visibile = true
    let paginaVisibile = !document.hidden
    const io = new IntersectionObserver(([voce]) => (visibile = voce.isIntersecting), { threshold: 0 })
    io.observe(contenitore)
    const suVisibilita = () => (paginaVisibile = !document.hidden)
    document.addEventListener('visibilitychange', suVisibilita)

    const orologio = new THREE.Clock()
    let frame = 0
    const disegna = () => {
      frame = requestAnimationFrame(disegna)
      if (!visibile || !paginaVisibile) {
        orologio.getDelta()
        return
      }
      const dt = Math.min(orologio.getDelta(), 0.05)
      const t = orologio.elapsedTime

      if (!trascinando) {
        // inerzia che si spegne, poi torna la rotazione lenta
        rotY += inerziaY
        rotX = THREE.MathUtils.clamp(rotX + inerziaX, -1.1, 1.1)
        inerziaY *= 0.94
        inerziaX *= 0.94
        rotY += VEL_AUTO * dt
        // l'inclinazione verticale torna piano verso un valore a riposo
        rotX += (0.36 - rotX) * 0.01
      }

      // inclinazione dolce verso il mouse (si somma alla rotazione)
      gruppo.rotation.y += (rotY + puntaY - gruppo.rotation.y) * 0.08
      gruppo.rotation.x += (rotX + puntaX - gruppo.rotation.x) * 0.08
      gruppo.position.y = ridotto ? 0 : Math.sin(t * 0.9) * 0.08

      renderer.render(scena, camera)
    }
    disegna()

    return () => {
      cancelAnimationFrame(frame)
      osservatore.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', suVisibilita)
      renderer.domElement.removeEventListener('pointerdown', suDown)
      window.removeEventListener('pointermove', suMove)
      window.removeEventListener('pointerup', suUp)
      window.removeEventListener('pointermove', suMouseFinestra)
      scena.traverse((o) => {
        o.geometry?.dispose()
        const m = o.material
        if (m) (Array.isArray(m) ? m : [m]).forEach((x) => x.dispose())
      })
      texture.forEach((x) => x.dispose())
      texUccello?.dispose()
      ambiente.dispose()
      pmrem.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  return (
    <div className="relative size-full">
      {/* Alone turchese morbido dietro al cubo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 size-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full
                   bg-accent-500/25 blur-[90px]"
      />
      <div
        ref={contenitoreRef}
        className="relative size-full"
        role="img"
        aria-label={
          variante === 'freccia'
            ? 'Cubo tridimensionale con una freccia in su'
            : 'Cubo tridimensionale con i quattro servizi: Web, Grafica, Video e Social'
        }
      />
    </div>
  )
}
