import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Reveal } from '../ui/Reveal'
import { CATEGORIE, LAVORI } from './portfolio/lavori'
import { ModaleLavoro } from './portfolio/ModaleLavoro'
import { LogoConBolle } from './portfolio/LogoConBolle'

/* ============================================================================
   PORTFOLIO
   Griglia dei lavori con filtro per categoria. Le card si riposizionano con
   un'animazione quando cambi filtro (layout animation di Motion).
   I contenuti stanno in portfolio/lavori.js.
   ========================================================================== */

const EASE = [0.16, 1, 0.3, 1]

export function Portfolio() {
  const [filtro, setFiltro] = useState('tutti')

  const visibili =
    filtro === 'tutti' ? LAVORI : LAVORI.filter((lavoro) => lavoro.categoria === filtro)

  return (
    <section id="portfolio" className="relative">
      <div className="container-site section-y">
        {/* --- Intestazione --- */}
        <div className="max-w-2xl">
          <Reveal y={16}>
            <p className="flex items-center gap-2.5 text-eyebrow uppercase text-white/55">
              <span className="inline-block size-1.5 rounded-full bg-accent-400" />
              Portfolio
            </p>
          </Reveal>

          <Reveal delay={0.1} as="h2" className="mt-7 text-title font-display text-balance">
            <span className="text-white">Lavori recenti,</span>{' '}
            <span className="text-white/40">ognuno con uno scopo.</span>
          </Reveal>
        </div>

        {/* --- Filtri --- */}
        <Reveal delay={0.2} className="mt-10 flex flex-wrap gap-2">
          {CATEGORIE.map((categoria) => (
            <button
              key={categoria.id}
              type="button"
              onClick={() => setFiltro(categoria.id)}
              className={`rounded-full px-4 py-2 text-[0.875rem] transition-colors duration-300 ${
                filtro === categoria.id
                  ? 'bg-white text-ink-950'
                  : 'bg-white/[0.06] text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              {categoria.label}
            </button>
          ))}
        </Reveal>

        {/* --- Griglia --- */}
        <motion.div layout className="mt-12 grid gap-6 sm:grid-cols-2 lg:gap-8 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visibili.map((lavoro, i) => (
              <CardLavoro key={lavoro.id} lavoro={lavoro} indice={i} />
            ))}
          </AnimatePresence>
        </motion.div>

        {visibili.length === 0 && (
          <p className="mt-16 text-center text-white/40">Nessun lavoro in questa categoria.</p>
        )}
      </div>
    </section>
  )
}

/** Una singola card. Diventa un link solo se il progetto ha un indirizzo. */
function CardLavoro({ lavoro, indice }) {
  const [aperta, setAperta] = useState(false)
  // Il link è solo sull'immagine, così il bottone "Leggi di più" non finisce dentro un <a>
  const Immagine = lavoro.link ? 'a' : 'div'
  const propsImmagine = lavoro.link
    ? { href: lavoro.link, target: '_blank', rel: 'noreferrer' }
    : {}

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.7, delay: 0.06 * indice, ease: EASE }}
      className="group flex h-full flex-col"
    >
      {/* --- Immagine --- */}
      <Immagine
        {...propsImmagine}
        className="relative block aspect-[4/3] overflow-hidden rounded-xl bg-white/[0.04] ring-1 ring-white/10"
      >
        {lavoro.effetto === 'bolle' ? (
          <LogoConBolle lavoro={lavoro} />
        ) : lavoro.logo ? (
          // Solo il logo del cliente, centrato su un colore di sfondo
          <div
            className={`relative flex size-full items-center ${
              lavoro.mascotte ? 'justify-start p-8 pr-[44%]' : 'justify-center p-10'
            }`}
            style={{ backgroundColor: lavoro.sfondo }}
          >
            <img
              src={lavoro.logo}
              alt={lavoro.titolo}
              loading="lazy"
              className="max-h-full max-w-full object-contain transition-transform duration-700
                         ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
            />
            {/* Mascotte del progetto, in piedi sul bordo basso della card */}
            {lavoro.mascotte && (
              <img
                src={lavoro.mascotte}
                alt=""
                aria-hidden="true"
                loading="lazy"
                className="pointer-events-none absolute bottom-0 right-4 h-[86%] w-auto
                           transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
                           group-hover:-translate-y-1.5"
              />
            )}
          </div>
        ) : lavoro.immagine ? (
          <img
            src={lavoro.immagine}
            alt={lavoro.titolo}
            loading="lazy"
            className="size-full object-cover transition-transform duration-700
                       ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
          />
        ) : (
          <Segnaposto titolo={lavoro.titolo} piattaforma={lavoro.piattaforma} />
        )}

        {/* Freccina che compare all'hover, solo se il progetto è cliccabile */}
        {lavoro.link && (
          <span
            className="absolute right-4 top-4 flex size-9 items-center justify-center
                       rounded-full bg-white/90 text-ink-950 opacity-0 backdrop-blur
                       transition-all duration-500 group-hover:opacity-100"
          >
            <svg
              viewBox="0 0 20 20"
              className="size-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6 14 14 6m0 0H7m7 0v7" />
            </svg>
          </span>
        )}
      </Immagine>

      {/* --- Testo --- */}
      <div className="mt-5 flex flex-1 flex-col">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-display text-[1.1875rem] font-semibold tracking-[-0.02em] text-white">
            {lavoro.titolo}
          </h3>
          <span className="shrink-0 text-[0.8125rem] tabular-nums text-white/40">
            {lavoro.anno}
          </span>
        </div>

        <p className="mt-2 text-[0.9375rem] leading-relaxed text-white/55 text-pretty">
          {lavoro.descrizione}
        </p>

        {lavoro.completa && (
          // mt-auto: il bottone scende sempre in fondo alla card, alla stessa altezza delle altre
          <button
            type="button"
            onClick={() => setAperta(true)}
            className="mt-auto inline-flex self-start pt-4 items-center gap-1.5 text-[0.9375rem] font-medium text-accent-400
                       transition-colors duration-300 hover:text-white"
          >
            Leggi di più
            <svg
              viewBox="0 0 20 20"
              className="size-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M4 10h12m0 0-5.5-5.5M16 10l-5.5 5.5" />
            </svg>
          </button>
        )}
      </div>

      {lavoro.completa && (
        <ModaleLavoro lavoro={lavoro} aperta={aperta} onChiudi={() => setAperta(false)} />
      )}
    </motion.div>
  )
}

// Loghi dei canali social, disegnati a mano per non dipendere da librerie esterne
const LOGHI = {
  instagram: (
    <>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  facebook: (
    <path d="M14.5 8.5h2.2V5.3h-2.6c-2.4 0-3.9 1.5-3.9 4v2.2H7.8v3.2h2.4v7.8h3.4v-7.8h2.5l.5-3.2h-3v-1.8c0-.8.3-1.2 1-1.2Z" />
  ),
}

/** Riempitivo grafico per i progetti ancora senza foto */
function Segnaposto({ titolo, piattaforma }) {
  const logo = LOGHI[piattaforma]

  return (
    <div
      className="flex size-full items-center justify-center
                 bg-[linear-gradient(135deg,var(--color-accent-50)_0%,var(--color-ink-100)_55%,var(--color-ink-200)_100%)]"
    >
      {logo ? (
        <svg
          viewBox="0 0 24 24"
          className="size-16 text-white/80"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {logo}
        </svg>
      ) : (
        <span className="font-display text-5xl font-semibold text-white/70">
          {titolo.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  )
}
