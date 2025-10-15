import { Primitives } from "@compo/primitives"
import { cn, VariantProps } from "@compo/utils"
import React from "react"
import { switchThumbVariants, switchVariants } from "./variants"

/**
 * Switch
 */
export type SwitchProps = React.ComponentPropsWithoutRef<typeof Primitives.Switch.Root> &
  VariantProps<typeof switchVariants>
const Switch = React.forwardRef<React.ElementRef<typeof Primitives.Switch.Root>, SwitchProps>(
  ({ className, variant, size, ...props }, ref) => (
    <Primitives.Switch.Root className={cn(switchVariants({ variant, size }), className)} {...props} ref={ref}>
      <Primitives.Switch.Thumb className={cn(switchThumbVariants({ variant, size }))} />
    </Primitives.Switch.Root>
  )
)
Switch.displayName = Primitives.Switch.Root.displayName

export { Switch }
