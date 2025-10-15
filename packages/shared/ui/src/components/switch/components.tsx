import * as SwitchPrimitives from "@radix-ui/react-switch"
import * as React from "react"
import { cn, VariantProps } from "@compo/utils"
import { switchThumbVariants, switchVariants } from "./variants"

/**
 * Switch
 */
export type SwitchProps = React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> &
  VariantProps<typeof switchVariants>
const Switch = React.forwardRef<React.ElementRef<typeof SwitchPrimitives.Root>, SwitchProps>(
  ({ className, variant, size, ...props }, ref) => (
    <SwitchPrimitives.Root className={cn(switchVariants({ variant, size }), className)} {...props} ref={ref}>
      <SwitchPrimitives.Thumb className={cn(switchThumbVariants({ variant, size }))} />
    </SwitchPrimitives.Root>
  )
)
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
