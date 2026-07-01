'use client'

import { motion, useReducedMotion, type Variants } from 'framer-motion'

// Staggered fade-up for the hero's opening lines. One tasteful load animation — the eyebrow,
// headline, and subhead rise in sequence. Fully disabled under prefers-reduced-motion.
const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

const line: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

export default function HeroIntro() {
  const reduce = useReducedMotion()

  // Reduced motion: render everything at rest, no opacity/transform animation.
  const motionProps = reduce
    ? {}
    : { initial: 'hidden' as const, animate: 'show' as const, variants: container }
  const itemVariants = reduce ? undefined : line

  return (
    <motion.div {...motionProps}>
      {/* Availability pill — mono, with an accent dot that pulses (motion-safe only). */}
      <motion.div variants={itemVariants} className="mb-5">
        <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-3 py-1 font-mono text-xs text-neutral-600">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-accent animate-dot-pulse" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
          Available for work
        </span>
      </motion.div>
      <motion.p
        variants={itemVariants}
        className="font-mono text-sm font-medium uppercase tracking-widest text-neutral-400"
      >
        Nic Ranum
      </motion.p>
      <motion.h1
        variants={itemVariants}
        className="mt-4 max-w-2xl text-[clamp(2.5rem,5.5vw,5rem)] font-semibold leading-[1.05] tracking-tight text-neutral-900"
      >
        Building software, <span className="text-accent">end to end.</span>
      </motion.h1>
      <motion.p
        variants={itemVariants}
        className="mt-6 max-w-xl text-[clamp(1rem,1.4vw,1.25rem)] leading-relaxed text-neutral-600"
      >
        Software engineer. This site answers for itself — ask it anything about
        my work below, or explore my projects and CV.
      </motion.p>
    </motion.div>
  )
}
