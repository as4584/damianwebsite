import {
  layoutNextLine,
  layoutWithLines,
  prepareWithSegments,
  walkLineRanges,
} from 'https://esm.sh/@chenglou/pretext@0.0.5'

// ── Constants ─────────────────────────────────────────────────────────────────
const BODY_FONT = '18px "Iowan Old Style", "Palatino Linotype", "Book Antiqua", Palatino, serif'
const BODY_LINE_HEIGHT = 30
const HEADLINE_FONT_FAMILY = '"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Palatino, serif'
const HEADLINE_TEXT = 'STARTING A BUSINESS SHOULD NOT REQUIRE FIVE VENDORS'
const GUTTER = 48
const COL_GAP = 40
const BOTTOM_GAP = 20
const MIN_SLOT_WIDTH = 50
const NARROW_BREAKPOINT = 760
const NARROW_GUTTER = 20
const NARROW_COL_GAP = 20
const NARROW_BOTTOM_GAP = 16
const NARROW_ORB_SCALE = 0.58
const NARROW_ACTIVE_ORBS = 3

// ── Body Copy ─────────────────────────────────────────────────────────────────
const BODY_TEXT = `Most people who start a business do not know what they are actually starting. They have a skill, a product, an idea. They have customers willing to pay. What they do not have is a legal container for the thing they are building. That container matters more than most founders realize — and getting it wrong in year one creates problems that compound for years afterward.

Every business transaction you enter, every contract you sign, every bank account you open, every invoice you send — all of it flows through an entity. The entity is the legal person doing business. Without one, you are the legal person. That means your personal assets — your home, your savings, your future income — are exposed to every business dispute, every disgruntled client, every debt you cannot pay.

The choice of entity is not a bureaucratic formality. It is a structural decision with tax, liability, governance, and capital-raising implications that will shape your company for its entire life. A sole proprietorship is invisible to the law as a separate entity, which means it offers no protection. A general partnership can bind you to your co-founder's personal debts. An LLC offers flexibility and pass-through taxation. An S-Corporation can reduce self-employment tax at the cost of rigid ownership rules. A C-Corporation is the only structure that accommodates venture investment and equity compensation at scale.

None of these is the right answer for every business. All of them are wrong answers if chosen without understanding the trade-offs.

The first meeting with your accountant will typically focus on taxes. That is a reasonable place to start — nobody wants to overpay. But tax optimization is downstream of entity structure, which is downstream of business model. If you have not decided whether you will raise outside capital in the next three years, your accountant cannot tell you whether an S-Corp election makes sense. If you have not decided how equity will be split between co-founders, your attorney cannot advise you on whether an LLC operating agreement or a shareholder agreement serves you better.

These questions feel premature when you are trying to get your first ten customers. They are not premature. They are precisely the questions that are hardest to answer after the fact, when the business has real value at stake. Restructuring an LLC into a C-Corp as you approach a Series A costs time, money, and attorney hours that could have been avoided by making the right decision at formation.

We are not saying you need to be perfect at the start. We are saying that the decisions you make in the first ninety days have a half-life of years. The ones you make at formation have a half-life of decades.

Let us talk about the operating agreement — the document that most early founders either skip entirely or copy from an internet template without reading. The operating agreement is the constitution of your business. It answers the questions that will define your ability to survive disagreement: What happens if a co-founder stops contributing? Can a member transfer their ownership to a third party? What vote is required to bring in new equity? Who has authority to bind the company on contracts? What happens to the business if it needs more capital and one owner cannot contribute?

These questions feel theoretical when everyone is getting along. They become existential when they are not. The majority of business dissolution disputes in closely-held companies trace back to an operating agreement that was silent or vague on the exact issue causing the conflict. You did not include the provision because you could not imagine needing it. The provision is most valuable precisely when you cannot imagine needing it.

A well-drafted operating agreement does not just protect you from your co-founders. It protects your co-founders from you. It protects the business from the personal circumstances of all its owners. It creates the governance structure that lets the company make decisions efficiently as it grows, without requiring unanimous consensus on every question.

Compliance is the word that makes most entrepreneurs' eyes glaze over. It sounds like a tax on growth — a series of forms and fees that exist to slow you down and extract money from you before you become successful enough to extract it from yourself. That framing is understandable and almost entirely wrong.

Compliance requirements are not designed with your specific business in mind. They are designed to create a predictable legal environment that allows businesses to transact with each other, hire employees, hold property, and enter contracts with confidence. When you are compliant, you can access that environment. When you are not, you are building inside a structure that can be challenged, unwound, or penalized at any moment.

The most common compliance failure we see is not taxes. It is recordkeeping. A business that cannot produce clean financials, a complete register of contracts, a current list of authorized signatories, and a clear ownership cap table cannot be acquired, cannot raise capital, and cannot demonstrate to a sophisticated counterparty that it is a real business and not a shadow of one.

The second most common failure is separating business and personal finances. This sounds basic because it is basic. It is also violated constantly. When you pay a personal expense from the business account, you create a record of commingled funds. When you create enough such records, you create the conditions under which a court can pierce the corporate veil — meaning the liability protection you thought you had disappears, and you are personally exposed to business obligations.

The third failure is salary and compensation. Many founders take draws rather than salary, which can work in early-stage LLCs but creates problems in S-Corps where owner-operators are required to pay themselves a reasonable salary. The IRS is not flexible on this. The penalties are real. And the problem is discovered at precisely the moment you can least afford to deal with it: during an audit, during a capital raise, or during a sale.

These failures compound. A business with commingled funds and no operating agreement and a missed annual report filing and an owner who has never taken a W-2 is not a business in the legal sense. It is an individual with a website. Cleaning that up costs more than it would have cost to do it right.

Starting a business is hard. It requires judgment, persistence, and tolerance for uncertainty that most people cannot sustain. The structural work — the entity, the agreements, the compliance — is the part that allows everything else you build to be real. It is the foundation that lets your growth mean something, that lets your equity be worth something, that lets your business survive you.

We help entrepreneurs build that foundation correctly from the start. And we help businesses that have outgrown their early structure evolve without losing ground. If you are starting something, or if you are realizing that the thing you started needs to be put on proper footing, that is exactly what we do.`

