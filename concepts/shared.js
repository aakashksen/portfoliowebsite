// Shared kit for the portfolio concept pages: content, a reactive dot field,
// the card assembly choreography, and click-to-open section panels.
(function () {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches

  const PERSON = {
    name: 'Aakash Senthilnathan',
    initials: 'AS',
    role: 'Developer & designer', // placeholder
    email: 'hello@yourdomain.dev', // placeholder
    skills: ['React', 'TypeScript', 'Node.js'],
    status: 'Available for projects',
  }

  const SECTIONS = {
    projects: { title: 'Projects', kicker: 'My creative work', path: '/projects', body: 'Case studies, side projects and experiments will live here.' },
    experience: { title: 'Experience', kicker: 'My professional journey', path: '/experience', body: 'Roles, teams, and what I shipped at each one.' },
    blog: { title: 'Blog', kicker: 'Thoughts & insights', path: '/blog', body: 'Longer write-ups on things I have built and learned.' },
    current: { title: 'Current Work', kicker: "What I'm building now", path: '/now', body: 'A running log of the project on my desk this month.' },
    about: { title: PERSON.name, kicker: "Let's connect", path: '/about', body: 'Short bio, contact details and links.' },
  }

  // Grid of dots displaced by expanding ripples and by pointer movement.
  // The loop only runs while something is moving (or while opts.ambient is true).
  function Field(canvas, opts) {
    const o = Object.assign({ spacing: 18, speed: 900, band: 90, life: 1600, push: 14, mouseRadius: 110, mousePush: 10, ambient: false }, opts)
    const ctx = canvas.getContext('2d')
    let W = 0, H = 0, dots = [], ripples = [], raf = 0
    const mouse = { x: -1e4, y: -1e4, t: -1e4 }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = canvas.clientWidth
      H = canvas.clientHeight
      canvas.width = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      dots = []
      const s = o.spacing
      let i = 0
      for (let y = s / 2; y < H + s; y += s)
        for (let x = s / 2; x < W + s; x += s) dots.push({ bx: x, by: y, x, y, dx: 0, dy: 0, e: 0, i: i++ })
      kick()
    }

    function kick() { if (!raf) raf = requestAnimationFrame(frame) }

    function frame(now) {
      raf = 0
      ripples = ripples.filter(r => now - r.t < o.life)
      const mouseAge = now - mouse.t
      const mouseOn = !reduced && mouseAge < 900
      for (const d of dots) {
        let ox = 0, oy = 0, e = 0
        for (const r of ripples) {
          const age = now - r.t
          const R = (age / 1000) * o.speed
          const vx = d.bx - r.x, vy = d.by - r.y
          const dist = Math.hypot(vx, vy) || 1
          const b = 1 - Math.abs(dist - R) / o.band
          if (b > 0) {
            const k = b * b * (1 - age / o.life) * r.s
            ox += (vx / dist) * k * o.push
            oy += (vy / dist) * k * o.push
            e += k
          }
        }
        if (mouseOn) {
          const vx = d.bx - mouse.x, vy = d.by - mouse.y
          const dist = Math.hypot(vx, vy) || 1
          if (dist < o.mouseRadius) {
            const k = (1 - dist / o.mouseRadius) ** 2 * (1 - mouseAge / 900)
            ox += (vx / dist) * k * o.mousePush
            oy += (vy / dist) * k * o.mousePush
            e += k * 0.6
          }
        }
        d.dx = ox; d.dy = oy; d.x = d.bx + ox; d.y = d.by + oy; d.e = Math.min(1, e)
      }
      ctx.clearRect(0, 0, W, H)
      o.render(ctx, dots, W, H, now, mouse, ripples)
      const ambient = typeof o.ambient === 'function' ? o.ambient(now) : o.ambient
      if (!reduced && (ripples.length || mouseOn || ambient)) kick()
    }

    let resizeTimer
    addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(resize, 120) })
    if (!reduced) addEventListener('pointermove', e => { mouse.x = e.clientX; mouse.y = e.clientY; mouse.t = performance.now(); kick() })
    resize()

    return {
      ripple(x, y, s = 1) { if (reduced) return; ripples.push({ x, y, s, t: performance.now() }); kick() },
      kick,
    }
  }

  function centerOf(el) {
    const r = el.getBoundingClientRect()
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
  }

  // Plays each card in from wherever plan() says, landing in its real layout slot.
  // plan(el, i, dx, dy) -> { keyframes, delay, duration, easing }; dx/dy point from the slot to the viewport centre.
  function assemble(cards, plan, onLand) {
    if (reduced) { cards.forEach(c => onLand && onLand(c, true)); return Promise.resolve() }
    const cx = innerWidth / 2, cy = innerHeight / 2
    return Promise.all(cards.map((el, i) => {
      const c = centerOf(el)
      const p = plan(el, i, cx - c.x, cy - c.y)
      const a = el.animate(p.keyframes, {
        duration: p.duration || 650,
        delay: p.delay || 0,
        easing: p.easing || 'cubic-bezier(.16,1,.3,1)',
        fill: 'backwards',
      })
      return a.finished.then(() => onLand && onLand(el, false))
    }))
  }

  // Cards with [data-id] open <dialog id="panel"> filled from SECTIONS.
  function wirePanels(field) {
    const dlg = document.getElementById('panel')
    if (!dlg) return
    const slot = name => dlg.querySelector(`[data-slot="${name}"]`)
    document.querySelectorAll('[data-id]').forEach(el => {
      const open = () => {
        const s = SECTIONS[el.dataset.id]
        for (const k of ['title', 'kicker', 'path', 'body']) if (slot(k)) slot(k).textContent = s[k]
        if (field) { const c = centerOf(el); field.ripple(c.x, c.y, 1.4) }
        dlg.showModal()
      }
      el.tabIndex = 0
      el.setAttribute('role', 'button')
      el.setAttribute('aria-label', `${SECTIONS[el.dataset.id].title}: ${SECTIONS[el.dataset.id].kicker}`)
      el.addEventListener('click', e => { if (!e.target.closest('[data-noopen]')) open() })
      el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open() } })
    })
    dlg.addEventListener('click', e => { if (e.target === dlg || e.target.closest('[data-close]')) dlg.close() })
  }

  // Fills [data-person="field"] and [data-skills] placeholders.
  function fillPerson(root = document) {
    root.querySelectorAll('[data-person]').forEach(el => { el.textContent = PERSON[el.dataset.person] })
    root.querySelectorAll('[data-skills]').forEach(el => {
      el.innerHTML = PERSON.skills.map(s => `<span class="${el.dataset.skills}">${s}</span>`).join('')
    })
  }

  window.Kit = { reduced, PERSON, SECTIONS, Field, assemble, wirePanels, fillPerson, centerOf }
})()
