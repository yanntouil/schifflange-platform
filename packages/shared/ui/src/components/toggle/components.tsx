import * as TogglePrimitive from "@radix-ui/react-toggle"
import * as React from "react"
import { cn, type VariantProps } from "@compo/utils"
import { toggleVariants } from "./variants"

/**
 * Toggle
 */
export type ToggleProps = React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>
const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root ref={ref} className={cn(toggleVariants({ variant, size, className }))} {...props} />
))

Toggle.displayName = TogglePrimitive.Root.displayName

export { Toggle }