const PULLQUOTE_TEXTS = [
  '"Structure is not a formality — it is your first strategic decision, with consequences that compound from day one."',
  '"The operating agreement is the constitution of your business. A vague one is a future lawsuit waiting for a trigger."',
]

// ── Stage ─────────────────────────────────────────────────────────────────────
const stage = document.getElementById('stage')

// ── Orb definitions ───────────────────────────────────────────────────────────
const orbDefs = [
  { fx: 0.52, fy: 0.22, r: 110, vx: 24, vy: 16, color: [184, 151, 126] },
  { fx: 0.18, fy: 0.48, r: 85,  vx: -19, vy: 26, color: [60, 100, 180] },
  { fx: 0.74, fy: 0.58, r: 95,  vx: 16,  vy: -21, color: [80, 55, 120] },
  { fx: 0.38, fy: 0.72, r: 75,  vx: -26, vy: -14, color: [30, 70, 140] },
  { fx: 0.86, fy: 0.18, r: 65,  vx: -13, vy: 19,  color: [100, 80, 160] },
]

function createOrbEl(color) {
  const el = document.createElement('div')
  el.className = 'orb'
  el.style.background = `radial-gradient(circle at 35% 35%, rgba(${color[0]},${color[1]},${color[2]},0.35), rgba(${color[0]},${color[1]},${color[2]},0.12) 55%, transparent 72%)`
  el.style.boxShadow = `0 0 60px 15px rgba(${color[0]},${color[1]},${color[2]},0.18), 0 0 120px 40px rgba(${color[0]},${color[1]},${color[2]},0.07)`
  stage.appendChild(el)
  return el
}

const W0 = window.innerWidth
const H0 = window.innerHeight

await document.fonts.ready

