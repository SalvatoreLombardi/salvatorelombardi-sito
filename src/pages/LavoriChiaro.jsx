import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { CATEGORIE, LAVORI } from '../components/portfolio/lavori.js'
import { LogoConBolle } from '../components/portfolio/LogoConBolle.jsx'

/* ============================================================================
   LAVORI — lato chiaro.
   Un blocco grande per ogni lavoro, con le stesse regole del sito scuro:
   come anteprima c'è il logo del cliente su un colore di sfondo (con la mascotte
   o le bolle, dove previsto), non lo screenshot del sito. "Leggi di più" apre la
   descrizione completa. Mentre si scorre, l'anteprima scivola dentro la cornice
   e il titolo si muove nel senso opposto.
   I lavori vengono da `components/portfolio/lavori.js`: il contenuto è uno solo.
   ========================================================================== */

const EASE = [0.16, 1, 0.3, 1]

// Il sito scuro, una delle due versioni di questo sito, come lavoro: l'anteprima confronta i due stili.
// Il link porta alla home di adesso; quando i due lati si scambieranno, si aggiorna solo `link`.
const SITO_SCURO = {
  id: 'sito-scuro',
  titolo: 'Il lato scuro',
  categoria: ['web', 'grafica'],
  anno: '2026',
  descrizione:
    'Due versioni dello stesso sito, per mostrare come il design cambia l’intenzione di un sito senza toccarne i contenuti. Muovi il mouse sull’anteprima per vedere la differenza, poi entra nel lato scuro e confronta i dettagli: bottoni, titoli e movimenti.',
  confronto: true,
  // ricarica la pagina con ?loader: così il lato scuro mostra sempre il suo caricamento (percentuale, scintille, pannelli)
  stessaScheda: true,
  link: `${import.meta.env.BASE_URL}?loader#/scuro`,
  testoLink: 'Apri il lato scuro',
  completa: {
    intro:
      'Due versioni dello stesso sito, fatte per mostrare una cosa: con gli stessi contenuti, il design basta a cambiare l’intenzione. Il lato scuro è tecnologico e brillante, il lato chiaro è artigianale e calmo. Cambiano stile, forme e movimento, non le parole.',
    punti: [
      ['Lato scuro', 'Fondo nero, vetro e riflessi, angoli morbidi, un solo colore verde acqua e un cubo 3D che segue il mouse.'],
      ['Lato chiaro', 'Carta e inchiostro, angoli vivi, titoli enormi in contorno e in pieno, linee a matita e un cubo che mostra le sue facce con lo scroll.'],
      ['Stessi contenuti', 'Servizi, lavori e contatti sono gli stessi: cambia solo il modo di raccontarli, così la manutenzione resta una sola.'],
      ['Si passa con un clic', 'Dal lato chiaro un bottone nell’angolo porta al lato scuro.'],
    ],
  },
}

// Ordine in pagina: prima il B&B, poi Identitario, poi il confronto dei due lati, poi il resto
const ORDINE = ['le-terrazze-sul-mondo', 'identitario', 'sito-scuro', 'baggo', 'identitario-instagram']
const ELENCO = ORDINE.map((id) => (id === 'sito-scuro' ? SITO_SCURO : LAVORI.find((l) => l.id === id))).filter(Boolean)

const etichetta = (cat) => {
  const lista = Array.isArray(cat) ? cat : [cat]
  return lista.map((id) => CATEGORIE.find((c) => c.id === id)?.label ?? id).join(' · ')
}

/** Link esterno (scheda nuova) oppure interno al sito. */
function Collegamento({ lavoro, children, ...resto }) {
  if (lavoro.interno) {
    return (
      <Link to={lavoro.link} {...resto}>
        {children}
      </Link>
    )
  }
  if (lavoro.stessaScheda) {
    return (
      <a href={lavoro.link} {...resto}>
        {children}
      </a>
    )
  }
  return (
    <a href={lavoro.link} target="_blank" rel="noopener noreferrer" {...resto}>
      {children}
    </a>
  )
}

