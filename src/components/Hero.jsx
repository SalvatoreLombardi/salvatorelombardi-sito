import { lazy, Suspense, useEffect, useState } from 'react'
import { Reveal } from '../ui/Reveal'
import { BottoneCta } from '../ui/BottoneCta'
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

/** true quando la finestra rispetta la media query (si aggiorna se ruoti o ridimensioni). */
function useMediaQuery(query) {
  const [vero, setVero] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const aggiorna = () => setVero(mq.matches)
    aggiorna()
    mq.addEventListener('change', aggiorna)
    return () => mq.removeEventListener('change', aggiorna)
  }, [query])
  return vero
}

export function Hero() {
  // Il cubo sta in tre posti diversi: a destra del testo (schermi larghi), accanto al titolo (tablet)
  // o nello spazio libero sotto il testo (telefono). Se ne monta sempre uno solo.
  const schermoLargo = useMediaQuery('(min-width: 1024px)')
  const telefono = useMediaQuery('(max-width: 639px)')

  return (
    <section id="home" className="relative flex min-h-[100svh] items-center overflow-hidden">
      {/* Velo dietro al testo: più scuro a sinistra dove sta scritto, si apre verso destra */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(100deg,rgba(8,8,10,0.78)_0%,rgba(8,8,10,0.42)_46%,rgba(8,8,10,0.15)_75%)]" />

      {/* Cubo 3D a destra del testo (solo schermi larghi) */}
      {/* Più largo di prima (+30%) e spostato in alto: il suo centro cade al centro del titolo */}
      {schermoLargo && (
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 flex w-[64%] items-center justify-center pb-[9.5rem] pl-8 pr-[max(2.5rem,calc((100vw-80rem)/2+2.5rem))]">
          {/* Spostato di ~2 cm in basso e ~3 cm a destra (1 cm ≈ 37,8 px) */}
          <div className="pointer-events-auto aspect-square w-full max-w-[52rem] translate-x-[7.1rem] translate-y-[4.75rem]">
            <Suspense fallback={null}>
              <CuboServizi />
            </Suspense>
          </div>
        </div>
      )}

      <div className="container-site relative pb-[3.25rem] pt-20 sm:pb-16 sm:pt-28 lg:pt-24">
        <div className="max-w-xl max-sm:flex max-sm:min-h-[calc(100svh-8.25rem)] max-sm:flex-col">
          <Reveal delay={0.05} y={16}>
            <p className="flex items-center gap-2.5 text-eyebrow uppercase text-white/55">
              <span className="inline-block size-1.5 rounded-full bg-accent-400" />
              Web · Grafica · Video · Social
            </p>
          </Reveal>

          <div className="relative">
            <Reveal delay={0.15} as="h1" className="mt-5 text-display font-display text-balance max-sm:text-[clamp(1.2rem,6.9vw,2rem)] max-sm:leading-tight sm:mt-7">
              <span className="text-white max-sm:block">Il tuo progetto digitale,</span>{' '}
              <span className="text-white/40">dal preventivo al sito online</span>
            </Reveal>

            {/* Tablet: cubo a destra, accanto alle righe corte del titolo */}
            {!schermoLargo && !telefono && (
              <div className="absolute -bottom-8 -right-8 size-[13rem] sm:-right-4 sm:bottom-0 sm:size-[14rem]">
                <Suspense fallback={null}>
                  <CuboServizi />
                </Suspense>
              </div>
            )}
          </div>

          <Reveal delay={0.3}>
            <p className="mt-5 max-w-lg text-lead text-white/60 text-pretty max-sm:max-w-none max-sm:text-[clamp(0.75rem,3.6vw,0.9rem)] max-sm:leading-snug max-sm:text-balance sm:mt-7">
              Siti, ecommerce e app su misura. Compila il configuratore e ricevi un
              preventivo in poche ore.
            </p>
          </Reveal>

          <Reveal delay={0.4}>
            <p className="mt-3 text-sm text-accent-400">Risposta entro 24 ore · Nessun impegno</p>
          </Reveal>

          {/* Telefono: lo spazio libero fra il testo e il bottone ospita il cubo, a destra */}
          {telefono && (
            <div className="relative min-h-[10rem] flex-1">
              <div className="absolute left-1/2 top-[48%] size-[27.2rem] max-[420px]:size-[19rem] -translate-x-1/2 -translate-y-1/2">
                <Suspense fallback={null}>
                  <CuboServizi />
                </Suspense>
              </div>
            </div>
          )}

          {/* Su telefono il bottone scende in fondo alla prima schermata (mt-auto) */}
          <Reveal delay={0.5} className="relative z-10 max-sm:mt-auto max-sm:pt-8">
            <div className="flex justify-center sm:mt-8 sm:block">
              <BottoneCta href="#configuratore" onClick={(e) => vaiAllaSezione(e, 'configuratore')} className="max-sm:w-full max-sm:max-w-[21rem]" />
            </div>
          </Reveal>
        </div>
      </div>

      {/* --- Invito a scorrere --- */}
      <InvitoScorri verso="servizi" />
    </section>
  )
}
