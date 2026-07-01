'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

// Example prompts shown as clickable chips under the hero input. Each hands off to /ask exactly
// like a typed query — it's an entry point, not a live RAG call.
const EXAMPLE_PROMPTS = [
  "What is Nic's work experience?",
  'Tell me about the ama-rag project',
  'Are you open to work?',
]

export default function HeroAsk() {
  const router = useRouter()
  const [query, setQuery] = useState('')

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
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask me anything about my work…"
          aria-label="Ask me anything about my work"
          className="min-w-0 flex-1 bg-transparent px-3 py-2 text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
        />
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
            className="rounded-full border border-neutral-200 px-3 py-1.5 text-sm text-neutral-600 transition-colors hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-900"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  )
}
