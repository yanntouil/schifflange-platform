import * as SeparatorPrimitive from "@radix-ui/react-separator"
import * as React from "react"
import { cxm } from "@compo/utils"
/**
 * Separator
 */
export type SeparatorProps = React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
const Separator = React.forwardRef<React.ElementRef<typeof SeparatorPrimitive.Root>, SeparatorProps>(
  ({ className, orientation = "horizontal", decorative = true, ...props }, ref) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cxm(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )}
      {...props}
    />
  )
)
Separator.displayName = SeparatorPrimitive.Root.displayName
export { Separator }
