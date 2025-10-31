import { useTranslation } from "@compo/localize"
import { cxm, T } from "@compo/utils"
import { CalendarIcon, ChevronLeft, ChevronRight, XIcon } from "lucide-react"
import React from "react"
import { Button } from "../button"
import { Popover } from "../popover"
import { SrOnly } from "../sr-only"
import { formatDateKey, useCalendarDays, useHoliday, useIsWeekend } from "./hooks"
import { SelectMonth } from "./select-month"
import { SelectYear } from "./select-year"
import { TimePicker } from "./time-picker"

/**
 * Datepicker
 */
export type DatepickerProps = {
  // base UI
  className?: string
  // value
  value?: Date | null
  onValueChange?: (date: Date | null) => void

  // base UI
  placeholder?: string
  clearable?: boolean
  withTime?: boolean
  defaultTime?: string // "14:00"
  disabled?: boolean
  id?: string

  // selection limits
  minDate?: Date
  maxDate?: Date

  // highlighting
  highlightWeekends?: boolean
  highlightHolidays?: boolean

  // disable
  disableWeekends?: boolean
  disableHolidays?: boolean
  disabledDates?: Date[]
  holidays?: Date[] | ((date: Date) => boolean)

  // advanced customization
  isDateDisabled?: (date: Date) => boolean
}

