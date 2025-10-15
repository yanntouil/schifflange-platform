"use client"

import { cn } from "@compo/utils"
import { CalendarDate } from "@internationalized/date"
import type { VariantProps } from "class-variance-authority"
import { CalendarIcon } from "lucide-react"
import * as React from "react"
import {
  DatePicker as AriaDatePicker,
  DatePickerProps as AriaDatePickerProps,
  DateRangePicker as AriaDateRangePicker,
  DateRangePickerProps as AriaDateRangePickerProps,
  Dialog as AriaDialog,
  DialogProps as AriaDialogProps,
  PopoverProps as AriaPopoverProps,
  ValidationResult as AriaValidationResult,
  composeRenderProps,
  Text,
} from "react-aria-components"
import { Button } from "../button/components"
import {
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  CalendarHeading,
  RangeCalendar,
} from "../calendar/components"
import { DateInput } from "../datefield/components"
import { FieldError, FieldGroup, Label } from "../field"
import { fieldGroupVariants } from "../field/variants"
import { Popover } from "../popover"

/**
 * DatePicker
 */
const DatePicker = AriaDatePicker

/**
 * DateRangePicker
 */
const DateRangePicker = AriaDateRangePicker

/**
 * DatePickerContent
 */
export interface DatePickerContentProps extends AriaDialogProps {
  popoverClassName?: AriaPopoverProps["className"]
}

const DatePickerContent: React.FC<DatePickerContentProps> = ({ className, popoverClassName, ...props }) => (
  <Popover className={composeRenderProps(popoverClassName, (className) => cn("w-auto p-3", className))}>
    <AriaDialog
      className={cn("flex w-full flex-col space-y-4 outline-none sm:flex-row sm:space-x-4 sm:space-y-0", className)}
      {...props}
    />
  </Popover>
)

/**
 * JollyDatePicker
 */
export interface JollyDatePickerProps
  extends Omit<AriaDatePickerProps<CalendarDate>, "value" | "onChange">,
    Pick<VariantProps<typeof fieldGroupVariants>, "size"> {
  label?: string
  description?: string
  errorMessage?: string | ((validation: AriaValidationResult) => string)
  value?: Date
  onValueChange?: (date: Date | undefined) => void
}

