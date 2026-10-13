import { FrecciaMatita } from '../ui/FrecciaMatita.jsx'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { animate, motion, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { spegniMusica } from '../lib/musica.js'
import { NOTA_MUSICA, VIDEO } from '../components/portfolio/video.js'
import { useLingua } from '../i18n/LinguaChiaro.jsx'
import { NOTA_MUSICA_EN, videoTradotto } from '../i18n/contenuti.js'
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
  const { t } = useLingua()
  const ref = useRef(null)
  const visibile = useInView(ref, { once: true })
  const ridotto = useReducedMotion()
  const [divisore, unita] = valore >= 1_000_000 ? [1_000_000, t.video.unitaMilioni] : valore >= 1000 ? [1000, t.video.unitaMigliaia] : [1, '']
  const arrivo = valore / divisore
  const decimali = Number.isInteger(arrivo) ? 0 : 1
  const [mostrato, setMostrato] = useState(ridotto ? arrivo : 0)
  useEffect(() => {
    if (!visibile || ridotto) return
    const c = animate(0, arrivo, { duration: 2.2, ease: EASE, onUpdate: setMostrato })
    return () => c.stop()
  }, [visibile, arrivo, ridotto])
  const numero = mostrato.toLocaleString(t.video.localeNumeri, { minimumFractionDigits: decimali, maximumFractionDigits: decimali })
  return (
    <p ref={ref} className="h-vd-viste">
      <strong>
        {numero}
        {unita}
      </strong>
      <span>{t.video.visualizzazioni}</span>
    </p>
  )
}

/** Il video di Instagram, ritagliato nel riquadro (stesso disegno nella carta e a tutta pagina). */
function Embed({ video }) {
  return (
    <iframe
      src={`https://www.instagram.com/p/${video.instagram}/embed/`}
      title={video.titolo}
      allowFullScreen
      scrolling="no"
      // Il video (9:16) sta dentro un'area 4:5 (alta 1,25 volte la larghezza, sotto un'intestazione di 54px): si allarga a 146%
      // e si centra, così riempie la carta anche agli angoli (con 142% restava un filo bianco); intestazione e barra restano fuori
      style={{ position: 'absolute', border: 0, width: '146cqw', left: '-23cqw', top: '-54px', height: 'calc(182.5cqw + 135px)' }}
    />
  )
}

/** Video a tutta pagina: sfondo scuro, X in alto a destra o Esc per chiudere. Parte da capo (è un nuovo video). */
function VideoGrande({ video, chiudi }) {
  const { t } = useLingua()
  const bottone = useRef(null)
  useEffect(() => {
    const tasto = (e) => e.key === 'Escape' && chiudi()
    // Cliccando nel video di Instagram la tastiera passa a lui e Esc non arriva più: appena succede si riporta qui
    const suBlur = () =>
      setTimeout(() => {
        if (document.activeElement?.tagName === 'IFRAME') bottone.current?.focus()
      }, 0)
    window.addEventListener('blur', suBlur)
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', tasto)
    return () => {
      document.body.style.overflow = overflow
      window.removeEventListener('keydown', tasto)
      window.removeEventListener('blur', suBlur)
    }
  }, [chiudi])
  return createPortal(
    <div className="h-vd-grande" role="dialog" aria-modal="true" aria-label={video.titolo} onClick={(e) => e.target === e.currentTarget && chiudi()}>
      <div className="h-vd-grande-box h-vd-riquadro" style={{ containerType: 'inline-size' }}>
        <Embed video={video} />
      </div>
      <button type="button" ref={bottone} className="h-vd-chiudi" onClick={chiudi} aria-label={t.video.chiudi}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 5l14 14M19 5L5 19" />
        </svg>
      </button>
    </div>,
    document.body,
  )
}

