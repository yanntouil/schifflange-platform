"use client"

import { cn, cxm, VariantProps } from "@compo/utils"
import { CalendarIcon } from "lucide-react"
import React from "react"
import {
  Button,
  DatePicker as DatePickerRac,
  DateRangePicker as DateRangePickerRac,
  Dialog,
  Group,
  Popover,
} from "react-aria-components"
import { inputVariants } from "../../../variants"
import { Calendar } from "./calendar"
import { DateInput } from "./fields"
import { RangeCalendar } from "./range-calendar"
import { dateInputStyle } from "./variants"
export type { DateRange } from "react-aria-components"

/**
 * Date range picker component using react-aria
 */
type DateRangePickerProps = Omit<React.ComponentProps<typeof DateRangePickerRac>, "size"> & {
  size?: VariantProps<typeof inputVariants>["size"]
}
export const DateRangePicker: React.FC<DateRangePickerProps> = ({ size = "default", ...props }) => {
  return (
    <DateRangePickerRac className='*:not-first:mt-2' {...props}>
      <div className='flex'>
        <Group className={cn(dateInputStyle, inputVariants({ size }), "pe-9")}>
          <DateInput slot='start' unstyled />
          <span aria-hidden='true' className='text-muted-foreground/70 px-2'>
            -
          </span>
          <DateInput slot='end' unstyled />
        </Group>
        <Button
          className={cxm(
            "z-10 -ms-9 -me-px flex w-9 items-center justify-center rounded-e-md",
            "transition-[color,box-shadow]",
            "text-muted-foreground/80 hover:text-foreground",
            "data-focus-visible:outline-none data-focus-visible:ring-2 data-focus-visible:ring-ring data-focus-visible:ring-offset-2 data-focus-visible:ring-offset-background"
            // 'data-focus-visible:border-ring data-focus-visible:ring-ring/50 outline-none data-focus-visible:ring-[3px]',
          )}
        >
          <CalendarIcon size={16} />
        </Button>
      </div>
      <Popover
        className='bg-popover text-popover-foreground data-entering:animate-in data-exiting:animate-out data-[entering]:fade-in-0 data-[exiting]:fade-out-0 data-[entering]:zoom-in-95 data-[exiting]:zoom-out-95 data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2 rounded-md border shadow-lg outline-hidden'
        offset={4}
      >
        <Dialog className='max-h-[inherit] overflow-auto p-2'>
          <RangeCalendar />
        </Dialog>
      </Popover>
    </DateRangePickerRac>
  )
}

/**
 * Date picker component using react-aria
 */
type DatePickerProps = Omit<React.ComponentProps<typeof DatePickerRac>, "size"> & {
  size?: VariantProps<typeof inputVariants>["size"]
}
export const DatePicker: React.FC<DatePickerProps> = ({ size = "default", ...props }) => {
  return (
    <DatePickerRac className='*:not-first:mt-2 yolo' {...props}>
      <div className='flex'>
        <Group className={cn(dateInputStyle, inputVariants({ size }), "pe-9")}>
          <DateInput unstyled />
        </Group>
        <Button
          className={cxm(
            "z-10 -ms-9 -me-px flex w-9 items-center justify-center rounded-e-md",
            "transition-[color,box-shadow]",
            "text-muted-foreground/80 hover:text-foreground",
            "data-focus-visible:outline-none data-focus-visible:ring-2 data-focus-visible:ring-ring data-focus-visible:ring-offset-2 data-focus-visible:ring-offset-background"
          )}
        >
          <CalendarIcon size={16} />
        </Button>
      </div>
      <Popover
        className='isolate bg-popover text-popover-foreground data-entering:animate-in data-exiting:animate-out data-[entering]:fade-in-0 data-[exiting]:fade-out-0 data-[entering]:zoom-in-95 data-[exiting]:zoom-out-95 data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2 rounded-md border shadow-lg outline-hidden'
        offset={4}
      >
        <Dialog className='max-h-[inherit] overflow-auto p-2'>
          <Calendar />
        </Dialog>
      </Popover>
    </DatePickerRac>
  )
}
