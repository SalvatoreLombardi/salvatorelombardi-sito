/* ============================================================================
   VIDEO DA GUARDARE NEL SITO
   Per aggiungerne uno: copia un blocco e incolla il codice del post Instagram
   (è la parte finale dell'indirizzo: instagram.com/p/CODICE/).
   Il video si vede dentro la card, senza uscire dal sito.

   Campo opzionale `testo`: elenco di paragrafi. Se c'è, la card mostra "Leggi di più":
   si apre una finestra con il testo e il bottone "Vai su Instagram".

   Campo opzionale `luogo`: riga in più sotto la descrizione, con il pin del sito davanti (es. 'Nome del posto, Paese (PR)').

   Campo opzionale `visualizzazioni`: numero (es. 352000). Compare sotto il video con un
   contatore che sale da 0. Si aggiorna a mano.

   Campi opzionali per un player pulito, tutto del sito:
   - `file`:      video (mp4) in `public/video/`, es. '/video/identitario-1.mp4'
   - `anteprima`: immagine di copertina in `public/video/`, es. '/video/identitario-1.jpg'
   Con `file` il video parte dal bottone verde sotto la card. Senza `file`
   si usa il player di Instagram, ritagliato per nascondere intestazione e
   barra in basso.
   ========================================================================== */
// Frase aggiunta in fondo al testo completo di ogni video ("Leggi di più").
// Per togliere la riga basta svuotarla: ''.
export const NOTA_MUSICA = 'Tutte le musiche di questo video sono una mia creazione.'

