/* ============================================================================
   MUSICA DI ATMOSFERA
   Il brano viene caricato una volta, decodificato e riprodotto in ciclo con
   Web Audio. Perché non un semplice <audio>: su iPhone il volume dell'elemento
   audio non si può cambiare (la musica non si spegneva mai) e il brano a volte
   si inceppava. Qui il volume è un "guadagno" che sfuma, e il ciclo non ha buchi.

   Le funzioni di accensione vanno chiamate da un clic o un tocco, perché i
   browser non fanno partire l'audio da soli.
   ========================================================================== */
const FILE = '/audio/atmosfera.mp3'
const VOLUME = 0.55

let ctx = null
let guadagno = null
let analizzatore = null
let sorgente = null
let decodifica = null // il brano decodificato (una volta sola, poi si riusa in ogni nuovo contesto)
let brano = null
let acceso = false

/** Il contesto audio: se non c'è o è stato chiuso se ne crea uno nuovo (da chiamare dentro un clic). */
function prepara() {
  if (ctx && ctx.state !== 'closed') return ctx
  const Contesto = window.AudioContext || window.webkitAudioContext
  ctx = new Contesto()
  guadagno = ctx.createGain()
  guadagno.gain.value = 0
  analizzatore = ctx.createAnalyser()
  analizzatore.fftSize = 1024
  analizzatore.smoothingTimeConstant = 0.82
  guadagno.connect(analizzatore)
  analizzatore.connect(ctx.destination)
  sorgente = null
  if (!decodifica) {
    const c = ctx
    decodifica = fetch(FILE)
      .then((r) => r.arrayBuffer())
      .then((dati) => new Promise((ok, no) => c.decodeAudioData(dati, ok, no)))
      .then((b) => (brano = b))
      .catch((e) => {
        decodifica = null
        throw e
      })
  }
  return ctx
}

/** Sfuma il volume fino a `valore` in `secondi`. */
function sfuma(valore, secondi) {
  const t = ctx.currentTime
  guadagno.gain.cancelScheduledValues(t)
  guadagno.gain.setValueAtTime(guadagno.gain.value, t)
  guadagno.gain.linearRampToValueAtTime(valore, t + secondi)
}

/** Da chiamare dentro un clic: prepara l'audio e sblocca il telefono, ma non fa ancora partire il brano (che parte con `accendiMusica`). */
export function sbloccaMusica() {
  try {
    const c = prepara()
    c.resume?.()
    const vuoto = c.createBufferSource()
    vuoto.buffer = c.createBuffer(1, 1, 22050)
    vuoto.connect(c.destination)
    vuoto.start(0)
  } catch {
    /* senza audio il sito funziona lo stesso */
  }
}

export function musicaAccesa() {
  return acceso
}

/** L'analizzatore che fa muovere le onde (esiste dopo la prima accensione). */
export function analizzatoreMusica() {
  return analizzatore
}

export function accendiMusica() {
  try {
    const c = prepara()
    c.resume?.()
    acceso = true
    decodifica
      .then((buffer) => {
        if (!acceso || c !== ctx) return
        if (!sorgente) {
          sorgente = c.createBufferSource()
          sorgente.buffer = buffer
          sorgente.loop = true
          sorgente.connect(guadagno)
          sorgente.start()
        }
        sfuma(VOLUME, 1.2)
      })
      .catch(() => {
        acceso = false
      })
  } catch {
    acceso = false
  }
}

/* Dopo lo spegnimento l'audio si chiude del tutto: su iPhone un contesto fermo a lungo può non ripartire più,
   uno nuovo (creato dentro il clic) parte sempre. Il brano resta già decodificato, quindi la ripartenza è subito. */
export function spegniMusica() {
  acceso = false
  if (!ctx) return
  sfuma(0, 0.4)
  const c = ctx
  setTimeout(() => {
    if (acceso || c !== ctx) return
    try {
      sorgente?.stop()
    } catch {
      /* già fermo */
    }
    sorgente?.disconnect()
    sorgente = null
    if (brano) {
      c.close?.().catch(() => {})
      ctx = null
      guadagno = null
      analizzatore = null
    }
  }, 500)
}

/** Scheda in secondo piano: il suono si ferma; quando si torna riparte, se era acceso. */
export function sospendiMusica() {
  ctx?.suspend?.()
}
export function riprendiMusica() {
  if (acceso) ctx?.resume?.()
}
