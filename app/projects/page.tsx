import type { Metadata } from 'next'
import { projects } from '@/lib/projects'
import ProjectGrid from '@/components/projects/ProjectGrid'

export const metadata: Metadata = {
  title: 'Projects — Nic Ranum',
  description: 'Selected projects by Nic Ranum — a Notion-integrated Pomodoro timer, a RAG portfolio widget, and an MCP server for AI tooling.',
}

export default function ProjectsPage() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
      <header className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">Projects</h1>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-neutral-600">
          A few things I’ve built recently. Pick one to read more.
        </p>
      </header>

      <ProjectGrid projects={projects} />
    </main>
  )
}
