/* ============================================================================
   DEFINIZIONE DEGLI STEP
   Contenuto separato dalla grafica: per aggiungere una domanda o un'opzione
   basta toccare questo file, il configuratore si adatta da solo.

   Tipi di campo disponibili:
   - 'scelta' : griglia di opzioni cliccabili (una sola selezionabile)
   - 'testo'  : campo di testo libero
   - 'email'  : campo email
   - 'data'   : selettore data
   ========================================================================== */
export const STEP = [
  {
    id: 'progetto',
    etichetta: 'Progetto',
    titolo: 'Che tipo di progetto ti serve?',
    sottotitolo: 'Scegli il punto di partenza, poi affiniamo insieme.',
    campi: [
      {
        nome: 'tipoProgetto',
        tipo: 'scelta',
        obbligatorio: true,
        opzioni: [
          { valore: 'vetrina', label: 'Sito vetrina', nota: 'Presenti la tua attività online' },
          { valore: 'ecommerce', label: 'Ecommerce', nota: 'Vendi prodotti direttamente dal sito' },
          { valore: 'app', label: 'App', nota: 'App mobile o PWA per i tuoi clienti: prenotazioni, vetrina, fidelizzazione' },
          { valore: 'video', label: 'Video', nota: 'Riprese, anche con drone, e montaggio per promo o social' },
        ],
      },
    ],
  },
  {
    id: 'stile',
    etichetta: 'Stile',
    titolo: 'Che stile deve avere?',
    sottotitolo: 'Serve a capire la direzione, non è una scelta definitiva.',
    campi: [
      {
        nome: 'stile',
        tipo: 'scelta',
        obbligatorio: true,
        opzioni: [
          { valore: 'elegante', label: 'Elegante', nota: 'Sobrio, tanto spazio, poco colore' },
          { valore: 'moderno', label: 'Moderno', nota: 'Pulito e diretto, forme semplici' },
          { valore: 'colorato', label: 'Colorato', nota: 'Vivace, con personalità forte' },
          { valore: 'tecnologico', label: 'Tecnologico', nota: 'Netto, preciso, un po’ futurista' },
        ],
      },
    ],
  },
  {
    id: 'visivi',
    etichetta: 'Dettagli',
    titolo: 'Qualche dettaglio visivo',
    sottotitolo: 'Se non hai preferenze scegli pure “decidi tu”.',
    campi: [
      {
        nome: 'palette',
        titolo: 'Palette colori',
        tipo: 'scelta',
        obbligatorio: true,
        opzioni: [
          { valore: 'chiara', label: 'Chiara' },
          { valore: 'scura', label: 'Scura' },
          { valore: 'vivace', label: 'Vivace' },
          { valore: 'decidi-tu', label: 'Decidi tu' },
        ],
      },
      {
        nome: 'angoli',
        titolo: 'Angoli di card e bottoni',
        tipo: 'scelta',
        obbligatorio: true,
        opzioni: [
          { valore: 'squadrati', label: 'Squadrati' },
          { valore: 'arrotondati', label: 'Arrotondati' },
          { valore: 'decidi-tu', label: 'Decidi tu' },
        ],
      },
    ],
  },
  {
    id: 'contenuti',
    etichetta: 'Contenuti',
    titolo: 'Cosa hai già pronto?',
    sottotitolo: 'Quello che manca lo realizziamo noi: incide su tempi e preventivo.',
    campi: [
      {
        nome: 'foto',
        titolo: 'Foto',
        tipo: 'scelta',
        obbligatorio: true,
        opzioni: [
          { valore: 'disponibili', label: 'Le ho già' },
          { valore: 'da-realizzare', label: 'Da realizzare' },
          { valore: 'stock', label: 'Vanno bene foto d’archivio' },
        ],
      },
      {
        nome: 'testi',
        titolo: 'Testi',
        tipo: 'scelta',
        obbligatorio: true,
        opzioni: [
          { valore: 'pronti', label: 'Li ho già' },
          { valore: 'da-scrivere', label: 'Da scrivere' },
          { valore: 'da-sistemare', label: 'Ci sono, ma da sistemare' },
        ],
      },
      {
        nome: 'logo',
        titolo: 'Logo',
        tipo: 'scelta',
        obbligatorio: true,
        opzioni: [
          { valore: 'ho-logo', label: 'Ce l’ho' },
          { valore: 'da-creare', label: 'Da creare' },
          { valore: 'da-rifare', label: 'Da rifare' },
        ],
      },
    ],
  },
  {
    id: 'contatti',
    etichetta: 'Contatti',
    titolo: 'Dove ti mando il preventivo?',
    sottotitolo: 'Ti rispondo entro 24 ore. Nessun impegno.',
    campi: [
      { nome: 'nome', titolo: 'Nome e cognome', tipo: 'testo', obbligatorio: true, placeholder: 'Mario Rossi' },
      { nome: 'email', titolo: 'Email', tipo: 'email', obbligatorio: true, placeholder: 'mario@esempio.it' },
    ],
  },
]

