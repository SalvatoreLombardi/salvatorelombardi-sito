-- ============================================================================
-- AGGIORNAMENTO: risposte specifiche per sito, video e social
-- Da incollare nell'SQL Editor di Supabase ed eseguire UNA VOLTA.
-- Aggiunge la colonna `dettagli` (un elenco di risposte) alla tabella delle richieste.
-- Le richieste già salvate non cambiano.
-- ============================================================================

alter table public.richieste add column if not exists dettagli jsonb;

-- Limite di dimensione: blocca testi enormi inviati a mano all'API
alter table public.richieste drop constraint if exists richieste_dettagli_lunghezza;
alter table public.richieste add constraint richieste_dettagli_lunghezza check (
  dettagli is null or length(dettagli::text) <= 2000
) not valid;