/** Anteprima: lo stesso contenuto nei due stili, scuro sopra e chiaro sotto, divisi da una linea che segue il mouse. */
function ConfrontoStili() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    const cornice = el.closest('.h-lv-cornice')
    const ridotto = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let punta = null // posizione scelta dal mouse (0-100); finché è null la linea va avanti e indietro da sola, quasi da un bordo all'altro, così si scopre tutto
    let x = 50
    let frame = 0
    const muovi = (e) => {
      const r = cornice.getBoundingClientRect()
      punta = Math.min(Math.max(((e.clientX - r.left) / r.width) * 100, 0), 100)
    }
    const esci = () => (punta = null)
    cornice.addEventListener('pointermove', muovi)
    cornice.addEventListener('pointerleave', esci)
    const t0 = performance.now()
    const giro = (ora) => {
      frame = requestAnimationFrame(giro)
      const bersaglio = punta ?? (ridotto ? 50 : 50 + Math.sin((ora - t0) / 1800) * 22)
      x += (bersaglio - x) * 0.09
      el.style.setProperty('--x', `${x.toFixed(2)}%`)
    }
    frame = requestAnimationFrame(giro)
    return () => {
      cancelAnimationFrame(frame)
      cornice.removeEventListener('pointermove', muovi)
      cornice.removeEventListener('pointerleave', esci)
    }
  }, [])
  return (
    <div ref={ref} className="h-cf" aria-hidden="true">
      <div className="h-cf-chiaro">
        <p className="h-cf-frase">
          un solo interlocutore
          <br />
          per tutto.
        </p>
        <span className="h-cf-bottone">Parliamone</span>
        <span className="h-cf-etichetta h-cf-etichetta-dx">Lato chiaro</span>
      </div>
      <div className="h-cf-scuro">
        <p className="h-cf-frase">
          Un solo interlocutore
          <br />
          <span>per tutto.</span>
        </p>
        <span className="h-cf-bottone">Parliamone</span>
        <span className="h-cf-etichetta">Lato scuro</span>
      </div>
      <span className="h-cf-linea" />
    </div>
  )
}

// Alcuni loghi sono quadrati con molto bianco intorno: si ingrandiscono per riempire meglio la cornice
const INGRANDISCI_LOGO = { 'le-terrazze-sul-mondo': 1.22 }

/** Anteprima: logo su colore di sfondo, come nelle card del sito scuro. */
function Anteprima({ lavoro }) {
  if (lavoro.confronto) return <ConfrontoStili />
  if (lavoro.effetto === 'bolle') return <LogoConBolle lavoro={lavoro} />
  if (lavoro.logo) {
    return (
      <div className={`h-lv-logo ${lavoro.mascotte ? 'h-lv-logo-mascotte' : ''} ${INGRANDISCI_LOGO[lavoro.id] ? 'h-lv-logo-grande' : ''}`} style={{ backgroundColor: lavoro.sfondo }}>
        <img
          src={lavoro.logo}
          alt={lavoro.titolo}
          loading="lazy"
          style={INGRANDISCI_LOGO[lavoro.id] ? { transform: `scale(${INGRANDISCI_LOGO[lavoro.id]})` } : undefined}
        />
        {lavoro.mascotte && <img className="h-lv-mascotte" src={lavoro.mascotte} alt="" aria-hidden="true" loading="lazy" />}
      </div>
    )
  }
  return lavoro.immagine ? <img className="h-lv-foto" src={lavoro.immagine} alt={lavoro.titolo} loading="lazy" /> : null
}

function Lavoro({ lavoro, indice, apri }) {
  const ref = useRef(null)
  const cornice = useRef(null)
  const ridotto = useReducedMotion()
  const visibile = useInView(cornice, { once: true, margin: '0px 0px -20% 0px' })
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const verso = indice % 2 === 0 ? 1 : -1
  const xTitolo = useTransform(scrollYProgress, [0, 1], [`${3 * verso}vw`, `${-3 * verso}vw`])
  const yAnteprima = useTransform(scrollYProgress, [0, 1], ['-5%', '5%'])
  const pari = indice % 2 === 0

  return (
    <article ref={ref} className={`h-lv ${pari ? '' : 'h-lv-inverso'}`}>
      <motion.h3
        className="h-lv-titolo"
        // I titoli lunghi si rimpiccioliscono per restare dentro lo schermo
        style={{ '--fs': `min(8.6vw, ${(150 / lavoro.titolo.length).toFixed(2)}vw)`, ...(ridotto ? {} : { x: xTitolo }) }}
      >
        {lavoro.titolo}
      </motion.h3>

      <motion.div
        ref={cornice}
        className="h-lv-cornice"
        style={{ backgroundColor: lavoro.sfondo }}
        initial={ridotto ? false : { clipPath: 'inset(100% 0 0 0)' }}
        animate={{ clipPath: visibile || ridotto ? 'inset(0% 0 0 0)' : 'inset(100% 0 0 0)' }}
        transition={{ duration: 1.3, ease: EASE }}
      >
        <motion.div className="h-lv-interno" // con la mascotte l'anteprima resta ferma, altrimenti lo scorrimento le taglia piedi e braccia
          style={ridotto || lavoro.mascotte || lavoro.confronto ? undefined : { y: yAnteprima, scale: 1.12 }}>
          <Anteprima lavoro={lavoro} />
        </motion.div>
        {lavoro.link && (
          <Collegamento
            lavoro={lavoro}
            className="h-lv-apri"
            data-cursore=""
            aria-label={`${lavoro.testoLink ?? 'Visita il sito'}: ${lavoro.titolo}`}
          />
        )}
      </motion.div>

      <div className="h-lv-info">
        <span className="h-lv-numero" aria-hidden="true">
          0{indice + 1}
        </span>
        <p className="h-lv-meta">
          {etichetta(lavoro.categoria)} · {lavoro.anno}
        </p>
        <p className="h-lv-testo">{lavoro.descrizione}</p>
        <div className="h-lv-azioni">
          {lavoro.completa && (
            <button type="button" className="h-lv-piu" onClick={() => apri(lavoro)}>
              Leggi di più <span aria-hidden="true">→</span>
            </button>
          )}
          {lavoro.link && (
            <Collegamento lavoro={lavoro} className="h-lv-link">
              {lavoro.testoLink ?? 'Visita il sito'} <span aria-hidden="true">{lavoro.interno || lavoro.stessaScheda ? '→' : '↗'}</span>
            </Collegamento>
          )}
        </div>
      </div>
    </article>
  )
}

