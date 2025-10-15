import { variants } from "@compo/ui"
import { cn } from "@compo/utils"
import React from "react"
import { Form } from "use-a11y-form"

/**
 * FormError
 */
export type FormErrorProps = React.ComponentPropsWithoutRef<typeof Form.Error>
export const FormError = React.forwardRef<HTMLParagraphElement, FormErrorProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Form.Error ref={ref} {...(props as any)} className={cn(variants.fieldError(), className)}>
        {children}
      </Form.Error>
    )
  }
)
FormError.displayName = "FormError"

/**
 * FieldError
 */
export type FieldErrorProps = React.ComponentPropsWithoutRef<"p">
export const FieldError = React.forwardRef<HTMLParagraphElement, FieldErrorProps>(
  ({ className, children, ...props }, ref) => {
    if (!children) return null
    return (
      <p ref={ref} className={cn(variants.fieldError(), className)} {...props}>
        {children}
      </p>
    )
  }
)
FieldError.displayName = "FieldError"
