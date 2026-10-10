import { useEffect } from 'react'
import { EMAIL, TELEFONO_LEGGIBILE } from '../components/contatti/dati'

/* ============================================================================
   PRIVACY E COOKIE
   Informativa ai sensi degli artt. 13-14 del GDPR (Reg. UE 2016/679) e
   cookie policy (art. 122 Codice privacy, linee guida del Garante 10/06/2021).
   Raggiungibile da  /#/privacy  (link nel footer e nel configuratore).

   Se cambia qualcosa nel sito (nuovo strumento, nuovo fornitore, analytics,
   newsletter, mail con Resend) AGGIORNA QUESTA PAGINA e la data qui sotto.
   Riferimento: documenti/competenze-privacy-gdpr.md
   ========================================================================== */

const ULTIMO_AGGIORNAMENTO = '10 ottobre 2026'

function Sezione({ titolo, children }) {
  return (
    <section className="mt-12">
      <h2 className="font-display text-[1.375rem] font-semibold tracking-[-0.022em] text-white">
        {titolo}
      </h2>
      <div className="mt-4 space-y-4 text-[0.9688rem] leading-relaxed text-white/70">{children}</div>
    </section>
  )
}

function Elenco({ voci }) {
  return (
    <ul className="space-y-2.5 pl-5">
      {voci.map((voce, i) => (
        <li key={i} className="list-disc marker:text-accent-400">
          {voce}
        </li>
      ))}
    </ul>
  )
}

