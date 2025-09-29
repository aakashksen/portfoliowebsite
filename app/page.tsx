'use client'

import React, { useCallback, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Code, Briefcase, BookOpen, Zap, User } from 'lucide-react'

// Optimized components and hooks
import { CanvasDotsBackground, type CanvasDotsBackgroundRef } from '../components/CanvasDotsBackgroundFixed'
import { PortfolioBox, type BoxConfig } from '../components/PortfolioBox'
import { useViewportDimensions } from '../hooks/useViewportDimensions'
import { useAnimationSequence } from '../hooks/useAnimationSequence'

export default function AnimatedPortfolio() {
  const dimensions = useViewportDimensions()
  const dotsRef = useRef<CanvasDotsBackgroundRef>(null)

  // Check for reduced motion preference
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  // Memoized ripple effect handler for box loading - faster, smaller ripples
  const handleSpawnEffect = useCallback((x: number, y: number) => {
    dotsRef.current?.triggerRipple(x, y, 1000, 1.0) // Faster 1s ripples, normal size after box settles
  }, [])

  const { boxStates, animationComplete, animationStep, animationSpeed } = useAnimationSequence({
    dimensions,
    onSpawnEffect: handleSpawnEffect,
    enableReducedMotion: prefersReducedMotion
  })

  // Notification state
  const [showNotification, setShowNotification] = useState(false)

  // AGGRESSIVE collision detection and repulsion system
  const calculateRepulsion = useCallback((currentBox: any, allBoxes: any[]) => {
    const repelForce = 150 // MUCH stronger repulsion (was 50)
    const safeZone = 80 // Larger safe zone around each box (was ~40)
    const minDistance = Math.max(currentBox.width, currentBox.height) + safeZone
    
    let repelX = 0
    let repelY = 0
    
    allBoxes.forEach(otherBox => {
      if (otherBox.id === currentBox.id || !otherBox.isVisible) return
      
      const dx = currentBox.x - otherBox.x
      const dy = currentBox.y - otherBox.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      // AGGRESSIVE repulsion - push away HARD when too close
      if (distance < minDistance && distance > 0) {
        const force = Math.pow((minDistance - distance) / minDistance, 2) // Exponential force
        const pushX = (dx / distance) * force * repelForce
        const pushY = (dy / distance) * force * repelForce
        
        repelX += pushX
        repelY += pushY
        
        // Debug log to see if repulsion is working
        console.log(`REPULSION: ${currentBox.id} pushed by ${otherBox.id}, force: ${force.toFixed(2)}, push: ${pushX.toFixed(1)}, ${pushY.toFixed(1)}`)
      }
    })
    
    return { x: repelX, y: repelY }
  }, [])

  // Apply AGGRESSIVE repulsion to box positions
  const adjustedBoxStates = useMemo(() => {
    if (animationComplete) return boxStates // No repulsion after animation completes
    
    return boxStates.map(box => {
      const repulsion = calculateRepulsion(box, boxStates)
      
      // Apply repulsion with clamping to prevent boxes from flying off screen
      const maxRepel = 100 // Maximum repulsion distance per frame
      const clampedX = Math.max(-maxRepel, Math.min(maxRepel, repulsion.x))
      const clampedY = Math.max(-maxRepel, Math.min(maxRepel, repulsion.y))
      
      return {
        ...box,
        x: box.x + clampedX,
        y: box.y + clampedY
      }
    })
  }, [boxStates, calculateRepulsion, animationComplete])

  // Memoized box configurations to prevent recreation
  const boxConfigs = useMemo((): Record<string, BoxConfig> => ({
    projects: {
      id: 'projects',
      icon: <Code className={dimensions.isMobile ? 'w-10 h-10' : 'w-14 h-14'} />,
      title: 'Projects',
      subtitle: 'My creative work',
      finalPosition: { x: 0, y: 0, width: 0, height: 0 },
    },
    experience: {
      id: 'experience',
      icon: <Briefcase className={dimensions.isMobile ? 'w-10 h-10' : 'w-14 h-14'} />,
      title: 'Experience',
      subtitle: 'My professional journey',
      finalPosition: { x: 0, y: 0, width: 0, height: 0 },
    },
    blog: {
      id: 'blog',
      icon: <BookOpen className={dimensions.isMobile ? 'w-10 h-10' : 'w-14 h-14'} />,
      title: 'Blog',
      subtitle: 'My thoughts & insights',
      finalPosition: { x: 0, y: 0, width: 0, height: 0 },
    },
    current: {
      id: 'current',
      icon: <Zap className={dimensions.isMobile ? 'w-10 h-10' : 'w-14 h-14'} />,
      title: 'Current Work',
      subtitle: "What I'm building now",
      finalPosition: { x: 0, y: 0, width: 0, height: 0 },
    },
    about: {
      id: 'about',
      icon: <User className={dimensions.isMobile ? 'w-12 h-12' : 'w-16 h-16'} />,
      title: 'Aakash Senthilnathan',
      subtitle: "Let's connect",
      finalPosition: { x: 0, y: 0, width: 0, height: 0 },
      // Additional content that appears when box stretches
      showExtendedContent: animationStep >= 6 && !dimensions.isMobile,
    },
  }), [dimensions.isMobile, animationStep])

  const handleBoxClick = useCallback((boxId: string, x: number, y: number, width: number, height: number) => {
    console.log(`Box clicked: ${boxId}`)
    
    // Trigger ripple effect from center of box - slower for manual clicks
    const centerX = x + width / 2
    const centerY = y + height / 2
    dotsRef.current?.triggerRipple(centerX, centerY, 2500, 1.5) // Slower 2.5s ripples, larger for clicks
    
    // Show notification
    setShowNotification(true)
    
    // Auto-hide notification after 3 seconds
    setTimeout(() => {
      setShowNotification(false)
    }, 3000)
  }, [])

  // Removed hover handlers since no-go zone is disabled

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div 
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg shadow-lg border border-white/20 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                <span className="font-medium">In progress - currently being built</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Optimized dots background */}
      <CanvasDotsBackground 
        ref={dotsRef}
      />

      {/* Portfolio boxes */}
      <AnimatePresence>
        {adjustedBoxStates.map((boxState) => {
          const config = boxConfigs[boxState.id]
          if (!config) return null

          return (
            <PortfolioBox
              key={boxState.id}
              boxState={boxState}
              config={config}
              animationComplete={animationComplete}
              isMobile={dimensions.isMobile}
              animationSpeed={animationSpeed}
              onClick={(x, y, width, height) => handleBoxClick(boxState.id, x, y, width, height)}
              // Removed hover props since no-go zone is disabled
            />
          )
        })}
      </AnimatePresence>

      {/* Accessibility improvements */}
      <div className="sr-only">
        <h1>Portfolio Website</h1>
        <p>Interactive portfolio showcasing projects, experience, blog, current work, and about information.</p>
      </div>
    </div>
  )
}
