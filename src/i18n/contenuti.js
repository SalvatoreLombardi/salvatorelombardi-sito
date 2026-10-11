/* ============================================================================
   CONTENUTI IN INGLESE
   Servizi, lavori, video e domande del preventivo vengono da file condivisi con
   il sito scuro, scritti in italiano. Qui c'è la versione inglese di ciascuno:
   in italiano si usa il testo originale, in inglese si sovrappone quello di
   questo file. Se una voce manca qui, si vede il testo italiano.
   ========================================================================== */

/** Testo di un servizio (da components/Servizi.jsx), trovato dal suo titolo italiano. */
const SERVIZI_EN = {
  'Sviluppo web': {
    titolo: 'Web development',
    testo: 'Websites, e-commerce and apps for your business. Fast, secure and easy to manage on your own.',
    voci: ['Showcase and one-page websites', 'E-commerce', 'Mobile apps and PWAs', 'Maintenance and support'],
  },
  'Graphic design': {
    titolo: 'Graphic design',
    testo: 'Logo, visual identity and graphic materials. A consistent image that makes you recognisable everywhere.',
    voci: ['Logo and brand identity', 'Print materials', 'Web graphics', 'Presentations'],
  },
  'Social media management': {
    titolo: 'Social media management',
    testo: 'Strategy, content and publishing. Your channels managed consistently, to grow over time.',
    voci: ['Strategy and goals', 'Editorial calendar', 'Content creation', 'Publishing and community', 'Analytics and growth'],
  },
  'Video making': {
    titolo: 'Video making',
    testo: 'Filming and editing. From promotional videos to vertical content for social media, including aerial footage with a drone.',
    voci: ['Video shoots', 'Drone footage', 'Editing and colour grading', 'Promotional videos', 'Social media content'],
  },
}

export function servizioTradotto(servizio, lingua) {
  if (lingua !== 'en') return servizio
  return { ...servizio, ...SERVIZI_EN[servizio.titolo] }
}

/** Etichette dei filtri/categorie dei lavori. */
const CATEGORIE_EN = {
  tutti: 'All',
  web: 'Web development',
  grafica: 'Graphic design',
  video: 'Video',
  social: 'Social media',
}
export const etichettaCategoria = (id, italiano, lingua) => (lingua === 'en' ? CATEGORIE_EN[id] ?? italiano : italiano)