// ── Prepare text ──────────────────────────────────────────────────────────────
const preparedBody = prepareWithSegments(BODY_TEXT, BODY_FONT)
const PQ_FONT = `italic 19px ${HEADLINE_FONT_FAMILY}`
const PQ_LINE_HEIGHT = 27
const preparedPullquotes = PULLQUOTE_TEXTS.map(text => prepareWithSegments(text, PQ_FONT))
const pullquoteSpecs = [
  { prepared: preparedPullquotes[0], placement: { colIdx: 0, yFrac: 0.48, wFrac: 0.52, side: 'right' } },
  { prepared: preparedPullquotes[1], placement: { colIdx: 1, yFrac: 0.32, wFrac: 0.5,  side: 'left'  } },
]

// ── DOM pools ─────────────────────────────────────────────────────────────────
const domCache = {
  stage,
  bodyLines: [],
  headlineLines: [],
  pullquoteLines: [],
  pullquoteBoxes: [],
  orbs: orbDefs.map(def => createOrbEl(def.color)),
}

// ── App state ─────────────────────────────────────────────────────────────────
const st = {
  orbs: orbDefs.map(def => ({
    x: def.fx * W0,
    y: def.fy * H0,
    r: def.r,
    vx: def.vx,
    vy: def.vy,
    paused: false,
  })),
  pointer: { x: -9999, y: -9999 },
  drag: null,
  events: { pointerDown: null, pointerMove: null, pointerUp: null },
  lastFrameTime: null,
}

let committedTextProjection = null

// ── Helpers ───────────────────────────────────────────────────────────────────
function syncPool(pool, count, create) {
  while (pool.length < count) {
    const el = create()
    stage.appendChild(el)
    pool.push(el)
  }
  for (let i = 0; i < pool.length; i++) {
    pool[i].style.display = i < count ? '' : 'none'
  }
}

let cachedHeadlineWidth = -1
let cachedHeadlineHeight = -1
let cachedHeadlineMaxSize = -1
let cachedHeadlineFontSize = 24
let cachedHeadlineLines = []

function fitHeadline(maxWidth, maxHeight, maxSize = 92) {
  if (maxWidth === cachedHeadlineWidth && maxHeight === cachedHeadlineHeight && maxSize === cachedHeadlineMaxSize) {
    return { fontSize: cachedHeadlineFontSize, lines: cachedHeadlineLines }
  }
  cachedHeadlineWidth = maxWidth
  cachedHeadlineHeight = maxHeight
  cachedHeadlineMaxSize = maxSize
  let lo = 20, hi = maxSize, best = lo, bestLines = []

  while (lo <= hi) {
    const size = Math.floor((lo + hi) / 2)
    const font = `700 ${size}px ${HEADLINE_FONT_FAMILY}`
    const lineHeight = Math.round(size * 0.93)
    const prepared = prepareWithSegments(HEADLINE_TEXT, font)
    let breaksWord = false, lineCount = 0
    walkLineRanges(prepared, maxWidth, line => {
      lineCount++
      if (line.end.graphemeIndex !== 0) breaksWord = true
    })
    const totalHeight = lineCount * lineHeight
    if (!breaksWord && totalHeight <= maxHeight) {
      best = size
      const result = layoutWithLines(prepared, maxWidth, lineHeight)
      bestLines = result.lines.map((line, i) => ({ x: 0, y: i * lineHeight, text: line.text, width: line.width }))
      lo = size + 1
    } else {
      hi = size - 1
    }
  }

  cachedHeadlineFontSize = best
  cachedHeadlineLines = bestLines
  return { fontSize: best, lines: bestLines }
}

function carveTextLineSlots(base, blocked) {
  let slots = [base]
  for (let bi = 0; bi < blocked.length; bi++) {
    const interval = blocked[bi]
    const next = []
    for (let si = 0; si < slots.length; si++) {
      const slot = slots[si]
      if (interval.right <= slot.left || interval.left >= slot.right) { next.push(slot); continue }
      if (interval.left > slot.left) next.push({ left: slot.left, right: interval.left })
      if (interval.right < slot.right) next.push({ left: interval.right, right: slot.right })
    }
    slots = next
  }
  return slots.filter(slot => slot.right - slot.left >= MIN_SLOT_WIDTH)
}

