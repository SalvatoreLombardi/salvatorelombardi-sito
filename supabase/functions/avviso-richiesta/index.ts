// Edge Function: manda una mail a Salvatore a ogni nuova riga nella tabella `richieste`.
// Chiamata dal trigger SQL in supabase/avviso-mail.sql (database webhook).
// Segreti richiesti: RESEND_API_KEY, WEBHOOK_SECRET, EMAIL_DESTINATARIO

// Titoli e etichette copiati da src/components/configuratore/steps.js (da rigenerare se cambiano le domande)
const TITOLI: Record<string, string> = {"tipoProgetto":"tipoProgetto","pagine":"Quante pagine","funzioniVetrina":"Cosa deve avere (puoi sceglierne più d’una)","prodotti":"Quanti prodotti","funzioniEcommerce":"Cosa deve avere (puoi sceglierne più d’una)","piattaformaApp":"Come la usano i clienti","funzioniApp":"Cosa deve fare (puoi sceglierne più d’una)","tipoVideo":"Tipo di video","durata":"Durata","materiale":"Le riprese","location":"Hai già la location?","musica":"Musica","sottotitoli":"Sottotitoli","formato":"Formato","scadenzaVideo":"Quando ti serve","quantitaVideo":"Quanti video","canali":"Canali (puoi sceglierne più d’uno)","situazioneProfili":"I tuoi profili","obiettivo":"Obiettivo principale","serviziSocial":"Di cosa hai bisogno (puoi sceglierne più d’uno)","frequenza":"Quante pubblicazioni","materialeSocial":"Foto e video","durataSocial":"Durata della collaborazione","partenza":"Quando partire","stile":"stile","palette":"Palette colori","angoli":"Angoli di card e bottoni","foto":"Foto","testi":"Testi","logo":"Logo","nome":"Nome e cognome","email":"Email","lingua":"Lingua della richiesta"}
const ETICHETTE: Record<string, string> = {"vetrina":"Sito vetrina","ecommerce":"Ecommerce","app":"App","video":"Video","social":"Social","pagine-1":"Una sola pagina","pagine-3-5":"Da 3 a 5 pagine","pagine-6-piu":"Più di 5 pagine","pagine-non-so":"Non lo so ancora","f-modulo":"Modulo di contatto","f-galleria":"Galleria foto","f-blog":"Notizie o blog","f-mappa":"Mappa e orari","f-lingue":"Più lingue","prod-20":"Fino a 20","prod-20-100":"Da 20 a 100","prod-100-piu":"Più di 100","prod-non-so":"Non lo so ancora","f-pagamenti":"Pagamenti online","f-spedizioni":"Spedizioni e corrieri","f-sconti":"Codici sconto","f-account":"Account per i clienti","app-pwa":"PWA","app-nativa":"iPhone e Android","app-non-so":"Non so, consigliami","f-prenotazioni":"Prenotazioni","f-area-clienti":"Area clienti","f-notifiche":"Notifiche","f-pagamenti-app":"Pagamenti","f-catalogo":"Vetrina o catalogo","v-promo":"Promozionale","v-reel":"Per i social","v-drone":"Riprese con drone","dur-30":"Fino a 30 secondi","dur-1-2":"Da 1 a 2 minuti","dur-2-piu":"Più di 2 minuti","dur-non-so":"Non lo so ancora","mat-ho":"Le ho già","mat-da-girare":"Da girare","mat-misto":"In parte","loc-si":"Sì, ce l’ho","loc-no":"No","loc-parliamone":"Ne parliamo","mus-originale":"Originale","mus-ho":"La fornisco io","mus-senza":"Senza musica","sott-si":"Sì","sott-no":"No","sott-non-so":"Non lo so","fmt-verticale":"Verticale","fmt-orizzontale":"Orizzontale","fmt-entrambi":"Entrambi","scad-2-settimane":"Entro due settimane","scad-1-mese":"Entro un mese","scad-nessuna-fretta":"Nessuna fretta","qta-uno":"Uno solo","qta-serie":"Più video nel tempo","s-instagram":"Instagram","s-facebook":"Facebook","s-tiktok":"TikTok","s-linkedin":"LinkedIn","s-youtube":"YouTube","sit-attivi":"Già attivi","sit-fermi":"Ci sono, ma fermi","sit-da-creare":"Da creare","ob-conoscere":"Farmi conoscere","ob-vendere":"Vendere di più","ob-clienti":"Tenere vicini i clienti","ob-lancio":"Lanciare un prodotto o un evento","sv-strategia":"Strategia","sv-piano":"Piano editoriale","sv-contenuti":"Creazione di contenuti","sv-community":"Pubblicazione e community","sv-ads":"Pubblicità a pagamento","sv-analisi":"Analisi dei risultati","fr-1-2":"1-2 a settimana","fr-3-4":"3-4 a settimana","fr-ogni-giorno":"Ogni giorno","fr-da-definire":"Da definire","ms-ho":"Li ho già io","ms-da-realizzare":"Da realizzare","ms-misto":"In parte","du-1-mese":"Un mese di prova","du-3-mesi":"3 mesi","du-6-piu":"6 mesi o più","du-da-definire":"Da definire","par-subito":"Subito","par-1-mese":"Entro un mese","par-da-definire":"Da definire","elegante":"Elegante","moderno":"Moderno","colorato":"Colorato","tecnologico":"Tecnologico","chiara":"Chiara","scura":"Scura","vivace":"Vivace","decidi-tu":"Decidi tu","squadrati":"Squadrati","arrotondati":"Arrotondati","disponibili":"Le ho già","da-realizzare":"Da realizzare","stock":"Vanno bene foto d’archivio","pronti":"Li ho già","da-scrivere":"Da scrivere","da-sistemare":"Ci sono, ma da sistemare","ho-logo":"Ce l’ho","da-creare":"Da creare","da-rifare":"Da rifare","it":"Italiano","en":"Inglese: rispondi in inglese"}

