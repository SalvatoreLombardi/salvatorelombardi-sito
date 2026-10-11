import { StrictMode, Suspense, lazy, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import App from './App.jsx'
import '@fontsource-variable/inter'
import './index.css'
import { LinguaProvider } from './i18n/LinguaChiaro.jsx'

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
// Lato chiaro: ora è la home del sito (/#/)
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
    <LinguaProvider>
    <HashRouter>
      <InCimaAlCambioPagina />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Chiaro />} />
          {/* Il sito scuro, la prima versione, vive qui: ci si arriva dal lavoro "Il lato scuro" */}
          <Route path="/scuro" element={<App />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/privacy" element={<Privacy />} />
          {/* Il vecchio indirizzo di prova del lato chiaro porta alla home */}
          <Route path="/chiaro" element={<Navigate to="/" replace />} />
          {/* Qualsiasi altro indirizzo riporta al sito */}
          <Route path="*" element={<Chiaro />} />
        </Routes>
      </Suspense>
    </HashRouter>
    </LinguaProvider>
  </StrictMode>,
)