/* ============================================================================
   PERCORSI PER TIPO DI PROGETTO (usati dal lato chiaro)
   Dopo la prima domanda le altre cambiano: sito (vetrina, ecommerce, app),
   video e social hanno domande diverse. Il lato scuro usa ancora `STEP`.

   Un campo 'scelta' può avere `multipla: true`: si possono spuntare più opzioni
   e il valore è un elenco. I valori delle opzioni sono unici in tutto il file:
   servono alla pagina admin per tradurli in etichette leggibili.
   Le risposte che non hanno una colonna propria nel database (vedi COLONNE_RICHIESTE)
   finiscono nel campo `dettagli`.
   ========================================================================== */
export const COLONNE_RICHIESTE = ['tipoProgetto', 'stile', 'palette', 'angoli', 'foto', 'testi', 'logo', 'nome', 'email']

const STEP_PROGETTO = {
  id: 'progetto',
  titolo: 'Che tipo di progetto ti serve?',
  sottotitolo: 'Scegli il punto di partenza: le domande dopo cambiano in base a questa.',
  campi: [
    {
      nome: 'tipoProgetto',
      tipo: 'scelta',
      obbligatorio: true,
      opzioni: [
        { valore: 'vetrina', label: 'Sito vetrina', nota: 'Presenti la tua attività online' },
        { valore: 'ecommerce', label: 'Ecommerce', nota: 'Vendi prodotti direttamente dal sito' },
        { valore: 'app', label: 'App', nota: 'App mobile o PWA per i tuoi clienti: prenotazioni, vetrina, fidelizzazione' },
        { valore: 'video', label: 'Video', nota: 'Riprese, anche con drone, e montaggio per promo o social' },
        { valore: 'social', label: 'Social', nota: 'Gestione dei profili: strategia, contenuti e pubblicazione' },
      ],
    },
  ],
}

const STEP_CONTATTI = STEP[STEP.length - 1]

// Passi che i siti hanno in comune dopo la loro domanda specifica: stile, dettagli visivi, contenuti
const [, STEP_STILE, STEP_VISIVI, STEP_CONTENUTI] = STEP

const DIMENSIONE_VETRINA = {
  id: 'dimensione',
  titolo: 'Quanto è grande il sito?',
  sottotitolo: 'Un’idea di massima: serve a stimare tempi e prezzo.',
  campi: [
    {
      nome: 'pagine',
      titolo: 'Quante pagine',
      tipo: 'scelta',
      obbligatorio: true,
      opzioni: [
        { valore: 'pagine-1', label: 'Una sola pagina' },
        { valore: 'pagine-3-5', label: 'Da 3 a 5 pagine' },
        { valore: 'pagine-6-piu', label: 'Più di 5 pagine' },
        { valore: 'pagine-non-so', label: 'Non lo so ancora' },
      ],
    },
    {
      nome: 'funzioniVetrina',
      titolo: 'Cosa deve avere (puoi sceglierne più d’una)',
      tipo: 'scelta',
      multipla: true,
      obbligatorio: false,
      opzioni: [
        { valore: 'f-modulo', label: 'Modulo di contatto' },
        { valore: 'f-galleria', label: 'Galleria foto' },
        { valore: 'f-blog', label: 'Notizie o blog' },
        { valore: 'f-mappa', label: 'Mappa e orari' },
        { valore: 'f-lingue', label: 'Più lingue' },
      ],
    },
  ],
}

