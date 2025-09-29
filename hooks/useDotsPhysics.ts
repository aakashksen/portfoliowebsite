import { useState, useEffect, useRef, useCallback } from 'react'

export interface Dot {
  id: number
  x: number
  y: number
  originalX: number
  originalY: number
  velocityX: number
  velocityY: number
  isDisturbed: boolean
  disturbanceLevel: number
  rippleTime: number
}

interface UseDotsPhysicsOptions {
  dotSpacing?: number
  maxDots?: number
  enableReducedMotion?: boolean
  animationThreshold?: number
}

export function useDotsPhysics(options: UseDotsPhysicsOptions = {}) {
  const {
    dotSpacing = 15, // Even denser for more visual impact
    maxDots = 5000, // Massive increase for incredible density
    enableReducedMotion = false,
    animationThreshold = 0.2 // Much lower for faster animations
  } = options

  const [dots, setDots] = useState<Dot[]>([])
  const animationFrameRef = useRef<number>(0)
  const lastSpawnRef = useRef<{ x: number; y: number; time: number } | null>(null)
  const isAnimatingRef = useRef(false)
  const settledDotsRef = useRef(new Set<number>())

  // Check if user prefers reduced motion
  const prefersReducedMotion = useRef(false)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      prefersReducedMotion.current = mediaQuery.matches
      
      const handleChange = (e: MediaQueryListEvent) => {
        prefersReducedMotion.current = e.matches
      }
      
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  const initializeDots = useCallback(() => {
    if (typeof window === 'undefined') return

    const vw = window.innerWidth
    const vh = window.innerHeight
    
    // Calculate dots to extend beyond viewport boundaries for full coverage
    const dotsX = Math.ceil(vw / dotSpacing) + 6  // Extra dots beyond screen edges
    const dotsY = Math.ceil(vh / dotSpacing) + 6  // Extra dots beyond screen edges
    
    const totalDots = dotsX * dotsY
    console.log(`Viewport: ${vw}x${vh}, Dots needed: ${dotsX}x${dotsY} = ${totalDots}, Max allowed: ${maxDots}`)
    
    // If we need more dots than allowed, adjust spacing instead of limiting dots
    let actualDotsX = dotsX
    let actualDotsY = dotsY
    let actualSpacing = dotSpacing
    
    if (totalDots > maxDots) {
      // Calculate new spacing to fit within maxDots
      const ratio = Math.sqrt(maxDots / totalDots)
      actualSpacing = dotSpacing / ratio
      actualDotsX = Math.ceil(vw / actualSpacing) + 2
      actualDotsY = Math.ceil(vh / actualSpacing) + 2
      console.warn(`Adjusting spacing from ${dotSpacing} to ${actualSpacing.toFixed(1)} to fit ${maxDots} dots`)
    }

    const newDots: Dot[] = []
    let dotId = 0

    for (let x = 0; x < actualDotsX && dotId < maxDots; x++) {
      for (let y = 0; y < actualDotsY && dotId < maxDots; y++) {
        // Start dots slightly off-screen for full coverage
        const dotX = (x * actualSpacing) - (actualSpacing * 3)
        const dotY = (y * actualSpacing) - (actualSpacing * 3)
        
        newDots.push({
          id: dotId++,
          x: dotX,
          y: dotY,
          originalX: dotX,
          originalY: dotY,
          velocityX: 0,
          velocityY: 0,
          isDisturbed: false,
          disturbanceLevel: 0,
          rippleTime: 0,
        })
      }
    }

    setDots(newDots)
    settledDotsRef.current.clear()
    console.log(`Initialized ${newDots.length} dots (${dotsX}x${dotsY}) covering ${vw}x${vh}px`)
  }, [dotSpacing, maxDots])

  const triggerSpawnEffect = useCallback((x: number, y: number) => {
    if (prefersReducedMotion.current || enableReducedMotion) return
    
    lastSpawnRef.current = { x, y, time: Date.now() }
    isAnimatingRef.current = true
    settledDotsRef.current.clear()
  }, [enableReducedMotion])

  const triggerRepelEffect = useCallback((x: number, y: number, width: number, height: number, strength = 25) => {
    if (prefersReducedMotion.current || enableReducedMotion) return
    
    setDots((prevDots) => {
      const newDots = [...prevDots]
      const centerX = x + width / 2
      const centerY = y + height / 2
      const repelRadius = Math.max(width, height) * 0.8
      
      for (let i = 0; i < newDots.length; i++) {
        const dot = newDots[i]
        const dx = dot.originalX - centerX
        const dy = dot.originalY - centerY
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < repelRadius && distance > 0) {
          const repelForce = (1 - distance / repelRadius) * strength
          const normalizedX = dx / distance
          const normalizedY = dy / distance
          
          newDots[i] = {
            ...dot,
            velocityX: dot.velocityX + normalizedX * repelForce * 0.8,  // Much more responsive
            velocityY: dot.velocityY + normalizedY * repelForce * 0.8,  // Much more responsive
            isDisturbed: true,
            disturbanceLevel: Math.max(dot.disturbanceLevel, repelForce / strength)
          }
          
          settledDotsRef.current.delete(dot.id)
        }
      }
      
      isAnimatingRef.current = true
      return newDots
    })
  }, [enableReducedMotion])

  const updateDotPhysics = useCallback(() => {
    if (prefersReducedMotion.current || enableReducedMotion) {
      isAnimatingRef.current = false
      return
    }

    let hasActiveAnimation = false
    const currentTime = Date.now()

    setDots((prevDots) => {
      const newDots = [...prevDots] // Shallow copy instead of map for better performance
      
      for (let i = 0; i < newDots.length; i++) {
        const dot = newDots[i]
        
        // Skip settled dots to improve performance
        if (settledDotsRef.current.has(dot.id)) continue
        
        const newDot = { ...dot }
        let dotChanged = false

        // Apply ripple effect from last spawn
        if (lastSpawnRef.current) {
          const timeSinceSpawn = currentTime - lastSpawnRef.current.time
          const maxRippleTime = 2000

          if (timeSinceSpawn < maxRippleTime) {
            // Cache distance calculation
            const dx = dot.originalX - lastSpawnRef.current.x
            const dy = dot.originalY - lastSpawnRef.current.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            const rippleSpeed = 300
            const currentRippleRadius = (timeSinceSpawn / 1000) * rippleSpeed
            const rippleWidth = 100

            if (distance > currentRippleRadius - rippleWidth && distance < currentRippleRadius + rippleWidth) {
              const rippleStrength = Math.max(0, 1 - Math.abs(distance - currentRippleRadius) / rippleWidth)
              
              // Use cached dx, dy instead of recalculating
              const invDistance = 1 / distance
              const normalizedX = dx * invDistance
              const normalizedY = dy * invDistance

              const force = rippleStrength * 50
              newDot.velocityX += normalizedX * force * 0.1
              newDot.velocityY += normalizedY * force * 0.1
              newDot.isDisturbed = true
              newDot.disturbanceLevel = rippleStrength * 2
              newDot.rippleTime = timeSinceSpawn
              dotChanged = true
            }
          }
        }

        // Apply physics - much faster and more responsive
        const friction = 0.92  // Higher friction for snappier movement
        const springForce = 0.4  // Much stronger spring force
        const returnForceX = (dot.originalX - newDot.x) * springForce
        const returnForceY = (dot.originalY - newDot.y) * springForce

        newDot.velocityX = (newDot.velocityX + returnForceX) * friction
        newDot.velocityY = (newDot.velocityY + returnForceY) * friction
        newDot.x += newDot.velocityX
        newDot.y += newDot.velocityY

        // Check if dot has settled
        const distanceFromOriginal = Math.sqrt(
          Math.pow(newDot.x - dot.originalX, 2) + Math.pow(newDot.y - dot.originalY, 2)
        )

        const isStillDisturbed = distanceFromOriginal > 2 || 
          Math.abs(newDot.velocityX) > animationThreshold || 
          Math.abs(newDot.velocityY) > animationThreshold

        newDot.isDisturbed = isStillDisturbed
        newDot.disturbanceLevel = Math.max(0, newDot.disturbanceLevel * 0.95)

        if (!isStillDisturbed && newDot.disturbanceLevel < 0.1) {
          settledDotsRef.current.add(dot.id)
        } else {
          hasActiveAnimation = true
          dotChanged = true
        }

        if (dotChanged) {
          newDots[i] = newDot
        }
      }

      return newDots
    })

    // Continue animation only if there are active dots
    if (hasActiveAnimation) {
      animationFrameRef.current = requestAnimationFrame(updateDotPhysics)
    } else {
      isAnimatingRef.current = false
      console.log('Animation stopped - all dots settled')
    }
  }, [enableReducedMotion, animationThreshold])

  // Initialize dots on mount and window resize
  useEffect(() => {
    initializeDots()
    
    let timeoutId: NodeJS.Timeout
    const handleResize = () => {
      // Debounce resize to avoid excessive recalculations
      clearTimeout(timeoutId)
      timeoutId = setTimeout(initializeDots, 250)
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(timeoutId)
    }
  }, [initializeDots])

  // Start animation loop
  useEffect(() => {
    if (!isAnimatingRef.current && dots.length > 0) {
      updateDotPhysics()
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [updateDotPhysics, dots.length])

  return {
    dots,
    triggerSpawnEffect,
    triggerRepelEffect,
    isAnimating: isAnimatingRef.current,
    settledCount: settledDotsRef.current.size,
    totalCount: dots.length
  }
}
