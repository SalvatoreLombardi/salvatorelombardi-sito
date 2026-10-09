import { useEffect } from 'react'
import { Hero } from './components/Hero'
import { Servizi } from './components/Servizi'
import { Portfolio } from './components/Portfolio'
import { Video } from './components/Video'
import { ChiSono } from './components/ChiSono'
import { Configuratore } from './components/Configuratore'
import { Contatti } from './components/Contatti'
import { AvvisoRichieste } from './ui/AvvisoRichieste'
import { Navbar } from './ui/Navbar'
import { Footer } from './ui/Footer'
import { NetworkCanvas } from './components/hero/NetworkCanvas'

export default function App() {
  /* Aiuto per la messa a punto: con ?scrollTo=2400 la pagina si posiziona lì
     al caricamento, utile per controllare com'è lo sfondo a metà scroll senza
     doverlo rincorrere a mano. Non tocca nulla per i visitatori normali. */
  useEffect(() => {
    const y = new URLSearchParams(window.location.search).get('scrollTo')
    if (y !== null) window.scrollTo(0, Number(y))
  }, [])

  return (
    <>
      {/* Sfondo cinematografico fisso: dietro a tutta la pagina, dall'hero
          al footer. Non scrolla: è il resto del sito che scorre sopra di lui. */}
      <div className="fixed inset-0 -z-10 bg-ink-950">
        <NetworkCanvas />
      </div>

      <Navbar />

      <main>
        <Hero />
        <Servizi />
        <Portfolio />
        <Video />
        <ChiSono />
        <Configuratore />
        <Contatti />
      </main>

      <Footer />

      {/* Pillola con le richieste da leggere: compare solo se hai fatto il login */}
      <AvvisoRichieste />
    </>
  )
}