const DIMENSIONE_ECOMMERCE = {
  id: 'dimensione',
  titolo: 'Quanto è grande il negozio?',
  sottotitolo: 'Un’idea di massima: serve a stimare tempi e prezzo.',
  campi: [
    {
      nome: 'prodotti',
      titolo: 'Quanti prodotti',
      tipo: 'scelta',
      obbligatorio: true,
      opzioni: [
        { valore: 'prod-20', label: 'Fino a 20' },
        { valore: 'prod-20-100', label: 'Da 20 a 100' },
        { valore: 'prod-100-piu', label: 'Più di 100' },
        { valore: 'prod-non-so', label: 'Non lo so ancora' },
      ],
    },
    {
      nome: 'funzioniEcommerce',
      titolo: 'Cosa deve avere (puoi sceglierne più d’una)',
      tipo: 'scelta',
      multipla: true,
      obbligatorio: false,
      opzioni: [
        { valore: 'f-pagamenti', label: 'Pagamenti online' },
        { valore: 'f-spedizioni', label: 'Spedizioni e corrieri' },
        { valore: 'f-sconti', label: 'Codici sconto' },
        { valore: 'f-account', label: 'Account per i clienti' },
      ],
    },
  ],
}

const DIMENSIONE_APP = {
  id: 'dimensione',
  titolo: 'Che tipo di app?',
  sottotitolo: 'Se non sai cosa scegliere, ti consiglio io in base al budget.',
  campi: [
    {
      nome: 'piattaformaApp',
      titolo: 'Come la usano i clienti',
      tipo: 'scelta',
      obbligatorio: true,
      opzioni: [
        { valore: 'app-pwa', label: 'PWA', nota: 'Si installa dal browser, un solo codice per tutti i telefoni' },
        { valore: 'app-nativa', label: 'iPhone e Android', nota: 'App da scaricare dagli store' },
        { valore: 'app-non-so', label: 'Non so, consigliami' },
      ],
    },
    {
      nome: 'funzioniApp',
      titolo: 'Cosa deve fare (puoi sceglierne più d’una)',
      tipo: 'scelta',
      multipla: true,
      obbligatorio: false,
      opzioni: [
        { valore: 'f-prenotazioni', label: 'Prenotazioni' },
        { valore: 'f-area-clienti', label: 'Area clienti' },
        { valore: 'f-notifiche', label: 'Notifiche' },
        { valore: 'f-pagamenti-app', label: 'Pagamenti' },
        { valore: 'f-catalogo', label: 'Vetrina o catalogo' },
      ],
    },
  ],
}

