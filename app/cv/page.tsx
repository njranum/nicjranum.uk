import type { Metadata } from 'next'
import { cv } from '@/lib/cv'
import CvSection from '@/components/cv/CvSection'
import EntryHeader from '@/components/cv/EntryHeader'

export const metadata: Metadata = {
  title: 'CV — Nic Ranum',
  description: `CV of ${cv.name} — ${cv.tagline}. ${cv.summary}`,
}

export default function CvPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12 print:py-0 print:max-w-none">
      {/* Header */}
      <header className="mb-8 print:mb-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
              {cv.name}
            </h1>
            <p className="mt-1 text-neutral-600">{cv.tagline}</p>
          </div>
          <a
            href={cv.pdfPath}
            download
            className="inline-flex items-center gap-2 rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-900 hover:text-neutral-900 print:hidden"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              aria-hidden="true"
              className="shrink-0"
            >
              <path
                d="M7.5 1.5v8m0 0L4.5 6.5m3 3l3-3M2.5 11.5v1a1 1 0 001 1h8a1 1 0 001-1v-1"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Download PDF
          </a>
        </div>

        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm text-neutral-600">
          {cv.contact.map(c => (
            <li key={c.label}>
              <a
                href={c.href}
                className="transition-colors hover:text-neutral-900"
                {...(c.href.startsWith('http')
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
              >
                {c.display}
              </a>
            </li>
          ))}
        </ul>
      </header>

      <div className="space-y-8 print:space-y-5">
        {/* Summary */}
        <CvSection title="Summary">
          <p className="text-[15px] leading-relaxed text-neutral-700">{cv.summary}</p>
        </CvSection>

        {/* Experience */}
        <CvSection title="Experience">
          {cv.experience.map(job => (
            <div key={`${job.company}-${job.start}`}>
              <EntryHeader
                title={job.role}
                subtitle={job.company}
                meta={`${job.start} – ${job.end}`}
                metaSub={job.location}
              />
              <ul className="mt-2 list-disc space-y-1 pl-5 text-[15px] leading-relaxed text-neutral-700 marker:text-neutral-300">
                {job.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </CvSection>

        {/* Education */}
        <CvSection title="Education">
          {cv.education.map(ed => (
            <EntryHeader
              key={ed.institution}
              title={ed.institution}
              subtitle={ed.qualification}
              meta={`${ed.start} – ${ed.end}`}
              metaSub={ed.location}
            />
          ))}
        </CvSection>

        {/* Awards */}
        <CvSection title="Awards & Honors">
          {cv.awards.map(award => (
            <div key={award.title}>
              <EntryHeader title={award.title} subtitle={award.issuer} meta={award.date} />
              {award.description && (
                <p className="mt-2 text-[15px] leading-relaxed text-neutral-700">
                  {award.description}
                </p>
              )}
            </div>
          ))}
        </CvSection>

        {/* Skills */}
        <CvSection title="Skills">
          <dl className="space-y-3">
            {cv.skills.map(group => (
              <div key={group.label} className="sm:flex sm:gap-4">
                <dt className="w-48 shrink-0 text-sm font-medium text-neutral-900">
                  {group.label}
                </dt>
                <dd className="mt-1 flex flex-wrap gap-x-2 gap-y-1 text-[15px] text-neutral-700 sm:mt-0">
                  {group.items.join(', ')}
                </dd>
              </div>
            ))}
          </dl>
        </CvSection>

        {/* Projects */}
        <CvSection title="Projects">
          {cv.projects.map(project => (
            <div key={project.name}>
              <h3 className="font-medium text-neutral-900">{project.name}</h3>
              <p className="mt-0.5 font-mono text-xs text-neutral-500">
                {project.stack.join(' · ')}
              </p>
              <p className="mt-2 text-[15px] leading-relaxed text-neutral-700">
                {project.description}
              </p>
            </div>
          ))}
        </CvSection>
      </div>
    </main>
  )
}
