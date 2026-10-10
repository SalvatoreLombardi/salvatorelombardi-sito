import { useEffect, useRef, useState } from 'react'
import { animate, motion, useInView, useReducedMotion } from 'motion/react'
import { Reveal } from '../ui/Reveal'
import { NOTA_MUSICA, VIDEO } from './portfolio/video'
import { ModaleLavoro } from './portfolio/ModaleLavoro'

/* ============================================================================
   SEZIONE VIDEO
   Card con i video dei social: chi visita il sito li guarda qui, senza andare
   su Instagram. I contenuti stanno in portfolio/video.js.
   ========================================================================== */

const EASE = [0.16, 1, 0.3, 1]

export function Video() {
  return (
    <section id="video" className="relative">
      <div className="container-site pb-24 sm:pb-32">
        <div className="max-w-2xl">
          <Reveal y={16}>
            <p className="flex items-center gap-2.5 text-eyebrow uppercase text-white/55">
              <span className="inline-block size-1.5 rounded-full bg-accent-400" />
              Video
            </p>
          </Reveal>

          <Reveal delay={0.1} as="h2" className="mt-7 text-title font-display text-balance">
            <span className="text-white">Video recenti,</span>{' '}
            <span className="text-white/40">riprese aeree, dettagli e montaggio.</span>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:gap-8 xl:grid-cols-3">
          {VIDEO.map((video, i) => (
            <CardVideo key={video.id} video={video} indice={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

/** Player di Instagram ritagliato: sparisce l'intestazione e la barra in basso.
    Instagram è un servizio di terzi: finché la persona non clicca "Carica il
    video" non carichiamo nulla (niente cookie, niente IP trasmesso). */
function PlayerInstagram({ video }) {
  const [caricato, setCaricato] = useState(false)

  return (
    <div
      className="relative aspect-[9/16] overflow-hidden rounded-xl bg-ink-950 ring-1 ring-white/10"
      style={{ containerType: 'inline-size' }}
    >
      {caricato ? (
        <iframe
          src={`https://www.instagram.com/p/${video.instagram}/embed/`}
          title={video.titolo}
          allowFullScreen
          scrolling="no"
          className="absolute border-0"
          // Il riquadro è 9:16 come il video. L'embed ha il video (9:16) dentro un'area 4:5:
          // lo si allarga a 142% (1 / 0,703) e lo si centra, così il video riempie tutta la card.
          // Intestazione (54px) e barra (81px) restano fuori dal riquadro.
          style={{ width: '142.2cqw', left: '-21.1cqw', top: '-54px', height: 'calc(177.8cqw + 135px)' }}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
          {/* Copertina del video (immagine nostra in public/video/, campo `anteprima`), scurita per far leggere il testo */}
          {video.anteprima && (
            <>
              <img
                src={video.anteprima}
                alt=""
                loading="lazy"
                className="absolute inset-0 size-full object-cover"
              />
              <div className="absolute inset-0 bg-ink-950/65" />
            </>
          )}
          <p className="relative text-[0.9375rem] font-medium text-white/90">{video.titolo}</p>
          <p className="relative text-[0.8125rem] leading-relaxed text-white/60 text-pretty">
            Il video è ospitato da Instagram. Caricandolo, Instagram può ricevere il tuo indirizzo IP
            e usare cookie.{' '}
            <a href="#/privacy" className="underline underline-offset-2 hover:text-white">
              Dettagli
            </a>
          </p>
          <button
            type="button"
            onClick={() => setCaricato(true)}
            className="vetro-verde relative inline-flex h-11 items-center rounded-full px-6 text-[0.9375rem] font-medium"
          >
            Carica il video
          </button>
        </div>
      )}
    </div>
  )
}

/** Player del sito: copertina, video e bottone verde di vetro sotto. */
function PlayerVideo({ video }) {
  const ref = useRef(null)
  const [inRiproduzione, setInRiproduzione] = useState(false)

  const alterna = () => {
    const el = ref.current
    if (!el) return
    if (el.paused) el.play()
    else el.pause()
  }

  return (
    <div>
      <div className="relative aspect-[9/16] overflow-hidden rounded-xl bg-ink-950 ring-1 ring-white/10">
        <video
          ref={ref}
          src={video.file}
          poster={video.anteprima}
          playsInline
          preload="metadata"
          onClick={alterna}
          onPlay={() => setInRiproduzione(true)}
          onPause={() => setInRiproduzione(false)}
          onEnded={() => setInRiproduzione(false)}
          className="size-full cursor-pointer object-cover"
        />
      </div>

      <button
        type="button"
        onClick={alterna}
        className="vetro-verde mt-4 inline-flex h-11 items-center gap-2.5 rounded-full px-6 text-[0.9375rem] font-medium"
      >
        {inRiproduzione ? (
          <svg viewBox="0 0 20 20" className="size-4" fill="currentColor" aria-hidden="true">
            <rect x="5" y="4" width="3.4" height="12" rx="1" />
            <rect x="11.6" y="4" width="3.4" height="12" rx="1" />
          </svg>
        ) : (
          <svg viewBox="0 0 20 20" className="size-4" fill="currentColor" aria-hidden="true">
            <path d="M6 3.8v12.4a.8.8 0 0 0 1.2.7l10-6.2a.8.8 0 0 0 0-1.4l-10-6.2A.8.8 0 0 0 6 3.8Z" />
          </svg>
        )}
        {inRiproduzione ? 'Pausa' : 'Guarda il video'}
      </button>
    </div>
  )
}

/** Numero di visualizzazioni: sale da 0 al valore quando entra nello schermo.
 *  Sopra le mille si scrive "mila" (352 mila), sopra il milione "milioni". */
function Visualizzazioni({ valore }) {
  const ref = useRef(null)
  const visibile = useInView(ref, { once: true, margin: '-10% 0px' })
  const prefersReducedMotion = useReducedMotion()

  // Il numero che si vede e la parola che lo segue: 352000 -> 352 + "mila"
  const [divisore, unita] =
    valore >= 1_000_000 ? [1_000_000, 'milioni'] : valore >= 1000 ? [1000, 'mila'] : [1, '']
  const arrivo = valore / divisore
  const decimali = Number.isInteger(arrivo) ? 0 : 1

  const [mostrato, setMostrato] = useState(prefersReducedMotion ? arrivo : 0)

  useEffect(() => {
    if (!visibile || prefersReducedMotion) return
    const controllo = animate(0, arrivo, {
      duration: 2.2,
      ease: EASE,
      onUpdate: (v) => setMostrato(v),
    })
    return () => controllo.stop()
  }, [visibile, arrivo, prefersReducedMotion])

  const numero = mostrato.toLocaleString('it-IT', {
    minimumFractionDigits: decimali,
    maximumFractionDigits: decimali,
  })

  return (
    <p ref={ref} className="mt-3 flex items-baseline gap-2">
      <span className="font-display text-[1.75rem] font-semibold tabular-nums tracking-[-0.02em] text-accent-400">
        {numero}
        {unita && ` ${unita}`}
      </span>
      <span className="text-[0.875rem] text-white/55">visualizzazioni</span>
    </p>
  )
}

/** Pin della posizione, disegnato per il sito: linea sottile nel turchese. */
function PinLuogo() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="mt-[0.2rem] size-[1.125rem] shrink-0 text-accent-400"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 21.5s-7-6.1-7-11.6a7 7 0 0 1 14 0c0 5.5-7 11.6-7 11.6Z" />
      <circle cx="12" cy="9.8" r="2.6" fill="currentColor" stroke="none" />
    </svg>
  )
}

/** Una card: video, titolo, descrizione, luogo, "Leggi di più" e visualizzazioni. */
function CardVideo({ video, indice }) {
  const [aperta, setAperta] = useState(false)

  return (
    <motion.article
      className="mx-auto flex h-full w-full max-w-[20rem] flex-col sm:mx-0"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.7, delay: 0.06 * indice, ease: EASE }}
    >
      {video.file ? <PlayerVideo video={video} /> : <PlayerInstagram video={video} />}

      <div className="mt-5 flex flex-1 flex-col">
        <h3 className="font-display text-[1.1875rem] font-semibold tracking-[-0.02em] text-white">
          {video.titolo}
        </h3>
        <p className="mt-2 text-[0.9375rem] leading-relaxed text-white/55 text-pretty">
          {video.descrizione}
        </p>
        {video.luogo && (
          <p className="mt-2 flex items-start gap-2 text-[0.9375rem] leading-relaxed text-white/75">
            <PinLuogo />
            <span>{video.luogo}</span>
          </p>
        )}

        {/* Parte bassa: sempre in fondo alla card, così "Leggi di più" e il numero
            stanno alla stessa altezza in tutte le card della riga */}
        <div className="mt-auto flex flex-col pt-4">
        {video.testo && (
          <>
            <button
              type="button"
              onClick={() => setAperta(true)}
              className="inline-flex items-center gap-1.5 self-start text-[0.9375rem] font-medium text-accent-400
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
            <ModaleLavoro
              lavoro={{
                titolo: video.titolo,
                completa: { paragrafi: video.testo, nota: NOTA_MUSICA },
                link: `https://www.instagram.com/p/${video.instagram}/`,
                testoLink: 'Vai su Instagram',
              }}
              aperta={aperta}
              onChiudi={() => setAperta(false)}
            />
          </>
        )}

          {video.visualizzazioni && <Visualizzazioni valore={video.visualizzazioni} />}
        </div>
      </div>
    </motion.article>
  )
}
