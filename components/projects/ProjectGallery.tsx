/* eslint-disable @next/next/no-img-element */
// Renders project media: featured items go full-width, the rest form a 2-col gallery.
// Plain <img> (not next/image) — static export, and these are pre-sized assets.

import type { ProjectMedia } from '@/lib/projects'

function Figure({ media, className }: { media: ProjectMedia; className?: string }) {
  return (
    <figure className={className}>
      <img
        src={media.src}
        alt={media.alt}
        loading="lazy"
        className="w-full rounded-xl border border-neutral-200 bg-neutral-50"
      />
      {media.caption && (
        <figcaption className="mt-2 text-xs leading-relaxed text-neutral-500">
          {media.caption}
        </figcaption>
      )}
    </figure>
  )
}

export default function ProjectGallery({ media }: { media: ProjectMedia[] }) {
  const featured = media.filter(m => m.featured)
  const rest = media.filter(m => !m.featured)

  return (
    <div className="space-y-5">
      {featured.map(m => (
        <Figure key={m.src} media={m} />
      ))}
      {rest.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2">
          {rest.map(m => (
            <Figure key={m.src} media={m} />
          ))}
        </div>
      )}
    </div>
  )
}
