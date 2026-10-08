-- Avviso via mail a ogni nuova richiesta.
-- Da incollare nell'SQL Editor di Supabase ed eseguire una volta sola,
-- DOPO aver pubblicato la funzione avviso-richiesta.
-- Se l'avviso fallisce, la richiesta viene salvata comunque.

create extension if not exists pg_net with schema extensions;

create or replace function public.avvisa_nuova_richiesta()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform net.http_post(
    url := 'https://rhndzctbdqgagwamwwbf.supabase.co/functions/v1/avviso-richiesta',
    headers := '{"Content-Type":"application/json","x-webhook-secret":"SEGRETO_QUI"}'::jsonb,
    body := jsonb_build_object('record', to_jsonb(new)),
    timeout_milliseconds := 5000
  );
  return new;
exception when others then
  return new;
end;
$$;

drop trigger if exists avviso_nuova_richiesta on public.richieste;
create trigger avviso_nuova_richiesta
  after insert on public.richieste
  for each row execute function public.avvisa_nuova_richiesta();
