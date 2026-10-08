import { motion } from 'motion/react'

// Stili condivisi da tutte le varianti: pill, tipografia, transizioni
const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-medium ' +
  'tracking-[-0.011em] transition-colors duration-300 select-none'

const sizes = {
  md: 'h-11 px-6 text-[0.9375rem]',
  lg: 'h-14 px-8 text-[1.0625rem]',
}

const variants = {
  // Vetro liquido: l'effetto è definito in index.css (.vetro)
  vetro: 'vetro',
  // CTA principale: nero pieno, l'accento resta un dettaglio (ombra al hover)
  primary:
    'bg-ink-950 text-white hover:bg-ink-800 shadow-soft ' +
    'hover:shadow-[0_10px_40px_-12px_var(--color-accent-500)]',
  // Variante che usa il colore accento come riempimento
  accent: 'bg-accent-500 text-white hover:bg-accent-600 shadow-soft',
  // Azione secondaria, discreta
  ghost: 'bg-transparent text-white/60 hover:text-white hover:bg-white/10',
}

/**
 * Bottone di sistema. Se riceve `href` renderizza un <a> (utile per le ancore),
 * altrimenti un <button>.
 */
export function Button({
  children,
  href,
  variant = 'vetro',
  size = 'lg',
  className = '',
  ...props
}) {
  const Tag = href ? motion.a : motion.button
  const classes = `${base} ${sizes[size]} ${variants[variant]} ${className}`

  return (
    <Tag
      href={href}
      className={classes}
      // Micro-interazioni discrete, solo su transform: fluide anche su mobile
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      {...props}
    >
      {children}
    </Tag>
  )
}