function circleIntervalForBand(cx, cy, r, bandTop, bandBottom, hPad, vPad) {
  const top = bandTop - vPad
  const bottom = bandBottom + vPad
  if (top >= cy + r || bottom <= cy - r) return null
  const minDy = cy >= top && cy <= bottom ? 0 : cy < top ? top - cy : cy - bottom
  if (minDy >= r) return null
  const maxDx = Math.sqrt(r * r - minDy * minDy)
  return { left: cx - maxDx - hPad, right: cx + maxDx + hPad }
}

function layoutColumn(prepared, startCursor, regionX, regionY, regionW, regionH, lineHeight, circleObstacles, rectObstacles, singleSlotOnly = false) {
  let cursor = startCursor
  let lineTop = regionY
  const lines = []
  let textExhausted = false

  while (lineTop + lineHeight <= regionY + regionH && !textExhausted) {
    const bandTop = lineTop
    const bandBottom = lineTop + lineHeight
    const blocked = []

    for (let i = 0; i < circleObstacles.length; i++) {
      const o = circleObstacles[i]
      const interval = circleIntervalForBand(o.cx, o.cy, o.r, bandTop, bandBottom, o.hPad, o.vPad)
      if (interval !== null) blocked.push(interval)
    }
    for (let i = 0; i < rectObstacles.length; i++) {
      const rect = rectObstacles[i]
      if (bandBottom <= rect.y || bandTop >= rect.y + rect.h) continue
      blocked.push({ left: rect.x, right: rect.x + rect.w })
    }

    const slots = carveTextLineSlots({ left: regionX, right: regionX + regionW }, blocked)
    if (slots.length === 0) { lineTop += lineHeight; continue }

    const orderedSlots = singleSlotOnly
      ? [slots.reduce((best, slot) => {
          const bw = best.right - best.left
          const sw = slot.right - slot.left
          if (sw > bw) return slot
          if (sw < bw) return best
          return slot.left < best.left ? slot : best
        })]
      : [...slots].sort((a, b) => a.left - b.left)

    for (let si = 0; si < orderedSlots.length; si++) {
      const slot = orderedSlots[si]
      const line = layoutNextLine(prepared, cursor, slot.right - slot.left)
      if (line === null) { textExhausted = true; break }
      lines.push({ x: Math.round(slot.left), y: Math.round(lineTop), text: line.text, width: line.width })
      cursor = line.end
    }

    lineTop += lineHeight
  }

  return { lines, cursor, textExhausted }
}

function hitTestOrbs(orbs, px, py, activeCount, radiusScale) {
  for (let i = activeCount - 1; i >= 0; i--) {
    const orb = orbs[i]
    const radius = orb.r * radiusScale
    const dx = px - orb.x, dy = py - orb.y
    if (dx * dx + dy * dy <= radius * radius) return i
  }
  return -1
}

function positionedLinesEqual(a, b) {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    const l = a[i], r = b[i]
    if (l.x !== r.x || l.y !== r.y || l.width !== r.width || l.text !== r.text) return false
  }
  return true
}

function textProjectionEqual(a, b) {
  return a !== null &&
    a.headlineLeft === b.headlineLeft &&
    a.headlineTop === b.headlineTop &&
    a.headlineFont === b.headlineFont &&
    a.headlineLineHeight === b.headlineLineHeight &&
    a.bodyFont === b.bodyFont &&
    a.bodyLineHeight === b.bodyLineHeight &&
    a.pullquoteFont === b.pullquoteFont &&
    a.pullquoteLineHeight === b.pullquoteLineHeight &&
    positionedLinesEqual(a.headlineLines, b.headlineLines) &&
    positionedLinesEqual(a.bodyLines, b.bodyLines) &&
    positionedLinesEqual(a.pullquoteLines, b.pullquoteLines)
}