const PASSI_VIDEO = [
  {
    id: 'video-tipo',
    titolo: 'Che video ti serve?',
    sottotitolo: 'Dimmi lo scopo e quanto deve durare, il resto lo vediamo insieme.',
    campi: [
      {
        nome: 'tipoVideo',
        titolo: 'Tipo di video',
        tipo: 'scelta',
        obbligatorio: true,
        opzioni: [
          { valore: 'v-promo', label: 'Promozionale', nota: 'Racconta la tua attività o un prodotto' },
          { valore: 'v-reel', label: 'Per i social', nota: 'Video verticali brevi per Reel e TikTok' },
          { valore: 'v-drone', label: 'Riprese con drone', nota: 'Vedute aeree di luoghi, strutture, eventi' },
        ],
      },
      {
        nome: 'durata',
        titolo: 'Durata',
        tipo: 'scelta',
        obbligatorio: true,
        opzioni: [
          { valore: 'dur-30', label: 'Fino a 30 secondi' },
          { valore: 'dur-1-2', label: 'Da 1 a 2 minuti' },
          { valore: 'dur-2-piu', label: 'Più di 2 minuti' },
          { valore: 'dur-non-so', label: 'Non lo so ancora' },
        ],
      },
    ],
  },
  {
    id: 'video-riprese',
    titolo: 'Come si gira?',
    sottotitolo: 'Le riprese incidono molto su tempi e preventivo.',
    campi: [
      {
        nome: 'materiale',
        titolo: 'Le riprese',
        tipo: 'scelta',
        obbligatorio: true,
        opzioni: [
          { valore: 'mat-ho', label: 'Le ho già', nota: 'Serve solo il montaggio' },
          { valore: 'mat-da-girare', label: 'Da girare', nota: 'Servono riprese e montaggio' },
          { valore: 'mat-misto', label: 'In parte', nota: 'Un po’ di materiale c’è, il resto da girare' },
        ],
      },
      {
        nome: 'location',
        titolo: 'Hai già la location?',
        tipo: 'scelta',
        obbligatorio: true,
        opzioni: [
          { valore: 'loc-si', label: 'Sì, ce l’ho', nota: 'So già dove girare' },
          { valore: 'loc-no', label: 'No', nota: 'Il posto va trovato' },
          { valore: 'loc-parliamone', label: 'Ne parliamo', nota: 'Decidiamo insieme' },
        ],
      },
    ],
  },
  {
    id: 'video-finiture',
    titolo: 'Le finiture',
    sottotitolo: 'Musica, sottotitoli e formato: scegli quello che ti serve.',
    campi: [
      {
        nome: 'musica',
        titolo: 'Musica',
        tipo: 'scelta',
        obbligatorio: true,
        opzioni: [
          { valore: 'mus-originale', label: 'Originale', nota: 'La creo io per il tuo video' },
          { valore: 'mus-ho', label: 'La fornisco io' },
          { valore: 'mus-senza', label: 'Senza musica' },
        ],
      },
      {
        nome: 'sottotitoli',
        titolo: 'Sottotitoli',
        tipo: 'scelta',
        obbligatorio: true,
        opzioni: [
          { valore: 'sott-si', label: 'Sì' },
          { valore: 'sott-no', label: 'No' },
          { valore: 'sott-non-so', label: 'Non lo so' },
        ],
      },
      {
        nome: 'formato',
        titolo: 'Formato',
        tipo: 'scelta',
        obbligatorio: true,
        opzioni: [
          { valore: 'fmt-verticale', label: 'Verticale', nota: '9:16, per i social' },
          { valore: 'fmt-orizzontale', label: 'Orizzontale', nota: '16:9, per sito e YouTube' },
          { valore: 'fmt-entrambi', label: 'Entrambi' },
        ],
      },
    ],
  },
  {
    id: 'video-quando',
    titolo: 'Quando e quanti?',
    sottotitolo: 'Per capire se è un lavoro singolo o una collaborazione nel tempo.',
    campi: [
      {
        nome: 'scadenzaVideo',
        titolo: 'Quando ti serve',
        tipo: 'scelta',
        obbligatorio: true,
        opzioni: [
          { valore: 'scad-2-settimane', label: 'Entro due settimane' },
          { valore: 'scad-1-mese', label: 'Entro un mese' },
          { valore: 'scad-nessuna-fretta', label: 'Nessuna fretta' },
        ],
      },
      {
        nome: 'quantitaVideo',
        titolo: 'Quanti video',
        tipo: 'scelta',
        obbligatorio: true,
        opzioni: [
          { valore: 'qta-uno', label: 'Uno solo' },
          { valore: 'qta-serie', label: 'Più video nel tempo' },
        ],
      },
    ],
  },
]

