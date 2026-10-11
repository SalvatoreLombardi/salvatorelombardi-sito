import { StrictMode, Suspense, lazy, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom'
import App from './App.jsx'
import '@fontsource-variable/inter'
import './index.css'

/* ============================================================================
   ROUTING
   Usiamo HashRouter (indirizzi con #) perché GitHub Pages serve solo file
   statici: con le rotte normali, aprendo /admin darebbe 404.
   Il sito sta su  /#/       l'area riservata su  /#/admin

   L'admin è caricata solo quando serve (lazy): chi visita il sito non scarica
   il codice del pannello.
   ========================================================================== */
const Admin = lazy(() => import('./pages/Admin.jsx'))
const Privacy = lazy(() => import('./pages/Privacy.jsx'))
// Lato chiaro: pagina di prova, non collegata a nessun link del sito (/#/chiaro)
const Chiaro = lazy(() => import('./pages/Chiaro.jsx'))

// Il browser non deve rimettere la pagina dove era rimasta: ogni apertura parte dall'inizio
if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

/** Quando si cambia pagina (per esempio dal lato chiaro al lato scuro) si riparte dall'inizio. */
function InCimaAlCambioPagina() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <InCimaAlCambioPagina />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/chiaro" element={<Chiaro />} />
          {/* Qualsiasi altro indirizzo riporta al sito */}
          <Route path="*" element={<App />} />
        </Routes>
      </Suspense>
    </HashRouter>
  </StrictMode>,
)
