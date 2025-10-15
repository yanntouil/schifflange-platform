import * as LabelPrimitive from "@radix-ui/react-label"
import { VariantProps } from "class-variance-authority"
import * as React from "react"
import { cn } from "@compo/utils"
import { labelVariants } from "./variants"

/**
 * Label
 */
export type LabelProps = React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & VariantProps<typeof labelVariants>
const Label = React.forwardRef<React.ElementRef<typeof LabelPrimitive.Root>, LabelProps>(
  ({ className, ...props }, ref) => (
    <LabelPrimitive.Root ref={ref} className={cn(labelVariants(), className)} {...props} />
  )
)
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
