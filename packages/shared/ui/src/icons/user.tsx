"use client"

import type { Variants } from "motion/react"
import { motion, useAnimation } from "motion/react"
import type { HTMLAttributes } from "react"
import React, { forwardRef, useCallback, useImperativeHandle, useRef } from "react"
import { cn } from "@compo/utils"

export interface UserHandle {
  startAnimation: () => void
  stopAnimation: () => void
}

interface UserProps extends HTMLAttributes<HTMLDivElement> {
  //
}

const pathVariant: Variants = {
  normal: { pathLength: 1, opacity: 1, pathOffset: 0 },
  animate: {
    pathLength: [0, 1],
    opacity: [0, 1],
    pathOffset: [1, 0],
  },
}

const circleVariant: Variants = {
  normal: {
    pathLength: 1,
    pathOffset: 0,
    scale: 1,
  },
  animate: {
    pathLength: [0, 1],
    pathOffset: [1, 0],
    scale: [0.5, 1],
  },
}

const User = forwardRef<UserHandle, UserProps>(({ onMouseEnter, onMouseLeave, className, ...props }, ref) => {
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
        <motion.circle cx='12' cy='8' r='5' animate={controls} variants={circleVariant} />

        <motion.path
          d='M20 21a8 8 0 0 0-16 0'
          variants={pathVariant}
          transition={{
            delay: 0.2,
            duration: 0.4,
          }}
          animate={controls}
        />
      </svg>
    </div>
  )
})

User.displayName = "User"

export { User }
