/** L'icona dell'assistente AI: il cerchio disegnato a mano con la nuvoletta dentro, la stessa del bottone della chat, in piccolo accanto ai testi. */
export function IconaNuvoletta({ className = 'h-nuvoletta' }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <path d="M50 4C76 3 97 24 96 51C95 77 75 97 49 96C23 95 3 76 4 49C5 25 24 5 52 5" />
      <path d="M30 36C30 31 34 29 39 29L62 29C67 29 70 32 70 37L70 54C70 59 67 62 62 62L48 62L36 72L38 62C33 62 30 59 30 54Z" />
      <path d="M42 42L58 42" />
      <path d="M42 50L53 50" />
    </svg>
  )
}
