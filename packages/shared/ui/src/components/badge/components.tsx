import { type VariantProps } from "class-variance-authority"
import * as React from "react"
import { cn } from "@compo/utils"
import { Tooltip } from "../tooltip"
import { TooltipContentProps } from "../tooltip/components"
import { badgeVariants } from "./variants"

/**
 * Badge props
 */
export type BadgeProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof badgeVariants> & {
    tooltip?: string
    side?: TooltipContentProps["side"]
    align?: TooltipContentProps["align"]
  }
const Badge: React.FC<BadgeProps> = ({ className, variant, tooltip, side, align, ...props }) => {
  return (
    <Tooltip.Quick tooltip={tooltip} side={side} align={align} asChild>
      <span className={cn(badgeVariants({ variant }), className)} {...props} />
    </Tooltip.Quick>
  )
}

export { Badge }