export const VIDEO = [
  {
    id: 'identitario-1',
    titolo: 'Sacro e profano',
    descrizione: 'Un amore proibito, una tragedia e un’acqua che ancora oggi risponde a due parole.',
    // Testo completo: si apre con "Leggi di più", insieme al bottone "Vai su Instagram"
    testo: [
      'Un amore proibito, una tragedia e un’acqua che ancora oggi risponde a due parole.',
      'Siamo a Nova Siri, in Basilicata, alle Vasche di Sant’Alessio: antiche vasche romane alimentate da una sorgente sulfurea. Qui, secoli fa, sorgevano conventi di monaci basiliani. La leggenda racconta di un monaco e una monaca che si amarono di nascosto: scoperti, furono uccisi proprio accanto a queste acque.',
      'Da allora si dice che, pronunciando “u monc e a monc”, l’acqua inizi a ribollire più forte. È il monaco che si ribella.',
      'Leggenda o no, il fenomeno esiste davvero: provala e guarda con i tuoi occhi.',
    ],
    luogo: 'Vasche di Sant’Alessio, Nova Siri (MT)',
    visualizzazioni: 352000,
    anteprima: '/video/identitario-1.jpg',
    instagram: 'DdgjnEPM1d9',
  },
  {
    id: 'identitario-2',
    titolo: 'Novanta gradini verso il passato',
    descrizione: 'C’è un luogo in Puglia dove il sacro affonda le radici in un passato molto più antico…',
    testo: [
      'C’è un luogo in Puglia dove il sacro affonda le radici in un passato molto più antico di quanto immagini.',
      'Siamo a Minervino Murge, e questa grotta è una cavità naturale nata due milioni di anni fa. Molto prima dei cristiani era già un luogo di culto pagano: ancora oggi al suo interno si conserva un cippo di epoca romana imperiale.',
      'Le prime testimonianze scritte risalgono a una pergamena dell’anno Mille, custodita a Montecassino: allora la grotta era dedicata al Santissimo Salvatore. Solo nei secoli successivi divenne il santuario di San Michele Arcangelo che vediamo oggi.',
      'Novanta gradini scavati nella pietra scendono fino all’altare, dove veglia la statua dell’Arcangelo. Un luogo dove natura, storia e fede si fondono in un’unica roccia.',
    ],
    luogo: 'Grotta di San Michele, Minervino Murge (BAT)',
    visualizzazioni: 159000,
    anteprima: '/video/identitario-2.jpg',
    instagram: 'DdyjLDcMC6t',
  },
  {
    id: 'identitario-3',
    titolo: 'L’oro rosso della Lucania',
    descrizione: 'L’eccellenza della Lucania è il Peperone Crusco IGP.',
    testo: [
      'L’eccellenza della Lucania è il Peperone Crusco IGP.',
      'È un prodotto semplice, coltivato e lavorato con pazienza tra le colline di Senise.',
      'Il sole lo scalda, lo avvolge con i suoi raggi e lo trasforma in un frutto dal rosso intenso.',
      'Un alimento che, accompagnato alle altre pietanze, nobilita il sapore e le decora di colori vivaci.',
      'Ogni morso produce un suono unico, quello della sua irresistibile croccantezza, lasciando al palato sapidità e contentezza.',
    ],
    luogo: 'Il Paniere dei ricci, Contrada Pietrapica, Chiaromonte (PZ)',
    visualizzazioni: 127000,
    anteprima: '/video/identitario-3.jpg',
    instagram: 'Db28jtMsZJG',
  },
  {
    id: 'identitario-4',
    titolo: 'Il custode della Via Appia',
    descrizione: 'Una stazione romana, una cripta sacra e una masseria fortificata: tutto nello stesso luogo.',
    testo: [
      'Una stazione romana, una cripta sacra e una masseria fortificata: tutto nello stesso luogo.',
      'Siamo a Masseria Jesce, nelle campagne di Altamura, lungo l’antichissima Via Appia. Qui, al tempo dei romani, i viaggiatori si fermavano per cambiare i cavalli. Poi divenne un possedimento dei monaci benedettini, e infine una masseria fortificata del Cinquecento.',
      'Il suo cuore nascosto è una cripta rupestre scavata nella roccia: al suo interno affreschi che risalgono al Trecento, tra cui San Michele Arcangelo. Tutt’intorno, grotte un tempo abitate, una necropoli e le tracce di un villaggio neolitico: migliaia di anni stratificati in un unico posto.',
      'E a custodirla c’è Donato, un narratore straordinario che racconta questo luogo come nessun altro.',
    ],
    luogo: 'Masseria Jesce, Altamura (BA)',
    visualizzazioni: 13200,
    // Copertina mostrata prima del clic su "Carica il video" (immagine nostra, nessun contatto con Instagram)
    anteprima: '/video/identitario-4.jpg',
    instagram: 'DeHJjtpMram',
  },
  {
    id: 'identitario-5',
    titolo: 'Un santuario nella roccia',
    descrizione: 'Si chiama Madonna delle Armi, ma non c’entra nulla con la guerra.',
    testo: [
      'Si chiama Madonna delle Armi, ma non c’entra nulla con la guerra. Il nome viene dal greco “ton armon”, cioè “delle grotte”: perché è lì, dentro la roccia del monte Sellaro, che tutto ebbe inizio.',
      'Il santuario nacque intorno al 1450, dopo il ritrovamento di antiche icone sacre in una grotta, su un luogo già abitato secoli prima dai monaci bizantini. Nei secoli fu ampliato e arricchito, soprattutto dalla famiglia Pignatelli, fino a diventare uno dei santuari più amati della Calabria.',
      'Oggi sorge a oltre 1000 metri, incastonato nella roccia, con una vista che abbraccia la piana di Sibari e il Golfo di Taranto.',
    ],
    luogo: 'Santuario Madonna delle Armi, Cerchiara (CS)',
    visualizzazioni: 11700,
    anteprima: '/video/identitario-5.jpg',
    instagram: 'Dc_DwVFsF7Q',
  },
  {
    id: 'identitario-6',
    titolo: 'Acquatrekking nel Pollino',
    descrizione: 'Anche se solo per poche ore, immergersi nelle acque del Mercure a 9-10° è stata un’esperienza rigenerante.',
    testo: [
      'Anche se solo per poche ore, immergersi nelle acque del Mercure a 9-10° è stata un’esperienza rigenerante. L’acqua trasparente che scorre, il verde quasi accecante, la fauna del posto: una giornata unica.',
      'L’acquatrekking ha tre percorsi: Easy (adatto a famiglie e bambini), Medium e Canyon per chi cerca più adrenalina. E se vuoi di più, c’è anche il River Tubing, la discesa del fiume su ciambella.',
      'Tutto organizzato da @infopollino, centro escursioni di Viggianello con le guide ufficiali del Parco del Pollino, che forniscono tuta e attrezzatura e sono sempre super disponibili.',
      'Info: infopollino.com. Per prenotare: 338 2333888 (anche WhatsApp).',
    ],
    luogo: 'Info Pollino, Viggianello (PZ)',
    visualizzazioni: 11200,
    anteprima: '/video/identitario-6.jpg',
    instagram: 'DctA6IDsXqc',
  },
]
