import { motion, useReducedMotion } from 'motion/react'

/**
 * Wrapper per il reveal allo scroll: l'elemento entra dal basso con una
 * dissolvenza morbida la prima volta che compare nel viewport.
 * È il mattone base delle animazioni di tutte le sezioni.
 *
 * @param {number} delay    - ritardo in secondi (per creare cascate)
 * @param {number} y        - px di partenza sotto la posizione finale
 * @param {number} duration - durata in secondi
 * @param {string} as       - tag HTML da renderizzare (default: div)
 */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  duration = 0.8,
  as = 'div',
  className = '',
  ...props
}) {
  const prefersReducedMotion = useReducedMotion()
  const Tag = motion[as] ?? motion.div

  return (
    <Tag
      className={className}
      initial={prefersReducedMotion ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      // once: l'animazione parte una sola volta
      // margin: anticipa di poco l'ingresso, così non si "vede arrivare"
      viewport={{ once: true, margin: '-12% 0px -12% 0px' }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      {...props}
    >
      {children}
    </Tag>
  )
}
