"use client"

import { cn } from "@compo/utils"
import React from "react"
import {
  composeRenderProps,
  DateFieldProps,
  DateField as DateFieldRac,
  DateInputProps as DateInputPropsRac,
  DateInput as DateInputRac,
  DateSegmentProps,
  DateSegment as DateSegmentRac,
  DateValue as DateValueRac,
  TimeFieldProps,
  TimeField as TimeFieldRac,
  TimeValue as TimeValueRac,
} from "react-aria-components"
import { dateInputStyle } from "./variants"

/**
 * Date field component using react-aria
 */
export const DateField: React.FC<DateFieldProps<DateValueRac>> = ({ className, children, ...props }) => {
  return (
    <DateFieldRac className={composeRenderProps(className, (className) => cn(className))} {...props}>
      {children}
    </DateFieldRac>
  )
}

/**
 * Time field component using react-aria
 */
export const TimeField: React.FC<TimeFieldProps<TimeValueRac>> = ({ className, children, ...props }) => {
  return (
    <TimeFieldRac className={composeRenderProps(className, (className) => cn(className))} {...props}>
      {children}
    </TimeFieldRac>
  )
}

/**
 * Date segment component using react-aria
 */
export const DateSegment: React.FC<DateSegmentProps> = ({ className, ...props }) => {
  return (
    <DateSegmentRac
      className={composeRenderProps(className, (className) =>
        cn(
          "text-foreground data-focused:bg-accent data-invalid:data-focused:bg-destructive data-focused:data-placeholder:text-foreground data-focused:text-foreground data-invalid:data-placeholder:text-destructive data-invalid:text-destructive data-placeholder:text-muted-foreground/70 data-[type=literal]:text-muted-foreground/70 inline rounded p-0.5 caret-transparent outline-hidden data-disabled:cursor-not-allowed data-disabled:opacity-50 data-invalid:data-focused:text-white data-invalid:data-focused:data-placeholder:text-white data-[type=literal]:px-0",
          className
        )
      )}
      {...props}
      data-invalid
    />
  )
}

interface DateInputProps extends Omit<DateInputPropsRac, "className"> {
  className?: string
  unstyled?: boolean
}
export const DateInput: React.FC<Omit<DateInputProps, "children">> = ({ className, unstyled = false, ...props }) => {
  return (
    <DateInputRac
      className={composeRenderProps(className, (className) => cn(!unstyled && dateInputStyle, className))}
      {...props}
    >
      {(segment) => <DateSegment segment={segment} />}
    </DateInputRac>
  )
}

export type { DateInputProps }
