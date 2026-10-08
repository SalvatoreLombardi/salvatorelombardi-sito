/* ============================================================================
   I TUOI LAVORI
   Per aggiungere un progetto: copia un blocco e cambia i valori.

   `immagine`: metti il file dentro `public/lavori/` e scrivi qui il percorso,
   per esempio '/lavori/nome-file.jpg'.
   Se lo lasci a `null` compare un segnaposto grafico al suo posto, così la
   griglia resta ordinata anche senza foto.

   `categoria`: deve combaciare con una delle CATEGORIE qui sotto.
   `link`: indirizzo del sito online, oppure `null` se non c'è.
   `logo` + `sfondo`: se presenti, la card mostra solo il logo del cliente
   (file in `public/lavori/loghi/`) centrato su quel colore di sfondo, al
   posto dello screenshot.
   `piattaforma`: solo per i lavori social ('instagram' o 'facebook'): al posto
   del segnaposto mostra il logo del canale.
   ========================================================================== */

export const CATEGORIE = [
  { id: 'tutti', label: 'Tutti' },
  { id: 'web', label: 'Sviluppo web' },
  { id: 'grafica', label: 'Graphic design' },
  { id: 'video', label: 'Video' },
  { id: 'social', label: 'Social media' },
]

export const LAVORI = [
  {
    id: 'identitario',
    titolo: 'Identitario',
    categoria: 'web',
    anno: '2025',
    descrizione:
      'Sito editoriale su borghi, paesaggi e tradizioni italiane, sincronizzato in automatico con i contenuti Instagram.',
    logo: '/lavori/loghi/identitario.png',
    sfondo: '#0b0b0f',
    immagine: '/lavori/identitario.jpg',
    link: 'https://identitario.eu',
  },
  {
    id: 'le-terrazze-sul-mondo',
    titolo: 'Le Terrazze sul Mondo',
    categoria: 'web',
    anno: '2025',
    descrizione:
      'Sito per un B&B in dimora storica a Gravina in Puglia: camere, tariffe e richiesta di disponibilità online.',
    logo: '/lavori/loghi/le-terrazze-sul-mondo.jpg',
    sfondo: '#fdfdf1',
    immagine: '/lavori/le-terrazze-sul-mondo.jpg',
    link: 'https://leterrazzesulmondo.github.io/',
  },
  {
    id: 'baggo',
    titolo: 'Baggo',
    categoria: 'web',
    anno: '2025',
    descrizione:
      'Pagina link per il lancio di Baggo: da un solo indirizzo il pubblico arriva ai canali social del brand.',
    logo: '/lavori/loghi/baggo.png',
    sfondo: '#0b0b0f',
    immagine: '/lavori/baggo.jpg',
    link: 'https://salvatore-lombardi-cyber.github.io/Baggo/',
  },
  {
    id: 'progetto-4',
    titolo: 'Nome del progetto',
    categoria: 'video',
    anno: '2025',
    descrizione: 'Una riga che spiega cosa hai fatto e che problema hai risolto.',
    immagine: null,
    link: null,
  },
  {
    id: 'identitario-instagram',
    titolo: 'Identitario · Instagram',
    categoria: 'social',
    anno: '2025',
    descrizione:
      'Gestione del canale: piano editoriale, reel e fotografie dei borghi, pubblicazione continuativa.',
    logo: '/lavori/loghi/identitario-tondo.png',
    sfondo: '#ffffff',
    immagine: '/lavori/identitario-instagram.jpg',
    piattaforma: 'instagram',
    link: 'https://www.instagram.com/identitario_official',
  },
]

/* Dettagli del sito Identitario: scorrono in loop sotto la griglia.
   Per aggiungerne uno: metti l'immagine in `public/lavori/identitario/`
   e aggiungi una riga qui. */
export const DETTAGLI_IDENTITARIO = [
  { src: '/lavori/identitario/dettaglio-01.jpg', alt: 'Identitario: home page' },
  { src: '/lavori/identitario/dettaglio-02.jpg', alt: 'Identitario: sezione ricette' },
  { src: '/lavori/identitario/dettaglio-03.jpg', alt: 'Identitario: percorsi Identit-AI' },
  { src: '/lavori/identitario/dettaglio-04.jpg', alt: 'Identitario: colonne sonore' },
  { src: '/lavori/identitario/dettaglio-05.jpg', alt: 'Identitario: chi siamo' },
  { src: '/lavori/identitario/dettaglio-06.jpg', alt: 'Identitario: articoli' },
  { src: '/lavori/identitario/dettaglio-07.jpg', alt: 'Identitario: cartolina digitale' },
]
