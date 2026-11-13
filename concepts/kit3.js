// Round 3 engine: the original proof-of-concept mechanic.
// Blocks spawn one at a time; every spawn re-lays out the blocks already on screen so they glide aside to make room.
// Opening an entry un-spawns the current blocks one by one (the rest close the gap), then spawns that entry's blocks the same way.
(function () {
  const GAP = 16

  // Growing layout: 1 centred, 2 side by side, 3 = two over one, 4 = 2x2, then rows of 3.
  // When `bento` is set and five blocks are on screen, the fifth takes the tall centre column (the POC's final layout).
  function growLayout(k, W, H, opt = {}) {
    const narrow = W < 700
    const maxW = Math.min(W, opt.maxW || 1120)
    if (narrow) {
      const h = opt.narrowH || 170
      return Array.from({ length: k }, (_, i) => ({ x: (W - maxW) / 2, y: i * (h + GAP), w: maxW, h }))
    }
    if (opt.bento && k === 5) {
      const cw = (maxW - GAP * 2) / 3, ch = Math.min(opt.cellH || 250, (H - GAP) / 2)
      const x0 = (W - maxW) / 2, y0 = Math.max(0, (H - (ch * 2 + GAP)) / 2)
      return [
        { x: x0, y: y0, w: cw, h: ch }, { x: x0 + (cw + GAP) * 2, y: y0, w: cw, h: ch },
        { x: x0, y: y0 + ch + GAP, w: cw, h: ch }, { x: x0 + (cw + GAP) * 2, y: y0 + ch + GAP, w: cw, h: ch },
        { x: x0 + cw + GAP, y: y0, w: cw, h: ch * 2 + GAP }]
    }
    const cols = k <= 2 ? k : k <= 4 ? 2 : 3
    const rows = Math.ceil(k / cols)
    const cw = Math.min((maxW - GAP * (cols - 1)) / cols, opt.cellW || 360)
    const ch = Math.min(opt.cellH || 250, (H - GAP * (rows - 1)) / rows)
    const totalH = rows * ch + (rows - 1) * GAP
    const y0 = Math.max(0, (H - totalH) / 2)
    const out = []
    for (let i = 0; i < k; i++) {
      const r = Math.floor(i / cols), inRow = Math.min(cols, k - r * cols), c = i % cols
      const rowW = inRow * cw + (inRow - 1) * GAP
      out.push({ x: (W - rowW) / 2 + c * (cw + GAP), y: y0 + r * (ch + GAP), w: cw, h: ch })
    }
    return out
  }

  // stage: absolutely positioned blocks inside `el`.
  // o.make(spec) -> element, o.layout(k, ctx) -> rects, o.enter(el), o.exit(el) -> Animation|undefined, o.onSpawn(el)
  function Stage(el, o) {
    let blocks = [], ctx = {}
    const viewH = () => o.viewH ? o.viewH() : el.clientHeight
    function apply(instant) {
      const rects = o.layout(blocks.length, el.clientWidth, viewH(), ctx)
      let bottom = 0
      blocks.forEach((b, i) => {
        const r = rects[i]
        if (instant) b.style.transition = 'none'
        Object.assign(b.style, { left: r.x + 'px', top: r.y + 'px', width: r.w + 'px', height: r.h + 'px' })
        if (instant) { b.offsetWidth; b.style.transition = '' }
        bottom = Math.max(bottom, r.y + r.h)
      })
      el.style.minHeight = bottom + 'px'
    }
    async function spawn(specs, context = {}) {
      ctx = context
      for (const spec of specs) {
        const b = o.make(spec)
        b.classList.add('blk-stage')
        el.append(b)
        blocks.push(b)
        // Place the newcomer at its slot without a transition, then let the others glide
        b.style.transition = 'none'
        const rects = o.layout(blocks.length, el.clientWidth, viewH(), ctx)
        const r = rects[blocks.length - 1]
        Object.assign(b.style, { left: r.x + 'px', top: r.y + 'px', width: r.w + 'px', height: r.h + 'px' })
        b.offsetWidth; b.style.transition = ''
        apply()
        if (!Kit.reduced && o.enter) o.enter(b)
        if (o.onSpawn) o.onSpawn(b)
        await Kit.wait(o.interval || 190)
      }
    }
    async function clear() {
      while (blocks.length) {
        const b = blocks.pop()
        const a = !Kit.reduced && o.exit ? o.exit(b) : null
        apply()
        if (a) await Promise.race([a.finished, Kit.wait(220)])
        b.remove()
        await Kit.wait(o.clearInterval || 40)
      }
    }
    let t
    addEventListener('resize', () => { clearTimeout(t); t = setTimeout(() => apply(true), 100) })
    return { spawn, clear, get blocks() { return blocks } }
  }

  // Home <-> section navigation around a Stage. o.home() / o.section(id) return specs; o.onView(target) updates chrome.
  function runApp(stage, o) {
    let view = null, busy = false
    async function go(target) {
      if (busy || target === view) return
      busy = true
      if (view) { if (o.beforeClear) o.beforeClear(target); await stage.clear() }
      view = target
      if (o.onView) o.onView(target)
      scrollTo(0, 0)
      await stage.spawn(target === 'home' ? o.home() : o.section(target), { home: target === 'home', id: target })
      if (o.afterSpawn) o.afterSpawn(target)
      busy = false
    }
    Kit.onBack(() => go('home'))
    return go
  }

  Object.assign(window.Kit, { growLayout, Stage, runApp, GAP })
})()
