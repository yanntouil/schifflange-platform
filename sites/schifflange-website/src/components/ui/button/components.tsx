import { cxm, type VariantProps } from "@compo/utils"
import { Slot } from "@radix-ui/react-slot"
import React from "react"
import { variants } from "../variants"

/**
 * Button
 */
export type ButtonProps = React.ComponentProps<"button"> & {
  asChild?: boolean
} & VariantProps<typeof variants.button>

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, icon, size, asChild, disabled, ...props }, ref) => {
    const Component = asChild ? Slot : "button"
    return (
      <Component
        ref={ref}
        disabled={disabled}
        aria-disabled={disabled}
        {...props}
        className={cxm(variants.button({ variant, icon, size }), className)}
      />
    )
  }
)

Button.displayName = "Button"
export { Button }
