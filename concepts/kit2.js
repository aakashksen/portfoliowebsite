// Round 2 kit: content (home entries + the blocks each entry spawns), a reactive dot field,
// and animation helpers for "spawn this section's blocks / go back" transitions.
(function () {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches

  const PERSON = {
    name: 'Aakash Senthilnathan',
    first: 'Aakash',
    last: 'Senthilnathan',
    initials: 'AS',
    role: 'Developer & designer', // placeholder
    email: 'hello@yourdomain.dev', // placeholder
    skills: ['React', 'TypeScript', 'Node.js', 'Canvas', 'Python'],
    status: 'Available for projects',
    bio: 'I build interactive things for the web and care about how they move. This is a placeholder bio; replace it with two or three sentences about you.',
  }

  // Home entries, in display order
  const SECTIONS = [
    { id: 'projects', title: 'Projects', kicker: 'My creative work', path: '/projects' },
    { id: 'experience', title: 'Experience', kicker: 'My professional journey', path: '/experience' },
    { id: 'blog', title: 'Blog', kicker: 'Thoughts & insights', path: '/blog' },
    { id: 'current', title: 'Current Work', kicker: "What I'm building now", path: '/now' },
    { id: 'about', title: PERSON.name, kicker: "Let's connect", path: '/about' },
  ]
  const SECTION = Object.fromEntries(SECTIONS.map(s => [s.id, s]))

  // The blocks each entry spawns. All sample content, to be replaced.
  const ITEMS = {
    projects: [
      { title: 'This portfolio', meta: '2026 · Next.js · Canvas', text: 'Dot-field site with choreographed transitions between sections.', file: 'portfolio.md' },
      { title: 'Realtime chat', meta: 'Sample · WebSockets', text: 'Rooms, presence and typing indicators on a tiny Node server.', file: 'realtime-chat.md' },
      { title: 'Image classifier', meta: 'Sample · Python · PyTorch', text: 'Small model and a drag-and-drop web demo around it.', file: 'classifier.md' },
      { title: 'CLI toolkit', meta: 'Sample · TypeScript', text: 'Scripts that automate my project setup and releases.', file: 'cli-toolkit.md' },
      { title: 'Habit tracker', meta: 'Sample · React Native', text: 'Streaks, reminders and a calm weekly review screen.', file: 'habits.md' },
    ],
    experience: [
      { title: 'Software Engineer', meta: 'Company A · 2025 – now', text: 'Placeholder: what you owned, shipped and improved.', file: 'company-a.log' },
      { title: 'Engineering Intern', meta: 'Company B · 2024', text: 'Placeholder: the team, the stack and one result.', file: 'company-b.log' },
      { title: 'Freelance Developer', meta: 'Self-employed · 2023 – 2024', text: 'Placeholder: clients and the kind of work you did.', file: 'freelance.log' },
    ],
    blog: [
      { title: 'Building a dot field in canvas', meta: 'Oct 2026 · 6 min', text: 'Ripples, springs and keeping it at 60fps.', file: 'dot-field.md' },
      { title: 'Choreographing UI motion', meta: 'Sep 2026 · 4 min', text: 'Why overlap beats waiting for each step to finish.', file: 'ui-motion.md' },
      { title: 'Shipping my first side project', meta: 'Aug 2026 · 5 min', text: 'What went right, what I would cut next time.', file: 'first-ship.md' },
      { title: 'Reading list, autumn', meta: 'Jul 2026 · 3 min', text: 'Books and essays that changed how I work.', file: 'reading.md' },
    ],
    current: [
      { title: 'Portfolio v2', meta: 'In progress · 60%', text: 'Picking a direction from these concepts.', progress: 0.6, file: 'portfolio-v2.sh' },
      { title: 'Learning WebGL', meta: 'In progress · 35%', text: 'Shaders, buffers and moving the dot field to the GPU.', progress: 0.35, file: 'webgl.sh' },
      { title: 'Side project', meta: 'Planning · 10%', text: 'Placeholder for the next thing you are building.', progress: 0.1, file: 'next.sh' },
    ],
    about: [
      { title: 'Bio', meta: 'About me', text: PERSON.bio, file: 'bio.txt' },
      { title: 'Contact', meta: 'Email', text: PERSON.email, file: 'contact.txt' },
      { title: 'Stack', meta: 'Tools I use', text: PERSON.skills.join(' · '), file: 'stack.txt' },
      { title: 'Links', meta: 'Elsewhere', text: 'GitHub · LinkedIn · Résumé (placeholders)', file: 'links.txt' },
      { title: 'Status', meta: 'Right now', text: PERSON.status, file: 'status.txt' },
    ],
  }

  // Grid of dots displaced by expanding ripples and pointer movement; idles when nothing moves.
  function Field(canvas, opts) {
    const o = Object.assign({ spacing: 18, speed: 900, band: 90, life: 1600, push: 14, mouseRadius: 110, mousePush: 10, ambient: false }, opts)
    const ctx = canvas.getContext('2d')
    let W = 0, H = 0, dots = [], ripples = [], raf = 0
    const mouse = { x: -1e4, y: -1e4, t: -1e4 }
    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = canvas.clientWidth; H = canvas.clientHeight
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      dots = []
      const s = o.spacing
      let i = 0
      for (let y = s / 2; y < H + s; y += s)
        for (let x = s / 2; x < W + s; x += s) dots.push({ bx: x, by: y, x, y, e: 0, i: i++ })
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
          const age = now - r.t, R = (age / 1000) * o.speed
          const vx = d.bx - r.x, vy = d.by - r.y, dist = Math.hypot(vx, vy) || 1
          const b = 1 - Math.abs(dist - R) / o.band
          if (b > 0) { const k = b * b * (1 - age / o.life) * r.s; ox += (vx / dist) * k * o.push; oy += (vy / dist) * k * o.push; e += k }
        }
        if (mouseOn) {
          const vx = d.bx - mouse.x, vy = d.by - mouse.y, dist = Math.hypot(vx, vy) || 1
          if (dist < o.mouseRadius) {
            const k = (1 - dist / o.mouseRadius) ** 2 * (1 - mouseAge / 900)
            ox += (vx / dist) * k * o.mousePush; oy += (vy / dist) * k * o.mousePush; e += k * 0.6
          }
        }
        d.x = d.bx + ox; d.y = d.by + oy; d.e = Math.min(1, e)
      }
      ctx.clearRect(0, 0, W, H)
      o.render(ctx, dots, W, H, now)
      const ambient = typeof o.ambient === 'function' ? o.ambient(now) : o.ambient
      if (!reduced && (ripples.length || mouseOn || ambient)) kick()
    }
    let t
    addEventListener('resize', () => { clearTimeout(t); t = setTimeout(resize, 120) })
    if (!reduced) addEventListener('pointermove', e => { mouse.x = e.clientX; mouse.y = e.clientY; mouse.t = performance.now(); kick() })
    resize()
    return { ripple(x, y, s = 1) { if (reduced) return; ripples.push({ x, y, s, t: performance.now() }); kick() }, kick }
  }

  const rectOf = el => el.getBoundingClientRect()
  function centerOf(el) { const r = rectOf(el); return { x: r.left + r.width / 2, y: r.top + r.height / 2 } }
  const wait = ms => new Promise(r => setTimeout(r, reduced ? 0 : ms))

  // Runs plan(el, i, rect) -> { keyframes, delay, duration, easing, fill } on every element.
  function animateAll(els, plan, onEach) {
    if (reduced) { els.forEach((el, i) => onEach && onEach(el, i, true)); return Promise.resolve() }
    return Promise.all(els.map((el, i) => {
      const p = plan(el, i, rectOf(el))
      if (!p) return Promise.resolve()
      const a = el.animate(p.keyframes, { duration: p.duration || 600, delay: p.delay || 0, easing: p.easing || 'cubic-bezier(.16,1,.3,1)', fill: p.fill || 'backwards' })
      return a.finished.then(() => onEach && onEach(el, i, false))
    }))
  }

  // Esc / Backspace go back (not while typing)
  function onBack(fn) {
    addEventListener('keydown', e => {
      if (e.target.closest && e.target.closest('input, textarea')) return
      if (e.key === 'Escape' || e.key === 'Backspace') { e.preventDefault(); fn() }
    })
  }

  // Makes a non-button element keyboard-clickable
  function pressable(el, fn) {
    el.tabIndex = 0
    el.setAttribute('role', 'button')
    el.addEventListener('click', fn)
    el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(e) } })
  }

  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])

  window.Kit = { reduced, PERSON, SECTIONS, SECTION, ITEMS, Field, rectOf, centerOf, wait, animateAll, onBack, pressable, esc }
})()
