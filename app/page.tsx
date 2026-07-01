import Link from 'next/link'
import { projects } from '@/lib/projects'
import HeroAsk from '@/components/HeroAsk'
import HeroIntro from '@/components/HeroIntro'

// Feature the non-RAG projects here — the RAG widget is the hero's own Ask entry point.
const featured = projects.filter(p => p.slug !== 'rag')

export default function Home() {
  return (
    <main className="flex-1">
      {/* Fluid container — caps at 1200px on ultra-wide screens, scales its side gutters below that. */}
      <div className="mx-auto w-[min(1200px,92vw)]">
        {/* Availability pill — pinned top-right, just below the nav. */}
        <div className="flex justify-end pt-[clamp(1.5rem,4vh,3rem)]">
          <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-3 py-1 font-mono text-xs text-neutral-600">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-accent animate-dot-pulse" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            Available for work
          </span>
        </div>
        {/* Hero — a deliberate full-viewport section (min 100svh, capped so it never looks absurd on
            very tall screens), content vertically centred so the whitespace reads as intentional
            breathing room. Two columns above 900px (copy + CTAs left, Ask panel right); below that it
            collapses to one column. DOM order is copy → ask → CTAs, so the stack never reverses. */}
        <section className="grid gap-[clamp(2rem,5vh,3rem)] pt-[clamp(1rem,2vh,1.5rem)] pb-[var(--section-space)] min-[900px]:grid-cols-2 min-[900px]:gap-x-12">
          {/* Copy — column 1, row 1 (always first) */}
          <div className="min-[900px]:col-start-1 min-[900px]:row-start-1">
            <HeroIntro />
          </div>

          {/* Ask panel — column 2, spanning both rows and vertically centred against the left stack */}
          <div className="min-[900px]:col-start-2 min-[900px]:row-span-2 min-[900px]:self-center">
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
              <p className="font-mono text-xs font-medium uppercase tracking-widest text-neutral-400">
                Ask this site
              </p>
              <div className="mt-3">
                <HeroAsk />
              </div>
            </div>
          </div>

          {/* CTAs — column 1, row 2 (directly under the copy on desktop; last on mobile) */}
          <div className="flex flex-wrap gap-3 min-[900px]:col-start-1 min-[900px]:row-start-2">
            <Link
              href="/projects"
              className="inline-flex h-11 items-center rounded-full bg-neutral-900 px-6 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
            >
              View projects
            </Link>
            <Link
              href="/cv"
              className="inline-flex h-11 items-center rounded-full border border-neutral-300 bg-white px-6 text-sm font-medium text-neutral-900 transition-colors hover:border-neutral-900"
            >
              Read my CV
            </Link>
          </div>
        </section>

        {/* Projects strip — the gap above comes from the hero's bottom padding, so only pad the
            bottom here to avoid doubling the shared spacing at the section boundary. */}
        <section className="pb-[var(--section-space)]">
          <h2 className="font-mono text-sm font-medium uppercase tracking-widest text-neutral-400">
            Selected work
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {featured.map(({ slug, name, tagline, status, stack }) => (
              <Link
                key={slug}
                href={`/projects/${slug}`}
                className="group rounded-2xl border border-neutral-200 bg-white p-6 transition duration-200 hover:border-accent hover:bg-neutral-50 hover:shadow-md motion-safe:hover:-translate-y-1"
              >
                <h3 className="flex items-center justify-between text-lg font-medium text-neutral-900">
                  {name}
                  <span className="text-neutral-400 transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-neutral-600">{tagline}</p>

                {/* Tech-stack tags — mono, accent-tinted. Capped so a long stack doesn't wrap forever. */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {stack.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md bg-accent/10 px-2 py-0.5 font-mono text-xs text-accent"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Status dot — semantic (green = shipped, amber = in progress), with a mono label. */}
                <div className="mt-4 flex items-center gap-1.5">
                  <span
                    aria-hidden="true"
                    className={`h-1.5 w-1.5 rounded-full ${
                      status === 'shipped' ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                  />
                  <span className="font-mono text-xs uppercase tracking-wide text-neutral-400">
                    {status === 'shipped' ? 'Shipped' : 'In progress'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-6">
            <Link
              href="/projects"
              className="text-sm font-medium text-accent transition-opacity hover:opacity-70"
            >
              See all projects →
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
