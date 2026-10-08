import { Reveal } from '../ui/Reveal'
import {
  EMAIL,
  IconaSocial,
  SOCIAL,
  TELEFONO_INTL,
  TELEFONO_LEGGIBILE,
} from './contatti/dati'

/* ============================================================================
   CONTATTI
   Tre modi diretti per raggiungerti, uno per card. I dati vengono da
   contatti/dati.jsx, condivisi con il footer.
   ========================================================================== */

// Icone dei canali di contatto
const ICONE = {
  telefono: <path d="M6.5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7 2 2 0 0 1 6.5 3.5Z" />,
  whatsapp: (
    <>
      <path d="M3.5 20.5 5 16.2A8.5 8.5 0 1 1 8 19.2l-4.5 1.3Z" />
      <path d="M9 9.2c.3 1 .8 1.9 1.5 2.6.7.7 1.6 1.2 2.6 1.5l.9-1.1 2 .8v1.4a1 1 0 0 1-1.1 1 8 8 0 0 1-7-7 1 1 0 0 1 1-1.1h1.4l.8 2L9 9.2Z" />
    </>
  ),
  email: (
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="3" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </>
  ),
}

export function Contatti() {
  const canali = [
    {
      id: 'telefono',
      etichetta: 'Telefono',
      valore: TELEFONO_LEGGIBILE,
      nota: 'Chiamami, rispondo io',
      href: `tel:${TELEFONO_INTL}`,
    },
    {
      id: 'whatsapp',
      etichetta: 'WhatsApp',
      valore: TELEFONO_LEGGIBILE,
      nota: 'Scrivimi quando vuoi',
      // wa.me vuole il numero senza + e senza spazi
      href: `https://wa.me/${TELEFONO_INTL.replace('+', '')}`,
      esterno: true,
    },
    {
      id: 'email',
      etichetta: 'Email',
      valore: EMAIL,
      nota: 'Per preventivi e documenti',
      href: `mailto:${EMAIL}`,
    },
  ]

  const socialAttivi = SOCIAL.filter((s) => s.url)

  return (
    <section id="contatti" className="relative">
      <div className="container-site section-y">
        {/* --- Intestazione --- */}
        <div className="max-w-2xl">
          <Reveal y={16}>
            <p className="flex items-center gap-2.5 text-eyebrow uppercase text-white/55">
              <span className="inline-block size-1.5 rounded-full bg-accent-400" />
              Contatti
            </p>
          </Reveal>

          <Reveal delay={0.1} as="h2" className="mt-7 text-title font-display text-balance">
            <span className="text-white">Parliamone.</span>{' '}
            <span className="text-white/40">Il primo confronto non si paga.</span>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mt-6 text-lead text-white/55 text-pretty">
              Se preferisci partire dal preventivo, il configuratore qui sopra fa metà del
              lavoro. Altrimenti scegli il canale che ti è più comodo.
            </p>
          </Reveal>
        </div>

        {/* --- Canali --- */}
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {canali.map((canale, i) => (
            <Reveal key={canale.id} delay={0.1 * i}>
              <a
                href={canale.href}
                target={canale.esterno ? '_blank' : undefined}
                rel={canale.esterno ? 'noreferrer' : undefined}
                className="group flex h-full flex-col rounded-xl border border-white/10 bg-white/[0.04] p-7
                           backdrop-blur-sm transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
                           hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06]
                           hover:shadow-[0_25px_70px_-25px_rgba(20,184,166,0.35)]"
              >
                <span
                  className="flex size-11 items-center justify-center rounded-md bg-white/[0.06]
                             text-white/70 transition-colors duration-500
                             group-hover:bg-accent-500/15 group-hover:text-accent-400"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="size-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    {ICONE[canale.id]}
                  </svg>
                </span>

                <span className="mt-6 text-[0.6875rem] uppercase tracking-[0.08em] text-white/40">
                  {canale.etichetta}
                </span>
                <span className="mt-1.5 font-display text-[1.1875rem] font-semibold tracking-[-0.02em] text-white">
                  {canale.valore}
                </span>
                <span className="mt-1 text-[0.875rem] text-white/55">{canale.nota}</span>
              </a>
            </Reveal>
          ))}
        </div>

        {/* --- Social (compaiono solo quando gli indirizzi sono impostati) --- */}
        {socialAttivi.length > 0 && (
          <Reveal delay={0.35}>
            <div className="mt-12 flex items-center gap-4 border-t border-white/10 pt-10">
              <span className="text-[0.875rem] text-white/55">Seguimi su</span>
              <div className="flex gap-2.5">
                {socialAttivi.map((social) => (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    className="flex size-11 items-center justify-center rounded-full border border-white/15
                               text-white/60 transition-all duration-300
                               hover:-translate-y-0.5 hover:border-white/40 hover:text-white"
                  >
                    <IconaSocial id={social.id} />
                  </a>
                ))}
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  )
}
