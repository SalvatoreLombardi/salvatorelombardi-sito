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
   `effetto`: 'bolle' fa galleggiare il logo e salire delle bolle (vedi LogoConBolle).
   `completa`: descrizione estesa ({ intro, punti: [[titolo, testo], ...] }).
   Se presente, la card mostra "Leggi di più" e apre una finestra con il testo.
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
      'Branding, logo e sito editoriale completo su borghi, tradizioni e cucina italiana, con un assistente AI che crea itinerari su misura.',
    logo: '/lavori/loghi/identitario.png',
    mascotte: '/lavori/identitario/mascotte.png',
    sfondo: '#0b0b0f',
    completa: {
      intro:
        'Un progetto completo: dall’identità visiva al sito online, per raccontare l’Italia autentica fatta di borghi, tradizioni e cucina.',
      punti: [
        ['Branding e logo', 'Identità visiva completa, con logo e mascotte, usata sul sito e sui social.'],
        ['Sito editoriale', 'Borghi, tradizioni, cucina e paesaggi, con articoli e contenuti sincronizzati in automatico con Instagram.'],
        ['Meteo', 'Le previsioni del luogo che stai scoprendo.'],
        ['Cartolina digitale', 'Scegli una foto e scrivi il messaggio: il sito aggiunge il francobollo di Identitario e crea un link da condividere, valido 24 ore.'],
        ['Identit-AI, Percorsi di Senso', 'Scegli un elemento (Fuoco, Acqua, Devozione o Silenzio) e l’intelligenza artificiale crea un itinerario che unisce borghi, tradizioni e luoghi sacri.'],
        ['Colonne sonore', 'Le playlist Spotify che accompagnano i video.'],
        ['Responsive', 'Tutto il sito è perfettamente responsive, anche su mobile.'],
      ],
    },
    immagine: '/lavori/identitario.jpg',
    link: 'https://identitario.eu',
  },
  {
    id: 'le-terrazze-sul-mondo',
    titolo: 'Le Terrazze sul Mondo',
    categoria: 'web',
    anno: '2025',
    descrizione:
      'Logo, fotografie, video con drone e sito web per un B&B in una dimora storica a Gravina in Puglia.',
    logo: '/lavori/loghi/le-terrazze-sul-mondo.jpg',
    sfondo: '#fdfdf1',
    completa: {
      intro:
        'Un progetto completo per un bed & breakfast in una dimora storica del 1742 a Gravina in Puglia: ho creato il logo, realizzato fotografie e video con il drone e sviluppato il sito.',
      punti: [
        ['Logo', 'Un disegno al tratto in oro su fondo avorio, con le terrazze e il ponte acquedotto, che richiama il carattere elegante del luogo.'],
        ['Fotografie', 'Ho realizzato le foto degli spazi interni ed esterni usate nel sito e nella galleria.'],
        ['Video con drone', 'Un video girato con il drone nella home, che si muove con lo scorrimento della pagina.'],
        ['Il sito', 'La storia della dimora, le due camere (Nadir e Zenit), Gravina e dintorni, la galleria fotografica, la mappa e i contatti.'],
        ['Richiesta di disponibilità', 'Un modulo per indicare nome, email, date, numero di ospiti e camera preferita.'],
        ['Responsive', 'Il sito è perfettamente responsive: si adatta a computer, tablet e smartphone.'],
      ],
    },
    immagine: '/lavori/le-terrazze-sul-mondo.jpg',
    link: 'https://leterrazzesulmondo.github.io/',
  },
  {
    id: 'baggo',
    titolo: 'Baggo',
    categoria: 'web',
    anno: '2025',
    descrizione:
      'Mascotte, pagine social, post e pagina di presentazione per il lancio di Baggo.',
    logo: '/lavori/loghi/baggo.png',
    sfondo: '#F2C000',
    effetto: 'bolle',
    completa: {
      intro:
        'Il lancio di Baggo, dalla mascotte ai canali social: ho creato l’immagine del brand e gli strumenti per farlo conoscere.',
      punti: [
        ['Mascotte', 'Ho creato la mascotte del brand: il polpo.'],
        ['Pagine social', 'Ho curato le pagine social del brand.'],
        ['Post', 'Ho creato i post per i canali social.'],
        ['Pagina di presentazione', 'Una pagina link che serve a raggiungere i social: da un solo indirizzo il pubblico arriva ai canali del brand.'],
      ],
    },
    immagine: '/lavori/baggo.jpg',
    link: 'https://salvatore-lombardi-cyber.github.io/Baggo/',
  },
  {
    id: 'identitario-instagram',
    titolo: 'Identitario · Instagram',
    categoria: 'social',
    anno: '2025',
    descrizione:
      'Gestione del canale: piano editoriale, reel e fotografie dei borghi, pubblicazione continuativa.',
    logo: '/lavori/loghi/identitario-instagram.png',
    sfondo: '#0b0b0f',
    immagine: '/lavori/identitario-instagram.jpg',
    piattaforma: 'instagram',
    link: 'https://www.instagram.com/identitario_official',
  },
]
