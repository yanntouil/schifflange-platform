import { cn } from "@compo/utils"
import React from "react"

export type WrapperProps<T extends keyof React.JSX.IntrinsicElements> = React.ComponentProps<T> & {
  as?: T
}
export const Wrapper = <T extends keyof React.JSX.IntrinsicElements = "div">({
  className,
  as,
  ...props
}: WrapperProps<T>) => {
  const As = (as || "div") as React.ElementType
  return (
    <As className={cn("relative flex flex-col items-center justify-center @container/wrapper", className)} {...props} />
  )
}
