import {
  prepareWithSegments,
  layoutWithLines,
  walkLineRanges,
} from 'https://esm.sh/@chenglou/pretext@0.0.5'

const FF = 'Georgia, "Times New Roman", serif'

// Binary-search for the largest font size (≤ maxPx) that wraps the headline
// to at most maxLines lines within containerWidth.
function fitHeadlineToWidth(text, containerWidth, maxPx, maxLines) {
  let lo = 18, hi = maxPx
  let chosenSize = 18, chosenLines = []

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2)
    const font = `400 ${mid}px ${FF}`
    const prepared = prepareWithSegments(text, font)
    let count = 0
    walkLineRanges(prepared, containerWidth, () => { count++ })
    if (count <= maxLines) {
      const lh = Math.ceil(mid * 1.08)
      const result = layoutWithLines(prepared, containerWidth, lh)
      chosenSize = mid
      chosenLines = result.lines
      lo = mid + 1
    } else {
      hi = mid - 1
    }
  }

  return { size: chosenSize, lines: chosenLines, lh: Math.ceil(chosenSize * 1.08) }
}

// Render Pretext-computed lines into `el`, overwriting its content.
function renderInto(el, text, maxPx, maxLines = 3) {
  const w = el.clientWidth
  if (!w) return
  const { size, lines, lh } = fitHeadlineToWidth(text, w, maxPx, maxLines)
  el.innerHTML = ''
  el.style.fontSize = `${size}px`
  el.style.lineHeight = `${lh}px`
  el.style.letterSpacing = '-0.035em'
  lines.forEach(line => {
    const d = document.createElement('div')
    d.textContent = line.text
    el.appendChild(d)
  })
}

const TARGETS = [
  { id: 'svc-hero-headline',        text: 'Scalable growth infrastructure.', maxPx: 90 },
  { id: 'svc-methodology-headline', text: 'How we build your system.',        maxPx: 72 },
  { id: 'svc-cta-headline',         text: 'Let us build your business system.', maxPx: 72 },
]

// Wait for fonts so measurements are accurate.
await document.fonts.ready

function layoutAll() {
  TARGETS.forEach(({ id, text, maxPx }) => {
    const el = document.getElementById(id)
    if (el) renderInto(el, text, maxPx)
  })
}

layoutAll()

// Debounced resize handler.
let resizeTimer
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer)
  resizeTimer = setTimeout(layoutAll, 80)
}, { passive: true })

// ── Scroll parallax: hero text drifts upward as user scrolls ─────────────────
const heroContent = document.querySelector('.hero-content')
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

if (heroContent && !prefersReduced) {
  let rafPending = false
  window.addEventListener('scroll', () => {
    if (!rafPending) {
      rafPending = true
      requestAnimationFrame(() => {
        const y = window.scrollY
        // Text drifts up at 28% of scroll speed — creates float-over-video depth
        const drift = Math.min(y * 0.28, 100)
        // Gracefully fade out once hero scrolls away
        const fade = Math.max(1 - y / (window.innerHeight * 0.65), 0)
        heroContent.style.transform = `translateY(-${drift}px)`
        heroContent.style.opacity = fade
        rafPending = false
      })
    }
  }, { passive: true })
}
