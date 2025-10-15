"use client"

import type { Variants } from "motion/react"
import { motion, useAnimation } from "motion/react"
import type { HTMLAttributes } from "react"
import React, { forwardRef, useCallback, useImperativeHandle, useRef } from "react"
import { cn } from "@compo/utils"

export interface IdCardHandle {
  startAnimation: () => void
  stopAnimation: () => void
}

interface IdCardProps extends HTMLAttributes<HTMLDivElement> {
  //
}

const Variants: Variants = {
  normal: {
    pathLength: 1,
    opacity: 1,
  },
  animate: (custom: number) => ({
    pathLength: [0, 1],
    opacity: [0, 1],
    transition: {
      duration: 0.3,
      delay: custom * 0.1,
    },
  }),
}

const IdCard = forwardRef<IdCardHandle, IdCardProps>(({ onMouseEnter, onMouseLeave, className, ...props }, ref) => {
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
        <motion.path d='M16 10h2' variants={Variants} animate={controls} custom={2} />
        <motion.path d='M16 14h2' variants={Variants} animate={controls} custom={2} />
        <motion.path d='M6.17 15a3 3 0 0 1 5.66 0' variants={Variants} animate={controls} custom={0} />
        <motion.circle cx='9' cy='11' r='2' variants={Variants} animate={controls} custom={1} />
        <rect x='2' y='5' width='20' height='14' rx='2' />
      </svg>
    </div>
  )
})

IdCard.displayName = "IdCard"

export { IdCard }
