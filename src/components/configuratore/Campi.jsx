/* ============================================================================
   CAMPI DEL CONFIGURATORE
   Componenti di input riutilizzabili, coerenti con i token del design system.
   ========================================================================== */

/** Griglia di opzioni. Usa radio veri (nascosti) così funzionano
 *  tastiera e lettori di schermo senza codice extra. */
export function CampoScelta({ campo, valore, onChange }) {
  return (
    <fieldset className="border-0 p-0">
      {campo.titolo && (
        <legend className="mb-4 text-sm font-medium text-white/70">{campo.titolo}</legend>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {campo.opzioni.map((opzione) => {
          const selezionata = valore === opzione.valore

          return (
            <label
              key={opzione.valore}
              className={`relative flex cursor-pointer flex-col rounded-lg border p-5
                          transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
                          has-[:focus-visible]:outline has-[:focus-visible]:outline-2
                          has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent-500
                          ${
                            selezionata
                              ? 'border-accent-400/60 bg-accent-500/15 text-white shadow-soft'
                              : 'border-white/10 bg-white/[0.03] text-white hover:border-white/20 hover:bg-white/[0.06]'
                          }`}
            >
              {/* Il radio è invisibile ma resta l'elemento che governa la selezione */}
              <input
                type="radio"
                name={campo.nome}
                value={opzione.valore}
                checked={selezionata}
                onChange={() => onChange(campo.nome, opzione.valore)}
                className="sr-only"
              />

              <span className="text-[0.9375rem] font-medium tracking-[-0.011em]">
                {opzione.label}
              </span>

              {opzione.nota && (
                <span
                  className={`mt-1.5 text-[0.8125rem] leading-snug ${
                    selezionata ? 'text-white/70' : 'text-white/45'
                  }`}
                >
                  {opzione.nota}
                </span>
              )}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

/** Campo di testo / email / data */
export function CampoTesto({ campo, valore, onChange }) {
  const tipoHtml = { testo: 'text', email: 'email', data: 'date' }[campo.tipo]

  return (
    <div>
      <label
        htmlFor={campo.nome}
        className="mb-2 block text-sm font-medium text-white/70"
      >
        {campo.titolo}
        {!campo.obbligatorio && <span className="ml-2 text-white/40">(facoltativo)</span>}
      </label>

      <input
        id={campo.nome}
        name={campo.nome}
        type={tipoHtml}
        value={valore ?? ''}
        placeholder={campo.placeholder}
        onChange={(e) => onChange(campo.nome, e.target.value)}
        className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3.5
                   text-[0.9375rem] text-white placeholder:text-white/35
                   transition-colors duration-300
                   hover:border-white/20 focus:border-accent-400 focus:outline-none
                   [color-scheme:dark]"
      />
    </div>
  )
}
