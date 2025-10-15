"use client"

import type { Transition } from "motion/react"
import { motion, useAnimation } from "motion/react"
import type { HTMLAttributes } from "react"
import React, { forwardRef, useCallback, useImperativeHandle, useRef } from "react"
import { cn } from "@compo/utils"

export interface ChevronDownHandle {
  startAnimation: () => void
  stopAnimation: () => void
}

interface ChevronDownProps extends HTMLAttributes<HTMLDivElement> {
  //
}

const defaultTransition: Transition = {
  times: [0, 0.4, 1],
  duration: 0.5,
}

const ChevronDown = forwardRef<ChevronDownHandle, ChevronDownProps>(
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
          <motion.path
            variants={{
              normal: { y: 0 },
              animate: { y: [0, 2, 0] },
            }}
            transition={defaultTransition}
            animate={controls}
            d='m6 9 6 6 6-6'
          />
        </svg>
      </div>
    )
  }
)

ChevronDown.displayName = "ChevronDown"

export { ChevronDown }
