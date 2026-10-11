import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useInView } from 'motion/react'
import { EMAIL, IconaSocial, SOCIAL, TELEFONO_INTL, TELEFONO_LEGGIBILE } from '../components/contatti/dati.jsx'

/* ============================================================================
   CONTATTI — lato chiaro.
   Chiusura scura, come l'ingresso: "Parliamone." grande (pieno che si svuota,
   vuoto che si riempie) e tre righe per raggiungermi. I dati sono quelli del
   sito scuro (`components/contatti/dati.jsx`): un solo punto da modificare.
   ========================================================================== */

const CANALI = [
  { id: 'telefono', etichetta: 'Telefono', valore: TELEFONO_LEGGIBILE, nota: 'Chiamami, rispondo io', href: `tel:${TELEFONO_INTL}` },
  {
    id: 'whatsapp',
    etichetta: 'WhatsApp',
    valore: TELEFONO_LEGGIBILE,
    nota: 'Scrivimi quando vuoi',
    href: `https://wa.me/${TELEFONO_INTL.replace('+', '')}`,
    esterno: true,
  },
  { id: 'email', etichetta: 'Email', valore: EMAIL, nota: 'Per preventivi e documenti', href: `mailto:${EMAIL}` },
]

export function ContattiChiaro() {
  const intesta = useRef(null)
  const dentro = useInView(intesta, { once: true, margin: '0px 0px -30% 0px' })
  const social = SOCIAL.filter((s) => s.url)
  const anno = new Date().getFullYear()

  return (
    <section className="h-ct" id="contatti" aria-labelledby="h-ct-titolo">
      <h2 id="h-ct-titolo" ref={intesta} className="h-sv-intesta h-ct-intesta">
        {/* "Parliamone." parte pieno e si svuota da sinistra; la seconda riga parte vuota e si riempie da destra */}
        <span className={`h-sv-riga h-sv-svuota ${dentro ? 'h-sv-scambiato' : ''}`}>
          <span className="h-sv-contorno">Parliamone.</span>
          <span className="h-sv-riempimento">Parliamone.</span>
        </span>
        <span className={`h-sv-riga h-sv-riempi ${dentro ? 'h-sv-scambiato' : ''}`}>
          <span className="h-sv-contorno">Scegli come.</span>
          <span className="h-sv-riempimento">Scegli come.</span>
        </span>
      </h2>

      <p className="h-ct-testo">
        Il primo confronto non si paga. Se preferisci partire dal progetto,{' '}
        <a href="#preventivo">il preventivo</a> fa metà del lavoro.
      </p>

      <ul className="h-ct-canali">
        {CANALI.map((canale) => (
          <li key={canale.id}>
            <a
              className="h-ct-riga"
              href={canale.href}
              target={canale.esterno ? '_blank' : undefined}
              rel={canale.esterno ? 'noreferrer' : undefined}
              data-cursore=""
            >
              <span className="h-ct-etichetta">{canale.etichetta}</span>
              <span className="h-ct-valore">{canale.valore}</span>
              <span className="h-ct-nota">{canale.nota}</span>
              <span className="h-ct-freccia" aria-hidden="true">
                →
              </span>
            </a>
          </li>
        ))}
      </ul>

      {social.length > 0 && (
        <p className="h-ct-social">
          {social.map((s) => (
            <a key={s.id} href={s.url} target="_blank" rel="noreferrer" aria-label={s.label}>
              <IconaSocial id={s.id} className="size-5" />
            </a>
          ))}
        </p>
      )}

      <footer className="h-ct-fine">
        <p>© {anno} Salvatore Lombardi</p>
        <p>
          <Link to="/privacy">Privacy e cookie</Link>
          <span>Gravina in Puglia, Italia</span>
        </p>
      </footer>
    </section>
  )
}