function projectTextProjection(projection) {
  syncPool(domCache.headlineLines, projection.headlineLines.length, () => {
    const el = document.createElement('span')
    el.className = 'headline-line'
    return el
  })
  for (let i = 0; i < projection.headlineLines.length; i++) {
    const el = domCache.headlineLines[i]
    const line = projection.headlineLines[i]
    el.textContent = line.text
    el.style.left = `${projection.headlineLeft + line.x}px`
    el.style.top = `${projection.headlineTop + line.y}px`
    el.style.font = projection.headlineFont
    el.style.lineHeight = `${projection.headlineLineHeight}px`
  }

  syncPool(domCache.bodyLines, projection.bodyLines.length, () => {
    const el = document.createElement('span')
    el.className = 'line'
    return el
  })
  for (let i = 0; i < projection.bodyLines.length; i++) {
    const el = domCache.bodyLines[i]
    const line = projection.bodyLines[i]
    el.textContent = line.text
    el.style.left = `${line.x}px`
    el.style.top = `${line.y}px`
    el.style.font = projection.bodyFont
    el.style.lineHeight = `${projection.bodyLineHeight}px`
  }

  syncPool(domCache.pullquoteLines, projection.pullquoteLines.length, () => {
    const el = document.createElement('span')
    el.className = 'pullquote-line'
    return el
  })
  for (let i = 0; i < projection.pullquoteLines.length; i++) {
    const el = domCache.pullquoteLines[i]
    const line = projection.pullquoteLines[i]
    el.textContent = line.text
    el.style.left = `${line.x}px`
    el.style.top = `${line.y}px`
    el.style.font = projection.pullquoteFont
    el.style.lineHeight = `${projection.pullquoteLineHeight}px`
  }
}

// ── Event handlers ────────────────────────────────────────────────────────────
let scheduledRaf = null
function scheduleRender() {
  if (scheduledRaf !== null) return
  scheduledRaf = requestAnimationFrame(function renderAndMaybeSchedule(now) {
    scheduledRaf = null
    if (render(now)) scheduleRender()
  })
}

stage.addEventListener('pointerdown', event => {
  const scrollY = window.scrollY || 0
  const activeOrbCount = window.innerWidth < NARROW_BREAKPOINT ? NARROW_ACTIVE_ORBS : st.orbs.length
  const radiusScale = window.innerWidth < NARROW_BREAKPOINT ? NARROW_ORB_SCALE : 1
  if (hitTestOrbs(st.orbs, event.clientX, event.clientY + scrollY, activeOrbCount, radiusScale) !== -1) {
    event.preventDefault()
  }
  st.events.pointerDown = { x: event.clientX, y: event.clientY + scrollY }
  scheduleRender()
})

stage.addEventListener('touchmove', event => {
  if (st.drag !== null) event.preventDefault()
}, { passive: false })

window.addEventListener('pointermove', event => {
  st.events.pointerMove = { x: event.clientX, y: event.clientY + (window.scrollY || 0) }
  scheduleRender()
})

window.addEventListener('pointerup', event => {
  st.events.pointerUp = { x: event.clientX, y: event.clientY + (window.scrollY || 0) }
  scheduleRender()
})

window.addEventListener('pointercancel', event => {
  st.events.pointerUp = { x: event.clientX, y: event.clientY + (window.scrollY || 0) }
  scheduleRender()
})

window.addEventListener('scroll', () => scheduleRender(), { passive: true })
window.addEventListener('resize', () => { recalcStageHeight(); scheduleRender() })

