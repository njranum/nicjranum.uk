'use client'

import { useState } from 'react'

/**
 * Primary email block. Big mono address, a copy-to-clipboard button with transient "Copied"
 * feedback, and a mailto "Compose" CTA. Client component only because of the clipboard
 * interaction; the mailto link works even if the Clipboard API is unavailable.
 */
export default function ContactEmail({ address, href }: { address: string; href: string }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard unavailable (insecure context / old browser) — silently no-op.
      // The visible mailto button below still gives them a way through.
    }
  }

  return (
    <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 sm:p-8">
      <p className="font-mono text-xs font-medium uppercase tracking-widest text-neutral-400">
        Email me
      </p>
      <div className="mt-3 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <a
          href={href}
          className="break-all font-mono text-lg text-neutral-900 transition-colors hover:text-accent sm:text-xl"
        >
          {address}
        </a>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={copy}
            aria-live="polite"
            className="inline-flex h-10 items-center gap-1.5 rounded-full border border-neutral-300 bg-white px-4 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-900 hover:text-neutral-900"
          >
            {copied ? 'Copied ✓' : 'Copy'}
          </button>
          <a
            href={href}
            className="inline-flex h-10 items-center rounded-full bg-neutral-900 px-5 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
          >
            Compose →
          </a>
        </div>
      </div>
    </div>
  )
}
