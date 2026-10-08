/* ============================================================================
   DATI DI CONTATTO
   Unico punto da modificare: sono usati sia nella sezione Contatti sia nel
   footer, così non si rischia di aggiornarne uno e dimenticare l'altro.
   ========================================================================== */

export const TELEFONO_LEGGIBILE = '345 881 6003'
// Formato internazionale senza spazi: serve per i link tel: e WhatsApp
export const TELEFONO_INTL = '+393458816003'
export const EMAIL = 'salvatore-lombardi@blu.it'

/* I profili social.
   TODO: incolla qui i tuoi indirizzi. Finché restano `null` le icone non
   compaiono, così non si rischia di pubblicare un link rotto. */
export const SOCIAL = [
  { id: 'instagram', label: 'Instagram', url: null },
  { id: 'facebook', label: 'Facebook', url: null },
]

/** Loghi dei social, disegnati a mano per non dipendere da librerie esterne */
export const LOGHI_SOCIAL = {
  instagram: (
    <>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  facebook: (
    <path d="M14.5 8.5h2.2V5.3h-2.6c-2.4 0-3.9 1.5-3.9 4v2.2H7.8v3.2h2.4v7.8h3.4v-7.8h2.5l.5-3.2h-3v-1.8c0-.8.3-1.2 1-1.2Z" />
  ),
}

/** Icona social riutilizzabile */
export function IconaSocial({ id, className = 'size-5' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {LOGHI_SOCIAL[id]}
    </svg>
  )
}
