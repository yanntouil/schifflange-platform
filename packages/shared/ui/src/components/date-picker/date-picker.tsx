"use client"

import { useToday } from "@compo/hooks"
import { Translation, useTranslation } from "@compo/localize"
import { cxm, G, T, VariantProps } from "@compo/utils"
import { CalendarDays, CalendarIcon, Trash2, X } from "lucide-react"
import * as React from "react"
import { useImperativeHandle, useRef } from "react"
import { inputIconVariants, inputVariants } from "../../variants"
import { Button } from "../button"
import { Popover } from "../popover"
import { Calendar, CalendarProps } from "./calendar"

/**
 * DatePicker
 */
export type DatePickerProps = {
  id?: string
  value?: Date | null
  onValueChange?: (date: Date | null) => void
  disabled?: boolean
  placeholder?: string
  formatStr?: string
  interval?: { start: Date; end: Date }
  size?: VariantProps<typeof inputVariants>["size"]
  className?: string
} & Pick<CalendarProps, "locale" | "weekStartsOn" | "showWeekNumber" | "showOutsideDays">
export type DatePickerRef = {
  value?: Date | null
} & Omit<HTMLButtonElement, "value">
export const DatePicker = React.forwardRef<Partial<DatePickerRef>, DatePickerProps>((props, ref) => {
  const { _, locale, format } = useTranslation(dictionary)

  const {
    id,
    value,
    onValueChange,
    disabled = false,
    placeholder = _("placeholder"),
    formatStr = "PPP",
    size = "default",
    className,
  } = props

  const internalId = React.useId()
  const today = useToday()
  const [month, onMonthChange] = React.useState<Date>(value ?? today)
  const buttonRef = useRef<HTMLButtonElement>(null)
  /**
   * carry over the current time when a user clicks a new day
   * instead of resetting to 00:00
   */
  const handleSelect = (newDay: Date | undefined) => {
    if (!newDay) return
    if (!value) {
      onValueChange?.(newDay)
      onMonthChange(newDay)
      return
    }
    const diff = newDay.getTime() - value.getTime()
    const diffInDays = diff / (1000 * 60 * 60 * 24)
    const newDateFull = T.add(value, { days: Math.ceil(diffInDays) })
    onValueChange?.(newDateFull)
    onMonthChange(newDateFull)
    onOpenChange(false)
  }

  useImperativeHandle(ref, () => ({ ...buttonRef.current, value }), [value])

  const [open, onOpenChange] = React.useState(() => false)

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
          <span className='line-clamp-1'>{value ? format(value, formatStr) : placeholder}</span>
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
})

/**
 * translation
 */
const dictionary = {
  fr: {
    placeholder: "Sélectionner une date",
    today: "Aujourd'hui",
    clear: "Effacer",
  },
  en: {
    placeholder: "Select date",
    today: "Today",
    clear: "Clear",
  },
  de: {
    placeholder: "Datum auswählen",
    today: "Heute",
    clear: "Löschen",
  },
} satisfies Translation
