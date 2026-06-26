import type { Metadata } from 'next'

import AskWidget from '@/components/AskWidget'

export const metadata: Metadata = {
  title: 'Ask — Nic Ranum',
  description: 'Ask a question about my background, projects, and experience.',
}

export default function AskPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">Ask me anything</h1>
      <p className="mt-2 text-neutral-600">
        A retrieval-augmented assistant that answers questions about my background, projects, and
        experience — grounded in my portfolio content, with the sources it used shown for each answer.
      </p>
      <div className="mt-8">
        <AskWidget />
      </div>
    </main>
  )
}
