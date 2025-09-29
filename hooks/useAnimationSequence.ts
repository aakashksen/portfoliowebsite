import { useState, useEffect, useCallback, useRef } from 'react'
import type { BoxState } from '../components/PortfolioBox'
import type { ViewportDimensions } from './useViewportDimensions'

interface UseAnimationSequenceOptions {
  dimensions: ViewportDimensions
  onSpawnEffect: (x: number, y: number) => void
  enableReducedMotion?: boolean
}
export function useAnimationSequence({ 
  dimensions, 
  onSpawnEffect, 
  enableReducedMotion = false 
}: UseAnimationSequenceOptions) {
  // Unified animation speed control - modify this to speed up/slow down everything
  const ANIMATION_SPEED = 1.2 // 1.0 = normal, 0.5 = slow, 2.0 = fast - controls all timing
  const [boxStates, setBoxStates] = useState<BoxState[]>([])
  const [animationStep, setAnimationStep] = useState(0)
  const [animationComplete, setAnimationComplete] = useState(false)
  const timeoutsRef = useRef<NodeJS.Timeout[]>([])
  const { 
    boxWidth, 
    boxHeight, 
    tallBoxHeight, 
    startX, 
    startY, 
    centerX, 
    centerY,
    isMobile 
  } = dimensions

  const clearTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []
  }, [])

  const createAnimationSequence = useCallback(() => {
    if (enableReducedMotion) {
      // Skip animation, show final state immediately
      setBoxStates([
        {
          id: "projects",
          x: startX,
          y: startY,
          width: boxWidth,
          height: boxHeight,
          isVisible: true,
        },
        {
          id: "experience",
          x: isMobile ? startX : startX + boxWidth * 2 + 40,
          y: isMobile ? startY + boxHeight + 20 : startY,
          width: boxWidth,
          height: boxHeight,
          isVisible: true,
        },
        {
          id: "blog",
          x: startX,
          y: isMobile ? startY + (boxHeight + 20) * 2 : startY + boxHeight + 20,
          width: boxWidth,
          height: boxHeight,
          isVisible: true,
        },
        {
          id: "current",
          x: isMobile ? startX : startX + boxWidth * 2 + 40,
          y: isMobile ? startY + (boxHeight + 20) * 3 : startY + boxHeight + 20,
          width: boxWidth,
          height: boxHeight,
          isVisible: true,
        },
        {
          id: "about",
          x: isMobile ? startX : startX + boxWidth + 20,
          y: isMobile ? startY + (boxHeight + 20) * 4 : startY,
          width: boxWidth,
          height: isMobile ? boxHeight : tallBoxHeight,
          isVisible: true,
        },
      ])
      setAnimationComplete(true)
      setAnimationStep(5)
      return
    }

    const animationSequence = [
      // Step 1: First box spawns in center
      () => {
        setBoxStates([
          {
            id: "projects",
            x: centerX - boxWidth / 2,
            y: centerY - boxHeight / 2,
            width: boxWidth,
            height: boxHeight,
            isVisible: true,
          },
        ])
        // Delay ripple until after box fade-in animation completes
        setTimeout(() => {
          onSpawnEffect(centerX, centerY)
        }, 600) // Wait for box to fully appear
      },

      // Step 2: Second box spawns, first moves left
      () => {
        setBoxStates([
          {
            id: "projects",
            x: centerX - boxWidth - 10,
            y: centerY - boxHeight / 2,
            width: boxWidth,
            height: boxHeight,
            isVisible: true,
          },
          {
            id: "experience",
            x: centerX + 10,
            y: centerY - boxHeight / 2,
            width: boxWidth,
            height: boxHeight,
            isVisible: true,
          },
        ])
        // Delay ripple until after box movement and fade-in completes
        setTimeout(() => {
          onSpawnEffect(centerX + 10 + boxWidth / 2, centerY)
        }, 600)
      },

      // Step 3: Third box spawns below
      () => {
        setBoxStates([
          {
            id: "projects",
            x: centerX - boxWidth - 10,
            y: centerY - boxHeight - 10,
            width: boxWidth,
            height: boxHeight,
            isVisible: true,
          },
          {
            id: "experience",
            x: centerX + 10,
            y: centerY - boxHeight - 10,
            width: boxWidth,
            height: boxHeight,
            isVisible: true,
          },
          {
            id: "blog",
            x: centerX - boxWidth / 2,
            y: centerY + 10,
            width: boxWidth,
            height: boxHeight,
            isVisible: true,
          },
        ])
        // Delay ripple until after box positioning completes
        setTimeout(() => {
          onSpawnEffect(centerX, centerY + 10 + boxHeight / 2)
        }, 600)
      },

      // Step 4: Fourth box completes 2x2 grid
      () => {
        setBoxStates([
          {
            id: "projects",
            x: centerX - boxWidth - 10,
            y: centerY - boxHeight - 10,
            width: boxWidth,
            height: boxHeight,
            isVisible: true,
          },
          {
            id: "experience",
            x: centerX + 10,
            y: centerY - boxHeight - 10,
            width: boxWidth,
            height: boxHeight,
            isVisible: true,
          },
          {
            id: "blog",
            x: centerX - boxWidth - 10,
            y: centerY + 10,
            width: boxWidth,
            height: boxHeight,
            isVisible: true,
          },
          {
            id: "current",
            x: centerX + 10,
            y: centerY + 10,
            width: boxWidth,
            height: boxHeight,
            isVisible: true,
          },
        ])
        // Delay ripple until after grid formation completes
        setTimeout(() => {
          onSpawnEffect(centerX + 10 + boxWidth / 2, centerY + 10 + boxHeight / 2)
        }, 600)
      },

      // Step 5: Move to final positions, About box loads in center
      () => {
        if (isMobile) {
          // Mobile: vertical stack layout
          setBoxStates([
            {
              id: "projects",
              x: startX,
              y: startY,
              width: boxWidth,
              height: boxHeight,
              isVisible: true,
            },
            {
              id: "experience",
              x: startX,
              y: startY + boxHeight + 20,
              width: boxWidth,
              height: boxHeight,
              isVisible: true,
            },
            {
              id: "blog",
              x: startX,
              y: startY + (boxHeight + 20) * 2,
              width: boxWidth,
              height: boxHeight,
              isVisible: true,
            },
            {
              id: "current",
              x: startX,
              y: startY + (boxHeight + 20) * 3,
              width: boxWidth,
              height: boxHeight,
              isVisible: true,
            },
            {
              id: "about",
              x: startX,
              y: startY + (boxHeight + 20) * 4,
              width: boxWidth,
              height: boxHeight, // Start with normal height
              isVisible: true,
            },
          ])
          // Delay ripple until after final positioning completes
          setTimeout(() => {
            onSpawnEffect(startX + boxWidth / 2, startY + (boxHeight + 20) * 4 + boxHeight / 2)
          }, 800) // Longer delay for final positioning
        } else {
          // Desktop: About box loads in center of screen first
          setBoxStates([
            {
              id: "projects",
              x: startX,
              y: startY,
              width: boxWidth,
              height: boxHeight,
              isVisible: true,
            },
            {
              id: "experience",
              x: startX + boxWidth * 2 + 40,
              y: startY,
              width: boxWidth,
              height: boxHeight,
              isVisible: true,
            },
            {
              id: "blog",
              x: startX,
              y: startY + boxHeight + 20,
              width: boxWidth,
              height: boxHeight,
              isVisible: true,
            },
            {
              id: "current",
              x: startX + boxWidth * 2 + 40,
              y: startY + boxHeight + 20,
              width: boxWidth,
              height: boxHeight,
              isVisible: true,
            },
            {
              id: "about",
              x: startX + boxWidth + 20, // Go directly to final position
              y: startY, // Start at top of final position
              width: boxWidth,
              height: boxHeight, // Start with normal height
              isVisible: true,
            },
          ])
          // Delay ripple until after final positioning completes
          setTimeout(() => {
            onSpawnEffect(startX + boxWidth + 20 + boxWidth / 2, startY + boxHeight / 2)
          }, 800) // Longer delay for final positioning
        }
      },

      // Step 6: Stretch the About box and show additional content
      () => {
        if (isMobile) {
          // Mobile: keep vertical stack, about box stays normal
          setBoxStates([
            {
              id: "projects",
              x: startX,
              y: startY,
              width: boxWidth,
              height: boxHeight,
              isVisible: true,
            },
            {
              id: "experience",
              x: startX,
              y: startY + boxHeight + 20,
              width: boxWidth,
              height: boxHeight,
              isVisible: true,
            },
            {
              id: "blog",
              x: startX,
              y: startY + (boxHeight + 20) * 2,
              width: boxWidth,
              height: boxHeight,
              isVisible: true,
            },
            {
              id: "current",
              x: startX,
              y: startY + (boxHeight + 20) * 3,
              width: boxWidth,
              height: boxHeight,
              isVisible: true,
            },
            {
              id: "about",
              x: startX,
              y: startY + (boxHeight + 20) * 4,
              width: boxWidth,
              height: boxHeight, // Mobile keeps normal height
              isVisible: true,
            },
          ])
        } else {
          // Desktop: About box expands up and down from center, then moves to final position
          const expandedY = centerY - tallBoxHeight / 2 // Expand up and down from center
          setBoxStates([
            {
              id: "projects",
              x: startX,
              y: startY,
              width: boxWidth,
              height: boxHeight,
              isVisible: true,
            },
            {
              id: "experience",
              x: startX + boxWidth * 2 + 40,
              y: startY,
              width: boxWidth,
              height: boxHeight,
              isVisible: true,
            },
            {
              id: "blog",
              x: startX,
              y: startY + boxHeight + 20,
              width: boxWidth,
              height: boxHeight,
              isVisible: true,
            },
            {
              id: "current",
              x: startX + boxWidth * 2 + 40,
              y: startY + boxHeight + 20,
              width: boxWidth,
              height: boxHeight,
              isVisible: true,
            },
            {
              id: "about",
              x: startX + boxWidth + 20, // Stay in final X position
              y: startY, // Expand to top of grid
              width: boxWidth,
              height: tallBoxHeight, // Stretch to tall height
              isVisible: true,
            },
          ])
        }
        
        setTimeout(() => setAnimationComplete(true), 1000 / ANIMATION_SPEED)
      },
    ]

    clearTimeouts()

    animationSequence.forEach((step, index) => {
      // STRICT RULE: Each pop-in must finish before next box starts
      // Pop-in takes ~1200ms to fully settle, so minimum 1300ms between steps
      let delay = index * 1300 // Ensure pop-in completes before next box
      if (index === 3) delay += 300 // Extra delay for step 4 to prevent crossing
      if (index >= 4) delay += 300 // Shift later steps
      
      // Apply unified speed control
      delay = delay / ANIMATION_SPEED
      
      const timeout = setTimeout(() => {
        setAnimationStep(index + 1)
        step()
      }, delay)
      timeoutsRef.current.push(timeout)
    })
  }, [
    boxWidth, 
    boxHeight, 
    tallBoxHeight, 
    startX, 
    startY, 
    centerX, 
    centerY, 
    isMobile,
    onSpawnEffect, 
    enableReducedMotion,
    clearTimeouts,
    ANIMATION_SPEED
  ])

  // Start animation sequence
  useEffect(() => {
    createAnimationSequence()
    
    return clearTimeouts
  }, [createAnimationSequence, clearTimeouts])

  return {
    boxStates,
    animationComplete,
    animationStep,
    animationSpeed: ANIMATION_SPEED
  }
}
