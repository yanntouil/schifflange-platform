"use client"

import { cn } from "@compo/utils"
import type { VariantProps } from "class-variance-authority"
import * as React from "react"
import type { ButtonProps as AriaButtonProps } from "react-aria-components"
import { Button as AriaButton, composeRenderProps } from "react-aria-components"
import { buttonVariants } from "./variants"

/**
 * Button
 */
export type ButtonProps = AriaButtonProps & VariantProps<typeof buttonVariants>
const Button: React.FC<ButtonProps> = ({ className, variant, size, icon, ...props }) => {
  return (
    <AriaButton
      className={composeRenderProps(className, (className) =>
        cn(
          buttonVariants({
            variant,
            size,
            icon,
            className,
          })
        )
      )}
      {...props}
    />
  )
}

export { Button }
