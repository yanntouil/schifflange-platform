import { cva } from "@compo/utils"

/**
 * Focus Variants
 */
export const focusVisibleVariants = cva(
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
)
export const focusVariants = cva(
  "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
)
export const focusWithinVariants = cva(
  "focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background"
)
export { focusVariants as focus, focusVisibleVariants as focusVisible, focusWithinVariants as focusWithin }
