"use client"

import { cn } from "@compo/utils"
import React, { ComponentProps } from "react"
import { composeRenderProps, RangeCalendar as RangeCalendarRac } from "react-aria-components"
import { CalendarGridComponent } from "./calendar-grid"
import { CalendarHeader } from "./calendar-header"

/**
 * Base calendar props
 */
interface BaseCalendarProps {
  className?: string
}

/**
 * Range calendar component using react-aria
 */
type RangeCalendarProps = Omit<ComponentProps<typeof RangeCalendarRac>, "className"> & BaseCalendarProps
export const RangeCalendar: React.FC<RangeCalendarProps> = ({ className, ...props }) => {
  return (
    <RangeCalendarRac {...props} className={composeRenderProps(className, (className) => cn("w-fit", className))}>
      <CalendarHeader />
      <CalendarGridComponent isRange />
    </RangeCalendarRac>
  )
}
