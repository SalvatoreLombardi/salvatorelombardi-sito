import { Reveal } from '../../ui/Reveal'
import { DETTAGLI_IDENTITARIO } from './lavori'

/* ============================================================================
   CAROSELLO DEI DETTAGLI
   Fascia di immagini che scorre da sola in loop. Si ferma al passaggio del
   mouse. Chi ha "riduci animazioni" attivo la scorre a mano (vedi index.css).
   Le immagini si duplicano per far combaciare la fine con l'inizio.
   ========================================================================== */

export function CaroselloDettagli() {
  const elenco = [...DETTAGLI_IDENTITARIO, ...DETTAGLI_IDENTITARIO]

  return (
    <div className="mt-24">
      <Reveal y={16}>
        <p className="flex items-center gap-2.5 text-eyebrow uppercase text-white/55">
          <span className="inline-block size-1.5 rounded-full bg-accent-400" />
          Dettagli · Identitario
        </p>
      </Reveal>

      <div className="carosello mt-8 -mx-6 md:-mx-10 overflow-hidden">
        <div className="carosello-pista flex w-max">
          {elenco.map((dettaglio, i) => (
            <img
              key={i}
              src={dettaglio.src}
              alt={i < DETTAGLI_IDENTITARIO.length ? dettaglio.alt : ''}
              aria-hidden={i >= DETTAGLI_IDENTITARIO.length ? true : undefined}
              loading="lazy"
              draggable="false"
              className="mr-6 h-56 w-auto shrink-0 rounded-xl ring-1 ring-white/10 sm:h-72"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
