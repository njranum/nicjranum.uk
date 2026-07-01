'use client'

import { useEffect, useRef } from 'react'

// Full-page interactive dot-grid rendered to a single <canvas>. Base dots are faint/neutral; dots
// near the (smoothed) cursor light toward the accent and grow with a quadratic falloff, plus a
// time+distance ripple so lit dots shimmer. Idle/touch → a slow auto-drifting focal point. Under
// prefers-reduced-motion it renders a static faint grid with no loop and no cursor reaction.

const SPACING = 26 // px between dots
const BASE_RADIUS = 1.1 // px, unlit dot
const GLOW_RADIUS = 1.7 // px added at full intensity
const GLOW_DIST = 190 // px falloff radius around the focal point
const BASE_ALPHA = 0.14 // unlit dot alpha (keep low so text stays readable)
const GLOW_ALPHA = 0.9 // fully-lit dot alpha
const BUCKETS = 18 // quantised intensity levels → precomputed fills, no per-frame string alloc
const LERP = 0.08 // focal-point smoothing
const IDLE_MS = 2000 // no mouse for this long → auto-drift takes over

function parseHex(hex: string): [number, number, number] {
  const h = hex.trim().replace('#', '')
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  const n = parseInt(full || '000000', 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

export default function DotField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    if (!ctx) return

    const styles = getComputedStyle(document.documentElement)
    const accent = parseHex(styles.getPropertyValue('--accent') || '#4f46e5')
    const base = parseHex(styles.getPropertyValue('--foreground') || '#171717')

    // Precompute one fill string + radius per intensity bucket (bucket 0 = base dot). Done once so
    // the animation loop never allocates strings.
    const bucketColor: string[] = new Array(BUCKETS)
    const bucketRadius = new Float32Array(BUCKETS)
    for (let b = 0; b < BUCKETS; b++) {
      const t = b / (BUCKETS - 1)
      const r = Math.round(base[0] + (accent[0] - base[0]) * t)
      const g = Math.round(base[1] + (accent[1] - base[1]) * t)
      const bl = Math.round(base[2] + (accent[2] - base[2]) * t)
      const a = BASE_ALPHA + (GLOW_ALPHA - BASE_ALPHA) * t
      bucketColor[b] = `rgba(${r},${g},${bl},${a.toFixed(3)})`
      bucketRadius[b] = BASE_RADIUS + GLOW_RADIUS * t
    }

    const TAU = Math.PI * 2
    const R2 = GLOW_DIST * GLOW_DIST

    let width = 0
    let height = 0
    let count = 0
    // Grid geometry + per-frame bucket assignment — all reused across frames (no per-frame alloc).
    let xs = new Float32Array(0)
    let ys = new Float32Array(0)
    let bucketOf = new Uint8Array(0)

    function buildGrid() {
      const cols = Math.ceil(width / SPACING) + 1
      const rows = Math.ceil(height / SPACING) + 1
      count = cols * rows
      xs = new Float32Array(count)
      ys = new Float32Array(count)
      bucketOf = new Uint8Array(count)
      const offX = (width - (cols - 1) * SPACING) / 2
      const offY = (height - (rows - 1) * SPACING) / 2
      let i = 0
      for (let ry = 0; ry < rows; ry++) {
        for (let cx = 0; cx < cols; cx++) {
          xs[i] = offX + cx * SPACING
          ys[i] = offY + ry * SPACING
          i++
        }
      }
    }

    function resize() {
      width = window.innerWidth
      height = window.innerHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      buildGrid()
    }

    // Draw every dot at a given bucket in one path — one fillStyle set, one fill call per bucket.
    function drawBucket(b: number) {
      const rad = bucketRadius[b]
      ctx.fillStyle = bucketColor[b]
      ctx.beginPath()
      for (let i = 0; i < count; i++) {
        if (bucketOf[i] !== b) continue
        ctx.moveTo(xs[i] + rad, ys[i]) // start a fresh subpath so arcs aren't joined by lines
        ctx.arc(xs[i], ys[i], rad, 0, TAU)
      }
      ctx.fill()
    }

    function drawStatic() {
      ctx.clearRect(0, 0, width, height)
      for (let i = 0; i < count; i++) bucketOf[i] = 0
      drawBucket(0)
    }

    resize()

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const onResize = () => {
      resize()
      if (reduce) drawStatic()
    }
    window.addEventListener('resize', onResize)

    if (reduce) {
      drawStatic()
      return () => window.removeEventListener('resize', onResize)
    }

    let fx = width / 2
    let fy = height / 2
    let mx = width / 2
    let my = height / 2
    let lastMove = -Infinity
    let raf = 0

    const onMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
      lastMove = e.timeStamp
    }
    window.addEventListener('mousemove', onMove, { passive: true })

    function frame(now: number) {
      // Focal target: the cursor if it moved recently, otherwise a slow drifting Lissajous path so
      // the grid stays alive on idle/touch. Lerp toward it so the glow glides.
      let tx: number
      let ty: number
      if (now - lastMove < IDLE_MS) {
        tx = mx
        ty = my
      } else {
        tx = width / 2 + Math.cos(now * 0.0004) * width * 0.32
        ty = height / 2 + Math.sin(now * 0.0005) * height * 0.32
      }
      fx += (tx - fx) * LERP
      fy += (ty - fy) * LERP

      for (let i = 0; i < count; i++) {
        const dx = xs[i] - fx
        const dy = ys[i] - fy
        const d2 = dx * dx + dy * dy
        if (d2 >= R2) {
          bucketOf[i] = 0
          continue
        }
        const d = Math.sqrt(d2)
        const t = 1 - d / GLOW_DIST
        const g = t * t // quadratic falloff → soft radiating edge
        const ripple = 0.75 + 0.25 * Math.sin(now * 0.004 - d * 0.045)
        let intensity = g * ripple
        if (intensity < 0) intensity = 0
        else if (intensity > 1) intensity = 1
        bucketOf[i] = (intensity * (BUCKETS - 1) + 0.5) | 0
      }

      ctx.clearRect(0, 0, width, height)
      for (let b = 0; b < BUCKETS; b++) drawBucket(b)

      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 -z-10 print:hidden"
    />
  )
}
