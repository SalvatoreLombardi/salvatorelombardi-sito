import { EMAIL, IconaSocial, SOCIAL, TELEFONO_INTL, TELEFONO_LEGGIBILE } from '../components/contatti/dati'
import { vaiAllaSezione } from '../lib/scroll'

/* ============================================================================
   FOOTER
   Chiusura scura: stacca dal bianco del sito e dà un finale netto alla pagina.
   ========================================================================== */

const VOCI = [
  { id: 'servizi', label: 'Servizi' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'chi-sono', label: 'Chi sono' },
  { id: 'configuratore', label: 'Preventivo' },
  { id: 'contatti', label: 'Contatti' },
]

export function Footer() {
  const anno = new Date().getFullYear()
  const socialAttivi = SOCIAL.filter((s) => s.url)

  return (
    <footer className="bg-ink-950 text-ink-300">
      <div className="container-site py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          {/* --- Marchio --- */}
          <div>
            <p className="font-display text-[1.0625rem] font-semibold tracking-[-0.022em] text-white">
              Salvatore Lombardi
            </p>
            <p className="mt-3 max-w-xs text-[0.9375rem] leading-relaxed text-ink-500 text-pretty">
              Siti, ecommerce e app su misura. Grafica, video e social, con un solo
              interlocutore.
            </p>

            {socialAttivi.length > 0 && (
              <div className="mt-6 flex gap-2.5">
                {socialAttivi.map((social) => (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    className="flex size-10 items-center justify-center rounded-full border border-ink-800
                               text-ink-400 transition-colors duration-300
                               hover:border-ink-600 hover:text-white"
                  >
                    <IconaSocial id={social.id} className="size-[1.125rem]" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* --- Navigazione --- */}
          <nav>
            <p className="text-[0.6875rem] uppercase tracking-[0.08em] text-ink-600">Sezioni</p>
            <ul className="mt-4 space-y-2.5">
              {VOCI.map((voce) => (
                <li key={voce.id}>
                  <a
                    href={`#${voce.id}`}
                    onClick={(e) => vaiAllaSezione(e, voce.id)}
                    className="text-[0.9375rem] text-ink-400 transition-colors duration-300 hover:text-white"
                  >
                    {voce.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* --- Contatti --- */}
          <div>
            <p className="text-[0.6875rem] uppercase tracking-[0.08em] text-ink-600">Contatti</p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a
                  href={`tel:${TELEFONO_INTL}`}
                  className="text-[0.9375rem] text-ink-400 transition-colors duration-300 hover:text-white"
                >
                  {TELEFONO_LEGGIBILE}
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${TELEFONO_INTL.replace('+', '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[0.9375rem] text-ink-400 transition-colors duration-300 hover:text-white"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${EMAIL}`}
                  className="break-all text-[0.9375rem] text-ink-400 transition-colors duration-300 hover:text-white"
                >
                  {EMAIL}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* --- Riga finale --- */}
        <div className="mt-14 flex flex-col gap-2 border-t border-ink-800 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[0.8125rem] text-ink-600">
            © {anno} Salvatore Lombardi. Tutti i diritti riservati.
          </p>
          {/* TODO: quando apri la partita IVA, aggiungila qui accanto */}
          <p className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[0.8125rem] text-ink-600">
            <a href="#/privacy" className="transition-colors duration-300 hover:text-white">
              Privacy e cookie
            </a>
            <span>Gravina in Puglia, Italia</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
