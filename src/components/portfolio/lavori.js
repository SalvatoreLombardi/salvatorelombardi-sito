/* ============================================================================
   I TUOI LAVORI
   Per aggiungere un progetto: copia un blocco e cambia i valori.

   `immagine`: metti il file dentro `public/lavori/` e scrivi qui il percorso,
   per esempio '/lavori/nome-file.jpg'.
   Se lo lasci a `null` compare un segnaposto grafico al suo posto, così la
   griglia resta ordinata anche senza foto.

   `categoria`: deve combaciare con una delle CATEGORIE qui sotto.
   `link`: indirizzo del sito online, oppure `null` se non c'è.
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
    immagine: '/lavori/identitario-instagram.jpg',
    piattaforma: 'instagram',
    link: 'https://www.instagram.com/identitario_official',
  },
]