/** Lavori, trovati dal loro id. */
const LAVORI_EN = {
  identitario: {
    descrizione:
      'Branding, logo and a complete editorial website about Italy’s villages, traditions and cuisine, with an AI assistant that creates tailor-made itineraries.',
    completa: {
      intro:
        'A complete project: from visual identity to the live website, telling the story of authentic Italy, made of villages, traditions and food.',
      punti: [
        ['Branding and logo', 'A complete visual identity, with logo and mascot, used across the website and social media.'],
        ['Editorial website', 'Villages, traditions, food and landscapes, with articles and content automatically synchronised with Instagram.'],
        ['Weather', 'The forecast for the place you are discovering.'],
        ['Digital postcard', 'Choose a photo and write your message: the site adds the Identitario stamp and creates a link to share, valid for 24 hours.'],
        ['Identit-AI, Paths of Meaning', 'Choose an element (Fire, Water, Devotion or Silence) and artificial intelligence creates an itinerary linking villages, traditions and sacred places.'],
        ['Soundtracks', 'The Spotify playlists that accompany the videos.'],
        ['Responsive', 'The whole site is fully responsive, including on mobile.'],
      ],
    },
  },
  'le-terrazze-sul-mondo': {
    descrizione: 'Logo, photography, drone video and a website for a B&B in a historic residence in Gravina in Puglia.',
    completa: {
      intro:
        'A complete project for a bed & breakfast in a historic residence dating back to 1742, in Gravina in Puglia: I created the logo, took the photographs and shot the drone footage, and developed the website.',
      punti: [
        ['Logo', 'A line drawing in gold on an ivory background, with the terraces and the aqueduct bridge, echoing the elegant character of the place.'],
        ['Photography', 'I took the photos of the interior and exterior spaces used on the site and in the gallery.'],
        ['Drone video', 'A video shot with a drone on the home page, which moves as you scroll.'],
        ['The website', 'The story of the residence, the two rooms (Nadir and Zenit), Gravina and its surroundings, the photo gallery, the map and contact details.'],
        ['Availability request', 'A form to enter name, email, dates, number of guests and preferred room.'],
        ['Responsive', 'The site is fully responsive: it adapts to computers, tablets and smartphones.'],
      ],
    },
  },
  baggo: {
    descrizione: 'Mascot, social pages, posts and a landing page for the launch of Baggo.',
    completa: {
      intro: 'The launch of Baggo, from the mascot to the social channels: I created the brand’s image and the tools to get it known.',
      punti: [
        ['Mascot', 'I created the brand’s mascot: the octopus.'],
        ['Social pages', 'I looked after the brand’s social pages.'],
        ['Posts', 'I created the posts for the social channels.'],
        ['Link page', 'A page that gathers the social channels: from a single address, the audience reaches all of the brand’s channels.'],
      ],
    },
  },
  'identitario-instagram': {
    descrizione: 'Logo, pictogram, social pages and videos to tell the story of villages, traditions and recipes with emotion.',
    testoLink: 'Go to Instagram',
    completa: {
      intro: 'Identitario’s communication, from visual identity to social channels, telling the story of authentic Italy with emotion.',
      punti: [
        ['Logo and pictogram', 'I created the brand’s logo and pictogram.'],
        ['Social pages', 'I created the pages on Instagram, Facebook, TikTok and YouTube.'],
        ['Strategy', 'The channels are managed with targeted strategies.'],
        ['Video', 'Videos shot with dedicated equipment and with a drone, telling stories of villages, traditions and recipes with emotion.'],
      ],
    },
  },
  'sito-scuro': {
    titolo: 'The Dark Side',
    descrizione:
      'Two versions of the same website, to show how design changes a site’s intent without touching its content. Move the mouse over the preview to see the difference, then step into the dark side and compare the details: buttons, headings and movement.',
    testoLink: 'Open the dark side',
    completa: {
      intro:
        'Two versions of the same website, made to show one thing: with the same content, design alone is enough to change the intent. The dark side is technological and bright, the light side is crafted and calm. Style, shapes and movement change, not the words.',
      punti: [
        ['Dark side', 'Black background, glass and reflections, soft corners, a single aqua-green colour and a 3D cube that follows the mouse.'],
        ['Light side', 'Paper and ink, sharp corners, huge headings in outline and solid, pencil lines and a cube that shows its faces as you scroll.'],
        ['Same content', 'Services, work and contacts are the same: only the way they are told changes, so maintenance stays in one place.'],
        ['One click to switch', 'The “Open the dark side” button takes you to the dark side, and the “Main site” button there brings you back.'],
      ],
    },
  },
}

export function lavoroTradotto(lavoro, lingua) {
  if (lingua !== 'en') return lavoro
  return { ...lavoro, ...LAVORI_EN[lavoro.id] }
}

