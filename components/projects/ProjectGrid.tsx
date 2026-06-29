'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import type { Project } from '@/lib/projects'
import StatusBadge from './StatusBadge'

export default function ProjectGrid({ projects }: { projects: Project[] }) {
  return (
    <ul className="grid gap-5 sm:grid-cols-2">
      {projects.map((project, i) => (
        <motion.li
          key={project.slug}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.06, ease: 'easeOut' }}
        >
          <Link
            href={`/projects/${project.slug}`}
            className="group flex h-full flex-col rounded-xl border border-neutral-200 bg-white p-6 transition-all hover:border-neutral-400 hover:shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-lg font-semibold tracking-tight text-neutral-900">
                {project.name}
              </h2>
              <StatusBadge status={project.status} />
            </div>

            <p className="mt-2 flex-1 text-[15px] leading-relaxed text-neutral-600">
              {project.tagline}
            </p>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {project.stack.slice(0, 4).map(tech => (
                <span
                  key={tech}
                  className="rounded-full border border-neutral-200 px-2 py-0.5 font-mono text-[11px] text-neutral-500"
                >
                  {tech}
                </span>
              ))}
              {project.stack.length > 4 && (
                <span className="px-1 py-0.5 font-mono text-[11px] text-neutral-400">
                  +{project.stack.length - 4}
                </span>
              )}
            </div>

            <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-neutral-500 transition-colors group-hover:text-neutral-900">
              View project
              <svg width="14" height="14" viewBox="0 0 15 15" fill="none" aria-hidden className="transition-transform group-hover:translate-x-0.5">
                <path d="M4 7.5h7M8 4.5l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </Link>
        </motion.li>
      ))}
    </ul>
  )
}