const JollyDatePicker: React.FC<JollyDatePickerProps> = ({
  label,
  description,
  errorMessage,
  className,
  value,
  onValueChange,
  size = "default",
  id,
  ...props
}) => {
  const internalId = React.useId()
  // Convert Date to CalendarDate for Aria
  const ariaValue = React.useMemo(() => {
    if (!value) return undefined
    const year = value.getFullYear()
    const month = value.getMonth() + 1 // JS months are 0-indexed
    const day = value.getDate()
    return new CalendarDate(year, month, day)
  }, [value])

  // Handle onChange to convert CalendarDate back to Date
  const handleChange = React.useCallback(
    (date: CalendarDate | null) => {
      if (!onValueChange) return
      if (!date) {
        onValueChange(undefined)
        return
      }
      // Convert CalendarDate to JS Date
      const jsDate = new Date(date.year, date.month - 1, date.day)
      onValueChange(jsDate)
    },
    [onValueChange]
  )

  return (
    <DatePicker
      id={id ?? internalId}
      className={composeRenderProps(className, (className) => cn("group flex flex-col gap-2", className))}
      value={ariaValue}
      onChange={handleChange}
      {...props}
    >
      {label && <Label>{label}</Label>}
      <FieldGroup size={size} className='pr-0'>
        <DateInput className='flex-1' variant='ghost' />
        <Button
          variant='ghost'
          size={size}
          icon
          className={cn("data-[focus-visible]:ring-offset-0 data-[focus-visible]:ring-0 data-[focus-visible]:bg-muted")}
        >
          <CalendarIcon aria-hidden className='size-3.5' />
        </Button>
      </FieldGroup>
      {description && (
        <Text className='text-sm text-muted-foreground' slot='description'>
          {description}
        </Text>
      )}
      <FieldError>{errorMessage}</FieldError>
      <DatePickerContent>
        <Calendar>
          <CalendarHeading />
          <CalendarGrid>
            <CalendarGridHeader>{(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}</CalendarGridHeader>
            <CalendarGridBody>{(date) => <CalendarCell date={date} />}</CalendarGridBody>
          </CalendarGrid>
        </Calendar>
      </DatePickerContent>
    </DatePicker>
  )
}

/**
 * JollyDateRangePicker
 */
export interface JollyDateRangePickerProps
  extends Omit<AriaDateRangePickerProps<CalendarDate>, "value" | "onChange">,
    Pick<VariantProps<typeof fieldGroupVariants>, "size"> {
  label?: string
  description?: string
  errorMessage?: string | ((validation: AriaValidationResult) => string)
  value?: { start: Date | undefined; end: Date | undefined }
  onValueChange?: (range: { start: Date | undefined; end: Date | undefined } | undefined) => void
}

const JollyDateRangePicker: React.FC<JollyDateRangePickerProps> = ({
  label,
  description,
  errorMessage,
  className,
  value,
  onValueChange,
  size = "default",
  id,
  ...props
}) => {
  const internalId = React.useId()
  // Convert Date range to CalendarDate range for Aria
  const ariaValue = React.useMemo(() => {
    if (!value || (!value.start && !value.end)) return null

    // Only return a value if we have at least a start date
    if (!value.start) return null

    const start = new CalendarDate(value.start.getFullYear(), value.start.getMonth() + 1, value.start.getDate())

    const end = value.end
      ? new CalendarDate(value.end.getFullYear(), value.end.getMonth() + 1, value.end.getDate())
      : start // If no end date, use start date as per React Aria's expectation

    return { start, end }
  }, [value])

  // Handle onChange to convert CalendarDate range back to Date range
  const handleChange = React.useCallback(
    (range: any) => {
      if (!onValueChange) return
      if (!range) {
        onValueChange(undefined)
        return
      }
      const start = range.start ? new Date(range.start.year, range.start.month - 1, range.start.day) : undefined
      const end = range.end ? new Date(range.end.year, range.end.month - 1, range.end.day) : undefined
      onValueChange({ start, end })
    },
    [onValueChange]
  )

  return (
    <DateRangePicker
      id={id ?? internalId}
      className={composeRenderProps(className, (className) => cn("group flex flex-col gap-2", className))}
      value={ariaValue}
      onChange={handleChange}
      {...props}
    >
      {label && <Label>{label}</Label>}
      <FieldGroup size={size} className='pr-0'>
        <DateInput variant='ghost' slot={"start"} />
        <span aria-hidden className='px-2 text-sm text-muted-foreground'>
          -
        </span>
        <DateInput className='flex-1' variant='ghost' slot={"end"} />

        <Button
          variant='ghost'
          size={size}
          icon
          className={cn("data-[focus-visible]:ring-offset-0 data-[focus-visible]:ring-0 data-[focus-visible]:bg-muted")}
        >
          <CalendarIcon aria-hidden className='size-3.5' />
        </Button>
      </FieldGroup>
      {description && (
        <Text className='text-sm text-muted-foreground' slot='description'>
          {description}
        </Text>
      )}
      <FieldError>{errorMessage}</FieldError>
      <DatePickerContent>
        <RangeCalendar>
          <CalendarHeading />
          <CalendarGrid>
            <CalendarGridHeader>{(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}</CalendarGridHeader>
            <CalendarGridBody>{(date) => <CalendarCell date={date} />}</CalendarGridBody>
          </CalendarGrid>
        </RangeCalendar>
      </DatePickerContent>
    </DateRangePicker>
  )
}

export { DatePicker, DatePickerContent, DateRangePicker, JollyDatePicker, JollyDateRangePicker }