const esc = (v: unknown) =>
  String(v ?? '—').replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`)

// Un valore del database in forma leggibile: "vetrina" diventa "Sito vetrina", un elenco diventa una lista
const leggibile = (v: unknown): string =>
  Array.isArray(v) ? v.map(leggibile).join(', ') : ETICHETTE[String(v)] ?? String(v ?? '—')

Deno.serve(async (req) => {
  if (req.headers.get('x-webhook-secret') !== Deno.env.get('WEBHOOK_SECRET')) {
    return new Response('non autorizzato', { status: 401 })
  }

  const { record: r } = await req.json()
  if (!r) return new Response('niente da inviare', { status: 400 })

  const righe: [string, unknown][] = [
    ['Nome', r.nome],
    ['Email', r.email],
    ['Tipo progetto', r.tipo_progetto],
    ['Stile', r.stile],
    ['Palette', r.palette],
    ['Angoli', r.angoli],
    ['Foto', r.foto],
    ['Testi', r.testi],
    ['Logo', r.logo],
  ]

  // Le risposte specifiche di sito, video o social stanno in `dettagli`: tutte, con il titolo della domanda
  const dettagli: [string, unknown][] = Object.entries(r.dettagli ?? {}).map(([nome, valore]) => [
    (TITOLI[nome] ?? nome).replace(/ \(.*\)$/, ''),
    valore,
  ])

  const tabella = (elenco: [string, unknown][]) =>
    elenco.map(([k, v]) => `<tr><td><b>${esc(k)}</b></td><td>${esc(leggibile(v))}</td></tr>`).join('')

  const html = `<h2>Nuova richiesta di preventivo</h2>
<table cellpadding="6">${tabella(righe)}</table>
${dettagli.length ? `<h3>Risposte alle domande</h3><table cellpadding="6">${tabella(dettagli)}</table>` : ''}
<p><a href="https://salvatorelombardi.com/#/admin">Apri l'Admin</a></p>`

  const risposta = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Sito <onboarding@resend.dev>',
      to: [Deno.env.get('EMAIL_DESTINATARIO')],
      reply_to: r.email,
      subject: `Nuovo preventivo da ${r.nome}`,
      html,
    }),
  })

  if (!risposta.ok) {
    console.error('Resend', risposta.status, await risposta.text())
    return new Response('invio fallito', { status: 502 })
  }
  return new Response('ok')
})
