import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react'
import { COLONNE_RICHIESTE, passiPer } from '../components/configuratore/steps.js'
import { supabase, supabaseAttivo } from '../lib/supabase.js'

/* ============================================================================
   PREVENTIVO — lato chiaro.
   Il configuratore del lato chiaro: dopo la prima domanda le altre cambiano in base
   al tipo di progetto (sito, video, social). Salva nella tabella `richieste` di
   Supabase: le risposte con una colonna propria vanno lì, le altre nel campo
   `dettagli` (vedi supabase/aggiornamento-dettagli.sql, da eseguire una volta).
   Le domande stanno in `components/configuratore/steps.js`.
   La logica è quella di `components/Configuratore.jsx`: se cambia un controllo
   o un campo da salvare, va aggiornato in entrambi.
   ========================================================================== */

const EASE = [0.16, 1, 0.3, 1]

/** Un gruppo di opzioni (una sola scelta). I radio veri restano nascosti: funzionano tastiera e lettori di schermo. */
function Scelta({ campo, valore, onChange }) {
  const multipla = !!campo.multipla
  const attive = multipla ? (Array.isArray(valore) ? valore : []) : [valore]
  const cambia = (v) => {
    if (!multipla) return onChange(campo.nome, v)
    onChange(campo.nome, attive.includes(v) ? attive.filter((x) => x !== v) : [...attive, v])
  }
  return (
    <fieldset className="h-pv-gruppo">
      {campo.titolo && <legend>{campo.titolo}</legend>}
      <div className="h-pv-opzioni">
        {campo.opzioni.map((o) => {
          const sel = attive.includes(o.valore)
          return (
            <label key={o.valore} className={`h-pv-opz ${sel ? 'h-pv-sel' : ''}`} data-cursore="">
              <input
                type={multipla ? 'checkbox' : 'radio'}
                name={campo.nome}
                value={o.valore}
                checked={sel}
                onChange={() => cambia(o.valore)}
              />
              <span className="h-pv-ol">{o.label}</span>
              {o.nota && <span className="h-pv-on">{o.nota}</span>}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

/** Campo di testo o email: solo la linea sotto, scrittura grande. */
function Testo({ campo, valore, onChange }) {
  return (
    <div className="h-pv-campo">
      <label htmlFor={`pv-${campo.nome}`}>
        {campo.titolo}
        {!campo.obbligatorio && <em> (facoltativo)</em>}
      </label>
      <input
        id={`pv-${campo.nome}`}
        name={campo.nome}
        type={campo.tipo === 'email' ? 'email' : campo.tipo === 'data' ? 'date' : 'text'}
        value={valore ?? ''}
        placeholder={campo.placeholder}
        maxLength={campo.tipo === 'email' ? 254 : 100}
        onChange={(e) => onChange(campo.nome, e.target.value)}
      />
    </div>
  )
}

/** Linea a matita che si disegna man mano che si avanza. */
function Avanzamento({ quota }) {
  const ridotto = useReducedMotion()
  return (
    <svg className="h-pv-linea" viewBox="0 0 600 12" preserveAspectRatio="none" aria-hidden="true">
      <path className="h-pv-linea-fondo" d="M2 6C60 2 100 10 160 6S260 3 320 7S430 9 490 5S570 6 598 6" />
      <motion.path
        d="M2 6C60 2 100 10 160 6S260 3 320 7S430 9 490 5S570 6 598 6"
        initial={false}
        animate={{ pathLength: quota }}
        transition={{ duration: ridotto ? 0 : 0.7, ease: EASE }}
      />
    </svg>
  )
}

export function PreventivoChiaro() {
  const ridotto = useReducedMotion()
  const intesta = useRef(null)
  const dentro = useInView(intesta, { once: true, margin: '0px 0px -30% 0px' })

  const [passo, setPasso] = useState(0)
  const [direzione, setDirezione] = useState(1) // da che parte entra la schermata (+1 avanti, -1 indietro)
  const [dati, setDati] = useState({})
  const [inviato, setInviato] = useState(false)
  const [invioInCorso, setInvioInCorso] = useState(false)
  const [errore, setErrore] = useState(null)
  const [lettoPrivacy, setLettoPrivacy] = useState(false)
  const [trappola, setTrappola] = useState('') // campo nascosto: le persone non lo riempiono, i bot sì

  // I passi dipendono dal tipo di progetto scelto al primo passo
  const passi = passiPer(dati.tipoProgetto)
  const step = passi[passo]
  const ultimo = passo === passi.length - 1
  const aggiorna = (nome, valore) => setDati((p) => ({ ...p, [nome]: valore }))

  // Si prosegue solo con tutti i campi obbligatori pieni (e un'email che somigli a un'email)
  const completo = step.campi.every((campo) => {
    if (!campo.obbligatorio) return true
    const v = dati[campo.nome]
    if (!v || (Array.isArray(v) && v.length === 0)) return false
    if (campo.tipo === 'email') return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
    return true
  })

  const avanti = () => {
    if (!completo) return
    setDirezione(1)
    setPasso((p) => Math.min(p + 1, passi.length - 1))
  }
  const indietro = () => {
    setDirezione(-1)
    setPasso((p) => Math.max(p - 1, 0))
  }

  const invia = async (e) => {
    e.preventDefault()
    if (!completo || invioInCorso || !lettoPrivacy) return
    setErrore(null)
    if (trappola) {
      setInviato(true) // un bot: facciamo finta di niente e non salviamo
      return
    }
    if (!supabaseAttivo) {
      setErrore('Invio non ancora collegato: mancano le credenziali Supabase in .env.local')
      return
    }
    setInvioInCorso(true)
    // Le risposte senza colonna propria (quelle specifiche di sito, video o social) vanno in `dettagli`;
    // si prendono solo i campi del percorso scelto, non quelli di un percorso abbandonato tornando indietro
    const dettagli = {}
    for (const passoFatto of passi) {
      for (const campo of passoFatto.campi) {
        const v = dati[campo.nome]
        if (COLONNE_RICHIESTE.includes(campo.nome) || v === undefined || (Array.isArray(v) && v.length === 0)) continue
        dettagli[campo.nome] = v
      }
    }
    // I nomi delle colonne seguono lo schema in supabase/schema.sql
    const { error } = await supabase.from('richieste').insert({
      dettagli,
      tipo_progetto: dati.tipoProgetto,
      stile: dati.stile,
      palette: dati.palette,
      angoli: dati.angoli,
      foto: dati.foto,
      testi: dati.testi,
      logo: dati.logo,
      nome: dati.nome,
      email: dati.email,
    })
    setInvioInCorso(false)
    if (error) {
      console.error('Errore invio richiesta:', error)
      setErrore('Non sono riuscito a inviare la richiesta. Riprova fra poco.')
      return
    }
    setInviato(true)
  }

  const scorri = ridotto ? 0 : 40
  const bloccato = !completo || invioInCorso || (ultimo && !lettoPrivacy)

  return (
    <section className="h-pv" id="preventivo" aria-labelledby="h-pv-titolo">
      <h2 id="h-pv-titolo" ref={intesta} className="h-sv-intesta h-pv-intesta">
        <span className={`h-sv-riga h-sv-svuota ${dentro ? 'h-sv-scambiato' : ''}`}>
          <span className="h-sv-contorno">Poche domande,</span>
          <span className="h-sv-riempimento">Poche domande,</span>
        </span>
        <span className={`h-sv-riga h-sv-riempi ${dentro ? 'h-sv-scambiato' : ''}`}>
          <span className="h-sv-contorno">e il preventivo è in arrivo.</span>
          <span className="h-sv-riempimento">e il preventivo è in arrivo.</span>
        </span>
      </h2>

      <div className="h-pv-pannello">
        {inviato ? (
          <motion.div className="h-pv-grazie" initial={ridotto ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>
            <svg viewBox="0 0 120 90" className="h-pv-spunta" aria-hidden="true">
              <motion.path
                d="M10 48C26 56 34 66 44 78C62 50 88 24 112 10"
                initial={ridotto ? false : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, delay: 0.3, ease: EASE }}
              />
            </svg>
            <h3>Richiesta ricevuta</h3>
            <p>Ti mando il preventivo entro 24 ore all’indirizzo che hai indicato.</p>
          </motion.div>
        ) : (
          <form onSubmit={invia}>
            <div className="h-pv-testa">
              <span className="h-pv-quanto">
                {passo + 1} / {passi.length}
              </span>
              <Avanzamento quota={(passo + 1) / passi.length} />
            </div>

            <div className="h-pv-corpo">
              <AnimatePresence mode="wait" initial={false} custom={direzione}>
                <motion.div
                  key={step.id}
                  className="h-pv-step"
                  initial={{ opacity: 0, x: direzione * scorri }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direzione * -scorri }}
                  transition={{ duration: ridotto ? 0 : 0.45, ease: EASE }}
                >
                  <div className="h-pv-domanda">
                    <h3>{step.titolo}</h3>
                    <p>{step.sottotitolo}</p>
                  </div>
                  <div className="h-pv-campi">
                    {step.campi.map((campo) =>
                      campo.tipo === 'scelta' ? (
                        <Scelta key={campo.nome} campo={campo} valore={dati[campo.nome]} onChange={aggiorna} />
                      ) : (
                        <Testo key={campo.nome} campo={campo} valore={dati[campo.nome]} onChange={aggiorna} />
                      ),
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Campo-trappola: nascosto a persone e lettori di schermo */}
            {ultimo && (
              <div aria-hidden="true" className="h-sr">
                <label>
                  Non compilare questo campo
                  <input type="text" name="sito_web" tabIndex={-1} autoComplete="off" value={trappola} onChange={(e) => setTrappola(e.target.value)} />
                </label>
              </div>
            )}

            {ultimo && (
              <label className="h-pv-privacy">
                <input type="checkbox" checked={lettoPrivacy} onChange={(e) => setLettoPrivacy(e.target.checked)} />
                <span className="h-pv-casella" aria-hidden="true" />
                <span>
                  Ho letto l’
                  <Link to="/privacy" target="_blank" rel="noreferrer">
                    informativa sulla privacy
                  </Link>{' '}
                  e so che userete i miei dati per rispondere a questa richiesta di preventivo.
                </span>
              </label>
            )}

            {errore && (
              <p role="alert" className="h-pv-errore">
                {errore}
              </p>
            )}

            <div className="h-pv-nav">
              <button type="button" className="h-pv-indietro" onClick={indietro} style={{ visibility: passo === 0 ? 'hidden' : 'visible' }}>
                ← Indietro
              </button>
              {ultimo ? (
                <button type="submit" className="h-pv-avanti" disabled={bloccato}>
                  {invioInCorso ? 'Invio in corso…' : 'Invia richiesta'}
                </button>
              ) : (
                <button type="button" className="h-pv-avanti" onClick={avanti} disabled={!completo}>
                  Avanti →
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </section>
  )
}