export default function Privacy() {
  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'Privacy e cookie — Salvatore Lombardi'
  }, [])

  return (
    <div className="min-h-screen bg-ink-950 text-white">
      <div className="mx-auto max-w-3xl px-6 py-14 sm:py-20">
        <a
          href="#/"
          className="text-[0.875rem] text-accent-400 transition-colors duration-300 hover:text-accent-200"
        >
          ← Torna al sito
        </a>

        <h1 className="mt-8 font-display text-[clamp(2rem,1.4rem+3vw,3rem)] font-semibold leading-tight tracking-[-0.03em]">
          Privacy e cookie
        </h1>
        <p className="mt-3 text-[0.875rem] text-white/45">Ultimo aggiornamento: {ULTIMO_AGGIORNAMENTO}</p>

        <p className="mt-8 text-[1rem] leading-relaxed text-white/70">
          Qui spiego, in modo semplice, quali dati personali tratta questo sito, perché, per quanto tempo e
          come puoi controllarli. Il sito non usa cookie di profilazione né strumenti di statistica.
        </p>

        <Sezione titolo="1. Chi è il titolare del trattamento">
          <p>
            Il titolare è <strong className="text-white">Salvatore Lombardi</strong>, Gravina in Puglia (BA),
            Italia. Per qualsiasi richiesta sui tuoi dati:
          </p>
          <Elenco
            voci={[
              <>
                email:{' '}
                <a className="text-white underline underline-offset-2" href={`mailto:${EMAIL}`}>
                  {EMAIL}
                </a>
              </>,
              <>telefono: {TELEFONO_LEGGIBILE}</>,
            ]}
          />
          <p>Non è stato nominato un responsabile della protezione dei dati (DPO), perché non è obbligatorio.</p>
        </Sezione>

        <Sezione titolo="2. Quali dati raccolgo, perché e con quale base giuridica">
          <p className="text-white">Richiesta di preventivo (configuratore)</p>
          <Elenco
            voci={[
              'Dati: le risposte che scegli (tipo di progetto, stile, colori, ecc.), il tuo nome e la tua email.',
              'Finalità: rispondere alla tua richiesta e inviarti un preventivo.',
              'Base giuridica: misure precontrattuali adottate su tua richiesta (art. 6, par. 1, lett. b GDPR). Non serve il tuo consenso per questo.',
              'Se non fornisci nome ed email non posso rispondere: sono i soli dati obbligatori.',
            ]}
          />
          <p className="text-white">Contatti diretti (telefono, WhatsApp, email)</p>
          <Elenco
            voci={[
              'Dati: quelli che mi comunichi tu (numero, nome, contenuto del messaggio).',
              'Finalità: risponderti. Base giuridica: la tua richiesta (art. 6, par. 1, lett. b) o il mio legittimo interesse a rispondere ai messaggi ricevuti (lett. f).',
              'Se usi WhatsApp, il servizio è di Meta, che tratta i dati secondo la propria informativa: io non ne sono il titolare.',
            ]}
          />
          <p className="text-white">Dati tecnici di navigazione</p>
          <Elenco
            voci={[
              'Il servizio di hosting (GitHub Pages) registra negli archivi del server dati tecnici come indirizzo IP, data e ora, e pagina richiesta, per far funzionare e proteggere il servizio.',
              'Io non uso questi dati e non ho strumenti di analisi delle visite.',
            ]}
          />
          <p>Non prendo decisioni basate su trattamenti automatizzati né faccio profilazione.</p>
        </Sezione>

        <Sezione titolo="3. A chi vengono comunicati i dati">
          <p>Per far funzionare il sito mi appoggio a questi fornitori, che trattano i dati per mio conto:</p>
          <Elenco
            voci={[
              'Supabase: archivio delle richieste di preventivo. Il database si trova nell\'Unione Europea (Irlanda, regione AWS eu-west-1). Supabase è una società con sede negli Stati Uniti e ha un accordo di trattamento dati con clausole contrattuali standard della Commissione europea.',
              'GitHub (GitHub Pages): ospita il sito. Società con sede negli Stati Uniti.',
              'Cloudflare: gestisce il nome di dominio. Società con sede negli Stati Uniti.',
            ]}
          />
          <p>
            Non vendo né cedo i tuoi dati a nessuno. Posso comunicarli ad autorità solo se la legge lo impone.
          </p>
        </Sezione>

        <Sezione titolo="4. Trasferimenti fuori dall'Unione Europea">
          <p>
            I dati delle richieste restano nell'Unione Europea. I fornitori indicati sopra hanno sede negli
            Stati Uniti, quindi alcuni dati tecnici (per esempio l'indirizzo IP nei registri di accesso)
            possono essere trattati anche lì, con le garanzie previste dal GDPR: decisione di adeguatezza
            (EU-US Data Privacy Framework) o clausole contrattuali standard.
          </p>
        </Sezione>

        <Sezione titolo="5. Per quanto tempo conservo i dati">
          <Elenco
            voci={[
              'Richieste di preventivo che non diventano un lavoro: 12 mesi dall\'invio, poi le cancello.',
              'Se nasce un lavoro insieme: per tutta la durata del rapporto e poi per i tempi che la legge impone per i documenti amministrativi e fiscali.',
              'Messaggi ricevuti per email o WhatsApp: fino a 12 mesi dall\'ultimo scambio, salvo che serva conservarli per un rapporto in corso.',
            ]}
          />
        </Sezione>

        <Sezione titolo="6. I tuoi diritti">
          <p>Puoi chiedermi in qualsiasi momento di:</p>
          <Elenco
            voci={[
              'sapere quali dati ho su di te e ottenerne una copia (accesso);',
              'correggerli (rettifica) o cancellarli;',
              'limitare il trattamento o opporti;',
              'riceverli in un formato leggibile (portabilità).',
            ]}
          />
          <p>
            Scrivimi a{' '}
            <a className="text-white underline underline-offset-2" href={`mailto:${EMAIL}`}>
              {EMAIL}
            </a>
            : ti rispondo entro un mese. Se ritieni che i tuoi dati siano trattati in modo non corretto, hai il
            diritto di presentare reclamo al{' '}
            <a
              className="text-white underline underline-offset-2"
              href="https://www.garanteprivacy.it"
              target="_blank"
              rel="noreferrer"
            >
              Garante per la protezione dei dati personali
            </a>
            .
          </p>
        </Sezione>

        <Sezione titolo="7. Cookie e strumenti simili">
          <p>
            Questo sito <strong className="text-white">non usa cookie di profilazione, né di pubblicità, né
            strumenti di statistica</strong>. Per questo non compare nessun banner da accettare.
          </p>
          <p className="text-white">Strumenti tecnici (non serve il consenso)</p>
          <Elenco
            voci={[
              'Memoria della sessione del browser (sessionStorage): un piccolo segno che ricorda di aver già mostrato l\'animazione d\'ingresso, così non la rivedi a ogni pagina. Si cancella quando chiudi la scheda e non contiene dati personali.',
              'Area riservata: solo per il titolare, usa un accesso tecnico di Supabase per tenere attiva la sessione di login. Chi visita il sito non lo riceve.',
            ]}
          />
          <p className="text-white">Contenuti di terze parti (solo se decidi tu)</p>
          <p>
            I video della sezione Video sono ospitati da Instagram (Meta). Finché non premi "Carica il video"
            non viene contattato nessun server di Instagram. Dopo il tuo clic, Instagram può ricevere il tuo
            indirizzo IP e impostare i propri cookie, secondo la{' '}
            <a
              className="text-white underline underline-offset-2"
              href="https://privacycenter.instagram.com/policy"
              target="_blank"
              rel="noreferrer"
            >
              sua informativa
            </a>
            . Io non ho controllo su quei cookie.
          </p>
          <p>
            Quando premi "Carica il video", il tuo browser si collega a Instagram (Meta Platforms Ireland
            Limited, Merrion Road, Dublin 4, D04 X2K5, Irlanda). Per la raccolta e la trasmissione di questi
            dati, che avviene a causa dell'incorporamento del video nel mio sito, io e Meta siamo
            corresponsabili; per tutto ciò che Meta fa dopo, il titolare è Meta e valgono le sue informative.
            Questo passaggio avviene solo con il tuo clic, che vale come consenso, e puoi scegliere di non
            farlo senza perdere nulla del resto del sito.
          </p>
          <p className="text-white">Caratteri tipografici</p>
          <p>
            Il carattere del sito (Inter) è servito direttamente da questo sito, senza chiamate a Google.
          </p>
          <p className="text-white">Link ad altri siti</p>
          <p>
            Il sito contiene link a progetti e profili esterni (per esempio i lavori in portfolio e WhatsApp).
            Quando li apri passi su siti con la loro informativa.
          </p>
        </Sezione>

        <Sezione titolo="8. Modifiche">
          <p>
            Se cambia qualcosa (per esempio aggiungo strumenti di statistica o una newsletter), aggiorno questa
            pagina e la data in alto. Per la newsletter o altre comunicazioni promozionali chiederò sempre un
            consenso separato e facoltativo.
          </p>
        </Sezione>
      </div>
    </div>
  )
}
