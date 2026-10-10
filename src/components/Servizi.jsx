import { Reveal } from '../ui/Reveal'

/* ============================================================================
   SERVIZI — le tre cose che offri.
   Usa gli stessi token e lo stesso Reveal della hero: il sistema è già pronto,
   qui si aggiunge solo il contenuto.
   ========================================================================== */

// Contenuto separato dal markup: per cambiare un testo non si tocca la grafica.
const SERVIZI = [
  {
    titolo: 'Sviluppo web',
    testo:
      'Siti, ecommerce e app per i tuoi clienti. Veloci, sicuri e facili da gestire in autonomia.',
    voci: ['Siti vetrina e one page', 'Ecommerce', 'App mobile e PWA per i tuoi clienti', 'Manutenzione e assistenza'],
    // Icona: parentesi angolari, il segno più immediato per "codice"
    icona: (
      <>
        <path d="M8 6.5 2.5 12 8 17.5" />
        <path d="M16 6.5 21.5 12 16 17.5" />
      </>
    ),
  },
  {
    titolo: 'Graphic design',
    testo:
      'Logo, identità visiva e materiali grafici. Un’immagine coerente che ti fa riconoscere ovunque.',
    voci: ['Logo e brand identity', 'Materiale stampa', 'Grafiche per il web', 'Presentazioni'],
    // Icona: livelli sovrapposti
    icona: (
      <>
        <path d="M12 3 3 8l9 5 9-5-9-5Z" />
        <path d="m3 14 9 5 9-5" />
      </>
    ),
  },
  {
    titolo: 'Social media management',
    testo:
      'Strategia, contenuti e pubblicazione. I tuoi canali curati con continuità, per crescere nel tempo.',
    voci: [
      'Strategia e obiettivi',
      'Piano editoriale',
      'Creazione contenuti',
      'Pubblicazione e community',
      'Analisi e crescita',
    ],
    // Icona: bolla di conversazione
    icona: (
      <>
        <path d="M21 11.5a8 8 0 0 1-11.5 7.2L3.5 20.5l1.8-6A8 8 0 1 1 21 11.5Z" />
      </>
    ),
  },
  {
    titolo: 'Video making',
    testo:
      'Riprese e montaggio. Dal video promozionale ai contenuti verticali per i social, anche con riprese aeree con il drone.',
    voci: ['Riprese video', 'Riprese con drone', 'Montaggio e color', 'Video promozionali', 'Contenuti per social'],
    // Icona: cinepresa
    icona: (
      <>
        <rect x="2.5" y="6.5" width="12" height="11" rx="2.5" />
        <path d="m14.5 10.5 5-2.8v8.6l-5-2.8z" />
      </>
    ),
  },
]

export function Servizi() {
  return (
    <section id="servizi" className="relative">
      <div className="container-site section-y">
        {/* --- Intestazione della sezione --- */}
        <div className="max-w-2xl">
          <Reveal y={16}>
            <p className="flex items-center gap-2.5 text-eyebrow uppercase text-white/55">
              <span className="inline-block size-1.5 rounded-full bg-accent-400" />
              Servizi
            </p>
          </Reveal>

          <Reveal delay={0.1} as="h2" className="mt-7 text-title font-display text-balance">
            <span className="text-white">Quello che ti serve,</span>{' '}
            <span className="text-white/40">dal sito ai social.</span>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mt-6 text-lead text-white/55 text-pretty">
              Che ti serva solo un sito o l’intera presenza online, parti da un preventivo
              chiaro e senza sorprese.
            </p>
          </Reveal>
        </div>

        {/* --- Le tre card --- */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:gap-8 xl:grid-cols-4">
          {SERVIZI.map((servizio, i) => (
            <Reveal
              key={servizio.titolo}
              // Cascata: ogni card entra poco dopo la precedente
              delay={0.1 * i}
              className="group flex flex-col rounded-xl border border-white/10 bg-white/[0.04] p-8
                         backdrop-blur-sm transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
                         hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06]
                         hover:shadow-[0_25px_70px_-25px_rgba(20,184,166,0.35)]"
            >
              {/* Icona in un quadrato tenue, l'accento arriva al passaggio del mouse */}
              <span
                className="flex size-12 items-center justify-center rounded-md bg-white/[0.06]
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
                  {servizio.icona}
                </svg>
              </span>

              <h3 className="mt-7 font-display text-[1.375rem] font-semibold tracking-[-0.02em] text-white">
                {servizio.titolo}
              </h3>

              <p className="mt-3 text-[0.9375rem] leading-relaxed text-white/55 text-pretty">
                {servizio.testo}
              </p>

              {/* Elenco delle attività incluse */}
              <ul className="mt-7 space-y-2.5 border-t border-white/10 pt-7">
                {servizio.voci.map((voce) => (
                  <li key={voce} className="flex items-start gap-3 text-[0.9375rem] text-white/70">
                    <svg
                      viewBox="0 0 16 16"
                      className="mt-1 size-3.5 shrink-0 text-accent-500"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="m3 8.5 3.2 3.2L13 5" />
                    </svg>
                    {voce}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