// ── Render loop ───────────────────────────────────────────────────────────────
function render(now) {
  const pageWidth = document.documentElement.clientWidth
  const pageHeight = document.documentElement.clientHeight
  const isNarrow = pageWidth < NARROW_BREAKPOINT
  const gutter = isNarrow ? NARROW_GUTTER : GUTTER
  const colGap = isNarrow ? NARROW_COL_GAP : COL_GAP
  const bottomGap = isNarrow ? NARROW_BOTTOM_GAP : BOTTOM_GAP
  const orbRadiusScale = isNarrow ? NARROW_ORB_SCALE : 1
  const activeOrbCount = isNarrow ? Math.min(NARROW_ACTIVE_ORBS, st.orbs.length) : st.orbs.length
  const orbs = st.orbs
  const scrollY = window.scrollY || 0

  let pointer = st.pointer
  let drag = st.drag

  if (st.events.pointerDown !== null) {
    const down = st.events.pointerDown
    pointer = down
    if (drag === null) {
      const orbIndex = hitTestOrbs(orbs, down.x, down.y, activeOrbCount, orbRadiusScale)
      if (orbIndex !== -1) {
        drag = {
          orbIndex,
          startPointerX: down.x,
          startPointerY: down.y,
          startOrbX: orbs[orbIndex].x,
          startOrbY: orbs[orbIndex].y,
        }
      }
    }
  }

  if (st.events.pointerMove !== null) {
    const move = st.events.pointerMove
    pointer = move
    if (drag !== null) {
      orbs[drag.orbIndex].x = drag.startOrbX + (move.x - drag.startPointerX)
      orbs[drag.orbIndex].y = drag.startOrbY + (move.y - drag.startPointerY)
    }
  }

  if (st.events.pointerUp !== null) {
    const up = st.events.pointerUp
    pointer = up
    if (drag !== null) {
      const dx = up.x - drag.startPointerX
      const dy = up.y - drag.startPointerY
      const orb = orbs[drag.orbIndex]
      if (dx * dx + dy * dy < 16) {
        orb.paused = !orb.paused
      } else {
        orb.x = drag.startOrbX + dx
        orb.y = drag.startOrbY + dy
      }
      drag = null
    }
  }

  const draggedOrbIndex = drag !== null ? drag.orbIndex : -1
  const lastFrameTime = st.lastFrameTime !== null ? st.lastFrameTime : now
  const dt = Math.min((now - lastFrameTime) / 1000, 0.05)
  let stillAnimating = false

  for (let i = 0; i < orbs.length; i++) {
    if (i >= activeOrbCount) continue
    const orb = orbs[i]
    const radius = orb.r * orbRadiusScale
    if (orb.paused || i === draggedOrbIndex) continue
    stillAnimating = true
    orb.x += orb.vx * dt
    orb.y += orb.vy * dt
    if (orb.x - radius < 0)           { orb.x = radius;                   orb.vx =  Math.abs(orb.vx) }
    if (orb.x + radius > pageWidth)   { orb.x = pageWidth - radius;       orb.vx = -Math.abs(orb.vx) }
    if (orb.y - radius < scrollY + gutter * 0.5){ orb.y = scrollY + radius + gutter * 0.5;    orb.vy =  Math.abs(orb.vy) }
    if (orb.y + radius > scrollY + pageHeight - bottomGap) { orb.y = scrollY + pageHeight - bottomGap - radius; orb.vy = -Math.abs(orb.vy) }
  }

  for (let i = 0; i < activeOrbCount; i++) {
    const a = orbs[i]
    const aRadius = a.r * orbRadiusScale
    for (let j = i + 1; j < activeOrbCount; j++) {
      const b = orbs[j]
      const bRadius = b.r * orbRadiusScale
      const dx = b.x - a.x, dy = b.y - a.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      const minDist = aRadius + bRadius + (isNarrow ? 12 : 20)
      if (dist >= minDist || dist <= 0.1) continue
      const force = (minDist - dist) * 0.8
      const nx = dx / dist, ny = dy / dist
      if (!a.paused && i !== draggedOrbIndex) { a.vx -= nx * force * dt; a.vy -= ny * force * dt }
      if (!b.paused && j !== draggedOrbIndex) { b.vx += nx * force * dt; b.vy += ny * force * dt }
    }
  }

  const circleObstacles = []
  for (let i = 0; i < activeOrbCount; i++) {
    const orb = orbs[i]
    circleObstacles.push({ cx: orb.x, cy: orb.y, r: orb.r * orbRadiusScale, hPad: isNarrow ? 10 : 14, vPad: isNarrow ? 2 : 4 })
  }

  const headlineWidth = Math.min(pageWidth - gutter * 2 - (isNarrow ? 12 : 0), 1000)
  const maxHeadlineHeight = Math.floor(pageHeight * (isNarrow ? 0.2 : 0.24))
  const { fontSize: headlineSize, lines: headlineLines } = fitHeadline(headlineWidth, maxHeadlineHeight, isNarrow ? 38 : 92)
  const headlineLineHeight = Math.round(headlineSize * 0.93)
  const headlineFont = `700 ${headlineSize}px ${HEADLINE_FONT_FAMILY}`
  const headlineHeight = headlineLines.length * headlineLineHeight

  const bodyTop = gutter + headlineHeight + (isNarrow ? 14 : 20)
  const bodyHeight = stage.offsetHeight - bodyTop - bottomGap

  const columnCount = pageWidth > 1000 ? 3 : pageWidth > 640 ? 2 : 1
  const totalGutter = gutter * 2 + colGap * (columnCount - 1)
  const maxContentWidth = Math.min(pageWidth, 1500)
  const columnWidth = Math.floor((maxContentWidth - totalGutter) / columnCount)
  const contentLeft = Math.round((pageWidth - (columnCount * columnWidth + (columnCount - 1) * colGap)) / 2)

  const pullquoteRects = []
  for (let i = 0; i < pullquoteSpecs.length; i++) {
    if (isNarrow) break
    const { prepared, placement } = pullquoteSpecs[i]
    if (placement.colIdx >= columnCount) continue
    const pullquoteWidth = Math.round(columnWidth * placement.wFrac)
    const pullquoteLines = layoutWithLines(prepared, pullquoteWidth - 20, PQ_LINE_HEIGHT).lines
    const pullquoteHeight = pullquoteLines.length * PQ_LINE_HEIGHT + 16
    const columnX = contentLeft + placement.colIdx * (columnWidth + colGap)
    const pullquoteX = placement.side === 'right' ? columnX + columnWidth - pullquoteWidth : columnX
    const pullquoteY = Math.round(bodyTop + bodyHeight * placement.yFrac)
    const positionedLines = pullquoteLines.map((line, li) => ({
      x: pullquoteX + 20,
      y: pullquoteY + 8 + li * PQ_LINE_HEIGHT,
      text: line.text,
      width: line.width,
    }))
    pullquoteRects.push({ x: pullquoteX, y: pullquoteY, w: pullquoteWidth, h: pullquoteHeight, lines: positionedLines, colIdx: placement.colIdx })
  }

  const allBodyLines = []
  let cursor = { segmentIndex: 0, graphemeIndex: 0 }
  let allTextExhausted = false
  for (let colIdx = 0; colIdx < columnCount; colIdx++) {
    const columnX = contentLeft + colIdx * (columnWidth + colGap)
    const rects = []
    for (let ri = 0; ri < pullquoteRects.length; ri++) {
      const pq = pullquoteRects[ri]
      if (pq.colIdx !== colIdx) continue
      rects.push({ x: pq.x, y: pq.y, w: pq.w, h: pq.h })
    }
    const result = layoutColumn(preparedBody, cursor, columnX, bodyTop, columnWidth, bodyHeight, BODY_LINE_HEIGHT, circleObstacles, rects, isNarrow)
    allBodyLines.push(...result.lines)
    cursor = result.cursor
    if (result.textExhausted) { allTextExhausted = true; break }
  }
  if (!allTextExhausted) {
    stage.style.height = Math.ceil(stage.offsetHeight + pageHeight * 0.7) + 'px'
    scheduleRender()
    return false
  }

  const pullquoteLines = []
  for (let i = 0; i < pullquoteRects.length; i++) {
    for (let li = 0; li < pullquoteRects[i].lines.length; li++) {
      pullquoteLines.push(pullquoteRects[i].lines[li])
    }
  }

  const hoveredOrbIndex = hitTestOrbs(orbs, pointer.x, pointer.y, activeOrbCount, orbRadiusScale)
  const cursorStyle = drag !== null ? 'grabbing' : hoveredOrbIndex !== -1 ? 'grab' : ''

  st.pointer = pointer
  st.drag = drag
  st.events.pointerDown = null
  st.events.pointerMove = null
  st.events.pointerUp = null
  st.lastFrameTime = stillAnimating ? now : null

  const textProjection = {
    headlineLeft: gutter,
    headlineTop: gutter,
    headlineFont,
    headlineLineHeight,
    headlineLines,
    bodyFont: BODY_FONT,
    bodyLineHeight: BODY_LINE_HEIGHT,
    bodyLines: allBodyLines,
    pullquoteFont: PQ_FONT,
    pullquoteLineHeight: PQ_LINE_HEIGHT,
    pullquoteLines,
  }

  if (!textProjectionEqual(committedTextProjection, textProjection)) {
    projectTextProjection(textProjection)
    committedTextProjection = textProjection
  }

  syncPool(domCache.pullquoteBoxes, pullquoteRects.length, () => {
    const el = document.createElement('div')
    el.className = 'pullquote-box'
    return el
  })
  for (let i = 0; i < pullquoteRects.length; i++) {
    const pq = pullquoteRects[i]
    const boxEl = domCache.pullquoteBoxes[i]
    boxEl.style.left = `${pq.x}px`
    boxEl.style.top = `${pq.y}px`
    boxEl.style.width = `${pq.w}px`
    boxEl.style.height = `${pq.h}px`
  }

  for (let i = 0; i < orbs.length; i++) {
    const orb = orbs[i]
    const el = domCache.orbs[i]
    if (i >= activeOrbCount) { el.style.display = 'none'; continue }
    const radius = orb.r * orbRadiusScale
    el.style.display = ''
    el.style.left = `${orb.x - radius}px`
    el.style.top = `${orb.y - radius}px`
    el.style.width = `${radius * 2}px`
    el.style.height = `${radius * 2}px`
    el.style.opacity = orb.paused ? '0.45' : '1'
  }

  domCache.stage.style.userSelect = drag !== null ? 'none' : ''
  domCache.stage.style.webkitUserSelect = drag !== null ? 'none' : ''
  document.body.style.cursor = cursorStyle

  return stillAnimating
}

