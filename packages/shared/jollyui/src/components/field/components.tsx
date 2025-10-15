"use client"

import { cn } from "@compo/utils"
import { type VariantProps } from "class-variance-authority"
import * as React from "react"
import {
  FieldError as AriaFieldError,
  FieldErrorProps as AriaFieldErrorProps,
  Group as AriaGroup,
  GroupProps as AriaGroupProps,
  Label as AriaLabel,
  LabelProps as AriaLabelProps,
  Text as AriaText,
  TextProps as AriaTextProps,
  composeRenderProps,
} from "react-aria-components"
import { fieldGroupVariants, labelVariants } from "./variants"

/**
 * Label
 */
const Label: React.FC<AriaLabelProps> = ({ className, ...props }) => (
  <AriaLabel className={cn(labelVariants(), className)} {...props} data-slot='label' />
)

/**
 * FormDescription
 */
const FormDescription: React.FC<AriaTextProps> = ({ className, ...props }) => {
  return <AriaText className={cn("text-sm text-muted-foreground", className)} {...props} data-slot='form-description' />
}

/**
 * FieldError
 */
const FieldError: React.FC<AriaFieldErrorProps> = ({ className, ...props }) => {
  return (
    <AriaFieldError
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
      data-slot='field-error'
    />
  )
}

/**
 * FieldGroup
 */
export interface GroupProps extends AriaGroupProps, VariantProps<typeof fieldGroupVariants> {}

const FieldGroup: React.FC<GroupProps> = ({ className, variant, size, icon, ...props }) => {
  return (
    <AriaGroup
      data-slot='field-group'
      className={composeRenderProps(className, (className) =>
        cn(fieldGroupVariants({ variant, size, icon }), className)
      )}
      {...props}
    />
  )
}

export { FieldError, FieldGroup, FormDescription, Label }
