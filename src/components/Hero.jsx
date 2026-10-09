import { lazy, Suspense, useEffect, useState } from 'react'
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
// Il cubo 3D si scarica solo quando serve (non pesa sulla prima apertura)
const CuboServizi = lazy(() => import('../ui/CuboServizi'))

/** true da 1024 px in su: sotto non c'è spazio accanto al testo, quindi niente cubo. */
function useSchermoLargo() {
  const [largo, setLargo] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const aggiorna = () => setLargo(mq.matches)
    aggiorna()
    mq.addEventListener('change', aggiorna)
    return () => mq.removeEventListener('change', aggiorna)
  }, [])
  return largo
}

export function Hero() {
  const schermoLargo = useSchermoLargo()

  return (
    <section id="home" className="relative flex min-h-[100svh] items-center overflow-hidden">
      {/* Velo dietro al testo: più scuro a sinistra dove sta scritto, si apre verso destra */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(100deg,rgba(8,8,10,0.78)_0%,rgba(8,8,10,0.42)_46%,rgba(8,8,10,0.15)_75%)]" />

      {/* Cubo 3D a destra del testo (solo schermi larghi) */}
      {schermoLargo && (
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 flex w-[52%] items-center justify-center pl-8 pr-[max(2.5rem,calc((100vw-80rem)/2+2.5rem))] pt-16">
          <div className="pointer-events-auto aspect-square w-full max-w-[40rem]">
            <Suspense fallback={null}>
              <CuboServizi />
            </Suspense>
          </div>
        </div>
      )}

      <div className="container-site relative pb-16 pt-24 sm:pt-28 lg:pt-24">
        <div className="max-w-xl">
          <Reveal delay={0.05} y={16}>
            <p className="flex items-center gap-2.5 text-eyebrow uppercase text-white/55">
              <span className="inline-block size-1.5 rounded-full bg-accent-400" />
              Web · Grafica · Video · Social
            </p>
          </Reveal>

          <div className="relative">
            <Reveal delay={0.15} as="h1" className="mt-5 text-display font-display text-balance max-sm:text-[2.15rem] sm:mt-7">
              <span className="text-white">Il tuo progetto digitale,</span>{' '}
              <span className="text-white/40">dal preventivo al sito online</span>
            </Reveal>

            {/* Cubo piccolo, sempre a destra, accanto alle righe corte del titolo (telefono e tablet) */}
            {!schermoLargo && (
              <div className="absolute -bottom-6 -right-6 size-[11rem] sm:-right-4 sm:bottom-0 sm:size-[12rem]">
                <Suspense fallback={null}>
                  <CuboServizi />
                </Suspense>
              </div>
            )}
          </div>

          <Reveal delay={0.3}>
            <p className="mt-5 max-w-lg text-lead text-white/60 text-pretty sm:mt-7">
              Siti, ecommerce e app su misura. Compila il configuratore e ricevi un
              preventivo in poche ore.
            </p>
          </Reveal>

          <Reveal delay={0.4}>
            <p className="mt-3 text-sm text-white/45">Risposta entro 24 ore · Nessun impegno</p>
          </Reveal>

          <Reveal delay={0.5}>
            <div className="mt-6 flex justify-center sm:mt-8 sm:block">
              <BottoneImmagine href="#configuratore" onClick={(e) => vaiAllaSezione(e, 'configuratore')} />
            </div>
          </Reveal>
        </div>
      </div>

      {/* --- Invito a scorrere --- */}
      <InvitoScorri verso="servizi" />
    </section>
  )
}
