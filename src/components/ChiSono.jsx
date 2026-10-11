import { useRef } from 'react'
import { motion } from 'motion/react'
import { Reveal } from '../ui/Reveal'
import { useParallax } from '../hooks/useParallax'
import { useLingua } from '../i18n/LinguaChiaro.jsx'

/* ============================================================================
   CHI SONO
   Due colonne: ritratto a sinistra, testo a destra (specchiata rispetto alla
   hero, così la pagina non risulta monotona). Su mobile si impilano.

   FOTO: `public/salvatore.jpg`. Per cambiarla basta sostituire quel file,
   mantenendo un taglio verticale 4:5.
   ========================================================================== */

export function ChiSono() {
  const { t } = useLingua()
  const c = t.scuro.chiSono
  const sezioneRef = useRef(null)

  // La foto si muove un po' più lenta del testo: dà profondità allo scroll
  const fotoY = useParallax(sezioneRef, { distance: 48 })

  return (
    <section id="chi-sono" ref={sezioneRef} className="relative">
      <div className="container-site section-y">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          {/* ============ RITRATTO ============ */}
          <motion.div style={{ y: fotoY }} className="lg:order-1">
            <Reveal y={28} duration={0.9}>
              <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-2xl bg-ink-950 ring-1 ring-white/10">
                <img
                  src="/salvatore.jpg"
                  alt={c.foto}
                  className="size-full object-cover"
                />
              </div>
            </Reveal>
          </motion.div>

          {/* ============ TESTO ============ */}
          <div className="lg:order-2">
            <Reveal y={16}>
              <p className="flex items-center gap-2.5 text-eyebrow uppercase text-white/55">
                <span className="inline-block size-1.5 rounded-full bg-accent-400" />
                {c.eyebrow}
              </p>
            </Reveal>

            <Reveal delay={0.1} as="h2" className="mt-7 text-title font-display text-balance">
              <span className="text-white">{c.t1}</span>{' '}
              <span className="text-white/40">{c.t2}</span>
            </Reveal>

            <Reveal delay={0.15}>
              <p className="mt-3 text-[0.8125rem] font-medium uppercase tracking-[0.14em] text-white/45">{c.autore}</p>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-7 space-y-5 text-lead text-white/60 text-pretty">
                {c.paragrafi.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
