import { createClient } from '@supabase/supabase-js'

/* ============================================================================
   CLIENT SUPABASE
   Le credenziali arrivano da `.env.local` (vedi .env.example).
   Se mancano, il client resta `null`: il sito continua a funzionare e il
   configuratore avvisa che l'invio non è ancora collegato, invece di rompersi.
   ========================================================================== */

const url = import.meta.env.VITE_SUPABASE_URL
const chiaveAnon = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = url && chiaveAnon ? createClient(url, chiaveAnon) : null

/** true quando le credenziali sono configurate */
export const supabaseAttivo = supabase !== null
