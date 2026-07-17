'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { timeline } from '@/lib/timeline'

// Scroll-driven career timeline (ported from design_handoff_timeline/). Entries alternate
// around a central spine; the entry whose dot is nearest the viewport centre sharpens into
// focus while neighbours dim, shrink and blur; an accent progress line fills the spine and a
// generated month/year ruler runs along it. Entries are equally spaced, so the time axis
// compresses differently per segment — the ruler adapts its tick density to match (see
// buildRuler). All per-frame work writes styles directly via refs — never React state — so it
// stays off the render path and runs every frame smoothly. Below 768px the spine moves to the
// left edge and all cards sit on one side. Under prefers-reduced-motion the
// opacity/transform/blur choreography is skipped entirely.

interface TimelineProps {
  /** Accent override for this section only. Defaults to the site-wide `--accent`. */
  accent?: string
  /** Gentle `y proximity` snap so dots settle on the viewport centre. Off by default —
   *  free scrolling feels more natural on a page with content above and below. */
  snapScroll?: boolean
  /** 0.3–0.95 — how far unfocused entries dim (unfocused opacity = 1 − focusContrast). */
  focusContrast?: number
}

const MONTHS = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// Ruler tick steps (in months) a segment may use, densest first. All divide 12 so ticks stay
// aligned to January regardless of step. MIN_TICK_SPACING is the px gap that keeps every tick
// comfortably labelled.
const TICK_STEPS = [1, 2, 3, 4, 6, 12]
const MIN_TICK_SPACING = 28

// Entries are equally spaced: each row shares the same min-height (min-h-[440px] on the row —
// roughly one card plus breathing room; `min` so an unusually tall card can never overlap the
// next row). The real elapsed time between entries is expressed by the ruler's tick density
// rather than by distance.
const rows = timeline.map((entry, i) => ({
  ...entry,
  ym: entry.year * 12 + entry.month,
  side: i % 2 === 0 ? ('left' as const) : ('right' as const),
}))

// One ruler tick at `y` px from the top of the wrapper. January ticks are bigger and carry the
// year. Labels render on desktop only — `alignLeft` puts a segment's labels on whichever side
// of the spine its card leaves free, so a label can never be covered by a card. On mobile the
// cards sit a few px from the spine (no room for axis text) and each card's date pill already
// annotates the axis, so mobile gets ticks only. Returns the created elements so the scroll
// loop can tint them accent as the progress line passes (inline colours override the class
// defaults; clearing them falls back).
function addTick(parent: ParentNode, y: number, big: boolean, label: string, desktop: boolean, alignLeft: boolean) {
  const tick = document.createElement('div')
  tick.className = `absolute left-[var(--spine-x)] -translate-x-1/2 -translate-y-1/2 transition-colors duration-[350ms] ${
    big ? 'h-[2px] w-[30px] bg-black/35' : 'h-px w-4 bg-black/15'
  }`
  tick.style.top = `${y}px`
  parent.appendChild(tick)
  if (!desktop) return { tick, label: null }
  const el = document.createElement('div')
  el.textContent = label
  el.className = `absolute -translate-y-1/2 whitespace-nowrap font-mono tracking-[0.06em] transition-colors duration-[350ms] ${
    big ? 'text-[13px] font-bold text-black/50' : 'text-[10px] font-medium text-black/30'
  }`
  el.style.top = `${y}px`
  if (alignLeft) {
    el.style.right = 'calc(50% + 26px)'
    el.style.textAlign = 'right'
  } else {
    el.style.left = 'calc(50% + 26px)'
  }
  parent.appendChild(el)
  return { tick, label: el }
}