const PASSI_SOCIAL = [
  {
    id: 'social-canali',
    titolo: 'Su quali social?',
    sottotitolo: 'Scegli i canali da curare e dimmi da dove si parte.',
    campi: [
      {
        nome: 'canali',
        titolo: 'Canali (puoi sceglierne più d’uno)',
        tipo: 'scelta',
        multipla: true,
        obbligatorio: true,
        opzioni: [
          { valore: 's-instagram', label: 'Instagram' },
          { valore: 's-facebook', label: 'Facebook' },
          { valore: 's-tiktok', label: 'TikTok' },
          { valore: 's-linkedin', label: 'LinkedIn' },
          { valore: 's-youtube', label: 'YouTube' },
        ],
      },
      {
        nome: 'situazioneProfili',
        titolo: 'I tuoi profili',
        tipo: 'scelta',
        obbligatorio: true,
        opzioni: [
          { valore: 'sit-attivi', label: 'Già attivi' },
          { valore: 'sit-fermi', label: 'Ci sono, ma fermi' },
          { valore: 'sit-da-creare', label: 'Da creare' },
        ],
      },
    ],
  },
  {
    id: 'social-obiettivo',
    titolo: 'Cosa vuoi ottenere?',
    sottotitolo: 'L’obiettivo decide la strategia: scegli il più importante e i servizi che ti servono.',
    campi: [
      {
        nome: 'obiettivo',
        titolo: 'Obiettivo principale',
        tipo: 'scelta',
        obbligatorio: true,
        opzioni: [
          { valore: 'ob-conoscere', label: 'Farmi conoscere' },
          { valore: 'ob-vendere', label: 'Vendere di più' },
          { valore: 'ob-clienti', label: 'Tenere vicini i clienti' },
          { valore: 'ob-lancio', label: 'Lanciare un prodotto o un evento' },
        ],
      },
      {
        nome: 'serviziSocial',
        titolo: 'Di cosa hai bisogno (puoi sceglierne più d’uno)',
        tipo: 'scelta',
        multipla: true,
        obbligatorio: true,
        opzioni: [
          { valore: 'sv-strategia', label: 'Strategia' },
          { valore: 'sv-piano', label: 'Piano editoriale' },
          { valore: 'sv-contenuti', label: 'Creazione di contenuti' },
          { valore: 'sv-community', label: 'Pubblicazione e community' },
          { valore: 'sv-ads', label: 'Pubblicità a pagamento' },
          { valore: 'sv-analisi', label: 'Analisi dei risultati' },
        ],
      },
    ],
  },
  {
    id: 'social-ritmo',
    titolo: 'Quanto spesso?',
    sottotitolo: 'Il ritmo di pubblicazione incide sul tempo di lavoro e sul prezzo.',
    campi: [
      {
        nome: 'frequenza',
        titolo: 'Quante pubblicazioni',
        tipo: 'scelta',
        obbligatorio: true,
        opzioni: [
          { valore: 'fr-1-2', label: '1-2 a settimana' },
          { valore: 'fr-3-4', label: '3-4 a settimana' },
          { valore: 'fr-ogni-giorno', label: 'Ogni giorno' },
          { valore: 'fr-da-definire', label: 'Da definire' },
        ],
      },
      {
        nome: 'materialeSocial',
        titolo: 'Foto e video',
        tipo: 'scelta',
        obbligatorio: true,
        opzioni: [
          { valore: 'ms-ho', label: 'Li ho già io' },
          { valore: 'ms-da-realizzare', label: 'Da realizzare', nota: 'Servono riprese e foto sul posto' },
          { valore: 'ms-misto', label: 'In parte' },
        ],
      },
    ],
  },
  {
    id: 'social-quando',
    titolo: 'Per quanto tempo?',
    sottotitolo: 'Si può partire con una prova e poi decidere insieme.',
    campi: [
      {
        nome: 'durataSocial',
        titolo: 'Durata della collaborazione',
        tipo: 'scelta',
        obbligatorio: true,
        opzioni: [
          { valore: 'du-1-mese', label: 'Un mese di prova' },
          { valore: 'du-3-mesi', label: '3 mesi' },
          { valore: 'du-6-piu', label: '6 mesi o più' },
          { valore: 'du-da-definire', label: 'Da definire' },
        ],
      },
      {
        nome: 'partenza',
        titolo: 'Quando partire',
        tipo: 'scelta',
        obbligatorio: true,
        opzioni: [
          { valore: 'par-subito', label: 'Subito' },
          { valore: 'par-1-mese', label: 'Entro un mese' },
          { valore: 'par-da-definire', label: 'Da definire' },
        ],
      },
    ],
  },
]

/** I passi da fare per un tipo di progetto. Prima di scegliere si vede il percorso dei siti (stessa lunghezza degli altri: 6). */
export function passiPer(tipoProgetto) {
  if (tipoProgetto === 'video') return [STEP_PROGETTO, ...PASSI_VIDEO, STEP_CONTATTI]
  if (tipoProgetto === 'social') return [STEP_PROGETTO, ...PASSI_SOCIAL, STEP_CONTATTI]
  const dimensione = tipoProgetto === 'ecommerce' ? DIMENSIONE_ECOMMERCE : tipoProgetto === 'app' ? DIMENSIONE_APP : DIMENSIONE_VETRINA
  return [STEP_PROGETTO, dimensione, STEP_STILE, STEP_VISIVI, STEP_CONTENUTI, STEP_CONTATTI]
}

const TUTTI_I_PASSI = [STEP_PROGETTO, DIMENSIONE_VETRINA, DIMENSIONE_ECOMMERCE, DIMENSIONE_APP, ...PASSI_VIDEO, ...PASSI_SOCIAL, ...STEP]

/** Mappa `nome campo` -> titolo leggibile (per la pagina admin). */
export const TITOLI_CAMPI = Object.fromEntries(
  TUTTI_I_PASSI.flatMap((passo) => passo.campi).map((campo) => [campo.nome, campo.titolo ?? campo.nome]),
)

/* Mappa `valore` -> etichetta leggibile.
   Serve alla pagina admin per mostrare "Sito vetrina" invece di "vetrina". */
export const ETICHETTE = Object.fromEntries(
  TUTTI_I_PASSI.flatMap((step) => step.campi)
    .filter((campo) => campo.tipo === 'scelta')
    .flatMap((campo) => campo.opzioni.map((opzione) => [opzione.valore, opzione.label])),
)
