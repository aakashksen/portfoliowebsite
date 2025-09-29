'use client'

import React, { memo } from 'react'
import { motion } from 'framer-motion'
import { Mail } from 'lucide-react'

export interface BoxState {
  id: string
  x: number
  y: number
  width: number
  height: number
  isVisible: boolean
}

export interface BoxConfig {
  id: string
  icon: React.ReactNode
  title: string
  subtitle: string
  finalPosition: { x: number; y: number; width: number; height: number }
  showExtendedContent?: boolean
}

interface PortfolioBoxProps {
  boxState: BoxState
  config: BoxConfig
  animationComplete: boolean
  isMobile?: boolean
  animationSpeed?: number
  onClick?: (x: number, y: number, width: number, height: number) => void
  onHover?: (x: number, y: number, width: number, height: number) => void
  onHoverEnd?: () => void
}

export const PortfolioBox = memo<PortfolioBoxProps>(({ 
  boxState, 
  config, 
  animationComplete,
  isMobile = false,
  animationSpeed = 1.0,
  onClick,
  onHover,
  onHoverEnd
}) => {
  const isAboutBox = boxState.id === 'about'

  return (
    <motion.div
      className="absolute glass-morphism rounded-3xl flex flex-col items-center justify-center p-6 cursor-pointer select-none"
      style={{
        width: boxState.width,
        height: boxState.height,
      }}
      initial={{
        x: boxState.x,
        y: boxState.y,
        scale: 0,
        opacity: 0,
      }}
      animate={{
        x: boxState.x,
        y: boxState.y,
        scale: 1,
        opacity: 1,
      }}
      transition={{
        // Movement springs - FAST repulsion, independent of animation speed
        x: { 
          type: "spring", 
          stiffness: 300, // FAST repulsion response (not tied to animationSpeed)
          damping: 25,    // Lower damping for quick response
          mass: 0.8       // Light mass for instant reaction
        },
        y: { 
          type: "spring", 
          stiffness: 300, // FAST repulsion response (not tied to animationSpeed)
          damping: 25,    // Lower damping for quick response
          mass: 0.8       // Light mass for instant reaction
        },
        // Pop-in animation - fast but finishes in ~1000ms max
        scale: { 
          type: "spring", 
          stiffness: 180 * animationSpeed, // Fast pop-in but not too fast
          damping: 25,                     // Less damping for snappy feel
          mass: 0.8                        // Lighter mass = faster settling
        },
        opacity: { 
          type: "spring", 
          stiffness: 180 * animationSpeed, // Fast pop-in but not too fast
          damping: 25,                     // Less damping for snappy feel
          mass: 0.8                        // Lighter mass = faster settling
        },
      }}
      whileHover={!isMobile && animationComplete ? {
        scale: 1.02,
        y: boxState.y - 10,
        transition: { duration: 0.2, ease: "easeOut" },
      } : undefined}
      whileTap={animationComplete ? {
        scale: 0.98,
        transition: { duration: 0.1 }
      } : undefined}
      onClick={() => {
        if (animationComplete) {
          onClick?.(boxState.x, boxState.y, boxState.width, boxState.height)
        }
      }}
      onMouseEnter={() => {
        if (!isMobile && animationComplete && onHover) {
          onHover(boxState.x, boxState.y, boxState.width, boxState.height)
        }
      }}
      onMouseLeave={() => {
        if (!isMobile && animationComplete && onHoverEnd) {
          onHoverEnd()
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`${config.title}: ${config.subtitle}`}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && animationComplete) {
          e.preventDefault()
          onClick?.(boxState.x, boxState.y, boxState.width, boxState.height)
        }
      }}
    >
      {!isAboutBox && (
        <>
          <div className="text-white mb-6 flex-shrink-0">
            {config.icon}
          </div>
          
          <h3 className={`font-bold text-white mb-3 text-center ${
            isMobile ? 'text-2xl' : 'text-3xl'
          }`}>
            {config.title}
          </h3>
          
          <p className={`text-gray-300 text-center mb-4 ${
            isMobile ? 'text-lg' : 'text-xl'
          }`}>
            {config.subtitle}
          </p>
        </>
      )}

      {isAboutBox && (
        <div className={`flex-1 flex flex-col items-center ${
          config.showExtendedContent ? 'justify-center' : 'justify-start'
        }`}>
          {/* Main About content that moves with extension */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="text-white mb-6 flex-shrink-0">
              {config.icon}
            </div>
            
            <h3 className={`font-bold text-white mb-3 text-center ${
              isMobile ? 'text-2xl' : 'text-3xl'
            }`}>
              {config.title}
            </h3>
            
            <p className={`text-gray-300 text-center ${
              isMobile ? 'text-lg' : 'text-xl'
            }`}>
              {config.subtitle}
            </p>
          </div>

          <motion.div
            className={`flex flex-col items-center gap-4 text-center ${
              isMobile ? 'gap-3' : 'gap-4'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: config.showExtendedContent ? 1 : 0,
              y: config.showExtendedContent ? 0 : 20
            }}
            transition={{ 
              delay: 0, // Show instantly when box stretches
              duration: 0.3,
              ease: "easeOut"
            }}
          >
          <div className={`rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center ${
            isMobile ? 'w-14 h-14' : 'w-20 h-20'
          }`}>
            <span className={`font-bold text-white ${
              isMobile ? 'text-xl' : 'text-3xl'
            }`}>
              JD
            </span>
          </div>
          
          <div className="text-center">
            <p className={`text-gray-300 ${
              isMobile ? 'text-base mb-3' : 'text-lg mb-4'
            }`}>
              Creative Developer & Designer
            </p>
            
            <motion.div 
              className="flex items-center gap-3 text-blue-400 justify-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Mail className={isMobile ? 'w-5 h-5' : 'w-6 h-6'} />
              <span className={isMobile ? 'text-base' : 'text-lg'}>
                hello@example.com
              </span>
            </motion.div>
            
            {/* Additional content that "loads in" when box stretches */}
            {config.showExtendedContent && (
              <motion.div
                className="mt-3 space-y-2 text-center w-full flex flex-col items-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
              >
                <div className="flex items-center justify-center gap-2 text-gray-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm">Available for projects</span>
                </div>
                
                <div className="flex flex-wrap justify-center gap-2 mt-2">
                  {['React', 'TypeScript', 'Node.js'].map((skill, index) => (
                    <motion.span
                      key={skill}
                      className="px-2 py-1 bg-gray-800 text-gray-300 rounded-full text-xs"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 + index * 0.1, duration: 0.3 }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
})

PortfolioBox.displayName = 'PortfolioBox'
