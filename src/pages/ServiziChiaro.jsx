import { useRef } from 'react'
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { SERVIZI } from '../components/Servizi.jsx'

/* ============================================================================
   SERVIZI — lato chiaro.
   Quattro carte squadrate che si sovrappongono mentre si scorre (le stesse
   quattro facce del cubo: Web, Grafica, Video, Social). Il titolo di ogni carta
   si riempie con lo scroll; accanto, un piccolo disegno a linea che si traccia.
   I testi vengono da `components/Servizi.jsx`, così il contenuto è uno solo.
   ========================================================================== */

const EASE = [0.16, 1, 0.3, 1]

// Ordine e nomi come sul cubo; `da` è la posizione del servizio nell'elenco dei testi
const CARTE = [
  {
    nome: 'Web',
    da: 0,
    disegno: [
      'M52 24C36 40 28 52 24 60C30 70 40 82 54 98',
      'M108 24C124 40 132 52 136 60C130 70 120 82 106 98',
      'M90 16C84 44 76 76 70 106',
    ],
  },
  {
    nome: 'Grafica',
    da: 1,
    disegno: [
      'M58 20C86 16 106 38 102 64C98 90 70 102 46 90C24 78 22 46 44 30',
      'M84 50L142 44L146 102L90 106L84 52',
      'M30 100L64 70L96 108',
    ],
  },
  {
    nome: 'Video',
    da: 3,
    disegno: [
      'M20 36L96 32L100 90L24 94L20 38',
      'M100 54L146 32L148 94L102 72',
      'M44 18L62 34M72 14L82 32',
    ],
  },
  {
    nome: 'Social',
    da: 2,
    disegno: [
      'M32 30C52 16 112 16 134 32C150 46 148 72 130 84C114 94 98 92 86 94L62 110L66 92C40 88 20 72 20 54C20 44 26 36 34 30',
      'M52 50L112 48M52 66L96 66',
    ],
  },
]

/** Disegno a linea sottile: si traccia quando la carta entra nello schermo. */
function Disegno({ tratti }) {
  const ref = useRef(null)
  const visibile = useInView(ref, { once: true, margin: '0px 0px -25% 0px' })
  const ridotto = useReducedMotion()
  return (
    <svg ref={ref} className="h-sv-disegno" viewBox="0 0 170 120" aria-hidden="true">
      {tratti.map((d, i) => (
        <motion.path
          key={d}
          d={d}
          initial={ridotto ? false : { pathLength: 0 }}
          animate={{ pathLength: visibile || ridotto ? 1 : 0 }}
          transition={{ duration: 1.6, delay: 0.25 + i * 0.35, ease: EASE }}
        />
      ))}
    </svg>
  )
}

/** Parola con contorno sotto e riempimento sopra: il riempimento cresce da sinistra con lo scroll. */
function TitoloCarta({ children, progresso }) {
  const ridotto = useReducedMotion()
  const taglio = useTransform(progresso, (v) => `inset(-6% ${100 - Math.min(Math.max(v, 0), 1) * 100}% -6% 0)`)
  return (
    <span className="h-sv-titolo">
      <span className="h-sv-contorno" aria-hidden="true">
        {children}
      </span>
      <motion.span className="h-sv-riempimento" style={ridotto ? undefined : { clipPath: taglio }}>
        {children}
      </motion.span>
    </span>
  )
}

function Carta({ voce, indice }) {
  const ref = useRef(null)
  const servizio = SERVIZI[voce.da]
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 95%', 'start 35%'] })
  return (
    <article ref={ref} className="h-sv-carta" style={{ '--i': indice }} data-cursore="">
      <div className="h-sv-colonna h-sv-sinistra">
        <span className="h-sv-numero" aria-hidden="true">
          0{indice + 1}
        </span>
        <Disegno tratti={voce.disegno} />
        <h3>
          <TitoloCarta progresso={scrollYProgress}>{voce.nome}</TitoloCarta>
        </h3>
      </div>
      <div className="h-sv-colonna h-sv-destra">
        <p className="h-sv-testo">{servizio.testo}</p>
        <ul className="h-sv-voci">
          {servizio.voci.map((v) => (
            <li key={v}>{v}</li>
          ))}
        </ul>
      </div>
    </article>
  )
}

export function ServiziChiaro() {
  const intesta = useRef(null)
  const dentro = useInView(intesta, { once: true, margin: '0px 0px -30% 0px' })
  return (
    <section className="h-sv" id="servizi" aria-labelledby="h-sv-titolo">
      <h2 id="h-sv-titolo" ref={intesta} className="h-sv-intesta">
        {/* "Dal sito al video," parte pieno e si svuota da sinistra; "sempre con me." parte vuoto e si riempie da destra */}
        <span className={`h-sv-riga h-sv-svuota ${dentro ? 'h-sv-scambiato' : ''}`}>
          <span className="h-sv-contorno">Dal sito al video,</span>
          <span className="h-sv-riempimento">Dal sito al video,</span>
        </span>
        <span className={`h-sv-riga h-sv-riempi ${dentro ? 'h-sv-scambiato' : ''}`}>
          <span className="h-sv-contorno">sempre con me.</span>
          <span className="h-sv-riempimento">sempre con me.</span>
        </span>
      </h2>

      <div className="h-sv-carte">
        {CARTE.map((voce, i) => (
          <Carta key={voce.nome} voce={voce} indice={i} />
        ))}
      </div>
    </section>
  )
}
