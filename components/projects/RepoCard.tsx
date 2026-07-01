/* eslint-disable @next/next/no-img-element */
// Hand-rolled GitHub repo card + shields.io badges. Fully static — no API calls,
// no rate limits. Badge images are fetched (and cached) by shields.io at view time.

const GitHubIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 16 16" width="20" height="20" fill="currentColor" aria-hidden className={className}>
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
  </svg>
)

export default function RepoCard({ repo }: { repo: string }) {
  const url = `https://github.com/${repo}`
  const badges = [
    { alt: 'GitHub stars', src: `https://img.shields.io/github/stars/${repo}?style=flat&color=525252&labelColor=171717` },
    { alt: 'Last commit', src: `https://img.shields.io/github/last-commit/${repo}?style=flat&color=525252&labelColor=171717` },
    { alt: 'Top language', src: `https://img.shields.io/github/languages/top/${repo}?style=flat&color=525252&labelColor=171717` },
  ]

  return (
    <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex items-center gap-2.5 text-neutral-900 transition-colors hover:text-neutral-600"
      >
        <GitHubIcon className="shrink-0" />
        <span className="font-mono text-sm">{repo}</span>
        <svg width="13" height="13" viewBox="0 0 15 15" fill="none" aria-hidden className="shrink-0 opacity-50 transition-opacity group-hover:opacity-100">
          <path d="M4 11L11 4M11 4H5M11 4v6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {badges.map(b => (
          <img key={b.alt} src={b.src} alt={b.alt} height={20} className="h-5" loading="lazy" />
        ))}
      </div>
    </div>
  )
}
