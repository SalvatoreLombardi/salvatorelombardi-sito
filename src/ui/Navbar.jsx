import { LogoInterruttore } from './LogoInterruttore.jsx'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { vaiAllaSezione } from '../lib/scroll'
import { useLingua } from '../i18n/LinguaChiaro.jsx'

/* ============================================================================
   NAVBAR
   Il sito è scuro dall'hero al footer (sfondo cinematografico fisso, vedi
   NetworkCanvas), quindi la navbar resta sempre in versione chiara-su-scuro:
   trasparente in cima alla pagina, un velo scuro sfocato appena si scrolla
   (mai bianca). Su mobile si apre a tutto schermo.

   Per aggiungere una voce quando creiamo una sezione nuova basta una riga qui
   sotto: il resto (link, menu mobile, evidenziazione) si adatta da solo.
   ========================================================================== */
const ID_VOCI = ['servizi', 'portfolio', 'chi-sono', 'configuratore', 'contatti']

export function Navbar() {
  const { t, lingua, setLingua } = useLingua()
  const n = t.scuro.navbar
  const VOCI = ID_VOCI.map((id) => ({ id, label: n.voci[id] }))
  const [scrollata, setScrollata] = useState(false)
  const [menuAperto, setMenuAperto] = useState(false)
  const [sezioneAttiva, setSezioneAttiva] = useState('')

  /* --- La barra cambia aspetto dopo i primi pixel di scroll --- */
  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, 'change', (valore) => setScrollata(valore > 24))

  /* --- Evidenzia la voce della sezione che stai guardando --- */
  useEffect(() => {
    const sezioni = VOCI.map((voce) => document.getElementById(voce.id)).filter(Boolean)
    if (sezioni.length === 0) return

    const osservatore = new IntersectionObserver(
      (voci) => {
        voci.forEach((voce) => {
          if (voce.isIntersecting) setSezioneAttiva(voce.target.id)
        })
      },
      // Considera "attiva" la sezione che occupa la fascia centrale dello schermo
      { rootMargin: '-45% 0px -45% 0px' },
    )

    sezioni.forEach((sezione) => osservatore.observe(sezione))
    return () => osservatore.disconnect()
  }, [])

  /* --- Col menu mobile aperto la pagina dietro non deve scrollare --- */
  useEffect(() => {
    document.body.style.overflow = menuAperto ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuAperto])

  const apriSezione = (evento, id) => {
    setMenuAperto(false)
    vaiAllaSezione(evento, id)
  }

  const tornaSu = (evento) => {
    evento.preventDefault()
    setMenuAperto(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          scrollata || menuAperto
            ? 'border-b border-white/10 bg-ink-950/70 backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <nav className="container-site flex h-16 items-center justify-between gap-6">
          {/* --- Nome / logo --- */}
          <a
            href="#/scuro"
            onClick={tornaSu}
            className="flex items-end"
            aria-label={n.logoAria}
          >
            <span className="flex items-center gap-2.5 text-accent-400" role="img" aria-label="Salvatore Lombardi">
              <LogoInterruttore className="h-9 w-auto lg:h-12" />
              <span className="font-display text-[1.05rem] font-semibold leading-[0.95] tracking-[-0.03em] text-white lg:text-[1.2rem]">
                Salvatore
                <br />
                Lombardi
              </span>
            </span>
          </a>

          {/* --- Link (solo desktop) --- */}
          <div className="hidden items-center gap-8 md:flex">
            {VOCI.map((voce) => (
              <a
                key={voce.id}
                href={`#${voce.id}`}
                onClick={(e) => apriSezione(e, voce.id)}
                className={`relative text-[0.9375rem] transition-colors duration-300 ${
                  sezioneAttiva === voce.id ? 'text-white' : 'text-white/55 hover:text-white'
                }`}
              >
                {voce.label}
                {/* Trattino sotto la voce attiva, si sposta con un'animazione */}
                {sezioneAttiva === voce.id && (
                  <motion.span
                    layoutId="voce-attiva"
                    className="absolute -bottom-1.5 left-0 h-px w-full bg-accent-400"
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  />
                )}
              </a>
            ))}
            {/* Torna al sito principale (lato chiaro) */}
            <a
              href="#/"
              className="rounded-full border border-white/20 px-4 py-1.5 text-[0.875rem] text-white/80
                         transition-colors duration-300 hover:border-white/50 hover:text-white"
            >
              {n.principale}
            </a>
            {/* Cambio lingua: IT / EN, la scelta vale anche per il sito principale */}
            <div className="flex items-center gap-0.5 text-[0.8125rem] font-medium tracking-[0.1em]" role="group" aria-label={n.lingua}>
              {['it', 'en'].map((codice) => (
                <button
                  key={codice}
                  type="button"
                  lang={codice}
                  aria-pressed={lingua === codice}
                  onClick={() => setLingua(codice)}
                  className={`rounded-full px-2.5 py-1 uppercase transition-colors duration-300 ${
                    lingua === codice ? 'bg-white text-ink-950' : 'text-white/55 hover:text-white'
                  }`}
                >
                  {codice}
                </button>
              ))}
            </div>
          </div>

          {/* --- Bottone del menu (solo mobile) --- */}
          <button
            type="button"
            onClick={() => setMenuAperto((aperto) => !aperto)}
            aria-label={menuAperto ? n.chiudiMenu : n.apriMenu}
            aria-expanded={menuAperto}
            className="flex size-10 items-center justify-center md:hidden"
          >
            {/* Due trattini che si incrociano a X quando il menu è aperto */}
            <span className="relative flex h-3 w-5 flex-col justify-between">
              <motion.span
                className="block h-px w-full bg-white"
                animate={menuAperto ? { rotate: 45, y: 5.5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              />
              <motion.span
                className="block h-px w-full bg-white"
                animate={menuAperto ? { rotate: -45, y: -5.5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              />
            </span>
          </button>
        </nav>
      </header>

      {/* --- Menu mobile a tutto schermo --- */}
      <AnimatePresence>
        {menuAperto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 top-16 z-30 bg-ink-950/95 backdrop-blur-xl md:hidden"
          >
            <div className="container-site flex flex-col gap-1 pt-8">
              {VOCI.map((voce, i) => (
                <motion.a
                  key={voce.id}
                  href={`#${voce.id}`}
                  onClick={(e) => apriSezione(e, voce.id)}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * i, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="border-b border-white/10 py-5 font-display text-[1.75rem]
                             font-semibold tracking-[-0.025em] text-white"
                >
                  {voce.label}
                </motion.a>
              ))}
              <motion.a
                href="#/"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06 * VOCI.length, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="py-5 text-[1rem] text-accent-400"
              >
                {n.tornaPrincipale}
              </motion.a>
              <div className="flex items-center gap-1 pt-2 text-[0.9375rem] font-medium tracking-[0.1em]" role="group" aria-label={n.lingua}>
                {['it', 'en'].map((codice) => (
                  <button
                    key={codice}
                    type="button"
                    lang={codice}
                    aria-pressed={lingua === codice}
                    onClick={() => setLingua(codice)}
                    className={`rounded-full px-3.5 py-1.5 uppercase transition-colors duration-300 ${
                      lingua === codice ? 'bg-white text-ink-950' : 'text-white/55 hover:text-white'
                    }`}
                  >
                    {codice}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