/** Video, trovati dal loro id. I video restano in italiano: cambiano titolo e testi che li presentano. */
const VIDEO_EN = {
  'identitario-1': {
    titolo: 'Sacred and Profane',
    descrizione: 'A forbidden love, a tragedy and water that still responds to two words.',
    testo: [
      'A forbidden love, a tragedy and water that still responds to two words.',
      'We are in Nova Siri, in Basilicata, at the Vasche di Sant’Alessio: ancient Roman pools fed by a sulphurous spring. Centuries ago, convents of Basilian monks stood here. Legend tells of a monk and a nun who loved each other in secret: discovered, they were killed right beside these waters.',
      'Since then it is said that when you utter “u monc e a monc” (“the monk and the nun”), the water starts to boil harder. It is the monk rebelling.',
      'Legend or not, the phenomenon is real: try it and see it with your own eyes.',
    ],
  },
  'identitario-2': {
    titolo: 'Ninety Steps into the Past',
    descrizione: 'There is a place in Puglia where the sacred has its roots in a past far older than you might imagine…',
    testo: [
      'There is a place in Puglia where the sacred has its roots in a past far older than you might imagine.',
      'We are in Minervino Murge, and this cave is a natural cavity formed two million years ago. Long before the Christians it was already a pagan place of worship: a cippus (stone marker) from the Roman imperial era is still preserved inside it today.',
      'The first written records date back to a parchment from the year 1000, kept at Montecassino: back then the cave was dedicated to the Most Holy Saviour. Only in the following centuries did it become the sanctuary of Saint Michael the Archangel that we see today.',
      'Ninety steps carved into the rock lead down to the altar, where the statue of the Archangel keeps watch. A place where nature, history and faith merge into a single rock.',
    ],
  },
  'identitario-3': {
    titolo: 'The Red Gold of Lucania',
    descrizione: 'Lucania’s excellence is the Peperone Crusco PGI.',
    testo: [
      'Lucania’s excellence is the Peperone Crusco PGI.',
      'It is a simple product, grown and processed with patience among the hills of Senise.',
      'The sun warms it, wraps it in its rays and turns it into a fruit of intense red.',
      'A food that, served alongside other dishes, elevates their flavour and decorates them with lively colours.',
      'Every bite makes a unique sound, that of its irresistible crunchiness, leaving the palate with savoury flavour and contentment.',
    ],
  },
  'identitario-4': {
    titolo: 'The Guardian of the Appian Way',
    descrizione: 'A Roman staging post, a sacred crypt and a fortified farmstead: all in the same place.',
    testo: [
      'A Roman staging post, a sacred crypt and a fortified farmstead: all in the same place.',
      'We are at Masseria Jesce, in the countryside of Altamura, along the ancient Appian Way. Here, in Roman times, travellers stopped to change horses. It later became a possession of the Benedictine monks, and finally a fortified farmstead of the sixteenth century.',
      'Its hidden heart is a crypt carved into the rock: inside are frescoes dating back to the fourteenth century, including Saint Michael the Archangel. All around, once-inhabited caves, a necropolis and the traces of a Neolithic village: thousands of years layered in a single place.',
      'And keeping watch over it is Donato, an extraordinary storyteller who tells the story of this place like no one else.',
    ],
  },
  'identitario-5': {
    titolo: 'A Sanctuary in the Rock',
    descrizione: 'It’s called Madonna delle Armi, but it has nothing to do with war.',
    testo: [
      'It’s called Madonna delle Armi, but it has nothing to do with war. The name comes from the Greek “ton armon”, meaning “of the caves”: because it is there, inside the rock of Mount Sellaro, that everything began.',
      'The sanctuary came into being around 1450, after the discovery of ancient sacred icons in a cave, on a site already inhabited centuries earlier by Byzantine monks. Over the centuries it was extended and enriched, above all by the Pignatelli family, until it became one of the most beloved sanctuaries in Calabria.',
      'Today it stands at over 1,000 metres, set into the rock, with a view that embraces the plain of Sibari and the Gulf of Taranto.',
    ],
  },
  'identitario-6': {
    titolo: 'Aquatrekking in the Pollino',
    descrizione: 'Even if only for a few hours, immersing yourself in the waters of the Mercure at 9–10 °C was a rejuvenating experience.',
    testo: [
      'Even if only for a few hours, immersing yourself in the waters of the Mercure at 9–10 °C was a rejuvenating experience. The clear flowing water, the almost dazzling green, the local wildlife: a unique day.',
      'Aquatrekking has three routes: Easy (suitable for families and children), Medium and Canyon for those looking for more adrenaline. And if you want more, there is also River Tubing, floating down the river on an inner tube.',
      'All organised by @infopollino, an excursion centre in Viggianello with the official guides of the Pollino National Park, who provide wetsuits and equipment and are always super helpful.',
      'Info: infopollino.com. To book: +39 338 2333888 (also on WhatsApp).',
    ],
  },
}

export function videoTradotto(video, lingua) {
  if (lingua !== 'en') return video
  return { ...video, ...VIDEO_EN[video.id] }
}

export const NOTA_MUSICA_EN = 'All the music in this video is my own creation.'

/* ----------------------------------------------------------------------------
   PREVENTIVO — le domande. I valori delle risposte (quelli salvati nel database)
   restano gli stessi: cambiano solo i testi che si leggono. I passi si trovano
   dal titolo italiano, i campi dal loro nome, le opzioni dal loro valore.
   -------------------------------------------------------------------------- */
const PASSI_EN = {
  'Che tipo di progetto ti serve?': ['What kind of project do you need?', 'Choose a starting point: the questions that follow change depending on this one.'],
  'Quanto è grande il sito?': ['How big is the website?', 'A rough idea: it helps estimate time and price.'],
  'Quanto è grande il negozio?': ['How big is the shop?', 'A rough idea: it helps estimate time and price.'],
  'Che tipo di app?': ['What kind of app?', 'If you’re not sure what to choose, I’ll advise you based on your budget.'],
  'Che stile deve avere?': ['What style should it have?', 'It helps me understand the direction; it’s not a final choice.'],
  'Qualche dettaglio visivo': ['A few visual details', 'If you have no preference, just choose “You decide”.'],
  'Cosa hai già pronto?': ['What do you already have?', 'Whatever is missing I’ll create for you: it affects timing and the quote.'],
  'Dove ti mando il preventivo?': ['Where should I send your quote?', 'I’ll reply within 24 hours. No commitment.'],
  'Che video ti serve?': ['What video do you need?', 'Tell me its purpose and how long it should be; we’ll work out the rest together.'],
  'Come si gira?': ['How will it be shot?', 'The filming has a big effect on timing and the quote.'],
  'Le finiture': ['The finishing touches', 'Music, subtitles and format: choose what you need.'],
  'Quando e quanti?': ['When and how many?', 'To understand whether it’s a one-off job or a collaboration over time.'],
  'Su quali social?': ['Which social networks?', 'Choose the channels to manage and tell me where we’re starting from.'],
  'Cosa vuoi ottenere?': ['What do you want to achieve?', 'The goal determines the strategy: pick the most important one and the services you need.'],
  'Quanto spesso?': ['How often?', 'The posting rhythm affects working time and price.'],
  'Per quanto tempo?': ['For how long?', 'We can start with a trial and decide together afterwards.'],
}

