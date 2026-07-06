import type { Metadata } from 'next'
import Link from 'next/link'
import { channels, email, location, responseTime } from '@/lib/contact'
import ContactEmail from '@/components/ContactEmail'
import ChannelIcon from '@/components/ChannelIcon'

export const metadata: Metadata = {
  title: 'Contact — Nic Ranum',
  description:
    'Get in touch with Nic Ranum — a software engineer based in London, open to new roles.',
}

export default function ContactPage() {
  return (
    <main className="flex-1">
      <div className="mx-auto w-[min(880px,92vw)] py-[clamp(2.5rem,6vh,4.5rem)]">
        {/* Status chips — availability (reuses the home page's pulsing dot) + location/timezone. */}
        <div className="flex flex-wrap gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-3 py-1 font-mono text-xs text-neutral-600">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-accent animate-dot-pulse" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            Available for work
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-3 py-1 font-mono text-xs text-neutral-600">
            {location.city} · {location.timezone}
          </span>
        </div>

        <header className="mt-6">
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
            Let&rsquo;s talk
          </h1>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-neutral-600">
            I&rsquo;m actively looking for a software engineering role and always happy to talk
            shop. Recruiter, fellow engineer, or just saying hi — email is the fastest way to
            reach me, or pick whichever channel suits you below.
          </p>
        </header>

        {/* Primary channel — email, with copy + compose. */}
        <section className="mt-8">
          <ContactEmail address={email.address} href={email.href} />
          <p className="mt-2 pl-1 font-mono text-xs text-neutral-400">{responseTime}</p>
        </section>

        {/* Secondary channels — LinkedIn, GitHub, scheduling. */}
        <section className="mt-8">
          <h2 className="font-mono text-sm font-medium uppercase tracking-widest text-neutral-400">
            Elsewhere
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {channels.map(ch => (
              <a
                key={ch.label}
                href={ch.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-4 rounded-2xl border border-neutral-200 bg-white p-5 transition duration-200 hover:border-accent hover:bg-neutral-50 hover:shadow-md motion-safe:hover:-translate-y-1"
              >
                <span className="mt-0.5 shrink-0 text-neutral-700 transition-colors group-hover:text-accent">
                  <ChannelIcon name={ch.icon} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between">
                    <span className="font-medium text-neutral-900">{ch.label}</span>
                    <span className="text-neutral-400 transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                  <span className="mt-0.5 block truncate font-mono text-xs text-neutral-500">
                    {ch.handle}
                  </span>
                  <span className="mt-2 block text-sm leading-relaxed text-neutral-600">
                    {ch.description}
                  </span>
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* Nudge toward the CV for anyone who wants the full picture first. */}
        <p className="mt-10 text-sm text-neutral-600">
          Prefer the full picture first?{' '}
          <Link href="/cv" className="font-medium text-accent transition-opacity hover:opacity-70">
            Read my CV →
          </Link>
        </p>
      </div>
    </main>
  )
}
