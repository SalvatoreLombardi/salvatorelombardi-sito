import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Tailwind v4 gira come plugin Vite: nessun postcss.config necessario.
export default defineConfig({
  // Percorsi relativi: il sito funziona sia su dominio proprio sia su
  // GitHub Pages dentro una sottocartella (username.github.io/nome-repo/).
  base: './',
  plugins: [react(), tailwindcss()],
  server: {
    // Porta dedicata: la 5173 (default di Vite) è già usata da un altro progetto.
    port: 5180,
    // strictPort: se la 5180 è occupata Vite si ferma con un errore, invece di
    // scivolare in silenzio su un'altra porta e farci guardare il sito sbagliato.
    strictPort: true,
    host: true, // espone in rete locale, per provare il sito dal telefono
  },
})
