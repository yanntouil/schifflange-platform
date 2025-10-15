import { G } from "@mobily/ts-belt"
import { ImplicitAny } from "./types"

/**
 * Throwable delayed promise
 */

const delayPresets = {
  fast: [100, 500], // slow 4G
  slow: [500, 1500], // slow 3G
  unstable: [100, 2200],
  indefinite: [120000, 120000],
} as const

export const delay = <R>(options: number | DelayDeclaration<R> = {}) => {
  const opts = G.isNumber(options) ? { duration: 1000 } : options
  const { duration = 1000, resolve, reject = false } = opts

  const preset = G.isNumber(duration)
    ? ([duration, duration] as const)
    : G.isArray(duration)
    ? duration
    : delayPresets[duration]

  const ms = randomBetween(preset[0], preset[1])

  if (opts.label) {
    console.info(`[${opts.label}] delayed: ${ms}ms`)
  }

  return new Promise<R>((res, rej) => {
    setTimeout(() => void (reject ? rej(new Error("delay({ reject: true })")) : res(resolve as R)), ms)
  })
}

export type DelayDeclaration<R = unknown> = {
  duration?: number | [number, number] | keyof typeof delayPresets
  label?: string
  resolve?: R
  reject?: boolean
}

const randomBetween = (min: number, max: number) => {
  if (min === max) return min
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Defer
 */

export const defer = (fn: (...args: ImplicitAny[]) => ImplicitAny, ms = 1) => {
  setTimeout(fn, ms)
}

export const makeDeferred = (fn: (...args: ImplicitAny[]) => ImplicitAny, ms = 1) => {
  return () => defer(fn, ms)
}
