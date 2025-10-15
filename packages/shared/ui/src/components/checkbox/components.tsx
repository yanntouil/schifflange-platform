import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { VariantProps } from "class-variance-authority"
import { CheckIcon } from "lucide-react"
import * as React from "react"
import { cn } from "@compo/utils"
import { checkboxVariants } from "./variants"

/**
 * Checkbox
 */
export type CheckboxProps = React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> &
  VariantProps<typeof checkboxVariants>
const Checkbox = React.forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(
  ({ size, variant, className, ...props }, ref) => (
    <CheckboxPrimitive.Root ref={ref} className={cn(checkboxVariants({ size, variant }), className)} {...props}>
      <CheckboxPrimitive.Indicator className={cn("flex items-center justify-center text-current")}>
        <CheckIcon />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
)
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
