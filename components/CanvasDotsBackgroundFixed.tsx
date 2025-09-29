'use client'

import React, { useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react'

interface CanvasDotsBackgroundProps {
  enableReducedMotion?: boolean
  className?: string
}

export interface CanvasDotsBackgroundRef {
  triggerSpawn: (x: number, y: number) => void
  triggerRipple: (x: number, y: number, duration?: number, radiusMultiplier?: number) => void
}

interface Dot {
  x: number
  y: number
  baseX: number
  baseY: number
  radius: number
  opacity: number
}

export const CanvasDotsBackground = forwardRef<CanvasDotsBackgroundRef, CanvasDotsBackgroundProps>(({ 
  enableReducedMotion = false,
  className = ''
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dotsRef = useRef<Dot[]>([])
  const mouseRef = useRef<{ x: number | null, y: number | null }>({ x: null, y: null })
  const animationFrameRef = useRef<number>(0)
  // Removed repelZoneRef since no-go zone is disabled
  const rippleRef = useRef<{ x: number, y: number, radius: number, maxRadius: number, startTime: number, duration: number } | null>(null)

  const spacing = 15
  const dotRadius = 1
  const returnSpeed = 0.15
  // Removed mouse and repel constants since those effects are disabled

  // Initialize dots
  const initializeDots = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const width = canvas.width
    const height = canvas.height
    const dots: Dot[] = []

    // Create dots with overflow beyond screen edges
    for (let x = -spacing; x < width + spacing; x += spacing) {
      for (let y = -spacing; y < height + spacing; y += spacing) {
        dots.push({
          x: x,
          y: y,
          baseX: x,
          baseY: y,
          radius: dotRadius,
          opacity: 0.4
        })
      }
    }

    dotsRef.current = dots
    console.log(`Canvas: Initialized ${dots.length} dots`)
  }, [spacing, dotRadius])

  // Resize handler
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    initializeDots()
  }, [initializeDots])

  // Mouse move handler
  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current.x = e.clientX
    mouseRef.current.y = e.clientY
  }, [])

  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const mouse = mouseRef.current
    // Removed repelZone since no-go zone is disabled
    const ripple = rippleRef.current

    // Update ripple - dynamic duration
    if (ripple) {
      const elapsed = Date.now() - ripple.startTime
      if (elapsed < ripple.duration) {
        ripple.radius = (elapsed / ripple.duration) * ripple.maxRadius
        // Ripple expanding
      } else {
        // Ripple completed
        rippleRef.current = null
      }
    }

    dotsRef.current.forEach(dot => {
      let moved = false

      // Mouse interaction - DISABLED for cleaner ripple effect
      // Commented out to avoid interfering with ripple waves
      /*
      if (mouse.x !== null && mouse.y !== null) {
        const dx = dot.x - mouse.x
        const dy = dot.y - mouse.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < maxInteractionDist) {
          const angle = Math.atan2(dy, dx)
          const force = (maxInteractionDist - dist) / 8
          dot.x += Math.cos(angle) * force * mouseRepelSpeed
          dot.y += Math.sin(angle) * force * mouseRepelSpeed
          dot.opacity = Math.min(1, 0.4 + (maxInteractionDist - dist) / maxInteractionDist * 0.6)
          moved = true
        }
      }
      */

      // Box repel - REMOVED (no-go zone disabled)
      // No box interaction effects

      // Ripple effect - MASSIVE SLOW WAVE
      if (ripple && !moved) {
        const dx = dot.baseX - ripple.x
        const dy = dot.baseY - ripple.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        
        // Much wider ripple band for better visibility
        const rippleBandWidth = 150 // Bigger band (was 80)
        if (dist < ripple.radius + rippleBandWidth && dist > ripple.radius - rippleBandWidth) {
          const rippleForce = 40 // Even stronger force for visibility
          const normalizedX = dx / (dist || 1) // Prevent division by zero
          const normalizedY = dy / (dist || 1)
          
          // Calculate wave intensity based on distance from wave center
          const waveIntensity = 1 - Math.abs(dist - ripple.radius) / rippleBandWidth
          
          dot.x = dot.baseX + normalizedX * rippleForce * waveIntensity
          dot.y = dot.baseY + normalizedY * rippleForce * waveIntensity
          dot.opacity = Math.min(1, 0.2 + waveIntensity * 0.8) // Brighter effect
          moved = true
        }
      }

      // Return to base position
      if (!moved) {
        dot.x += (dot.baseX - dot.x) * returnSpeed
        dot.y += (dot.baseY - dot.y) * returnSpeed
        dot.opacity += (0.4 - dot.opacity) * 0.1
      }

      // Draw dot
      ctx.beginPath()
      ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255, 255, 255, ${dot.opacity})`
      ctx.fill()
    })

    animationFrameRef.current = requestAnimationFrame(animate)
  }, [returnSpeed])

  // Expose functions to parent
  useImperativeHandle(ref, () => ({
      triggerSpawn: (x: number, y: number) => {
        if (enableReducedMotion) return
        mouseRef.current.x = x
        mouseRef.current.y = y
        setTimeout(() => {
          mouseRef.current.x = null
          mouseRef.current.y = null
        }, 500)
      },
      // Removed triggerRepel and clearRepel since no-go zone is disabled
      triggerRipple: (x: number, y: number, duration = 2000, radiusMultiplier = 1.5) => {
        if (enableReducedMotion) return
        const canvas = canvasRef.current
        if (!canvas) return
        
        // Ripple triggered
        rippleRef.current = {
          x,
          y,
          radius: 0,
          maxRadius: Math.max(canvas.width, canvas.height) * radiusMultiplier,
          startTime: Date.now(),
          duration: duration
        }
      }
    }),
  [enableReducedMotion])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Set initial size
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Initialize dots
    initializeDots()

    // Add event listeners
    window.addEventListener('resize', handleResize)
    // Removed mousemove listener since mouse interaction is disabled

    // Start animation
    animate()

    return () => {
      window.removeEventListener('resize', handleResize)
      // Removed mousemove cleanup since it's not used
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [initializeDots, handleResize, animate])

  if (enableReducedMotion) {
    return (
      <div className={`absolute inset-0 ${className}`}>
        <div 
          className="w-full h-full opacity-20 dot-grid"
          aria-hidden="true"
        />
      </div>
    )
  }

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 ${className}`}
      style={{ display: 'block' }}
      aria-hidden="true"
    />
  )
})

CanvasDotsBackground.displayName = 'CanvasDotsBackground'
