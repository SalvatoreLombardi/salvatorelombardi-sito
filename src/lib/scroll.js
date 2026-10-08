/* ============================================================================
   SCROLL VERSO UNA SEZIONE
   Non usiamo il salto nativo del browser (href="#servizi") perché l'indirizzo
   del sito è già basato sul cancelletto per via di HashRouter (/#/, /#/admin):
   un link "#servizi" sovrascriverebbe la rotta.
   Qui intercettiamo il clic e scrolliamo a mano, lasciando l'href al suo posto
   per accessibilità e per il tasto destro "apri in nuova scheda".
   ========================================================================== */
export function vaiAllaSezione(evento, id) {
  const sezione = document.getElementById(id)
  if (!sezione) return // la sezione non esiste ancora: lasciamo fare al browser

  evento.preventDefault()

  // `scroll-padding-top` in index.css tiene conto dell'altezza della navbar
  sezione.scrollIntoView({
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'auto'
      : 'smooth',
    block: 'start',
  })
}