// Sottotitoli che cambiano fra lato scuro e lato chiaro per la stessa domanda
const SOTTOTITOLI_EN = {
  'Scegli il punto di partenza, poi affiniamo insieme.': 'Choose a starting point, then we’ll refine it together.',
}
const ETICHETTE_PASSI_EN = { Progetto: 'Project', Stile: 'Style', Dettagli: 'Details', Contenuti: 'Content', Contatti: 'Contact' }

const CAMPI_EN = {
  pagine: ['How many pages'],
  funzioniVetrina: ['What should it include (you can pick more than one)'],
  prodotti: ['How many products'],
  funzioniEcommerce: ['What should it include (you can pick more than one)'],
  piattaformaApp: ['How your customers will use it'],
  funzioniApp: ['What should it do (you can pick more than one)'],
  tipoVideo: ['Type of video'],
  durata: ['Length'],
  materiale: ['The footage'],
  location: ['Do you already have a location?'],
  musica: ['Music'],
  sottotitoli: ['Subtitles'],
  formato: ['Format'],
  scadenzaVideo: ['When you need it'],
  quantitaVideo: ['How many videos'],
  canali: ['Channels (you can pick more than one)'],
  situazioneProfili: ['Your profiles'],
  obiettivo: ['Main goal'],
  serviziSocial: ['What you need (you can pick more than one)'],
  frequenza: ['How many posts'],
  materialeSocial: ['Photos and videos'],
  durataSocial: ['Length of the collaboration'],
  partenza: ['When to start'],
  palette: ['Colour palette'],
  angoli: ['Corners of cards and buttons'],
  foto: ['Photos'],
  testi: ['Texts'],
  logo: ['Logo'],
  nome: ['Full name', 'Jane Smith'],
  email: ['Email', 'jane@example.com'],
}

