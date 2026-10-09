import { Reveal } from '../ui/Reveal'
import { BottoneImmagine } from '../ui/BottoneImmagine'
import { InvitoScorri } from '../ui/InvitoScorri'
import { vaiAllaSezione } from '../lib/scroll'

/* ============================================================================
   HERO
   Solo testo: lo sfondo cinematografico (la rete di nodi) è globale, montato
   una volta in App.jsx dietro l'intera pagina — non è più un pezzo dell'hero,
   quindi qui non c'è altro da disegnare.

   Un velo scuro dietro al testo garantisce la leggibilità qualunque cosa
   stia succedendo nell'animazione in quel momento dello scroll.
   ========================================================================== */
export function Hero() {
  return (
    <section id="home" className="relative flex min-h-[100svh] items-center overflow-hidden">
      {/* Velo dietro al testo: più scuro a sinistra dove sta scritto, si apre verso destra */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(100deg,rgba(8,8,10,0.78)_0%,rgba(8,8,10,0.42)_46%,rgba(8,8,10,0.15)_75%)]" />

      <div className="container-site relative pb-36 pt-20 sm:pb-16 sm:pt-28 lg:pt-24">
        <div className="max-w-xl">
          <Reveal delay={0.05} y={16}>
            <p className="flex items-center gap-2.5 text-eyebrow uppercase text-white/55">
              <span className="inline-block size-1.5 rounded-full bg-accent-400" />
              Web · Grafica · Video · Social
            </p>
          </Reveal>

          <Reveal delay={0.15} as="h1" className="mt-5 text-display font-display text-balance max-sm:text-[2.5rem] sm:mt-7">
            <span className="text-white">Il tuo progetto digitale,</span>{' '}
            <span className="text-white/40">dal preventivo al sito online</span>
          </Reveal>

          <Reveal delay={0.3}>
            <p className="mt-5 max-w-lg text-lead text-white/60 text-pretty sm:mt-7">
              Siti, ecommerce e app su misura. Compila il configuratore e ricevi un
              preventivo in poche ore.
            </p>
          </Reveal>

          <Reveal delay={0.42}>
            <div className="mt-6 flex justify-center sm:mt-10 sm:block">
              <BottoneImmagine href="#configuratore" onClick={(e) => vaiAllaSezione(e, 'configuratore')} />
            </div>
          </Reveal>

          <Reveal delay={0.54}>
            <p className="mt-4 text-center text-sm text-white/35 sm:mt-6 sm:text-left">Risposta entro 24 ore · Nessun impegno</p>
          </Reveal>
        </div>
      </div>

      {/* --- Invito a scorrere --- */}
      <InvitoScorri verso="servizi" />
    </section>
  )
}
