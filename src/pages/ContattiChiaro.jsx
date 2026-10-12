import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useInView } from 'motion/react'
import { vaiAllaSezione } from '../lib/scroll.js'
import { useLingua } from '../i18n/LinguaChiaro.jsx'
import { ASSISTENTE_ATTIVO, apriAssistente } from '../lib/assistente.js'
import { IconaNuvoletta } from '../ui/IconaNuvoletta.jsx'
import { EMAIL, IconaSocial, SOCIAL, TELEFONO_INTL, TELEFONO_LEGGIBILE } from '../components/contatti/dati.jsx'

/* ============================================================================
   CONTATTI — lato chiaro.
   Chiusura scura, come l'ingresso: "Parliamone." grande (pieno che si svuota,
   vuoto che si riempie) e tre righe per raggiungermi. I dati sono quelli del
   sito scuro (`components/contatti/dati.jsx`): un solo punto da modificare.
   ========================================================================== */

export function ContattiChiaro() {
  const { t } = useLingua()
  const c = t.contatti
  const CANALI = [
    { id: 'telefono', valore: TELEFONO_LEGGIBILE, href: `tel:${TELEFONO_INTL}` },
    { id: 'whatsapp', valore: TELEFONO_LEGGIBILE, href: `https://wa.me/${TELEFONO_INTL.replace('+', '')}`, esterno: true },
    { id: 'email', valore: EMAIL, href: `mailto:${EMAIL}` },
  ]
  const intesta = useRef(null)
  const dentro = useInView(intesta, { once: true, margin: '0px 0px -30% 0px' })
  const social = SOCIAL.filter((s) => s.url)
  const anno = new Date().getFullYear()

  return (
    <section className="h-ct" id="contatti" aria-labelledby="h-ct-titolo">
      <h2 id="h-ct-titolo" ref={intesta} className="h-sv-intesta h-ct-intesta">
        {/* "Parliamone." parte pieno e si svuota da sinistra; la seconda riga parte vuota e si riempie da destra */}
        <span className={`h-sv-riga h-sv-svuota ${dentro ? 'h-sv-scambiato' : ''}`}>
          <span className="h-sv-contorno">{c.titolo1}</span>
          <span className="h-sv-riempimento">{c.titolo1}</span>
        </span>
        <span className={`h-sv-riga h-sv-riempi ${dentro ? 'h-sv-scambiato' : ''}`}>
          <span className="h-sv-contorno">{c.titolo2}</span>
          <span className="h-sv-riempimento">{c.titolo2}</span>
        </span>
      </h2>

      <p className="h-ct-testo">
        {c.testoA}
        <a href="#preventivo" onClick={(e) => vaiAllaSezione(e, 'preventivo')}>{c.testoLink}</a>
        {c.testoB}
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
              <span className="h-ct-etichetta">{c.canali[canale.id].etichetta}</span>
              <span className="h-ct-valore">{canale.valore}</span>
              <span className="h-ct-nota">{c.canali[canale.id].nota}</span>
              <span className="h-ct-freccia" aria-hidden="true">
                →
              </span>
            </a>
          </li>
        ))}
      </ul>

      {ASSISTENTE_ATTIVO && (
        <p className="h-ct-assistente">
          <button type="button" onClick={apriAssistente} data-cursore="">
            <IconaNuvoletta />
            {c.assistente}
          </button>
        </p>
      )}

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
          <Link to="/privacy">{c.privacy}</Link>
          <span>{c.luogo}</span>
        </p>
      </footer>
    </section>
  )
}
