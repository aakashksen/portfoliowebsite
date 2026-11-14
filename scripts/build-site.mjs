// Builds the live site (portfolio v3) into out/ for Cloudflare Pages.
// The site is static: concepts/v3 plus the shared concepts/kit2.js. No bundler needed.
// The old Next.js app still builds with `npm run build:next`.
import { cpSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs'

const SKIP = new Set(['build_resume.py', '.gitignore', '__pycache__'])
rmSync('out', { recursive: true, force: true })
mkdirSync('out')
for (const f of readdirSync('concepts/v3')) if (!SKIP.has(f)) cpSync(`concepts/v3/${f}`, `out/${f}`, { recursive: true })
cpSync('concepts/kit2.js', 'out/kit2.js') // index.html loads ../kit2.js, which resolves to /kit2.js at the root

// File names are not hashed, so nothing gets the year-long immutable cache the old site used.
writeFileSync('out/_headers', `/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Cache-Control: public, max-age=0, must-revalidate

/*.jpg
  Cache-Control: public, max-age=86400
`)
console.log('built out/ from concepts/v3')