const OPZIONI_EN = {
  vetrina: ['Showcase website', 'Present your business online'],
  ecommerce: ['E-commerce', 'Sell products directly from the website'],
  app: ['App', 'Mobile app or PWA: bookings, showcase, customer loyalty'],
  video: ['Video', 'Filming, including drone footage, and editing for promos or social media'],
  social: ['Social', 'Profile management: strategy, content and publishing'],
  elegante: ['Elegant', 'Restrained, lots of space, little colour'],
  moderno: ['Modern', 'Clean and direct, simple shapes'],
  colorato: ['Colourful', 'Lively, with a strong personality'],
  tecnologico: ['Technological', 'Sharp, precise, a little futuristic'],
  chiara: ['Light'],
  scura: ['Dark'],
  vivace: ['Vivid'],
  'decidi-tu': ['You decide'],
  squadrati: ['Square'],
  arrotondati: ['Rounded'],
  disponibili: ['I already have them'],
  'da-realizzare': ['To be created'],
  stock: ['Stock photos are fine'],
  pronti: ['I already have them'],
  'da-scrivere': ['To be written'],
  'da-sistemare': ['They exist, but need work'],
  'ho-logo': ['I have one'],
  'da-creare': ['To be created'],
  'da-rifare': ['To be redesigned'],
  'pagine-1': ['A single page'],
  'pagine-3-5': ['3 to 5 pages'],
  'pagine-6-piu': ['More than 5 pages'],
  'pagine-non-so': ['I don’t know yet'],
  'f-modulo': ['Contact form'],
  'f-galleria': ['Photo gallery'],
  'f-blog': ['News or blog'],
  'f-mappa': ['Map and opening hours'],
  'f-lingue': ['Multiple languages'],
  'prod-20': ['Up to 20'],
  'prod-20-100': ['20 to 100'],
  'prod-100-piu': ['More than 100'],
  'prod-non-so': ['I don’t know yet'],
  'f-pagamenti': ['Online payments'],
  'f-spedizioni': ['Shipping and couriers'],
  'f-sconti': ['Discount codes'],
  'f-account': ['Customer accounts'],
  'app-pwa': ['PWA', 'Installs from the browser, one codebase for all phones'],
  'app-nativa': ['iPhone and Android', 'Apps to download from the stores'],
  'app-non-so': ['Not sure, advise me'],
  'f-prenotazioni': ['Bookings'],
  'f-area-clienti': ['Customer area'],
  'f-notifiche': ['Notifications'],
  'f-pagamenti-app': ['Payments'],
  'f-catalogo': ['Showcase or catalogue'],
  'v-promo': ['Promotional', 'Tells the story of your business or a product'],
  'v-reel': ['For social media', 'Short vertical videos for Reels and TikTok'],
  'v-drone': ['Drone footage', 'Aerial views of places, buildings and events'],
  'dur-30': ['Up to 30 seconds'],
  'dur-1-2': ['1 to 2 minutes'],
  'dur-2-piu': ['More than 2 minutes'],
  'dur-non-so': ['I don’t know yet'],
  'mat-ho': ['I already have it', 'Editing only'],
  'mat-da-girare': ['To be shot', 'Filming and editing needed'],
  'mat-misto': ['Partly', 'Some footage exists, the rest has to be shot'],
  'loc-si': ['Yes, I do', 'I already know where to shoot'],
  'loc-no': ['No', 'The place needs to be found'],
  'loc-parliamone': ['Let’s discuss it', 'We decide together'],
  'mus-originale': ['Original', 'I compose it for your video'],
  'mus-ho': ['I’ll provide it'],
  'mus-senza': ['No music'],
  'sott-si': ['Yes'],
  'sott-no': ['No'],
  'sott-non-so': ['I don’t know'],
  'fmt-verticale': ['Vertical', '9:16, for social media'],
  'fmt-orizzontale': ['Horizontal', '16:9, for websites and YouTube'],
  'fmt-entrambi': ['Both'],
  'scad-2-settimane': ['Within two weeks'],
  'scad-1-mese': ['Within a month'],
  'scad-nessuna-fretta': ['No rush'],
  'qta-uno': ['Just one'],
  'qta-serie': ['Several videos over time'],
  's-instagram': ['Instagram'],
  's-facebook': ['Facebook'],
  's-tiktok': ['TikTok'],
  's-linkedin': ['LinkedIn'],
  's-youtube': ['YouTube'],
  'sit-attivi': ['Already active'],
  'sit-fermi': ['They exist, but are inactive'],
  'sit-da-creare': ['To be created'],
  'ob-conoscere': ['Get known'],
  'ob-vendere': ['Sell more'],
  'ob-clienti': ['Keep customers close'],
  'ob-lancio': ['Launch a product or event'],
  'sv-strategia': ['Strategy'],
  'sv-piano': ['Editorial calendar'],
  'sv-contenuti': ['Content creation'],
  'sv-community': ['Publishing and community'],
  'sv-ads': ['Paid advertising'],
  'sv-analisi': ['Analysing results'],
  'fr-1-2': ['1–2 a week'],
  'fr-3-4': ['3–4 a week'],
  'fr-ogni-giorno': ['Every day'],
  'fr-da-definire': ['To be decided'],
  'ms-ho': ['I already have them'],
  'ms-da-realizzare': ['To be created', 'On-site filming and photos needed'],
  'ms-misto': ['Partly'],
  'du-1-mese': ['One-month trial'],
  'du-3-mesi': ['3 months'],
  'du-6-piu': ['6 months or more'],
  'du-da-definire': ['To be decided'],
  'par-subito': ['Right away'],
  'par-1-mese': ['Within a month'],
  'par-da-definire': ['To be decided'],
}

/** Un passo del preventivo, con tutti i suoi testi tradotti. In italiano resta com'è. */
export function passoTradotto(passo, lingua) {
  if (lingua !== 'en') return passo
  const [titolo, sottotitoloDelTitolo] = PASSI_EN[passo.titolo] ?? [passo.titolo, passo.sottotitolo]
  const sottotitolo = SOTTOTITOLI_EN[passo.sottotitolo] ?? sottotitoloDelTitolo
  return {
    ...passo,
    etichetta: ETICHETTE_PASSI_EN[passo.etichetta] ?? passo.etichetta,
    titolo,
    sottotitolo,
    campi: passo.campi.map((campo) => {
      const [t, segnaposto] = CAMPI_EN[campo.nome] ?? []
      return {
        ...campo,
        titolo: t ?? campo.titolo,
        placeholder: segnaposto ?? campo.placeholder,
        opzioni: campo.opzioni?.map((o) => {
          const [label, nota] = OPZIONI_EN[o.valore] ?? []
          return { ...o, label: label ?? o.label, nota: label ? nota : o.nota }
        }),
      }
    }),
  }
}
