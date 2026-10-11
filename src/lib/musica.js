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
let caricamento = null
let acceso = false

function prepara() {
  if (ctx) return ctx
  const Contesto = window.AudioContext || window.webkitAudioContext
  ctx = new Contesto()
  guadagno = ctx.createGain()
  guadagno.gain.value = 0
  analizzatore = ctx.createAnalyser()
  analizzatore.fftSize = 1024
  analizzatore.smoothingTimeConstant = 0.82
  guadagno.connect(analizzatore)
  analizzatore.connect(ctx.destination)
  caricamento = fetch(FILE)
    .then((r) => r.arrayBuffer())
    .then((dati) => new Promise((ok, no) => ctx.decodeAudioData(dati, ok, no)))
  return ctx
}

/** Sfuma il volume fino a `valore` in `secondi`. */
function sfuma(valore, secondi) {
  const t = ctx.currentTime
  guadagno.gain.cancelScheduledValues(t)
  guadagno.gain.setValueAtTime(guadagno.gain.value, t)
  guadagno.gain.linearRampToValueAtTime(valore, t + secondi)
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
    caricamento
      .then((buffer) => {
        if (!acceso) return
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

export function spegniMusica() {
  acceso = false
  if (!ctx) return
  sfuma(0, 0.4)
  setTimeout(() => {
    if (!acceso && sorgente) {
      try {
        sorgente.stop()
      } catch {
        /* già fermo */
      }
      sorgente.disconnect()
      sorgente = null
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
