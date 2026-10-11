/* ============================================================================
   SUONI DELL'INGRESSO
   Lo scatto dell'interruttore (public/audio/interruttore.mp3) e l'apertura dei
   pannelli (public/audio/apertura-pannelli.mp3): per cambiarli basta sostituire
   i file con lo stesso nome. Se il file non si carica, c'è un rumore di riserva
   generato dal browser.
   Va chiamata da un clic: i browser non fanno partire l'audio da soli.
   ========================================================================== */
const FILE = '/audio/interruttore.mp3'
const FILE_PANNELLI = '/audio/apertura-pannelli.mp3'
// I file sono piccoli: si scaricano subito all'apertura della pagina, così al clic sono già pronti
const scarica = (file) => (typeof window !== 'undefined' ? fetch(file).then((r) => (r.ok ? r.arrayBuffer() : Promise.reject())).catch(() => null) : null)
const scaricato = scarica(FILE)
const scaricatoPannelli = scarica(FILE_PANNELLI)

// Un solo AudioContext per gli effetti: nasce dentro il clic (il telefono lo vuole così) e resta vivo,
// così il suono dei pannelli può partire più tardi senza un altro clic
let contesto = null
function prendiContesto() {
  const Contesto = window.AudioContext || window.webkitAudioContext
  if (!Contesto) return null
  if (!contesto) contesto = new Contesto()
  if (contesto.state === 'suspended') contesto.resume()
  return contesto
}

const decodifica = (ctx, dati) =>
  new Promise((ok, no) => ctx.decodeAudioData(dati.slice(0), ok, no))

let bufferPannelli = null // decodificato al clic, pronto per quando si aprono i pannelli

export function suonoScatto() {
  try {
    const ctx = prendiContesto()
    if (!ctx) return
    // intanto si prepara il suono dei pannelli
    ;(scaricatoPannelli || Promise.resolve(null)).then((dati) => dati && decodifica(ctx, dati).then((b) => (bufferPannelli = b)).catch(() => {}))
    ;(scaricato || Promise.resolve(null)).then((dati) => {
      if (!dati) return suonoSintetico() // se il file non c'è, il rumore generato dal browser
      decodifica(ctx, dati)
        .then((buffer) => {
          const sorgente = ctx.createBufferSource()
          sorgente.buffer = buffer
          sorgente.connect(ctx.destination)
          sorgente.start()
        })
        .catch(() => suonoSintetico())
    })
  } catch {
    /* senza audio il sito funziona lo stesso */
  }
}

/** Il suono dei pannelli che si aprono: va chiamato nell'istante in cui iniziano a muoversi. */
export function suonoPannelli() {
  try {
    const ctx = contesto
    if (!ctx || !bufferPannelli) return
    if (ctx.state === 'suspended') ctx.resume()
    const sorgente = ctx.createBufferSource()
    sorgente.buffer = bufferPannelli
    sorgente.connect(ctx.destination)
    sorgente.start()
  } catch {
    /* senza audio il sito funziona lo stesso */
  }
}

/** Rumore di riserva generato dal browser (clic secco + tonfo), usato solo se il file non si carica. */
function suonoSintetico() {
  try {
    const Contesto = window.AudioContext || window.webkitAudioContext
    if (!Contesto) return
    const ctx = new Contesto()
    if (ctx.state === 'suspended') ctx.resume()
    const t = ctx.currentTime + 0.01

    const uscita = ctx.createGain()
    uscita.gain.value = 0.85
    uscita.connect(ctx.destination)

    // Rumore che si spegne subito: è il "tic" del contatto
    const durata = 0.12
    const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * durata), ctx.sampleRate)
    const dati = buffer.getChannelData(0)
    for (let i = 0; i < dati.length; i++) dati[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / dati.length, 2)

    const tic = (quando, frequenza, q, volume, lungo) => {
      const sorgente = ctx.createBufferSource()
      sorgente.buffer = buffer
      const filtro = ctx.createBiquadFilter()
      filtro.type = 'bandpass'
      filtro.frequency.value = frequenza
      filtro.Q.value = q
      const volumeTic = ctx.createGain()
      volumeTic.gain.setValueAtTime(volume, quando)
      volumeTic.gain.exponentialRampToValueAtTime(0.001, quando + lungo)
      sorgente.connect(filtro).connect(volumeTic).connect(uscita)
      sorgente.start(quando)
      sorgente.stop(quando + lungo + 0.02)
    }

    // Clic secco, poi un piccolo rimbalzo
    tic(t, 3800, 1.2, 0.9, 0.035)
    tic(t + 0.045, 2400, 2, 0.45, 0.03)

    // Tonfo basso della plastica che batte
    const oscillatore = ctx.createOscillator()
    const volumeTonfo = ctx.createGain()
    oscillatore.type = 'sine'
    oscillatore.frequency.setValueAtTime(190, t)
    oscillatore.frequency.exponentialRampToValueAtTime(80, t + 0.07)
    volumeTonfo.gain.setValueAtTime(0.55, t)
    volumeTonfo.gain.exponentialRampToValueAtTime(0.001, t + 0.09)
    oscillatore.connect(volumeTonfo).connect(uscita)
    oscillatore.start(t)
    oscillatore.stop(t + 0.1)

    setTimeout(() => ctx.close?.(), 700)
  } catch {
    /* senza audio il sito funziona lo stesso */
  }
}