/** Descrizione completa di un lavoro: pannello squadrato sopra la pagina. Si chiude con Esc, fuori o "Chiudi". */
export function ModaleLavoro({ lavoro, chiudi }) {
  const ridotto = useReducedMotion()
  const pannello = useRef(null)
  useEffect(() => {
    if (!lavoro) return
    const suTasto = (e) => e.key === 'Escape' && chiudi()
    const prima = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', suTasto)
    pannello.current?.focus()
    return () => {
      window.removeEventListener('keydown', suTasto)
      document.body.style.overflow = prima
    }
  }, [lavoro, chiudi])

  return (
    <AnimatePresence>
      {lavoro && (
        <motion.div
          className="h-mod"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: ridotto ? 0 : 0.35 }}
        >
          <div className="h-mod-fondo" onClick={chiudi} aria-hidden="true" />
          <motion.div
            ref={pannello}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={lavoro.titolo}
            className="h-mod-pannello"
            initial={ridotto ? false : { clipPath: 'inset(100% 0 0 0)' }}
            animate={{ clipPath: 'inset(0% 0 0 0)' }}
            exit={ridotto ? undefined : { clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: ridotto ? 0 : 0.7, ease: EASE }}
          >
            <button type="button" className="h-mod-chiudi" onClick={chiudi}>
              Chiudi
            </button>
            <p className="h-mod-meta">{[lavoro.categoria && etichetta(lavoro.categoria), lavoro.anno].filter(Boolean).join(' · ')}</p>
            <h3 className="h-mod-titolo">{lavoro.titolo}</h3>
            {lavoro.completa.intro && <p className="h-mod-intro">{lavoro.completa.intro}</p>}
            {lavoro.completa.paragrafi?.map((p) => (
              <p key={p} className="h-mod-intro">
                {p}
              </p>
            ))}
            {lavoro.completa.nota && <p className="h-mod-nota">{lavoro.completa.nota}</p>}
            <ul className="h-mod-punti">
              {lavoro.completa.punti?.map(([titolo, testo]) => (
                <li key={titolo}>
                  <strong>{titolo}</strong>
                  <span>{testo}</span>
                </li>
              ))}
            </ul>
            {lavoro.link && (
              <Collegamento lavoro={lavoro} className="h-mod-bottone">
                {lavoro.testoLink ?? 'Visita il sito'} {lavoro.interno || lavoro.stessaScheda ? '→' : '↗'}
              </Collegamento>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function LavoriChiaro() {
  const intesta = useRef(null)
  const dentro = useInView(intesta, { once: true, margin: '0px 0px -30% 0px' })
  const [aperto, setAperto] = useState(null)
  const chiudi = () => setAperto(null)
  return (
    <section className="h-lvs" id="lavori" aria-labelledby="h-lvs-titolo">
      <h2 id="h-lvs-titolo" ref={intesta} className="h-sv-intesta">
        <span className={`h-sv-riga h-sv-svuota ${dentro ? 'h-sv-scambiato' : ''}`}>
          <span className="h-sv-contorno">Ogni lavoro</span>
          <span className="h-sv-riempimento">Ogni lavoro</span>
        </span>
        <span className={`h-sv-riga h-sv-riempi ${dentro ? 'h-sv-scambiato' : ''}`}>
          <span className="h-sv-contorno">ha una storia.</span>
          <span className="h-sv-riempimento">ha una storia.</span>
        </span>
      </h2>

      <div className="h-lv-elenco">
        {ELENCO.map((lavoro, i) => (
          <Lavoro key={lavoro.id} lavoro={lavoro} indice={i} apri={setAperto} />
        ))}
      </div>

      <ModaleLavoro lavoro={aperto} chiudi={chiudi} />
    </section>
  )
}