// ── Stage height calibration ──────────────────────────────────────────────────
function recalcStageHeight() {
  const w = window.innerWidth
  const h = window.innerHeight
  const isNarrow = w < NARROW_BREAKPOINT
  const gutter = isNarrow ? NARROW_GUTTER : GUTTER
  const colGap = isNarrow ? NARROW_COL_GAP : COL_GAP
  const bottomGap = isNarrow ? NARROW_BOTTOM_GAP : BOTTOM_GAP
  const columnCount = w > 1000 ? 3 : w > 640 ? 2 : 1
  const maxContentWidth = Math.min(w, 1500)
  const totalGutter = gutter * 2 + colGap * (columnCount - 1)
  const columnWidth = Math.floor((maxContentWidth - totalGutter) / columnCount)
  const contentLeft = Math.round((w - (columnCount * columnWidth + (columnCount - 1) * colGap)) / 2)
  const { fontSize: hlSize, lines: hlLines } = fitHeadline(
    Math.min(w - gutter * 2 - (isNarrow ? 12 : 0), 1000),
    Math.floor(h * (isNarrow ? 0.2 : 0.24)),
    isNarrow ? 38 : 92
  )
  const headlineLineHeight = Math.round(hlSize * 0.93)
  const headlineHeight = hlLines.length * headlineLineHeight
  const bodyTop = gutter + headlineHeight + (isNarrow ? 14 : 20)
  let stageH = h
  for (let attempt = 0; attempt < 20; attempt++) {
    const bodyH = stageH - bodyTop - bottomGap
    let cur = { segmentIndex: 0, graphemeIndex: 0 }
    let done = false
    for (let ci = 0; ci < columnCount; ci++) {
      const cx = contentLeft + ci * (columnWidth + colGap)
      const res = layoutColumn(preparedBody, cur, cx, bodyTop, columnWidth, bodyH, BODY_LINE_HEIGHT, [], [])
      cur = res.cursor
      if (res.textExhausted) { done = true; break }
    }
    if (done) { stageH = Math.ceil(stageH * 1.15); break }
    stageH += h * 0.7
  }
  stage.style.height = stageH + 'px'
}

recalcStageHeight()
scheduleRender()
