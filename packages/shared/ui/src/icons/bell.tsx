"use client"

import type { Variants } from "motion/react"
import { motion, useAnimation } from "motion/react"
import type { HTMLAttributes } from "react"
import React, { forwardRef, useCallback, useImperativeHandle, useRef } from "react"
import { cn } from "@compo/utils"

export interface BellHandle {
  startAnimation: () => void
  stopAnimation: () => void
}

interface BellProps extends HTMLAttributes<HTMLDivElement> {
  //
}

const svgVariants: Variants = {
  normal: { rotate: 0 },
  animate: { rotate: [0, -10, 10, -10, 0] },
}

const Bell = forwardRef<BellHandle, BellProps>(({ onMouseEnter, onMouseLeave, className, ...props }, ref) => {
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
        transition={{
          duration: 0.5,
          ease: "easeInOut",
        }}
      >
        <path d='M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9' />
        <path d='M10.3 21a1.94 1.94 0 0 0 3.4 0' />
      </motion.svg>
    </div>
  )
})

Bell.displayName = "Bell"

export { Bell }
