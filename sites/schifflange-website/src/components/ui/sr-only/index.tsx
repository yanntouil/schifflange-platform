import React from "react"
import { cxm } from "@compo/utils"

/**
 * SrOnly
 */
type Props<T extends keyof React.JSX.IntrinsicElements> = {
  as?: T
} & React.ComponentProps<T>
const SrOnlyCpm = <T extends keyof React.JSX.IntrinsicElements = "span">(
  { as, className, ...props }: Props<T>,
  ref: React.Ref<React.ElementType<T>>
) => {
  const As = (as || "span") as React.ElementType
  return <As className={cxm("sr-only", className)} {...props} ref={ref} />
}
export const SrOnly = React.forwardRef(SrOnlyCpm)