export default function Timeline({ accent, snapScroll = false, focusContrast = 0.75 }: TimelineProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const rulerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const desktopMq = window.matchMedia('(min-width: 768px)')
    const entries = Array.from(root.querySelectorAll<HTMLElement>('[data-tl-entry]'))
    let alive = true

    // Ruler ticks with their wrapper-relative y, so the scroll loop can tint the ones the
    // progress line has passed. Rebuilt alongside the ruler; `lit` avoids redundant writes.
    type TickRecord = { el: HTMLElement; label: HTMLElement | null; y: number; big: boolean; lit: boolean }
    const ticks: TickRecord[] = []

    const update = () => {
      const vh = window.innerHeight
      const mid = vh / 2
      const minO = 1 - focusContrast
      const desktop = desktopMq.matches
      for (const el of entries) {
        const dot = el.querySelector<HTMLElement>('[data-tl-dot]')
        const r = (dot ?? el).getBoundingClientRect()
        // Focus factor: 1 at the viewport centre, 0 beyond ~55% of the viewport, smoothstepped.
        const f = 1 - Math.min(Math.abs(r.top + r.height / 2 - mid) / (vh * 0.55), 1)
        const e = f * f * (3 - 2 * f)
        const on = e > 0.55
        if (!reduce) {
          el.style.opacity = (minO + (1 - minO) * e).toFixed(3)
          const card = el.querySelector<HTMLElement>('[data-tl-card]')
          if (card) {
            // Cards drift toward the spine and up to full scale as they focus.
            const side = desktop && el.dataset.side === 'left' ? -1 : 1
            card.style.transform = `translateX(${(side * (1 - e) * 42).toFixed(1)}px) scale(${(0.94 + 0.06 * e).toFixed(3)})`
            card.style.filter = `blur(${((1 - e) * 1.8).toFixed(2)}px)`
          }
          if (dot) dot.style.transform = `scale(${(0.75 + 0.55 * e).toFixed(2)})`
        }
        if (dot) {
          dot.style.backgroundColor = on ? 'var(--accent)' : '#fff'
          dot.style.borderColor = on ? 'var(--accent)' : 'rgba(0,0,0,0.28)'
          dot.style.boxShadow = on ? '0 0 0 7px color-mix(in srgb, var(--accent) 13%, transparent)' : 'none'
        }
      }
      const wr = root.getBoundingClientRect()
      const filled = Math.min(Math.max(mid - wr.top, 0), wr.height)
      const progress = progressRef.current
      if (progress) progress.style.height = `${filled}px`
      // Tint ticks/labels the progress line has swept past; clearing the inline colour falls
      // back to the class default. Only ticks that crossed the edge this frame get touched.
      for (const t of ticks) {
        const lit = t.y <= filled
        if (lit === t.lit) continue
        t.lit = lit
        if (t.big) {
          t.el.style.backgroundColor = lit ? 'var(--accent)' : ''
          if (t.label) t.label.style.color = lit ? 'var(--accent)' : ''
        } else {
          t.el.style.backgroundColor = lit ? 'color-mix(in srgb, var(--accent) 45%, transparent)' : ''
          if (t.label) t.label.style.color = lit ? 'color-mix(in srgb, var(--accent) 65%, transparent)' : ''
        }
      }
    }

    const buildRuler = () => {
      const ruler = rulerRef.current
      if (!ruler) return
      ruler.replaceChildren()
      ticks.length = 0
      const desktop = desktopMq.matches
      const rootTop = root.getBoundingClientRect().top
      const centerY = (el: HTMLElement) => {
        const r = el.querySelector<HTMLElement>('[data-tl-dot]')!.getBoundingClientRect()
        return r.top - rootTop + r.height / 2
      }
      const frag = document.createDocumentFragment()
      for (let i = 0; i < entries.length - 1; i++) {
        const mNew = Number(entries[i].dataset.ym)
        const mOld = Number(entries[i + 1].dataset.ym)
        const dm = mNew - mOld
        if (dm <= 0) continue
        const yNew = centerY(entries[i])
        const yOld = centerY(entries[i + 1])
        const perMonth = Math.abs(yOld - yNew) / dm
        // Entries are equidistant, so each segment compresses time differently. One rule keeps
        // the ruler looking uniform: pick the smallest month step whose ticks sit ≥ ~28px apart,
        // and label every tick (the spacing guarantee makes labels always safe). Steps all
        // divide 12 so January — the big tick with its year label — never drops out. Ticks land
        // on whole months strictly between adjacent dots (the dots mark the entry months),
        // interpolated linearly between the two dot positions.
        const step = TICK_STEPS.find((s) => perMonth * s >= MIN_TICK_SPACING) ?? 12
        // The only card inside this segment's strip is the newer entry's — labels take the
        // opposite side of the spine so they always sit in open space.
        const labelsLeft = entries[i].dataset.side === 'right'
        for (let mi = mOld + 1; mi < mNew; mi++) {
          const month = ((mi - 1) % 12) + 1
          if ((month - 1) % step !== 0) continue
          const isJan = month === 1
          const y = yOld + ((yNew - yOld) * (mi - mOld)) / dm
          const year = Math.floor((mi - 1) / 12)
          const label = isJan ? String(year) : `${MONTHS[month]} '${String(year).slice(2)}`
          const made = addTick(frag, y, isJan, label, desktop, labelsLeft)
          ticks.push({ el: made.tick, label: made.label, y, big: isJan, lit: false })
        }
      }
      ruler.appendChild(frag)
    }

    let raf: number | null = null
    const onScroll = () => {
      if (raf === null)
        raf = requestAnimationFrame(() => {
          raf = null
          update()
        })
    }
    let resizeTimer: ReturnType<typeof setTimeout>
    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        buildRuler()
        update()
      }, 150)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })
    if (snapScroll) document.documentElement.style.scrollSnapType = 'y proximity'

    buildRuler()
    update()
    // Rebuild once layout settles (web fonts and the page-transition mount can shift geometry).
    const settle = setTimeout(() => {
      buildRuler()
      update()
    }, 300)
    document.fonts?.ready.then(() => {
      if (!alive) return
      buildRuler()
      update()
    })

    return () => {
      alive = false
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      if (raf !== null) cancelAnimationFrame(raf)
      clearTimeout(resizeTimer)
      clearTimeout(settle)
      if (snapScroll) document.documentElement.style.scrollSnapType = ''
    }
  }, [snapScroll, focusContrast])

  return (
    <div
      ref={rootRef}
      className="relative mx-auto max-w-[1180px] pb-[10vh] pt-[6vh] [--spine-x:18px] md:[--spine-x:50%]"
      style={accent ? ({ '--accent': accent } as React.CSSProperties) : undefined}
    >
      {/* Spine, accent progress fill, and the generated month/year ruler overlay */}
      <div aria-hidden="true" className="absolute bottom-0 top-0 left-[var(--spine-x)] w-[2px] -translate-x-1/2 bg-black/10" />
      <div ref={progressRef} aria-hidden="true" className="absolute top-0 left-[var(--spine-x)] h-0 w-[2px] -translate-x-1/2 bg-accent" />
      <div ref={rulerRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-0" />

      {rows.map((row) => (
        <div
          key={row.ym}
          data-tl-entry=""
          data-side={row.side}
          data-ym={row.ym}
          className="relative z-[2] grid min-h-[440px] grid-cols-[36px_minmax(0,1fr)] items-start gap-x-4 pt-14 md:grid-cols-[minmax(0,1fr)_72px_minmax(0,1fr)] md:gap-x-0"
>
          {/* Dot on the spine (with a small tick crossing it) */}
          <div className="relative z-[3] col-start-1 row-start-1 flex snap-center items-center justify-center md:col-start-2">
            <div aria-hidden="true" className="absolute left-1/2 top-1/2 h-[2px] w-[26px] -translate-x-1/2 -translate-y-1/2 bg-black/25" />
            <div
              data-tl-dot
              className="relative h-[17px] w-[17px] rounded-full border-2 border-black/30 bg-white transition-[background-color,border-color,box-shadow] duration-[350ms]"
            />
          </div>

          {/* Card — hugs the spine; alternates sides on desktop, always right of it on mobile */}
          <div
            className={`relative z-[3] col-start-2 row-start-1 flex ${
              row.side === 'left' ? 'md:col-start-1 md:justify-end' : 'md:col-start-3 md:justify-start'
            }`}
          >
            <Link
              href="/cv"
              data-tl-card
              className="group block w-full max-w-[440px] rounded-2xl border border-neutral-200 bg-white px-[30px] py-[26px] shadow-sm transition-[border-color,box-shadow] duration-200 will-change-[transform,opacity,filter] hover:border-accent hover:shadow-md"
            >
              <p className="mb-[13px] font-mono text-[13px] font-semibold uppercase leading-none tracking-[0.08em] text-accent">
                {row.date}
              </p>
              <h3 className="text-[23px] font-bold leading-[1.22] tracking-[-0.012em] text-neutral-900">{row.title}</h3>
              <ul className="mt-[15px] flex flex-col gap-2.5">
                {row.bullets.map((bullet) => (
                  <li key={bullet} className="relative pl-5 text-[15px] leading-normal text-neutral-600">
                    <span aria-hidden="true" className="absolute left-0 top-2 h-1.5 w-1.5 rounded-full bg-accent" />
                    {bullet}
                  </li>
                ))}
              </ul>
              <p className="mt-[18px] text-sm font-medium text-accent transition-opacity duration-200 md:opacity-0 md:group-hover:opacity-100 md:motion-reduce:opacity-100">
                Read the full CV →
              </p>
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
