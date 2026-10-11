/* ============================================================================
   SCATTO DELL'INTERRUTTORE
   Il rumore di un interruttore della luce, creato al momento dal browser
   (Web Audio): un clic secco, un piccolo tonfo di plastica e un secondo tic
   di rimbalzo. Non è un file registrato, quindi non ci sono diritti da
   controllare. Se un giorno vuoi un suono registrato, basta sostituire il
   contenuto di questa funzione con la riproduzione del file.
   Va chiamata da un clic: i browser non fanno partire l'audio da soli.
   ========================================================================== */
export function suonoScatto() {
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
