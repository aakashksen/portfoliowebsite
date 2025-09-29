'use client'

import React, { memo, forwardRef, useImperativeHandle } from 'react'
import { motion } from 'framer-motion'
import { useDotsPhysics, type Dot } from '../hooks/useDotsPhysics'

interface DotsBackgroundProps {
  enableReducedMotion?: boolean
  className?: string
}

export interface DotsBackgroundRef {
  triggerSpawn: (x: number, y: number) => void
  triggerRepel: (x: number, y: number, width: number, height: number) => void
}

// Memoized individual dot component to prevent unnecessary re-renders
const DotComponent = memo(({ dot }: { dot: Dot }) => {
  return (
    <motion.div
      className="absolute w-0.5 h-0.5 bg-white rounded-full pointer-events-none performance-optimized shadow-sm"
      style={{
        left: dot.originalX,
        top: dot.originalY,
      }}
      animate={{
        x: dot.x - dot.originalX,
        y: dot.y - dot.originalY,
        scale: dot.isDisturbed ? 1.8 + dot.disturbanceLevel * 0.8 : 1,
        opacity: dot.isDisturbed ? 0.9 + dot.disturbanceLevel * 0.3 : 0.4,
      }}
      transition={{
        type: "tween",
        duration: 0.04,  // Super fast animations
        ease: "easeOut",
      }}
    />
  )
})

DotComponent.displayName = 'DotComponent'

export const DotsBackground = forwardRef<DotsBackgroundRef, DotsBackgroundProps>(({ 
  enableReducedMotion = false,
  className = ''
}, ref) => {
  const { dots, triggerSpawnEffect, triggerRepelEffect, isAnimating, settledCount, totalCount } = useDotsPhysics({
    dotSpacing: 15,
    maxDots: 5000,
    enableReducedMotion,
    animationThreshold: 0.2
  })

  // Expose trigger functions to parent through ref
  useImperativeHandle(ref, () => ({
    triggerSpawn: triggerSpawnEffect,
    triggerRepel: triggerRepelEffect
  }), [triggerSpawnEffect, triggerRepelEffect])

  // Performance monitoring in development
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`Dots: ${totalCount}, Settled: ${settledCount}, Animating: ${isAnimating}`)
    }
  }, [totalCount, settledCount, isAnimating])

  if (enableReducedMotion) {
    // Static dot grid for users who prefer reduced motion
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
    <div className={`absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {dots.map((dot) => (
        <DotComponent key={dot.id} dot={dot} />
      ))}
      
      {/* Performance indicator in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded text-xs font-mono z-50">
          <div>Dots: {totalCount}</div>
          <div>Settled: {settledCount}</div>
          <div>Active: {totalCount - settledCount}</div>
          <div>Animating: {isAnimating ? '🟢' : '🔴'}</div>
        </div>
      )}
    </div>
  )
})

DotsBackground.displayName = 'DotsBackground'
