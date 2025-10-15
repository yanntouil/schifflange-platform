"use client"

import { useToday } from "@compo/hooks"
import { Translation, useTranslation } from "@compo/localize"
import { cxm, G, T, VariantProps } from "@compo/utils"
import { add } from "date-fns"
import { CalendarDays, CalendarIcon, Trash2, X } from "lucide-react"
import * as React from "react"
import { useImperativeHandle, useRef } from "react"
import { inputIconVariants, inputVariants } from "../../variants"
import { Button } from "../button"
import { Popover } from "../popover"
import { Calendar, CalendarProps } from "./calendar"
import { Granularity, TimePicker } from "./time-picker"

/**
 * DateTimePicker
 */
export type DateTimePickerProps = {
  id?: string
  value?: Date | null
  onValueChange?: (date: Date | null) => void
  disabled?: boolean
  hourCycle?: 12 | 24
  placeholder?: string
  formatStr?: string
  displayFormat?: { hour24?: string; hour12?: string }
  granularity?: Granularity
  interval?: { start: Date; end: Date }
  size?: VariantProps<typeof inputVariants>["size"]
  className?: string
} & Pick<CalendarProps, "locale" | "weekStartsOn" | "showWeekNumber" | "showOutsideDays">
export type DateTimePickerRef = {
  value?: Date | null
} & Omit<HTMLButtonElement, "value">
export const DateTimePicker = React.forwardRef<Partial<DateTimePickerRef>, DateTimePickerProps>(
  (
    {
      id,
      value,
      onValueChange,
      hourCycle = 24,
      disabled = false,
      displayFormat,
      granularity = "minute",
      placeholder = "Select date and time",
      formatStr = "PPPp",
      size = "default",
      className,
      ...props
    },
    ref
  ) => {
    const { _, locale } = useTranslation(dictionary)
    const internalId = React.useId()
    const today = useToday()

    const [month, onMonthChange] = React.useState<Date>(value ?? today)
    const buttonRef = useRef<HTMLButtonElement>(null)

    const handleSelect = (newDay: Date | undefined) => {
      if (!newDay) return
      if (!value) {
        onValueChange?.(newDay)
        onMonthChange(newDay)
        return
      }
      const diff = newDay.getTime() - value.getTime()
      const diffInDays = diff / (1000 * 60 * 60 * 24)
      const newDateFull = add(value, { days: Math.ceil(diffInDays) })
      onValueChange?.(newDateFull)
      onMonthChange(newDateFull)
    }

    useImperativeHandle(
      ref,
      () => ({
        ...buttonRef.current,
        value,
      }),
      [value]
    )

    const [open, onOpenChange] = React.useState(false)

    return (
      <div>
        <Popover.Root open={open} onOpenChange={onOpenChange}>
          <Popover.Trigger
            disabled={disabled}
            id={id ?? internalId}
            className={cxm(
              inputVariants({
                icon: "both",
                size,
                className: "relative flex w-full items-center text-left",
              }),
              !value && "text-muted-foreground",
              className
            )}
            ref={buttonRef}
          >
            <span className={inputIconVariants({ size, side: "left" })} aria-hidden>
              <CalendarIcon className='text-muted-foreground/50' />
            </span>
            <span className='line-clamp-1'>{value ? T.format(value, formatStr, { locale }) : placeholder}</span>
          </Popover.Trigger>
          <Popover.Content className='p-0'>
            <Calendar
              mode='single'
              id={`${id ?? internalId}-calendar`}
              selected={value ?? undefined}
              month={month}
              onSelect={(newDay: Date | undefined) => handleSelect(newDay)}
              onMonthChange={onMonthChange}
              locale={locale}
              {...props}
            />
            <div className='flex items-center justify-around px-4 pb-2'>
              <Button
                id={`${id ?? internalId}-today`}
                variant='ghost'
                size='xxs'
                className='text-muted-foreground'
                onClick={() => onMonthChange(today)}
              >
                <CalendarDays aria-hidden />
                {_("today")}
              </Button>
              <Button
                id={`${id ?? internalId}-clear`}
                variant='ghost'
                size='xxs'
                className='text-muted-foreground'
                onClick={() => onValueChange?.(null)}
              >
                <Trash2 aria-hidden />
                {_("clear")}
              </Button>
            </div>
            <TimePicker
              id={`${id ?? internalId}-time`}
              onValueChange={onValueChange}
              value={value}
              hourCycle={hourCycle}
              granularity={granularity}
              className='border-t border-input px-4 py-2'
            />
          </Popover.Content>
        </Popover.Root>
        {G.isNotNullable(value) && (
          <button
            id={`${id ?? internalId}-clear`}
            type='button'
            className={cxm(
              inputIconVariants({
                size,
                side: "right",
              }),
              "inline-flex items-center justify-center text-muted [&>svg]:size-3"
            )}
            onClick={() => onValueChange?.(null)}
          >
            <X aria-label={_("clear")} />
          </button>
        )}
      </div>
    )
  }
)

/**
 * translations
 */
const dictionary = {
  fr: {
    label: "Date et heure",
    today: "Aujourd'hui",
    clear: "Effacer",
  },
  en: {
    label: "Date and time",
    today: "Today",
    clear: "Clear",
  },
  de: {
    label: "Datum und Uhrzeit",
    today: "Heute",
    clear: "Löschen",
  },
} satisfies Translation
