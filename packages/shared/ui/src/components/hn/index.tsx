import React from "react"
import { A } from "@compo/utils"
import { Tooltip } from "../tooltip"

/**
 * Hn
 */
export type HnProps = React.HTMLAttributes<HTMLHeadingElement> & {
  level?: string | number
  debug?: boolean
}
const Hn = React.forwardRef<HTMLHeadingElement, HnProps>(({ level = 1, debug = false, ...props }, ref) => {
  const l = A.includes([1, 2, 3, 4, 5, 6, "1", "2", "3", "4", "5", "6"], level) ? level : 1
  const As = `h${l}` as React.ElementType
  return (
    <Tooltip.Quick
      tooltip={debug ? `Heading ${l}` : undefined}
      asChild
      side='right'
      align='center'
      classNames={{ content: "border-2 border-destructive bg-card text-destructive font-medium" }}
    >
      <As {...props} ref={ref} />
    </Tooltip.Quick>
  )
})
Hn.displayName = "Hn"

/**
 * exports
 */
export { Hn }
