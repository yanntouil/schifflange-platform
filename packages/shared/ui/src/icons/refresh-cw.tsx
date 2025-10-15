"use client"

import { motion, useAnimation } from "motion/react"
import type { HTMLAttributes } from "react"
import React, { forwardRef, useCallback, useImperativeHandle, useRef } from "react"
import { cn } from "@compo/utils"

export interface RefreshCWIconHandle {
  startAnimation: () => void
  stopAnimation: () => void
}

interface RefreshCCWIcoWIcon extends HTMLAttributes<HTMLDivElement> {
  size?: number
}

const RefreshCWIcon = forwardRef<RefreshCWIconHandle, RefreshCCWIcoWIcon>(
  ({ onMouseEnter, onMouseLeave, className, size = 28, ...props }, ref) => {
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
        if (!isControlledRef.current) controls.start("animate")
        else onMouseEnter?.(e)
      },
      [controls, onMouseEnter]
    )

    const handleMouseLeave = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isControlledRef.current) controls.start("normal")
        else onMouseLeave?.(e)
      },
      [controls, onMouseLeave]
    )

    return (
      <div className={cn(className)} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} {...props}>
        <motion.svg
          xmlns='http://www.w3.org/2000/svg'
          width={size}
          height={size}
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
          transition={{ type: "spring", stiffness: 250, damping: 25 }}
          variants={{
            normal: { rotate: "0deg" },
            animate: { rotate: "50deg" },
          }}
          animate={controls}
        >
          <path d='M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8' />
          <path d='M21 3v5h-5' />
          <path d='M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16' />
          <path d='M8 16H3v5' />
        </motion.svg>
      </div>
    )
  }
)

RefreshCWIcon.displayName = "RefreshCWIcon"

export { RefreshCWIcon }
