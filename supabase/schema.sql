-- ============================================================================
-- TABELLA DELLE RICHIESTE DI PREVENTIVO
-- Da incollare nell'SQL Editor di Supabase ed eseguire una volta sola.
-- ============================================================================

create table if not exists public.richieste (
  id            uuid primary key default gen_random_uuid(),
  creato_il     timestamptz not null default now(),

  -- Risposte del configuratore
  tipo_progetto text,
  stile         text,
  palette       text,
  angoli        text,
  foto          text,
  testi         text,
  logo          text,

  -- Dati di contatto
  nome          text not null,
  email         text not null,
  budget        text,
  scadenza      date,

  -- Gestione interna (usata dalla pagina admin)
  stato         text not null default 'nuova',
  note          text
);

-- Le richieste più recenti si leggono per prime
create index if not exists richieste_creato_il_idx
  on public.richieste (creato_il desc);

-- ============================================================================
-- SICUREZZA (Row Level Security)
-- Regola: chiunque può INSERIRE una richiesta dal sito,
--         ma solo chi ha fatto il login può LEGGERLE e MODIFICARLE.
-- Senza queste policy la chiave pubblica del sito esporrebbe tutti i dati.
-- ============================================================================

alter table public.richieste enable row level security;

-- Il form pubblico può solo scrivere
drop policy if exists "chiunque puo inviare una richiesta" on public.richieste;
create policy "chiunque puo inviare una richiesta"
  on public.richieste for insert
  to anon, authenticated
  with check (true);

-- Solo l'admin autenticato può leggere
drop policy if exists "solo autenticati leggono" on public.richieste;
create policy "solo autenticati leggono"
  on public.richieste for select
  to authenticated
  using (true);

-- Solo l'admin autenticato può aggiornare (stato, note)
drop policy if exists "solo autenticati aggiornano" on public.richieste;
create policy "solo autenticati aggiornano"
  on public.richieste for update
  to authenticated
  using (true)
  with check (true);

-- Solo l'admin autenticato può cancellare
drop policy if exists "solo autenticati cancellano" on public.richieste;
create policy "solo autenticati cancellano"
  on public.richieste for delete
  to authenticated
  using (true);
