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
          { valore: 'app', label: 'App', nota: 'Uno strumento su misura per il tuo lavoro' },
          { valore: 'video', label: 'Video', nota: 'Riprese e montaggio per promo o social' },
        ],
      },
    ],
  },
  {
    id: 'stile',
    etichetta: 'Stile',
    titolo: 'Che aria deve avere?',
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
      {
        nome: 'budget',
        titolo: 'Budget indicativo',
        tipo: 'scelta',
        obbligatorio: true,
        opzioni: [
          { valore: 'fino-1000', label: 'Fino a 1.000 €' },
          { valore: '1000-3000', label: '1.000 – 3.000 €' },
          { valore: '3000-6000', label: '3.000 – 6.000 €' },
          { valore: 'oltre-6000', label: 'Oltre 6.000 €' },
          { valore: 'da-definire', label: 'Da definire' },
        ],
      },
      { nome: 'scadenza', titolo: 'Quando ti serve pronto?', tipo: 'data', obbligatorio: false },
    ],
  },
]

/* Mappa `valore` -> etichetta leggibile.
   Serve alla pagina admin per mostrare "Sito vetrina" invece di "vetrina". */
export const ETICHETTE = Object.fromEntries(
  STEP.flatMap((step) => step.campi)
    .filter((campo) => campo.tipo === 'scelta')
    .flatMap((campo) => campo.opzioni.map((opzione) => [opzione.valore, opzione.label])),
)
