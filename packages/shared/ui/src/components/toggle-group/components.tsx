import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group"
import * as React from "react"
import { cn, cxm, type VariantProps } from "@compo/utils"
import { toggleVariants } from "../toggle"
import { ToggleGroupContext, useToggleGroupContext } from "./context"

/**
 * ToggleGroupRoot
 */
export type ToggleGroupRootProps = React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> &
  VariantProps<typeof toggleVariants>

const ToggleGroupRoot = React.forwardRef<React.ElementRef<typeof ToggleGroupPrimitive.Root>, ToggleGroupRootProps>(
  ({ className, variant, size, children, ...props }, ref) => (
    <ToggleGroupPrimitive.Root
      ref={ref}
      className={cxm("flex items-center justify-center gap-1", className)}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ variant, size }}>{children}</ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  )
)
ToggleGroupRoot.displayName = "ToggleGroupRoot"

/**
 * ToggleGroupItem
 */
export type ToggleGroupItemProps = React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> &
  VariantProps<typeof toggleVariants>

const ToggleGroupItem = React.forwardRef<React.ElementRef<typeof ToggleGroupPrimitive.Item>, ToggleGroupItemProps>(
  ({ className, children, variant, size, ...props }, ref) => {
    const context = useToggleGroupContext()
    return (
      <ToggleGroupPrimitive.Item
        ref={ref}
        className={cn(
          toggleVariants({
            variant: context.variant || variant,
            size: context.size || size,
          }),
          className
        )}
        {...props}
      >
        {children}
      </ToggleGroupPrimitive.Item>
    )
  }
)
ToggleGroupItem.displayName = "ToggleGroupItem"

export { ToggleGroupItem as Item, ToggleGroupRoot as Root }