export const Datepicker: React.FC<DatepickerProps> = (props) => {
  const {
    className,
    value,
    onValueChange,
    placeholder,
    clearable = false,
    withTime = false,
    defaultTime = "12:00",
    disabled = false,
    id,
    minDate,
    maxDate,
    highlightWeekends = false,
    highlightHolidays = false,
    disableWeekends = false,
    disableHolidays = false,
    disabledDates = [],
    holidays,
    isDateDisabled,
  } = props

  const internalId = React.useId()
  const { _, format } = useTranslation(dictionary)
  const [open, setOpen] = React.useState(false)

  const displayValue = React.useMemo(() => {
    if (!value) return placeholder || _("placeholder")
    if (withTime) {
      return _("date-with-time", { date: format(value, "d MMMM yyyy"), time: format(value, "HH:mm") })
    }
    return format(value, "d MMMM yyyy")
  }, [value, placeholder, _, withTime, format])

  const contentProps = {
    value,
    onValueChange,
    withTime,
    defaultTime,
    clearable,
    minDate,
    maxDate,
    highlightWeekends,
    highlightHolidays,
    disableWeekends,
    disableHolidays,
    disabledDates,
    holidays,
    isDateDisabled,
  }
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button
          id={id || internalId}
          variant='outline'
          disabled={disabled}
          className={cxm(
            "w-full justify-start bg-card text-left font-normal hover:bg-card/80",
            !value && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className='mr-2 size-4' />
          {displayValue}
        </Button>
      </Popover.Trigger>
      <Popover.Content
        className='flex min-w-[320px] max-h-[min(var(--radix-popper-available-height),100vh)] w-max flex-col items-stretch gap-4 p-4'
        align='start'
      >
        <DatePickerContent {...contentProps} />
      </Popover.Content>
    </Popover.Root>
  )
}

/**
 * DatePickerContent
 */
type DatePickerContentProps = Pick<
  DatepickerProps,
  | "value"
  | "onValueChange"
  | "withTime"
  | "defaultTime"
  | "clearable"
  | "minDate"
  | "maxDate"
  | "highlightWeekends"
  | "highlightHolidays"
  | "disableWeekends"
  | "disableHolidays"
  | "disabledDates"
  | "holidays"
  | "isDateDisabled"
>

const DatePickerContent: React.FC<DatePickerContentProps> = ({
  value,
  onValueChange,
  withTime,
  defaultTime = "12:00",
  clearable,
  minDate,
  maxDate,
  highlightWeekends,
  highlightHolidays,
  disableWeekends,
  disableHolidays,
  disabledDates,
  holidays,
  isDateDisabled,
}) => {
  const { _, format } = useTranslation(dictionary)

  // Parse default time
  const defaultTimeDate = React.useMemo(() => {
    const [hours, minutes] = defaultTime.split(":").map(Number)
    const date = new Date()
    date.setHours(hours, minutes, 0, 0)
    return date
  }, [defaultTime])

  // Time state
  const [time, setTime] = React.useState<Date>(() => (value ? value : defaultTimeDate))

  // Calendar hook
  const calendar = useCalendarDays(value || new Date(), onValueChange)

  // Update time when value changes externally
  React.useEffect(() => {
    if (value) setTime(value)
  }, [value])

  // Handle time change
  const handleTimeChange = (newTime: Date) => {
    setTime(newTime)
    if (value) {
      const updatedDate = new Date(value)
      updatedDate.setHours(newTime.getHours(), newTime.getMinutes(), newTime.getSeconds(), 0)
      onValueChange?.(updatedDate)
    }
  }

  // Handle date selection
  const handleSelectDate = (date: Date) => {
    if (withTime) {
      const newDate = new Date(date)
      newDate.setHours(time.getHours(), time.getMinutes(), time.getSeconds(), 0)
      onValueChange?.(newDate)
    } else {
      onValueChange?.(date)
    }
  }

  // Handle clear
  const handleClear = () => {
    onValueChange?.(null)
    setTime(defaultTimeDate)
  }

  // Handle today
  const handleToday = () => {
    const now = new Date()
    if (withTime) {
      now.setHours(time.getHours(), time.getMinutes(), time.getSeconds(), 0)
    }
    onValueChange?.(now)
    calendar.setOpenedDate(now)
  }

  return (
    <>
      {/* Navigation */}
      <Navigation calendar={calendar} format={format} />

      {/* Calendar */}
      <div className='flex flex-col items-stretch gap-2'>
        <WeekDaysHeader />
        <div className='grid grid-cols-7 gap-1'>
          {calendar.openDays.map((date) => (
            <Day
              key={formatDateKey(date)}
              date={date}
              value={value}
              calendar={calendar}
              onSelect={handleSelectDate}
              minDate={minDate}
              maxDate={maxDate}
              highlightWeekends={highlightWeekends}
              highlightHolidays={highlightHolidays}
              disableWeekends={disableWeekends}
              disableHolidays={disableHolidays}
              disabledDates={disabledDates}
              holidays={holidays}
              isDateDisabled={isDateDisabled}
              format={format}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className='space-y-2'>
        {/* Row 1: TimePicker centré */}
        {withTime && (
          <div className='mx-auto'>
            <TimePicker value={time} onValueChange={handleTimeChange} granularity='minute' />
          </div>
        )}
        {/* Row 2: Clear (gauche) et Today (droite) */}
        {(clearable || true) && (
          <div className='flex items-center justify-between gap-2'>
            <div className='flex items-center gap-1'>
              {clearable && (
                <Button variant='ghost' size='xs' onClick={handleClear}>
                  <XIcon className='mr-1 size-4' aria-hidden />
                  {_("clear")}
                </Button>
              )}
            </div>
            <div className='flex items-center gap-1'>
              <Button variant='ghost' size='xs' onClick={handleToday}>
                <CalendarIcon className='mr-1 size-4' aria-hidden />
                {_("today")}
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

/**
 * Navigation
 */
type NavigationProps = {
  calendar: ReturnType<typeof useCalendarDays>
  format: (date: Date, pattern: string) => string
}

const Navigation: React.FC<NavigationProps> = ({ calendar, format }) => {
  const { _ } = useTranslation(dictionary)

  return (
    <div className='flex items-center justify-between gap-2'>
      <Button variant='ghost' size='sm' onClick={calendar.openPrevMonth} aria-label={_("previous-month")}>
        <SrOnly>{_("previous-month")}</SrOnly>
        <ChevronLeft aria-hidden />
      </Button>

      <div className='flex items-center gap-2'>
        <SelectMonth value={calendar.openedDate.getMonth()} onValueChange={calendar.openMonth} />
        <SelectYear value={calendar.openedDate.getFullYear()} onValueChange={calendar.openYear} />
      </div>

      <Button variant='ghost' size='sm' onClick={calendar.openNextMonth} aria-label={_("next-month")}>
        <SrOnly>{_("next-month")}</SrOnly>
        <ChevronRight aria-hidden />
      </Button>
    </div>
  )
}

/**
 * WeekDaysHeader
 */
type WeekDaysHeaderProps = React.ComponentProps<"div">

const WeekDaysHeader: React.FC<WeekDaysHeaderProps> = ({ className, ...props }) => {
  const { format } = useTranslation(dictionary)
  const weekDays = React.useMemo(() => {
    // Get a week starting from Monday
    const baseDate = new Date(2024, 0, 1) // Monday, January 1, 2024
    const startOfWeek = T.startOfWeek(baseDate, { weekStartsOn: 1 })
    const endOfWeek = T.endOfWeek(baseDate, { weekStartsOn: 1 })
    return T.eachDayOfInterval({ start: startOfWeek, end: endOfWeek })
  }, [])

  return (
    <div
      className={cxm("grid grid-cols-7 text-center text-xs font-medium text-muted-foreground", className)}
      {...props}
    >
      {weekDays.map((day) => (
        <div key={day.getDay()}>{format(day, "EEEEEE")}</div>
      ))}
    </div>
  )
}

/**
 * Day component
 */
type DayProps = {
  date: Date
  value: Date | null | undefined
  calendar: ReturnType<typeof useCalendarDays>
  onSelect: (date: Date) => void
  minDate?: Date
  maxDate?: Date
  highlightWeekends?: boolean
  highlightHolidays?: boolean
  disableWeekends?: boolean
  disableHolidays?: boolean
  disabledDates?: Date[]
  holidays?: Date[] | ((date: Date) => boolean)
  isDateDisabled?: (date: Date) => boolean
  format: (date: Date, pattern: string) => string
}

const Day: React.FC<DayProps> = ({
  date,
  value,
  calendar,
  onSelect,
  minDate,
  maxDate,
  highlightWeekends,
  highlightHolidays,
  disableWeekends,
  disableHolidays,
  disabledDates,
  holidays,
  isDateDisabled,
  format,
}) => {
  const { _ } = useTranslation(dictionary)
  const isWeekend = useIsWeekend(date)
  const holiday = useHoliday(date)

  // Check if date is a holiday (custom or Luxembourg)
  const isHoliday = React.useMemo(() => {
    if (holidays) {
      if (typeof holidays === "function") return holidays(date)
      return holidays.some((h) => T.isSameDay(h, date))
    }
    return !!holiday
  }, [date, holidays, holiday])

  // Check if date is in disabledDates array
  const isInDisabledDates = React.useMemo(
    () => disabledDates?.some((d) => T.isSameDay(d, date)) || false,
    [date, disabledDates]
  )

  // Calculate disabled state
  const isDisabled = React.useMemo(() => {
    if (isDateDisabled?.(date)) return true
    if (isInDisabledDates) return true
    if (minDate && T.isBefore(date, T.startOfDay(minDate))) return true
    if (maxDate && T.isAfter(date, T.endOfDay(maxDate))) return true
    if (disableWeekends && isWeekend) return true
    if (disableHolidays && isHoliday) return true
    return false
  }, [
    date,
    isDateDisabled,
    isInDisabledDates,
    minDate,
    maxDate,
    disableWeekends,
    disableHolidays,
    isWeekend,
    isHoliday,
  ])

  const isSelected = value ? T.isSameDay(date, value) : false
  const isToday = T.isSameDay(date, calendar.today)
  const isCurrentMonth = T.isSameMonth(date, calendar.openedDate)

  // Accessibility label
  const ariaLabel = React.useMemo(() => {
    const parts = [format(date, "EEEE d MMMM yyyy")]
    if (isToday) parts.push(_("aria-today"))
    if (isSelected) parts.push(_("aria-selected"))
    if (isHoliday) parts.push(_("aria-holiday"))
    if (!isCurrentMonth) parts.push(_("aria-outside-month"))
    if (isDisabled) parts.push(_("aria-disabled"))
    return parts.join(", ")
  }, [date, isToday, isSelected, isHoliday, isCurrentMonth, isDisabled, format, _])

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (isDisabled) return

    let nextDate: Date | null = null

    switch (e.key) {
      case "ArrowLeft":
        nextDate = T.addDays(date, -1)
        break
      case "ArrowRight":
        nextDate = T.addDays(date, 1)
        break
      case "ArrowUp":
        nextDate = T.addDays(date, -7)
        break
      case "ArrowDown":
        nextDate = T.addDays(date, 7)
        break
      case "Home":
        nextDate = T.startOfWeek(date, { weekStartsOn: 1 })
        break
      case "End":
        nextDate = T.endOfWeek(date, { weekStartsOn: 1 })
        break
      case "PageUp":
        nextDate = e.shiftKey ? T.addYears(date, -1) : T.addMonths(date, -1)
        break
      case "PageDown":
        nextDate = e.shiftKey ? T.addYears(date, 1) : T.addMonths(date, 1)
        break
      case "Enter":
      case " ":
        e.preventDefault()
        onSelect(date)
        return
      default:
        return
    }

    if (nextDate) {
      e.preventDefault()
      // Update the opened month if we moved outside current month
      if (!T.isSameMonth(nextDate, calendar.openedDate)) {
        calendar.setOpenedDate(nextDate)
      }
      // Focus the next date button
      const nextDateKey = formatDateKey(nextDate)
      const nextButton = document.querySelector(`[data-date="${nextDateKey}"]`) as HTMLButtonElement
      nextButton?.focus()
    }
  }

  return (
    <Button
      variant='ghost'
      size='sm'
      disabled={isDisabled}
      onClick={() => !isDisabled && onSelect(date)}
      onKeyDown={handleKeyDown}
      aria-label={ariaLabel}
      aria-pressed={isSelected}
      aria-disabled={isDisabled}
      role='button'
      tabIndex={isDisabled ? -1 : 0}
      data-date={formatDateKey(date)}
      className={cxm(
        "relative h-9 w-9 p-0 font-normal transition-colors",
        !isCurrentMonth && "text-muted-foreground opacity-50",
        // Highlighting
        highlightWeekends && isWeekend && !isSelected && "bg-blue-50 dark:bg-blue-950",
        highlightHolidays && isHoliday && !isSelected && "bg-amber-50 dark:bg-amber-950",
        // Selection
        !isDisabled &&
          isSelected &&
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
        // Today border
        isToday && !isSelected && "border border-primary"
      )}
    >
      {T.format(date, "d")}
    </Button>
  )
}

/**
 * Translations
 */
const dictionary = {
  fr: {
    placeholder: "Sélectionner une date",
    "date-with-time": "{{date}} à {{time}}",
    clear: "Effacer",
    today: "Aujourd'hui",
    "previous-month": "Mois précédent",
    "next-month": "Mois suivant",
    "aria-today": "aujourd'hui",
    "aria-selected": "sélectionné",
    "aria-holiday": "jour férié",
    "aria-outside-month": "hors du mois actuel",
    "aria-disabled": "non disponible",
  },
  en: {
    placeholder: "Select a date",
    "date-with-time": "{{date}} at {{time}}",
    clear: "Clear",
    today: "Today",
    "previous-month": "Previous month",
    "next-month": "Next month",
    "aria-today": "today",
    "aria-selected": "selected",
    "aria-holiday": "holiday",
    "aria-outside-month": "outside current month",
    "aria-disabled": "unavailable",
  },
  de: {
    placeholder: "Datum auswählen",
    "date-with-time": "{{date}} um {{time}}",
    clear: "Löschen",
    today: "Heute",
    "previous-month": "Vorheriger Monat",
    "next-month": "Nächster Monat",
    "aria-today": "heute",
    "aria-selected": "ausgewählt",
    "aria-holiday": "feiertag",
    "aria-outside-month": "außerhalb des aktuellen Monats",
    "aria-disabled": "nicht verfügbar",
  },
}
