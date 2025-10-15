"use client"

import type { Transition } from "motion/react"
import { motion, useAnimation } from "motion/react"
import type { HTMLAttributes } from "react"
import React, { forwardRef, useCallback, useImperativeHandle, useRef } from "react"
import { cn } from "@compo/utils"

export interface ChevronsUpDownHandle {
  startAnimation: () => void
  stopAnimation: () => void
}

interface ChevronsUpDownProps extends HTMLAttributes<HTMLDivElement> {
  //
}

const defaultTransition: Transition = {
  type: "spring",
  stiffness: 250,
  damping: 25,
}

const ChevronsUpDown = forwardRef<ChevronsUpDownHandle, ChevronsUpDownProps>(
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
              normal: { translateY: "0%" },
              animate: { translateY: "2px" },
            }}
            transition={defaultTransition}
            animate={controls}
            initial='normal'
            d='m7 15 5 5 5-5'
          />
          <motion.path
            variants={{
              normal: { translateY: "0%" },
              animate: { translateY: "-2px" },
            }}
            transition={defaultTransition}
            animate={controls}
            initial='normal'
            d='m7 9 5-5 5 5'
          />
        </svg>
      </div>
    )
  }
)

ChevronsUpDown.displayName = "ChevronsUpDown"

export { ChevronsUpDown }
