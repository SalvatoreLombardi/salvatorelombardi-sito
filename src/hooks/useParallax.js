import { useScroll, useSpring, useTransform, useReducedMotion } from 'motion/react'

/**
 * Hook di parallax riutilizzabile.
 *
 * Collega lo scroll di una sezione a uno spostamento verticale: elementi con
 * `distance` diverse si muovono a velocità diverse e creano profondità.
 *
 * @param {import('react').RefObject<HTMLElement>} targetRef - la sezione da osservare
 * @param {object}  options
 * @param {number}  options.distance - px di spostamento a fine scroll (negativo = va verso l'alto)
 * @param {string[]} options.offset  - quando inizia/finisce il tracciamento
 * @param {boolean} options.smooth   - ammorbidisce il movimento con una molla
 * @returns {import('motion/react').MotionValue<number>} valore da passare a `style={{ y }}`
 */
export function useParallax(
  targetRef,
  { distance = 60, offset = ['start start', 'end start'], smooth = true } = {},
) {
  const prefersReducedMotion = useReducedMotion()

  // Progresso 0 -> 1 mentre la sezione attraversa il viewport
  const { scrollYProgress } = useScroll({ target: targetRef, offset })

  // Se l'utente ha chiesto meno movimento, l'ampiezza diventa zero
  const raw = useTransform(scrollYProgress, [0, 1], [0, prefersReducedMotion ? 0 : distance])

  // Molla leggera: elimina lo "scatto" dello scroll, restando reattiva su mobile
  const smoothed = useSpring(raw, { stiffness: 140, damping: 30, mass: 0.35 })

  return smooth && !prefersReducedMotion ? smoothed : raw
}
