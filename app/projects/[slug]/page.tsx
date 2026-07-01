import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { projects, getProject } from '@/lib/projects'
import StatusBadge from '@/components/projects/StatusBadge'
import RepoCard from '@/components/projects/RepoCard'
import ProjectGallery from '@/components/projects/ProjectGallery'

// Required for `output: 'export'` — pre-render one page per project at build time.
export function generateStaticParams() {
  return projects.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) return {}
  return {
    title: `${project.name} — Nic Ranum`,
    description: project.tagline,
  }
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) notFound()

  const repoUrl = `https://github.com/${project.repo}`

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <Link
        href="/projects"
        className="inline-flex items-center gap-1 text-sm text-neutral-500 transition-colors hover:text-neutral-900"
      >
        <svg width="14" height="14" viewBox="0 0 15 15" fill="none" aria-hidden>
          <path d="M11 7.5H4M7 4.5l-3 3 3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        All projects
      </Link>

      {/* Hero */}
      <header className="mt-6">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">{project.name}</h1>
          <StatusBadge status={project.status} />
        </div>
        <p className="mt-2 text-lg leading-relaxed text-neutral-600">{project.tagline}</p>

        <div className="mt-5 flex flex-wrap gap-1.5">
          {project.stack.map(tech => (
            <span
              key={tech}
              className="rounded-full border border-neutral-200 px-2.5 py-0.5 font-mono text-xs text-neutral-500"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
          >
            View on GitHub
          </a>
          {project.live && (
            <Link
              href={project.live.href}
              className="inline-flex items-center gap-2 rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-900 hover:text-neutral-900"
            >
              {project.live.label}
            </Link>
          )}
        </div>
      </header>

      <div className="mt-10 space-y-8">
        {/* Summary */}
        <section>
          <p className="text-[15px] leading-relaxed text-neutral-700">{project.summary}</p>
        </section>

        {/* Highlights */}
        {project.highlights.length > 0 && (
          <section className="border-t border-neutral-200 pt-6">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
              Highlights
            </h2>
            <ul className="list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-neutral-700 marker:text-neutral-300">
              {project.highlights.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Narrative blocks */}
        {project.blocks?.map(block => (
          <section key={block.heading} className="border-t border-neutral-200 pt-6">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
              {block.heading}
            </h2>
            <p className="text-[15px] leading-relaxed text-neutral-700">{block.body}</p>
          </section>
        ))}

        {/* Media */}
        {project.media && project.media.length > 0 && (
          <section className="border-t border-neutral-200 pt-6">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
              Screenshots
            </h2>
            <ProjectGallery media={project.media} />
          </section>
        )}

        {/* WIP note */}
        {project.status === 'wip' && (
          <section className="border-t border-neutral-200 pt-6">
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-[15px] leading-relaxed text-amber-800">
              This one’s still in active development — more detail coming soon. Follow along on GitHub in the meantime.
            </p>
          </section>
        )}

        {/* Repo */}
        <section className="border-t border-neutral-200 pt-6">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
            Repository
          </h2>
          <RepoCard repo={project.repo} />
        </section>
      </div>
    </main>
  )
}
