import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

/* ============================================================================
   CUBO CHIARO — il cubo del lato scuro, rovesciato.
   Lato scuro: vetro turchese con nucleo scuro. Lato chiaro: vetro trasparente
   con nucleo nero. Sul nucleo, davanti, c'è il tuo ritratto; sulle altre facce
   i servizi (Web, Grafica, Video, Social).

   `progresso` è un valore da 0 a 1 che arriva dallo scroll della pagina: ruota
   il cubo per mostrare le altre facce. Il mouse lo inclina appena.
   ========================================================================== */

const FACCE = ['Web', 'Grafica', 'Video', 'Social']

function texturaParola(parola) {
  const lato = 1024
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = lato
  const c = canvas.getContext('2d')
  c.fillStyle = '#ece9e1'
  c.textAlign = 'center'
  c.textBaseline = 'middle'
  c.font = 'italic 500 230px "Bodoni Moda Variable", "Bodoni Moda", Georgia, serif'
  c.fillText(parola, lato / 2, lato / 2 + 10)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  return tex
}

/** Faccia con titolo e testo, per il "Chi sono": il corpo si rimpicciolisce finché sta nel quadrato. */
function texturaTesto({ titolo, corpo }) {
  const lato = 1024
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = lato
  const c = canvas.getContext('2d')
  c.fillStyle = '#ece9e1'
  c.textBaseline = 'alphabetic'
  const margine = 90
  const larghezza = 680 // colonna stretta, come un giornale
  const famiglia = '"Inter Variable", Inter, system-ui, sans-serif'
  const altezzaTitolo = 200
  const disponibile = lato - margine * 2 - altezzaTitolo - 40
  let corpoPx = 34
  let righe = []
  for (; corpoPx >= 22; corpoPx -= 2) {
    c.font = `400 ${corpoPx}px ${famiglia}`
    if ('letterSpacing' in c) c.letterSpacing = `${corpoPx * 0.1}px`
    righe = []
    let riga = ''
    for (const parola of corpo.split(' ')) {
      const prova = riga ? `${riga} ${parola}` : parola
      if (c.measureText(prova.toUpperCase()).width > larghezza && riga) {
        righe.push(riga)
        riga = parola
      } else riga = prova
    }
    righe.push(riga)
    if (righe.length * corpoPx * 1.75 <= disponibile) break
  }
  // Titolo in alto e sotto la colonna di testo
  const altezzaBlocco = altezzaTitolo + 40 + righe.length * corpoPx * 1.75
  const y0 = Math.max(margine - 20, (lato - altezzaBlocco) / 2)
  // Titolo come "PER TUTTO.": Bodoni maiuscolo, solo contorno
  c.font = '600 140px "Bodoni Moda Variable", "Bodoni Moda", Georgia, serif'
  if ('letterSpacing' in c) c.letterSpacing = '-6px'
  c.strokeStyle = '#ece9e1'
  c.lineWidth = 2.5
  c.lineJoin = 'round'
  c.strokeText(titolo.toUpperCase(), margine, y0 + 120)
  if ('letterSpacing' in c) c.letterSpacing = '0px'
  // Testo come "Suono acceso": Inter 500, maiuscolo, spaziato
  c.font = `400 ${corpoPx}px ${famiglia}`
  if ('letterSpacing' in c) c.letterSpacing = `${corpoPx * 0.1}px`
  // Testo giustificato: lo spazio in più si divide fra le parole (l'ultima riga resta a sinistra)
  const yTesto = y0 + altezzaTitolo + 40
  const spazio = c.measureText(' ').width
  righe.forEach((r, i) => {
    const y = yTesto + i * corpoPx * 1.75
    const parole = r.toUpperCase().split(' ')
    if (i === righe.length - 1 || parole.length < 2) return c.fillText(parole.join(' '), margine, y)
    const larghezzaParole = parole.reduce((t, w) => t + c.measureText(w).width, 0)
    const vuoto = (larghezza - larghezzaParole) / (parole.length - 1)
    // Se gli spazi diventerebbero troppo larghi, la riga resta normale (meglio di buchi tra le parole)
    if (vuoto > spazio * 2.6) return c.fillText(parole.join(' '), margine, y)
    let x = margine
    parole.forEach((w) => {
      c.fillText(w, x, y)
      x += c.measureText(w).width + vuoto
    })
  })

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  return tex
}

