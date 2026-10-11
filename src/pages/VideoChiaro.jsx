import { FrecciaMatita } from '../ui/FrecciaMatita.jsx'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { animate, motion, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { NOTA_MUSICA, VIDEO } from '../components/portfolio/video.js'
import { ModaleLavoro } from './LavoriChiaro.jsx'

/* ============================================================================
   VIDEO — lato chiaro.
   Una striscia di video verticali che scorre di lato mentre si scende con la
   rotella (sul telefono si scorre con il dito). Le regole sono quelle del sito
   scuro: la copertina è un'immagine nostra, e il video di Instagram si carica
   solo dopo il clic su "Carica il video" (privacy). "Leggi di più" apre il testo.
   I contenuti stanno in `components/portfolio/video.js`.
   ========================================================================== */

const EASE = [0.16, 1, 0.3, 1]

/** Pin della posizione, a linea sottile. */
function Pin() {
  return (
    <svg viewBox="0 0 24 24" className="h-vd-pin" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 21.5s-7-6.1-7-11.6a7 7 0 0 1 14 0c0 5.5-7 11.6-7 11.6Z" />
      <circle cx="12" cy="9.8" r="2.4" />
    </svg>
  )
}

/** Visualizzazioni: il numero sale da 0 quando la carta entra nello schermo. */
function Visualizzazioni({ valore }) {
  const ref = useRef(null)
  const visibile = useInView(ref, { once: true })
  const ridotto = useReducedMotion()
  const [divisore, unita] = valore >= 1_000_000 ? [1_000_000, 'milioni'] : valore >= 1000 ? [1000, 'mila'] : [1, '']
  const arrivo = valore / divisore
  const decimali = Number.isInteger(arrivo) ? 0 : 1
  const [mostrato, setMostrato] = useState(ridotto ? arrivo : 0)
  useEffect(() => {
    if (!visibile || ridotto) return
    const c = animate(0, arrivo, { duration: 2.2, ease: EASE, onUpdate: setMostrato })
    return () => c.stop()
  }, [visibile, arrivo, ridotto])
  const numero = mostrato.toLocaleString('it-IT', { minimumFractionDigits: decimali, maximumFractionDigits: decimali })
  return (
    <p ref={ref} className="h-vd-viste">
      <strong>
        {numero}
        {unita && ` ${unita}`}
      </strong>
      <span>visualizzazioni</span>
    </p>
  )
}

/** Riquadro 9:16: copertina nostra; l'embed di Instagram arriva solo dopo il clic. */
function Riquadro({ video }) {
  const [caricato, setCaricato] = useState(false)
  return (
    <div className="h-vd-riquadro" style={{ containerType: 'inline-size' }}>
      {caricato ? (
        <iframe
          src={`https://www.instagram.com/p/${video.instagram}/embed/`}
          title={video.titolo}
          allowFullScreen
          scrolling="no"
          // Il video (9:16) sta dentro un'area 4:5: si allarga a 142% e si centra, così riempie la carta;
          // intestazione e barra di Instagram restano fuori dal riquadro
          style={{ position: 'absolute', border: 0, width: '142.2cqw', left: '-21.1cqw', top: '-54px', height: 'calc(177.8cqw + 135px)' }}
        />
      ) : (
        <>
          {video.anteprima && <img src={video.anteprima} alt="" loading="lazy" />}
          <div className="h-vd-velo" />
          <div className="h-vd-cop">
            <p className="h-vd-privacy">
              Il video è ospitato da Instagram. Caricandolo, Instagram può ricevere il tuo indirizzo IP e usare cookie.{' '}
              <Link to="/privacy">Dettagli</Link>
            </p>
            <button type="button" className="h-vd-carica" onClick={() => setCaricato(true)}>
              Carica il video
            </button>
          </div>
        </>
      )}
    </div>
  )
}

function Carta({ video, apri }) {
  return (
    <article className="h-vd-carta" data-cursore="">
      <Riquadro video={video} />
      <h3 className="h-vd-titolo">{video.titolo}</h3>
      <p className="h-vd-descr">{video.descrizione}</p>
      {video.luogo && (
        <p className="h-vd-luogo">
          <Pin />
          <span>{video.luogo}</span>
        </p>
      )}
      <div className="h-vd-fondo">
        {video.testo && (
          <button type="button" className="h-lv-piu" onClick={() => apri(video)}>
            Leggi di più <span aria-hidden="true">→</span>
          </button>
        )}
        {video.visualizzazioni && <Visualizzazioni valore={video.visualizzazioni} />}
      </div>
    </article>
  )
}

export function VideoChiaro() {
  const sezione = useRef(null)
  const traccia = useRef(null)
  const intesta = useRef(null)
  const ridotto = useReducedMotion()
  const dentro = useInView(intesta, { once: true, margin: '0px 0px -30% 0px' })
  const [dist, setDist] = useState(0) // quanto deve scorrere la striscia di lato
  const [stretto, setStretto] = useState(false) // telefono: si scorre con il dito, niente blocco della pagina
  const [aperto, setAperto] = useState(null)
  const { scrollYProgress } = useScroll({ target: sezione, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, (v) => -v * dist)
  const orizzontale = !stretto && !ridotto

  useEffect(() => {
    const misura = () => {
      setStretto(window.matchMedia('(max-width: 760px)').matches)
      const el = traccia.current
      if (el) setDist(Math.max(el.scrollWidth - window.innerWidth, 0))
    }
    misura()
    const o = new ResizeObserver(misura)
    o.observe(traccia.current)
    window.addEventListener('resize', misura)
    return () => {
      o.disconnect()
      window.removeEventListener('resize', misura)
    }
  }, [])

  const datiModale = aperto && {
    titolo: aperto.titolo,
    categoria: 'video',
    completa: { paragrafi: aperto.testo, nota: NOTA_MUSICA },
    link: `https://www.instagram.com/p/${aperto.instagram}/`,
    testoLink: 'Vai su Instagram',
  }

  return (
    <section
      ref={sezione}
      className="h-vd"
      id="video"
      aria-labelledby="h-vd-titolo"
      // L'altezza dà lo spazio di scroll che serve a far passare tutta la striscia
      style={orizzontale ? { height: `calc(100vh + ${dist}px)` } : undefined}
    >
      <div className={orizzontale ? 'h-vd-scena' : 'h-vd-scena h-vd-libera'}>
        <motion.div ref={traccia} className="h-vd-traccia" style={orizzontale ? { x } : undefined}>
          <div className="h-vd-intro">
            <h2 id="h-vd-titolo" ref={intesta} className="h-sv-intesta h-vd-intesta">
              <span className={`h-sv-riga h-sv-svuota ${dentro ? 'h-sv-scambiato' : ''}`}>
                <span className="h-sv-contorno">Riprese aeree,</span>
                <span className="h-sv-riempimento">Riprese aeree,</span>
              </span>
              <span className={`h-sv-riga h-sv-riempi ${dentro ? 'h-sv-scambiato' : ''}`}>
                <span className="h-sv-contorno">dettagli, montaggio.</span>
                <span className="h-sv-riempimento">dettagli, montaggio.</span>
              </span>
            </h2>
            <p className="h-vd-guida" aria-hidden="true">
              <span>{orizzontale ? 'Continua a scendere' : 'Scorri di lato'}</span>
              <FrecciaMatita lunghezza={150} altezza={40} className="h-vd-freccia" />
            </p>
          </div>
          {VIDEO.map((video) => (
            <Carta key={video.id} video={video} apri={setAperto} />
          ))}
        </motion.div>
      </div>
      <ModaleLavoro lavoro={datiModale || null} chiudi={() => setAperto(null)} />
    </section>
  )
}
