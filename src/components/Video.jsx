import { useRef, useState } from 'react'
import { motion } from 'motion/react'
import { Reveal } from '../ui/Reveal'
import { VIDEO } from './portfolio/video'

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
            <span className="text-white/40">da guardare senza uscire dal sito.</span>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:gap-8 xl:grid-cols-3">
          {VIDEO.map((video, i) => (
            <motion.article
              key={video.id}
              className="w-full max-w-[20rem]"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ duration: 0.7, delay: 0.06 * i, ease: EASE }}
            >
              {video.file ? <PlayerVideo video={video} /> : <PlayerInstagram video={video} />}

              <div className="mt-5">
                <h3 className="font-display text-[1.1875rem] font-semibold tracking-[-0.02em] text-white">
                  {video.titolo}
                </h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-white/55 text-pretty">
                  {video.descrizione}
                </p>
                {video.luogo && (
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-white/75">{video.luogo}</p>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

/** Player di Instagram ritagliato: sparisce l'intestazione e la barra in basso. */
function PlayerInstagram({ video }) {
  return (
    <div
      className="relative aspect-[9/16] overflow-hidden rounded-xl bg-ink-950 ring-1 ring-white/10"
      style={{ containerType: 'inline-size' }}
    >
      <iframe
        src={`https://www.instagram.com/p/${video.instagram}/embed/`}
        title={video.titolo}
        loading="lazy"
        allowFullScreen
        scrolling="no"
        className="absolute border-0"
        // Il riquadro è 9:16 come il video. L'embed ha il video (9:16) dentro un'area 4:5:
        // lo si allarga a 142% (1 / 0,703) e lo si centra, così il video riempie tutta la card.
        // Intestazione (54px) e barra (81px) restano fuori dal riquadro.
        style={{ width: '142.2cqw', left: '-21.1cqw', top: '-54px', height: 'calc(177.8cqw + 135px)' }}
      />
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
