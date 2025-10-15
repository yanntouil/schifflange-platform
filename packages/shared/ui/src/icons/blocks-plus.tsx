"use client"

import type { Variants } from "motion/react"
import { motion, useAnimation } from "motion/react"
import type { HTMLAttributes } from "react"
import React, { forwardRef, useCallback, useImperativeHandle, useRef } from "react"
import { cn } from "@compo/utils"

export interface BlocksPlusHandle {
  startAnimation: () => void
  stopAnimation: () => void
}

interface BlocksPlusProps extends HTMLAttributes<HTMLDivElement> {
  size?: number
}

const variants: Variants = {
  normal: { translateX: 0, translateY: 0 },
  animate: { translateX: 2, translateY: 2 },
}

const BlocksPlus = forwardRef<BlocksPlusHandle, BlocksPlusProps>(
  ({ onMouseEnter, onMouseLeave, className, ...props }, ref) => {
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
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <path d='M12 3v17a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a1 1 0 0 1-1 1H3' />
          <motion.path d='M16 19h6' variants={variants} animate={controls} />
          <motion.path d='M19 22v-6' variants={variants} animate={controls} />
        </svg>
      </div>
    )
  }
) // motion.path

BlocksPlus.displayName = "BlocksPlus"

export { BlocksPlus }
