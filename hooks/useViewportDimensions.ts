import { useState, useEffect, useCallback } from 'react'

export interface ViewportDimensions {
  vw: number
  vh: number
  boxWidth: number
  boxHeight: number
  tallBoxHeight: number
  startX: number
  startY: number
  centerX: number
  centerY: number
  isMobile: boolean
  isTablet: boolean
}

// Helper function to calculate dimensions
function calculateDimensionsHelper(): ViewportDimensions {
  const vw = window.innerWidth
  const vh = window.innerHeight
  
  // Device detection
  const isMobile = vw < 768
  const isTablet = vw >= 768 && vw < 1024
  const isDesktop = vw >= 1024

  // Responsive box sizing
  let boxWidth: number
  let boxHeight: number
  
  if (isMobile) {
    // Mobile: smaller boxes, single column layout
    boxWidth = Math.min(vw * 0.85, 300)
    boxHeight = Math.min(vh * 0.25, 200)
  } else if (isTablet) {
    // Tablet: medium boxes
    boxWidth = Math.min(vw * 0.4, 350)
    boxHeight = Math.min(vh * 0.35, 280)
  } else {
    // Desktop: larger boxes
    boxWidth = Math.min(vw * 0.28, 450)
    boxHeight = Math.min(vh * 0.42, 380)
  }

  const tallBoxHeight = boxHeight * 2 + 20 // Gap between boxes

  // Calculate layout positioning
  const totalWidth = isMobile ? boxWidth : boxWidth * 3 + 40 // 20px gaps
  const totalHeight = boxHeight * 2 + 20

  const startX = (vw - totalWidth) / 2
  const startY = (vh - totalHeight) / 2

  return {
    vw,
    vh,
    boxWidth,
    boxHeight,
    tallBoxHeight,
    startX: Math.max(20, startX), // Ensure minimum margin
    startY: Math.max(20, startY),
    centerX: vw / 2,
    centerY: vh / 2,
    isMobile,
    isTablet,
  }
}

export function useViewportDimensions() {
  const [dimensions, setDimensions] = useState<ViewportDimensions>(() => {
    if (typeof window === 'undefined') {
      return {
        vw: 1200,
        vh: 800,
        boxWidth: 300,
        boxHeight: 250,
        tallBoxHeight: 520,
        startX: 100,
        startY: 100,
        centerX: 600,
        centerY: 400,
        isMobile: false,
        isTablet: false,
      }
    }
    return calculateDimensionsHelper()
  })

  const calculateDimensions = useCallback((): ViewportDimensions => {
    return calculateDimensionsHelper()
  }, [])

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions(calculateDimensions())
    }

    // Debounced resize handler
    let timeoutId: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(updateDimensions, 150)
    }

    window.addEventListener('resize', handleResize)
    
    // Initial calculation
    updateDimensions()

    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(timeoutId)
    }
  }, [calculateDimensions])

  return dimensions
}
