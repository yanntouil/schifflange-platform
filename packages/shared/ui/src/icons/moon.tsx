"use client"

import type { Transition, Variants } from "motion/react"
import { motion, useAnimation } from "motion/react"
import type { HTMLAttributes } from "react"
import React, { forwardRef, useCallback, useImperativeHandle, useRef } from "react"
import { cn } from "@compo/utils"

export interface MoonHandle {
  startAnimation: () => void
  stopAnimation: () => void
}

interface MoonProps extends HTMLAttributes<HTMLDivElement> {
  //
}

const svgVariants: Variants = {
  normal: {
    rotate: 0,
  },
  animate: {
    rotate: [0, -10, 10, -5, 5, 0],
  },
}

const svgTransition: Transition = {
  duration: 1.2,
  ease: "easeInOut",
}

const Moon = forwardRef<MoonHandle, MoonProps>(({ onMouseEnter, onMouseLeave, className, ...props }, ref) => {
  const controls = useAnimation()
  const isControlledRef = useRef(false)

  useImperativeHandle(ref, () => {
    isControlledRef.current = true

    return {
      startAnimation: () => controls.start("animate"),
      stopAnimation: () => controls.start("normal"),
    }
  })

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isControlledRef.current) {
        controls.start("animate")
      } else {
        onMouseEnter?.(e)
      }
    },
    [controls, onMouseEnter]
  )

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isControlledRef.current) {
        controls.start("normal")
      } else {
        onMouseLeave?.(e)
      }
    },
    [controls, onMouseLeave]
  )
  return (
    <div className={cn(className)} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} {...props}>
      <motion.svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        variants={svgVariants}
        animate={controls}
        transition={svgTransition}
      >
        <path d='M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z' />
      </motion.svg>
    </div>
  )
})

Moon.displayName = "Moon"

export { Moon }
