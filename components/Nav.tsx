'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const links = [
  { href: '/', label: 'Home' },
  { href: '/ask', label: 'Ask' },
  { href: '/projects', label: 'Projects' },
  { href: '/cv', label: 'CV' },
]

export default function Nav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/80 backdrop-blur-sm print:hidden">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-sm font-semibold tracking-wide text-neutral-900 hover:text-neutral-600 transition-colors"
        >
          Nic Ranum
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-6">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`relative text-sm transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:bg-current after:content-[''] motion-safe:after:transition-transform motion-safe:after:duration-200 ${
                  pathname === href
                    ? 'font-medium text-accent after:scale-x-100'
                    : 'text-neutral-500 hover:text-neutral-900 after:scale-x-0 hover:after:scale-x-100'
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Hamburger button */}
        <button
          className="md:hidden p-1"
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span className="sr-only">Menu</span>
          <div className="flex flex-col gap-1.5">
            <span className={`block h-0.5 w-5 bg-neutral-900 transition-transform duration-200 ${open ? 'translate-y-2 rotate-45' : ''}`} />
            <span className={`block h-0.5 w-5 bg-neutral-900 transition-opacity duration-200 ${open ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 w-5 bg-neutral-900 transition-transform duration-200 ${open ? '-translate-y-2 -rotate-45' : ''}`} />
          </div>
        </button>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <ul className="md:hidden border-t border-neutral-200 bg-white/95 px-6 py-4 flex flex-col gap-4">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                onClick={() => setOpen(false)}
                className={`block text-sm transition-colors ${
                  pathname === href
                    ? 'font-medium text-accent'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  )
}
