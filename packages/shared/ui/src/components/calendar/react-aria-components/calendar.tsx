"use client"

import { cn } from "@compo/utils"
import React, { ComponentProps } from "react"
import { Calendar as CalendarRac, composeRenderProps } from "react-aria-components"
import { CalendarGridComponent } from "./calendar-grid"
import { CalendarHeader } from "./calendar-header"

/**
 * Base calendar props
 */
interface BaseCalendarProps {
  className?: string
}

/**
 * Calendar component using react-aria
 */
type CalendarProps = Omit<ComponentProps<typeof CalendarRac>, "className"> & BaseCalendarProps
export const Calendar: React.FC<CalendarProps> = ({ className, ...props }) => {
  return (
    <CalendarRac {...props} className={composeRenderProps(className, (className) => cn("w-fit", className))}>
      <CalendarHeader />
      <CalendarGridComponent />
    </CalendarRac>
  )
}
