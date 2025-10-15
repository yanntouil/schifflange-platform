import { VariantProps } from "class-variance-authority"
import React from "react"
import { createAssertiveContext, cxm } from "@compo/utils"
import { Slot } from "../../primitives"
import { buttonVariants } from "./variants"

/**
 * Button component
 * @see https://ui.shadcn.com/docs/components/button
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, icon, asChild, type = "button", ...props }, ref) => {
    const Component = asChild ? Slot : "button"
    return (
      <Component ref={ref} type={type} className={cxm(buttonVariants({ variant, size, icon }), className)} {...props} />
    )
  }
)
Button.displayName = "Button"
export { Button }

/**
 * Button Context
 */
export const ButtonContext = createAssertiveContext<{ pending: boolean; active: boolean }>({
  pending: false,
  active: false,
})

/**
 * Button Loading
 */
export const ButtonLoading: React.FC<{
  children: React.ReactNode
  fallback?: React.ReactNode
  loading?: boolean
}> = (props) => {
  const { loading, fallback, children } = props

  const buttonContextPending = ButtonContext.use().pending
  const pending = loading || buttonContextPending

  if (!pending) return fallback
  return children
}

/**
 * ButtonActive
 */
export const ButtonActive: React.FC<{
  children: React.ReactNode
  fallback?: React.ReactNode
}> = (props) => {
  const { fallback, children } = props

  const active = ButtonContext.use().active

  if (!active) return fallback
  return children
}
