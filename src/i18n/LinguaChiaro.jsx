import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { TESTI } from './testi.js'

/* ============================================================================
   LINGUA — italiano e inglese per il lato chiaro.
   Alla prima visita si sceglie dalla lingua del browser: italiano se tra le
   lingue del visitatore c'è l'italiano, inglese in tutti gli altri casi.
   La scelta fatta dal menu viene ricordata nel browser.
   I testi stanno in `testi.js` (interfaccia) e `contenuti.js` (servizi, lavori,
   video e domande del preventivo, che vengono dai file condivisi con il sito scuro).
   ========================================================================== */
const CHIAVE = 'lingua'

export function rilevaLingua() {
  try {
    const salvata = localStorage.getItem(CHIAVE)
    if (salvata === 'it' || salvata === 'en') return salvata
  } catch {
    /* storage non disponibile */
  }
  const lingue = (navigator.languages?.length ? navigator.languages : [navigator.language || 'it']).map((l) => String(l).toLowerCase())
  return lingue.some((l) => l.startsWith('it')) ? 'it' : 'en'
}

const Contesto = createContext({ lingua: 'it', setLingua: () => {}, t: TESTI.it })

export function LinguaProvider({ children }) {
  const [lingua, setLinguaStato] = useState(rilevaLingua)

  const setLingua = useCallback((nuova) => {
    setLinguaStato(nuova)
    try {
      localStorage.setItem(CHIAVE, nuova)
    } catch {
      /* niente da fare */
    }
  }, [])

  // Descrizione per motori di ricerca (titolo e attributo lang li imposta ogni pagina)
  useEffect(() => {
    document.querySelector('meta[name="description"]')?.setAttribute('content', TESTI[lingua].descrizionePagina)
  }, [lingua])

  const valore = useMemo(() => ({ lingua, setLingua, t: TESTI[lingua] }), [lingua, setLingua])
  return <Contesto.Provider value={valore}>{children}</Contesto.Provider>
}

export const useLingua = () => useContext(Contesto)
