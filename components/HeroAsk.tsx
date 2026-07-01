'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState, useSyncExternalStore } from 'react'

const REDUCE_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

// Subscribe to the OS motion preference as an external store — avoids setState-in-effect and stays
// SSR-safe (the server snapshot assumes reduced, so no animation renders until hydration confirms).
function subscribeMotion(callback: () => void) {
  const mq = window.matchMedia(REDUCE_MOTION_QUERY)
  mq.addEventListener('change', callback)
  return () => mq.removeEventListener('change', callback)
}
const getMotionSnapshot = () => window.matchMedia(REDUCE_MOTION_QUERY).matches
const getMotionServerSnapshot = () => true

// Example prompts shown as clickable chips under the hero input, and cycled through the animated
// placeholder. Each hands off to /ask exactly like a typed query — it's an entry point, not a
// live RAG call.
const EXAMPLE_PROMPTS = [
  "What is Nic's work experience?",
  'Tell me about the ama-rag project',
  'Are you open to work?',
]

const REAL_PLACEHOLDER = 'Ask me anything about my work…'

// Typewriter timings (ms). Gentle typing, quicker delete, a readable hold at the full question.
const TYPE_MS = 65
const DELETE_MS = 35
const HOLD_MS = 1400
const BETWEEN_MS = 400
const START_MS = 500

export default function HeroAsk() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const [typed, setTyped] = useState('')
  const reduceMotion = useSyncExternalStore(
    subscribeMotion,
    getMotionSnapshot,
    getMotionServerSnapshot,
  )

  // Only animate when the field is idle: not focused, empty, and motion is allowed.
  const animating = !reduceMotion && !focused && query === ''

  // Typewriter loop — type a question, hold, delete, advance, repeat. Driven by a self-rescheduling
  // timeout so a single cleanup stops it, and it fully unwinds when `animating` goes false.
  useEffect(() => {
    if (!animating) return
    let timer: ReturnType<typeof setTimeout>
    let promptIndex = 0
    let charIndex = 0
    let deleting = false

    const tick = () => {
      const full = EXAMPLE_PROMPTS[promptIndex]
      if (!deleting) {
        charIndex += 1
        setTyped(full.slice(0, charIndex))
        if (charIndex === full.length) {
          deleting = true
          timer = setTimeout(tick, HOLD_MS)
          return
        }
        timer = setTimeout(tick, TYPE_MS)
      } else {
        charIndex -= 1
        setTyped(full.slice(0, charIndex))
        if (charIndex === 0) {
          deleting = false
          promptIndex = (promptIndex + 1) % EXAMPLE_PROMPTS.length
          timer = setTimeout(tick, BETWEEN_MS)
          return
        }
        timer = setTimeout(tick, DELETE_MS)
      }
    }

    // Kick off asynchronously: clear any stale text, then begin the loop. Doing the reset inside a
    // timeout (rather than synchronously in the effect body) keeps state updates out of the render
    // pass and avoids a flash of the previous question when the animation restarts.
    timer = setTimeout(() => {
      setTyped('')
      timer = setTimeout(tick, START_MS)
    }, 0)
    return () => clearTimeout(timer)
  }, [animating])

  // Hand off to the existing /ask page with the query in the URL; /ask reads ?q= and auto-runs it.
  // The hero never calls the RAG endpoint itself — it only navigates. Empty input does nothing.
  function goToAsk(text: string) {
    const q = text.trim()
    if (!q) return
    router.push(`/ask?q=${encodeURIComponent(q)}`)
  }

  function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    goToAsk(query)
  }

  return (
    <div>
      <form
        onSubmit={onSubmit}
        className="flex items-center gap-2 rounded-xl border border-neutral-300 bg-white p-1.5 shadow-sm transition-colors focus-within:border-neutral-900"
      >
        <div className="relative min-w-0 flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            // Native placeholder is the real one; it only shows when the typewriter overlay is off
            // (on focus, while typing, or under reduced motion) so the two never collide.
            placeholder={animating ? '' : REAL_PLACEHOLDER}
            aria-label="Ask me anything about my work"
            className="w-full bg-transparent px-3 py-2 text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
          />
          {animating && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 flex items-center overflow-hidden px-3 text-neutral-400"
            >
              <span className="truncate">{typed}</span>
              <span className="ml-0.5 inline-block h-[1.15em] w-[2px] shrink-0 animate-caret bg-accent" />
            </div>
          )}
        </div>
        <button
          type="submit"
          className="shrink-0 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
        >
          Ask
        </button>
      </form>

      <div className="mt-3 flex flex-wrap gap-2">
        {EXAMPLE_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => goToAsk(prompt)}
            className="rounded-full border border-neutral-200 px-3 py-1.5 text-sm text-neutral-600 transition duration-[180ms] hover:border-accent hover:bg-accent/10 hover:text-accent motion-safe:hover:-translate-y-px"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  )
}
