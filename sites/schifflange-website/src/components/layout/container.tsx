import { cn, cva, type VariantProps } from "@compo/utils"
import React from "react"

/**
 * Container
 */

export type ContainerProps<T extends keyof React.JSX.IntrinsicElements> = React.ComponentProps<T> & {
  as?: T
} & VariantProps<typeof containerVariants>
export const Container = <T extends keyof React.JSX.IntrinsicElements = "div">({
  className,
  size,
  padding,
  as,
  ...props
}: ContainerProps<T>) => {
  const As = (as || "div") as React.ElementType
  return <As className={cn(containerVariants({ size, padding }), className)} {...props} />
}

export const containerVariants = cva("w-full", {
  variants: {
    size: {
      default: "max-w-[1295px]",
    },
    padding: {
      default: "px-5 sm:px-5 lg:px-5",
      none: "",
    },
  },
  defaultVariants: {
    size: "default",
    padding: "default",
  },
})
