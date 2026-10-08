// Edge Function: manda una mail a Salvatore a ogni nuova riga nella tabella `richieste`.
// Chiamata dal trigger SQL in supabase/avviso-mail.sql (database webhook).
// Segreti richiesti: RESEND_API_KEY, WEBHOOK_SECRET, EMAIL_DESTINATARIO

const esc = (v: unknown) =>
  String(v ?? '—').replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`)

Deno.serve(async (req) => {
  if (req.headers.get('x-webhook-secret') !== Deno.env.get('WEBHOOK_SECRET')) {
    return new Response('non autorizzato', { status: 401 })
  }

  const { record: r } = await req.json()
  if (!r) return new Response('niente da inviare', { status: 400 })

  const righe: [string, unknown][] = [
    ['Nome', r.nome],
    ['Email', r.email],
    ['Tipo progetto', r.tipo_progetto],
    ['Stile', r.stile],
    ['Palette', r.palette],
    ['Angoli', r.angoli],
    ['Foto', r.foto],
    ['Testi', r.testi],
    ['Logo', r.logo],
  ]

  const html = `<h2>Nuova richiesta di preventivo</h2>
<table cellpadding="6">${righe
    .map(([k, v]) => `<tr><td><b>${k}</b></td><td>${esc(v)}</td></tr>`)
    .join('')}</table>
<p><a href="https://salvatorelombardi.com/#/admin">Apri l'Admin</a></p>`

  const risposta = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Sito <onboarding@resend.dev>',
      to: [Deno.env.get('EMAIL_DESTINATARIO')],
      reply_to: r.email,
      subject: `Nuovo preventivo da ${r.nome}`,
      html,
    }),
  })

  if (!risposta.ok) {
    console.error('Resend', risposta.status, await risposta.text())
    return new Response('invio fallito', { status: 502 })
  }
  return new Response('ok')
})
