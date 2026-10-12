import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/* Assistente AI, solo in locale: risponde su /api/assistente con la stessa funzione che va su Supabase
   (supabase/functions/assistente). La chiave Gemini sta in `.env.local` come GEMINI_API_KEY (senza VITE_,
   così non finisce mai nel sito). Senza chiave risponde con un testo di prova, per vedere la chat. */
function assistenteLocale(chiave) {
  return {
    name: 'assistente-locale',
    configureServer(server) {
      server.middlewares.use('/api/assistente', async (req, res) => {
        const pezzi = []
        for await (const p of req) pezzi.push(p)
        const corpo = Buffer.concat(pezzi).toString()
        res.setHeader('Content-Type', 'application/json')
        if (!chiave) {
          res.end(JSON.stringify({ testo: '[Prova in locale, senza chiave] Qui comparirà la risposta vera dell’assistente.' }))
          return
        }
        process.env.GEMINI_API_KEY = chiave
        const { gestisci } = await server.ssrLoadModule('/supabase/functions/assistente/index.ts')
        const r = await gestisci(new Request('http://localhost/api/assistente', { method: 'POST', body: corpo, headers: { 'Content-Type': 'application/json' } }))
        res.statusCode = r.status
        res.end(await r.text())
      })
    },
  }
}

// Tailwind v4 gira come plugin Vite: nessun postcss.config necessario.
export default defineConfig(({ mode }) => ({
  // Percorsi relativi: il sito funziona sia su dominio proprio sia su
  // GitHub Pages dentro una sottocartella (username.github.io/nome-repo/).
  base: './',
  plugins: [react(), tailwindcss(), assistenteLocale(loadEnv(mode, process.cwd(), '').GEMINI_API_KEY)],
  server: {
    // Porta dedicata: la 5173 (default di Vite) è già usata da un altro progetto.
    port: 5180,
    // strictPort: se la 5180 è occupata Vite si ferma con un errore, invece di
    // scivolare in silenzio su un'altra porta e farci guardare il sito sbagliato.
    strictPort: true,
    host: true, // espone in rete locale, per provare il sito dal telefono
  },
}))