/** Riquadro 9:16: copertina nostra; l'embed di Instagram arriva solo dopo il clic. */
function Riquadro({ video }) {
  const { t } = useLingua()
  const [caricato, setCaricato] = useState(false)
  const [grande, setGrande] = useState(false)
  return (
    <div className="h-vd-riquadro" style={{ containerType: 'inline-size' }}>
      {caricato ? (
        <>
          {/* mentre è a tutta pagina quello nella carta si toglie, così non suonano due video */}
          {!grande && <Embed video={video} />}
          <button type="button" className="h-vd-espandi" onClick={() => setGrande(true)} aria-label={t.video.ingrandisci}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7" />
            </svg>
          </button>
          {grande && <VideoGrande video={video} chiudi={() => setGrande(false)} />}
        </>
      ) : (
        <>
          {video.anteprima && <img src={video.anteprima} alt="" loading="lazy" />}
          <div className="h-vd-velo" />
          <div className="h-vd-cop">
            <p className="h-vd-privacy">
              {t.video.ospitato} <Link to="/privacy">{t.video.dettagli}</Link>
            </p>
            <button type="button" className="h-vd-carica" onClick={() => {
                spegniMusica() // il video ha il suo audio: la musica del sito si ferma
                setCaricato(true)
              }}>
              {t.video.carica}
            </button>
          </div>
        </>
      )}
    </div>
  )
}

function Carta({ video, apri }) {
  const { t } = useLingua()
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
            {t.video.leggiDiPiu} <span aria-hidden="true">→</span>
          </button>
        )}
        {video.visualizzazioni && <Visualizzazioni valore={video.visualizzazioni} />}
      </div>
    </article>
  )
}

export function VideoChiaro() {
  const { t, lingua } = useLingua()
  const sezione = useRef(null)
  const traccia = useRef(null)
  const intesta = useRef(null)
  const ridotto = useReducedMotion()
  const dentro = useInView(intesta, { once: true, margin: '0px 0px -30% 0px' })
  const [dist, setDist] = useState(0) // quanto deve scorrere la striscia di lato
  const [aperto, setAperto] = useState(null)
  const { scrollYProgress } = useScroll({ target: sezione, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, (v) => -v * dist)
  // La striscia si muove di lato scorrendo la pagina, anche da telefono; solo con "riduci movimento" si scorre col dito
  const orizzontale = !ridotto

  useEffect(() => {
    const misura = () => {
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

  const apertoOriginale = VIDEO.find((v) => v.id === aperto)
  const apertoTradotto = apertoOriginale && videoTradotto(apertoOriginale, lingua)
  const datiModale = apertoTradotto && {
    titolo: apertoTradotto.titolo,
    categoria: 'video',
    completa: { paragrafi: apertoTradotto.testo, nota: lingua === 'en' ? NOTA_MUSICA_EN : NOTA_MUSICA },
    link: `https://www.instagram.com/p/${apertoTradotto.instagram}/`,
    testoLink: t.video.vaiSuInstagram,
  }

  return (
    <section
      ref={sezione}
      className="h-vd"
      id="video"
      aria-labelledby="h-vd-titolo"
      // L'altezza dà lo spazio di scroll che serve a far passare tutta la striscia
      style={orizzontale ? { height: `calc(100svh + ${dist}px)` } : undefined}
    >
      <div className={orizzontale ? 'h-vd-scena' : 'h-vd-scena h-vd-libera'}>
        <motion.div ref={traccia} className="h-vd-traccia" style={orizzontale ? { x } : undefined}>
          <div className="h-vd-intro">
            <h2 id="h-vd-titolo" ref={intesta} className="h-sv-intesta h-vd-intesta">
              <span className={`h-sv-riga h-sv-svuota ${dentro ? 'h-sv-scambiato' : ''}`}>
                <span className="h-sv-contorno">{t.video.titolo1}</span>
                <span className="h-sv-riempimento">{t.video.titolo1}</span>
              </span>
              <span className={`h-sv-riga h-sv-riempi ${dentro ? 'h-sv-scambiato' : ''}`}>
                <span className="h-sv-contorno">{t.video.titolo2}</span>
                <span className="h-sv-riempimento">{t.video.titolo2}</span>
              </span>
            </h2>
            <p className="h-vd-guida" aria-hidden="true">
              <span>{orizzontale ? t.video.continuaScendere : t.video.scorriLato}</span>
              <FrecciaMatita lunghezza={150} altezza={40} className="h-vd-freccia" />
            </p>
          </div>
          {VIDEO.map((video) => (
            <Carta key={video.id} video={videoTradotto(video, lingua)} apri={(v) => setAperto(v.id)} />
          ))}
        </motion.div>
      </div>
      <ModaleLavoro lavoro={datiModale || null} chiudi={() => setAperto(null)} />
    </section>
  )
}
