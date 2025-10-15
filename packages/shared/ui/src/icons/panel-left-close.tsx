"use client"

import type { Transition, Variants } from "motion/react"
import { motion, useAnimation } from "motion/react"
import type { HTMLAttributes } from "react"
import React, { forwardRef, useCallback, useImperativeHandle, useRef } from "react"
import { cn } from "@compo/utils"

export interface PanelLeftCloseIconHandle {
  startAnimation: () => void
  stopAnimation: () => void
}

interface PanelLeftCloseIconProps extends HTMLAttributes<HTMLDivElement> {
  //
}

const defaultTransition: Transition = {
  times: [0, 0.4, 1],
  duration: 0.5,
}

const pathVariants: Variants = {
  normal: { x: 0 },
  animate: { x: [0, -1.5, 0] },
}

const PanelLeftClose = forwardRef<PanelLeftCloseIconHandle, PanelLeftCloseIconProps>(
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
          <rect width='18' height='18' x='3' y='3' rx='2' />
          <path d='M9 3v18' />
          <motion.path transition={defaultTransition} variants={pathVariants} animate={controls} d='m16 15-3-3 3-3' />
        </svg>
      </div>
    )
  }
)

PanelLeftClose.displayName = "PanelLeftCloseIcon"

export { PanelLeftClose }