export default function CuboChiaro({ progresso, apertoRef, facciaRef, testi = [], facce = FACCE, descrizioneCubo }) {
  const contenitoreRef = useRef(null)

  useEffect(() => {
    const contenitore = contenitoreRef.current
    if (!contenitore) return
    const ridotto = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    } catch {
      return // niente WebGL: resta il resto della pagina
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setClearColor(0x000000, 0)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05
    renderer.domElement.style.cssText = 'display:block;width:100%;height:100%;touch-action:pan-y'
    contenitore.appendChild(renderer.domElement)

    const scena = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50)
    camera.position.set(0, 0, 7.2)

    const pmrem = new THREE.PMREMGenerator(renderer)
    const ambiente = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scena.environment = ambiente

    const luce = new THREE.DirectionalLight(0xffffff, 1.8)
    luce.position.set(3, 5, 6)
    scena.add(luce)

    const gruppo = new THREE.Group()
    scena.add(gruppo)
    // Tutto ciò che sta dentro il cubo di linee: nucleo nero, poi o ritratto e parole (home)
    // oppure i testi del "Chi sono" (si scambiano quando si apre)
    const interno = new THREE.Group()
    gruppo.add(interno)
    const home = new THREE.Group()
    interno.add(home)
    const gruppoTesti = new THREE.Group()
    gruppoTesti.scale.setScalar(0.0001)
    gruppoTesti.visible = false
    interno.add(gruppoTesti)

    // Vetro trasparente: su fondo chiaro la "transmission" diventa un blocco bianco,
    // quindi qui è un vetro leggerissimo che lascia vedere il nome dietro e vive di riflessi
    const vetro = new THREE.Mesh(
      new RoundedBoxGeometry(2.3, 2.3, 2.3, 8, 0.2),
      new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0,
        roughness: 0.02,
        transparent: true,
        opacity: 0.07,
        clearcoat: 0,
        envMapIntensity: 0.4,
        side: THREE.FrontSide,
        depthWrite: false,
      }),
    )
    gruppo.add(vetro)

    // Spigoli sottili del vetro: su fondo chiaro servono a farlo leggere
    const matSpigoli = new THREE.LineBasicMaterial({ color: 0x0b0c0e, transparent: true, opacity: 0.22 })
    const spigoli = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(2.3, 2.3, 2.3)), matSpigoli)
    gruppo.add(spigoli)

    // Nucleo nero
    const nucleo = new THREE.Mesh(
      new RoundedBoxGeometry(1.5, 1.5, 1.5, 4, 0.1),
      new THREE.MeshStandardMaterial({ color: 0x0b0c0e, roughness: 0.32, metalness: 0.25 }),
    )
    interno.add(nucleo)

    const dispose = []
    let annullato = false

    // Ritratto sulla faccia davanti, parole sulle altre
    const caricaFacce = async () => {
      try {
        await Promise.all([
          document.fonts.load('italic 500 120px "Bodoni Moda Variable"'),
          document.fonts.load('500 40px "Inter Variable"'),
        ])
      } catch {
        /* se il font non arriva, il canvas usa Georgia */
      }
      if (annullato) return

      // Ritratto: ritagliato quadrato e sfumato nel nero dei bordi, così sembra parte del nucleo
      // e non un adesivo; è illuminato come il resto del cubo (stesso materiale del nucleo)
      const img = new Image()
      img.onload = () => {
        if (annullato) return
        const L = 1024
        const canvas = document.createElement('canvas')
        canvas.width = canvas.height = L
        const c = canvas.getContext('2d')
        const lato = Math.min(img.width, img.height * 0.82)
        c.drawImage(img, (img.width - lato) / 2, img.height * 0.04, lato, lato, 0, 0, L, L)

        // Bordi sfumati: due sfumature lineari (orizzontale e verticale) che dissolvono la foto nel nucleo nero.
        // Non si usa `filter: blur()` del canvas perché Safari su iPhone non lo supporta: lì la foto restava un quadrato netto.
        const bordo = 150
        const morbido = 95
        c.globalCompositeOperation = 'destination-in'
        for (const verticale of [false, true]) {
          const g = verticale ? c.createLinearGradient(0, 0, 0, L) : c.createLinearGradient(0, 0, L, 0)
          g.addColorStop(0, 'rgba(255,255,255,0)')
          g.addColorStop(Math.max((bordo - morbido) / L, 0), 'rgba(255,255,255,0)')
          g.addColorStop((bordo + morbido) / L, 'rgba(255,255,255,1)')
          g.addColorStop(1 - (bordo + morbido) / L, 'rgba(255,255,255,1)')
          g.addColorStop(Math.min(1 - (bordo - morbido) / L, 1), 'rgba(255,255,255,0)')
          g.addColorStop(1, 'rgba(255,255,255,0)')
          c.fillStyle = g
          c.fillRect(0, 0, L, L)
        }

        const tex = new THREE.CanvasTexture(canvas)
        tex.colorSpace = THREE.SRGBColorSpace
        tex.anisotropy = 8
        const mat = new THREE.MeshStandardMaterial({
          map: tex,
          transparent: true,
          roughness: 0.32,
          metalness: 0.25,
        })
        dispose.push(tex, mat)
        const ritratto = new THREE.Mesh(new THREE.PlaneGeometry(1.44, 1.44), mat)
        ritratto.position.set(0, 0, 0.752)
        home.add(ritratto)
      }
      img.src = '/salvatore.jpg'

      const posizioni = [
        { p: [0.756, 0, 0], r: [0, Math.PI / 2, 0] },
        { p: [0, 0, -0.756], r: [0, Math.PI, 0] },
        { p: [-0.756, 0, 0], r: [0, -Math.PI / 2, 0] },
        { p: [0, 0.756, 0], r: [-Math.PI / 2, 0, 0] },
      ]
      facce.forEach((parola, i) => {
        const tex = texturaParola(parola)
        const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, toneMapped: false })
        dispose.push(tex, mat)
        const piano = new THREE.Mesh(new THREE.PlaneGeometry(1.46, 1.46), mat)
        piano.position.set(...posizioni[i].p)
        piano.rotation.set(...posizioni[i].r)
        home.add(piano)
      })

      // Testi del "Chi sono": una faccia per testo, davanti / destra / dietro / sinistra
      const postiTesti = [
        { p: [0, 0, 0.756], r: [0, 0, 0] },
        posizioni[0],
        posizioni[1],
        posizioni[2],
      ]
      testi.slice(0, 4).forEach((t, i) => {
        const tex = texturaTesto(t)
        const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, toneMapped: false })
        dispose.push(tex, mat)
        const piano = new THREE.Mesh(new THREE.PlaneGeometry(1.46, 1.46), mat)
        piano.position.set(...postiTesti[i].p)
        piano.rotation.set(...postiTesti[i].r)
        gruppoTesti.add(piano)
      })
    }
    caricaFacce()

    // --- Interazione ---
    // Parte già con "Web" davanti: nessun salto al primo fotogramma
    let rotY = ridotto ? -0.28 : -Math.PI / 2 - 0.28 // parte con Web davanti
    let eraAperto = false
    const GIRO = Math.PI * 2
    let giroBase = 0
    gruppo.rotation.y = rotY
    let puntaX = 0
    let puntaY = 0
    const suMouse = (e) => {
      puntaY = (e.clientX / window.innerWidth - 0.5) * 0.6
      puntaX = (e.clientY / window.innerHeight - 0.5) * 0.4
    }
    window.addEventListener('pointermove', suMouse)

    const adatta = () => {
      const { clientWidth: w, clientHeight: h } = contenitore
      if (!w || !h) return
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.position.z = Math.min(w, h) < 300 ? 6.4 : 7.2
      camera.updateProjectionMatrix()
    }
    const osservatore = new ResizeObserver(adatta)
    osservatore.observe(contenitore)
    adatta()

    let visibile = true
    const io = new IntersectionObserver(([v]) => (visibile = v.isIntersecting), { threshold: 0 })
    io.observe(contenitore)

    const orologio = new THREE.Clock()
    let frame = 0
    const disegna = () => {
      frame = requestAnimationFrame(disegna)
      if (!visibile) {
        orologio.getDelta()
        return
      }
      orologio.getDelta()
      const t = orologio.elapsedTime
      const p = progresso?.get?.() ?? 0

      // Resta fermo su "Web". Scorrendo gira e arriva il ritratto (si ferma un po' davanti),
      // poi continua verso le altre facce. Senza movimento (riduci movimento) parte dal ritratto.
      const sm = THREE.MathUtils.smoothstep
      const aperto = !!apertoRef?.current
      const angolo = ridotto ? 0 : -Math.PI / 2 + (Math.PI / 2) * sm(p, 0.02, 0.42) + (Math.PI / 2) * sm(p, 0.62, 1)
      // Aperto "Chi sono": il cubo si raddrizza (quasi di fronte) così il testo sta dentro il suo riquadro
      const faccia = facciaRef?.current ?? 0
      let obiettivoY = -0.28 + angolo
      if (aperto) {
        // Appena si apre: due giri veloci, poi si ferma sulla faccia scelta (le facce girano in senso orario)
        const base = Math.round(rotY / GIRO) * GIRO
        if (!eraAperto) giroBase = base - (ridotto ? 0 : GIRO * 2)
        obiettivoY = giroBase - faccia * (Math.PI / 2) - 0.08
      } else if (eraAperto) {
        // Chiuso: si toglie il giro in eccesso senza che si veda (stessa posizione, angolo equivalente)
        const k = Math.round((rotY - obiettivoY) / GIRO) * GIRO
        rotY -= k
        gruppo.rotation.y -= k
      }
      eraAperto = aperto
      rotY += (obiettivoY - rotY) * (aperto ? 0.05 : 0.06)
      const mouse = aperto ? 0.25 : 1

      gruppo.rotation.y += (rotY + puntaY * mouse - gruppo.rotation.y) * 0.1
      gruppo.rotation.x += ((aperto ? 0.06 : 0.18 - p * 0.35) + puntaX * mouse - gruppo.rotation.x) * 0.1
      gruppo.position.y += ((aperto || ridotto ? 0 : Math.sin(t * 0.9) * 0.07) - gruppo.position.y) * 0.1
      const scalaGruppo = 1 + p * 0.18 // la dimensione non cambia quando si apre "Chi sono"
      gruppo.scale.setScalar(gruppo.scale.x + (scalaGruppo - gruppo.scale.x) * 0.08)

      // Il nucleo nero con ritratto e parole rimpicciolisce e sparisce, restano solo le linee
      // Aperto, il nucleo si allarga fin quasi al vetro: le facce con il testo diventano grandi
      interno.scale.setScalar(interno.scale.x + ((aperto ? 1.4 : 1) - interno.scale.x) * 0.08)
      // Il nucleo resta: cambiano solo ritratto/parole (home) e testi del "Chi sono"
      const sHome = home.scale.x + ((aperto ? 0 : 1) - home.scale.x) * 0.12
      home.scale.setScalar(Math.max(sHome, 0.0001))
      home.visible = sHome > 0.02
      const sTesti = gruppoTesti.scale.x + ((aperto ? 1 : 0) - gruppoTesti.scale.x) * 0.12
      gruppoTesti.scale.setScalar(Math.max(sTesti, 0.0001))
      gruppoTesti.visible = sTesti > 0.02

      renderer.render(scena, camera)
    }
    disegna()

    return () => {
      annullato = true
      cancelAnimationFrame(frame)
      osservatore.disconnect()
      io.disconnect()
      window.removeEventListener('pointermove', suMouse)
      scena.traverse((o) => {
        o.geometry?.dispose()
        const m = o.material
        if (m) (Array.isArray(m) ? m : [m]).forEach((x) => x.dispose())
      })
      dispose.forEach((x) => x.dispose?.())
      ambiente.dispose()
      pmrem.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [progresso, apertoRef, facciaRef, testi, facce])

  return (
    <div
      ref={contenitoreRef}
      className="size-full"
      role="img"
      aria-label={descrizioneCubo ?? 'Cubo tridimensionale di vetro con il ritratto di Salvatore Lombardi e i servizi Web, Grafica, Video e Social'}
    />
  )
}
