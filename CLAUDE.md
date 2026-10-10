# sito-salvatorelombardi.com

## Supabase
- Progetto: `rhndzctbdqgagwamwwbf` (dashboard: https://supabase.com/dashboard/project/rhndzctbdqgagwamwwbf)
- **Database**: il configuratore (`src/components/Configuratore.jsx`) salva le richieste dei clienti nella tabella `richieste`.
- **Auth**: il login protegge la pagina Admin (`src/pages/Admin.jsx`), dove si vedono le richieste, si cambia lo stato e si cancellano. Gli utenti in Auth > Users sono gli account che possono entrare.
- **Sicurezza**: le policy RLS sono in `supabase/schema.sql` (da eseguire una volta nell'SQL Editor). La protezione vera sta lì, non nel frontend.
- **Collegamento**: variabili `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` in `.env.local` (modello: `.env.example`). Il deploy GitHub (`.github/workflows/deploy.yml`) le prende dai secrets.
- Client: `src/lib/supabase.js`. Se mancano le credenziali, `supabaseAttivo` è false e il sito mostra un avviso.
- **Admin**: https://salvatorelombardi.com/#/admin (in locale `http://localhost:5173/#/admin`). Il `#` serve perché il sito usa HashRouter (GitHub Pages). Nessun link dalla home.
- **Pausa (piano Free)**: il progetto va in pausa dopo un periodo di inattività (successo l'8 ott 2026). In pausa le richieste NON si salvano e l'Admin non funziona. Si riattiva da dashboard con "Resume project" (pochi minuti). I dati già salvati restano al sicuro.
- **Anti-pausa**: `.github/workflows/ping-supabase.yml` fa una query al DB ogni 3 giorni (usa gli stessi secrets del deploy). Se il workflow diventa rosso su GitHub, controlla subito se il progetto è in pausa. GitHub disattiva i workflow schedulati dopo 60 giorni senza commit nel repo.

## Da fare
- Anteprime dei 6 video Instagram (immagini nostre in `public/video/`, campo `anteprima` in `portfolio/video.js`): il codice è pronto, mancano le immagini.
- Far rivedere a un consulente privacy la pagina `/#/privacy` (bozza del 10/10/2026). Riferimento: `documenti/competenze-privacy-gdpr.md`.
- Cubo 3D animato (stile Rubik nero con facce che ruotano, come la home di resend.com) nella home. Dopo la mail di avviso preventivo.
- Mail personalizzata sul dominio (registrato su Cloudflare): Resend con dominio verificato per spedire, Cloudflare Email Routing per ricevere su salvatore-lombardi@blu.it.
- Configuratore: il percorso "Video" ha le stesse domande del sito, sistemarle. Aggiungere il percorso "Social" con domande giuste.
