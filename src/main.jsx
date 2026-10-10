import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Route, Routes } from 'react-router-dom'
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

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/privacy" element={<Privacy />} />
          {/* Qualsiasi altro indirizzo riporta al sito */}
          <Route path="*" element={<App />} />
        </Routes>
      </Suspense>
    </HashRouter>
  </StrictMode>,
)
