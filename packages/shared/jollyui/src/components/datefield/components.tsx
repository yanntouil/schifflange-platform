"use client"

import { cn } from "@compo/utils"
import { VariantProps } from "class-variance-authority"
import * as React from "react"
import {
  DateField as AriaDateField,
  DateFieldProps as AriaDateFieldProps,
  DateInput as AriaDateInput,
  DateInputProps as AriaDateInputProps,
  DateSegment as AriaDateSegment,
  DateSegmentProps as AriaDateSegmentProps,
  DateValue as AriaDateValue,
  TimeField as AriaTimeField,
  TimeFieldProps as AriaTimeFieldProps,
  TimeValue as AriaTimeValue,
  ValidationResult as AriaValidationResult,
  composeRenderProps,
  Text,
} from "react-aria-components"

import { FieldError, fieldGroupVariants, Label } from "../field"

/**
 * DateField
 */
const DateField = AriaDateField

/**
 * TimeField
 */
const TimeField = AriaTimeField

/**
 * DateSegment
 */
const DateSegment: React.FC<AriaDateSegmentProps> = ({ className, ...props }) => {
  return (
    <AriaDateSegment
      className={composeRenderProps(className, (className) =>
        cn(
          "type-literal:px-0 inline rounded p-0.5 caret-transparent outline outline-none",
          /* Placeholder */
          "data-[placeholder]:text-muted-foreground",
          /* Disabled */
          "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
          /* Focused */
          "data-[focused]:bg-accent data-[focused]:text-accent-foreground",
          /* Invalid */
          "data-[invalid]:data-[focused]:bg-destructive data-[invalid]:data-[focused]:data-[placeholder]:text-destructive-foreground data-[invalid]:data-[focused]:text-destructive-foreground data-[invalid]:data-[placeholder]:text-destructive data-[invalid]:text-destructive",
          className
        )
      )}
      {...props}
    />
  )
}

/**
 * DateInput
 */
export interface DateInputProps extends AriaDateInputProps, VariantProps<typeof fieldGroupVariants> {}

const DateInput: React.FC<Omit<DateInputProps, "children">> = ({ className, variant, ...props }) => {
  return (
    <AriaDateInput
      className={composeRenderProps(className, (className) => cn("", className))}
      {...props}
      data-slot='date-input'
    >
      {(segment) => <DateSegment segment={segment} />}
    </AriaDateInput>
  )
}

/**
 * JollyDateField
 */
export interface JollyDateFieldProps<T extends AriaDateValue> extends AriaDateFieldProps<T> {
  label?: string
  description?: string
  errorMessage?: string | ((validation: AriaValidationResult) => string)
}

const JollyDateField = <T extends AriaDateValue>({
  label,
  description,
  className,
  errorMessage,
  ...props
}: JollyDateFieldProps<T>): React.ReactElement => {
  return (
    <DateField
      data-slot='date-field'
      className={composeRenderProps(className, (className) => cn("group flex flex-col gap-2", className))}
      {...props}
    >
      <Label>{label}</Label>
      <DateInput />
      {description && (
        <Text className='text-sm text-muted-foreground' slot='description'>
          {description}
        </Text>
      )}
      <FieldError>{errorMessage}</FieldError>
    </DateField>
  )
}

/**
 * JollyTimeField
 */
export interface JollyTimeFieldProps<T extends AriaTimeValue> extends AriaTimeFieldProps<T> {
  label?: string
  description?: string
  errorMessage?: string | ((validation: AriaValidationResult) => string)
}

const JollyTimeField = <T extends AriaTimeValue>({
  label,
  description,
  errorMessage,
  className,
  ...props
}: JollyTimeFieldProps<T>): React.ReactElement => {
  return (
    <TimeField
      data-slot='time-field'
      className={composeRenderProps(className, (className) => cn("group flex flex-col gap-2", className))}
      {...props}
    >
      <Label>{label}</Label>
      <DateInput />
      {description && <Text slot='description'>{description}</Text>}
      <FieldError>{errorMessage}</FieldError>
    </TimeField>
  )
}

export { DateField, DateInput, DateSegment, JollyDateField, JollyTimeField, TimeField }
