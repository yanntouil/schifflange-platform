"use client"

import { useToday } from "@compo/hooks"
import { Translation, useTranslation } from "@compo/localize"
import { cxm, G, T, VariantProps } from "@compo/utils"
import { Calendar, CalendarDays, ChevronLeft, ChevronRight, Trash2, X } from "lucide-react"
import * as React from "react"
import { useImperativeHandle, useRef } from "react"
import { inputIconVariants, inputVariants } from "../../variants"
import { Button } from "../button"
import { Popover } from "../popover"
import { SrOnly } from "../sr-only"
import { SelectMonth } from "./select-month"
import { SelectYear } from "./select-year"

/**
 * DateMonthPicker
 */
export type DateMonthPickerProps = {
  id?: string
  value?: Date | null
  onValueChange?: (date: Date | null) => void
  disabled?: boolean
  placeholder?: string
  formatStr?: string
  interval?: { start: Date; end: Date }
  size?: VariantProps<typeof inputVariants>["size"]
  className?: string
} & Omit<React.ComponentPropsWithoutRef<"button">, "value">

export type DateMonthPickerRef = {
  value?: Date | null
} & Omit<HTMLButtonElement, "value">
export const DateMonthPicker = React.forwardRef<Partial<DateMonthPickerRef>, DateMonthPickerProps>((props, ref) => {
  const { _, locale } = useTranslation(dictionary)
  const {
    id,
    value,
    onValueChange,
    disabled = false,
    placeholder = _("placeholder"),
    className,
    interval,
    formatStr = "MMMM yyyy",
    size = "default",
    ...buttonProps
  } = props
  const internalId = React.useId()
  const today = useToday()

  const buttonRef = useRef<HTMLButtonElement>(null)
  useImperativeHandle(ref, () => ({ ...buttonRef.current, value }), [value])

  const [open, onOpenChange] = React.useState(() => false)

  return (
    <div className='relative'>
      <Popover.Root open={open} onOpenChange={onOpenChange}>
        <Popover.Trigger asChild disabled={disabled}>
          <button
            type='button'
            id={id ?? internalId}
            className={cxm(
              inputVariants({
                icon: "both",
                size,
                className: "flex w-full items-center text-left",
              }),
              !value && "text-input-muted",
              className
            )}
            ref={buttonRef}
            {...buttonProps}
          >
            <span
              className={inputIconVariants({
                size,
                side: "left",
                className: "text-input-foreground inline-flex items-center justify-center",
              })}
              aria-hidden
            >
              <Calendar />
            </span>
            <span className='line-clamp-1'>{value ? T.format(value, formatStr, { locale }) : placeholder}</span>
          </button>
        </Popover.Trigger>
        <Popover.Content className='p-0'>
          <div className='inline-flex items-center justify-center gap-4 p-3 pb-2'>
            <Button
              variant='ghost'
              size='sm'
              aria-label={_("previous")}
              onClick={() => onValueChange?.(T.addMonths(value ?? today, -1))}
              className='text-muted-foreground'
            >
              <ChevronLeft aria-hidden />
              <SrOnly>{_("previous")}</SrOnly>
            </Button>
            <div className='flex'>
              <SelectMonth value={value ?? today} onValueChange={onValueChange} className='h-9' interval={interval} />
              <SelectYear value={value ?? today} onValueChange={onValueChange} className='h-9' interval={interval} />
            </div>
            <Button
              variant='ghost'
              size='sm'
              aria-label={_("next")}
              onClick={() => onValueChange?.(T.addMonths(value ?? today, 1))}
              className='text-muted-foreground'
            >
              <ChevronRight aria-hidden />
              <SrOnly>{_("next")}</SrOnly>
            </Button>
          </div>
          <div className='flex items-center justify-around px-4 pb-2'>
            <Button
              id={`${id ?? internalId}-today`}
              variant='ghost'
              size='xxs'
              onClick={() => onValueChange?.(today)}
              className='text-muted-foreground'
            >
              <CalendarDays aria-hidden />
              {_("today")}
            </Button>
            <Button
              id={`${id ?? internalId}-clear`}
              variant='ghost'
              size='xxs'
              onClick={() => onValueChange?.(null)}
              className='text-muted-foreground'
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
    placeholder: "Sélectionner un mois",
    next: "Aller au mois suivant",
    previous: "Aller au mois précédent",
    today: "Ce mois ci",
    clear: "Effacer",
  },
  en: {
    placeholder: "Select month",
    next: "Go to the next month",
    previous: "Go to the previous month",
    today: "This month",
    clear: "Clear",
  },
  de: {
    placeholder: "Monat auswählen",
    next: "Zum nächsten Monat",
    previous: "Zum vorherigen Monat",
    today: "Dieser Monat",
    clear: "Löschen",
  },
} satisfies Translation
