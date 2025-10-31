import { A, F, cxm } from "@compo/utils"
import { Clock } from "lucide-react"
import React from "react"
import { inputVariants } from "../../variants/input"
import { Select } from "../select"

/**
 * TimePicker
 */
type TimePickerProps = React.ComponentProps<"div"> & {
  value?: Date | null
  onValueChange?: (date: Date) => void
  hourCycle?: 12 | 24
  granularity?: Granularity
}

type TimePickerRef = {
  minuteRef: HTMLInputElement | null
  hourRef: HTMLInputElement | null
  secondRef: HTMLInputElement | null
}
export const TimePicker = React.forwardRef<TimePickerRef, TimePickerProps>(
  ({ id, value, onValueChange, hourCycle = 24, granularity = "second", className, ...props }, ref) => {
    const minuteRef = React.useRef<HTMLInputElement>(null)
    const hourRef = React.useRef<HTMLInputElement>(null)
    const secondRef = React.useRef<HTMLInputElement>(null)
    const periodRef = React.useRef<HTMLButtonElement>(null)
    const [period, setPeriod] = React.useState<Period>(value && value.getHours() >= 12 ? "PM" : "AM")

    React.useImperativeHandle(
      ref,
      () => ({
        minuteRef: minuteRef.current,
        hourRef: hourRef.current,
        secondRef: secondRef.current,
        periodRef: periodRef.current,
      }),
      [minuteRef, hourRef, secondRef]
    )

    const internalId = React.useId()
    const granularityList: Granularity[] = ["day", "hour", "minute", "second"]
    const granularityIndex = granularityList.indexOf(granularity)

    return granularityIndex >= 1 ? (
      <div className={cxm("flex items-center justify-center gap-2", className)} {...props}>
        <label htmlFor={`${id || internalId}-hour`}>
          <Clock className='mr-2 size-4' />
        </label>
        <TimePickerInput
          picker={hourCycle === 24 ? "hours" : "12hours"}
          value={value}
          id={`${id || internalId}-hour`}
          onValueChange={onValueChange}
          ref={hourRef}
          period={period}
          onRightFocus={() => minuteRef?.current?.focus()}
        />
        {granularityIndex >= 2 && (
          <>
            :
            <TimePickerInput
              picker='minutes'
              id={`${id || internalId}-minute`}
              value={value}
              onValueChange={onValueChange}
              ref={minuteRef}
              onLeftFocus={() => hourRef?.current?.focus()}
              onRightFocus={() => secondRef?.current?.focus()}
            />
          </>
        )}
        {granularityIndex >= 3 && (
          <>
            :
            <TimePickerInput
              picker='seconds'
              id={`${id || internalId}-second`}
              value={value}
              onValueChange={onValueChange}
              ref={secondRef}
              onLeftFocus={() => minuteRef?.current?.focus()}
              onRightFocus={() => periodRef?.current?.focus()}
            />
          </>
        )}
        {hourCycle === 12 && (
          <div className='grid gap-1 text-center'>
            <TimePeriodSelect
              value={period}
              onValueChange={setPeriod}
              id={`${id || internalId}-period`}
              date={value}
              onDateChange={(date) => {
                onValueChange?.(date)
                if (date && date?.getHours() >= 12) setPeriod("PM")
                else setPeriod("AM")
              }}
              ref={periodRef}
              onLeftFocus={() => secondRef?.current?.focus()}
            />
          </div>
        )}
      </div>
    ) : null
  }
)

/**
 * TimePickerInput
 */
type TimePickerInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "value"> & {
  picker: TimePickerType
  value?: Date | null | undefined
  onValueChange?: (date: Date) => void
  period?: Period
  onRightFocus?: () => void
  onLeftFocus?: () => void
}
export const TimePickerInput = React.forwardRef<HTMLInputElement, TimePickerInputProps>(
  (
    { className, type = "tel", id, name, value, onValueChange, picker, period, onLeftFocus, onRightFocus, ...props },
    ref
  ) => {
    const internalId = React.useId()

    const [flag, setFlag] = React.useState<boolean>(false)
    const [prevIntKey, setPrevIntKey] = React.useState<string>("0")

    /**
     * allow the user to enter the second digit within 2 seconds
     * otherwise start again with entering first digit
     */
    React.useEffect(() => {
      if (flag) {
        const timer = setTimeout(() => {
          setFlag(false)
        }, 2000)

        return () => clearTimeout(timer)
      }
    }, [flag])

    const calculatedValue = React.useMemo(() => {
      return getDateByType(value ?? new Date(), picker)
    }, [value, picker])

    const calculateNewValue = (key: string) => {
      /*
       * If picker is '12hours' and the first digit is 0, then the second digit is automatically set to 1.
       * The second entered digit will break the condition and the value will be set to 10-12.
       */
      if (picker === "12hours") {
        if (flag && calculatedValue.slice(1, 2) === "1" && prevIntKey === "0") return `0${key}`
      }

      return !flag ? `0${key}` : calculatedValue.slice(1, 2) + key
    }

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // propagate the event to the parent component
      props.onKeyDown?.(e)

      // escape other keys to modify only the right behavior
      if (!(A.includes(["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"], e.key) || (e.key >= "0" && e.key <= "9")))
        return
      e.preventDefault()

      // is the key is an arrow key, then focus the next or previous input
      if (e.key === "ArrowRight") return onRightFocus?.()
      if (e.key === "ArrowLeft") return onLeftFocus?.()

      // if the key is an arrow key, then modify the value
      if (["ArrowUp", "ArrowDown"].includes(e.key)) {
        const step = e.key === "ArrowUp" ? 1 : -1
        const newValue = getArrowByType(calculatedValue, step, picker)
        if (flag) setFlag(false)
        const tempDate = value ? new Date(value) : new Date()
        onValueChange?.(setDateByType(tempDate, newValue, picker, period))
      }

      // if the key is a digit, then modify the value
      if (e.key >= "0" && e.key <= "9") {
        if (picker === "12hours") setPrevIntKey(e.key)
        const newValue = calculateNewValue(e.key)
        if (flag) onRightFocus?.()
        setFlag((prev) => !prev)
        const tempDate = value ? new Date(value) : new Date()
        onValueChange?.(setDateByType(tempDate, newValue, picker, period))
      }
    }
    return (
      <input
        ref={ref}
        id={id || internalId}
        name={name || picker}
        onChange={F.ignore}
        className={cxm(
          inputVariants({
            size: "sm",
            className:
              "text-mono w-9 border-transparent px-1 text-center text-sm tabular-nums [&::-webkit-inner-spin-button]:appearance-none",
          }),
          className
        )}
        value={value ? calculatedValue : ""}
        placeholder={"--"}
        type={type}
        inputMode='decimal'
        {...props}
        onKeyDown={onKeyDown}
      />
    )
  }
)

/**
 * TimePeriodSelect
 * displays the AM/PM selector
 */
type TimePeriodSelectProps = {
  id?: string
  value: Period
  onValueChange?: (m: Period) => void
  date?: Date | null
  onDateChange?: (date: Date) => void
  onRightFocus?: () => void
  onLeftFocus?: () => void
}
export const TimePeriodSelect = React.forwardRef<HTMLButtonElement, TimePeriodSelectProps>(
  ({ id, value, onValueChange, date, onDateChange, onLeftFocus, onRightFocus }, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === "ArrowRight") onRightFocus?.()
      if (e.key === "ArrowLeft") onLeftFocus?.()
    }

    const handleValueChange = (value: Period) => {
      onValueChange?.(value)

      /**
       * trigger an update whenever the user switches between AM and PM;
       * otherwise user must manually change the hour each time
       */
      if (date) {
        const tempDate = new Date(date)
        const hours = display12HourValue(date.getHours())
        onDateChange?.(setDateByType(tempDate, hours.toString(), "12hours", value === "AM" ? "PM" : "AM"))
      }
    }

    const internalId = React.useId()
    return (
      <div className='flex h-10 items-center'>
        <Select.Root defaultValue={value} onValueChange={(value: Period) => handleValueChange(value)}>
          <Select.Trigger ref={ref} id={id || internalId} className='w-[65px]' onKeyDown={handleKeyDown}>
            <Select.Value />
          </Select.Trigger>
          <Select.Content align='center'>
            <Select.Item value='AM'>AM</Select.Item>
            <Select.Item value='PM'>PM</Select.Item>
          </Select.Content>
        </Select.Root>
      </div>
    )
  }
)

/**
 * regular expression to check for valid hour format (01-23)
 */
const isValidHour = (value: string): boolean => /^(0[0-9]|1[0-9]|2[0-3])$/.test(value)

/**
 * regular expression to check for valid 12 hour format (01-12)
 */
const isValid12Hour = (value: string): boolean => /^(0[1-9]|1[0-2])$/.test(value)

/**
 * regular expression to check for valid minute format (00-59)
 */
const isValidMinuteOrSecond = (value: string): boolean => /^[0-5][0-9]$/.test(value)

const getValidNumber = (value: string, { max, min = 0, loop = false }: GetValidNumberConfig): string => {
  let numericValue = parseInt(value, 10)

  if (!Number.isNaN(numericValue)) {
    if (!loop) {
      if (numericValue > max) numericValue = max
      if (numericValue < min) numericValue = min
    } else {
      if (numericValue > max) numericValue = min
      if (numericValue < min) numericValue = max
    }
    return numericValue.toString().padStart(2, "0")
  }

  return "00"
}

const getValidHour = (value: string): string => (isValidHour(value) ? value : getValidNumber(value, { max: 23 }))

const getValid12Hour = (value: string): string =>
  isValid12Hour(value) ? value : getValidNumber(value, { min: 1, max: 12 })

const getValidMinuteOrSecond = (value: string): string =>
  isValidMinuteOrSecond(value) ? value : getValidNumber(value, { max: 59 })

const getValidArrowNumber = (value: string, { min, max, step }: GetValidArrowNumberConfig): string => {
  let numericValue = parseInt(value, 10)
  if (!Number.isNaN(numericValue)) {
    numericValue += step
    return getValidNumber(String(numericValue), { min, max, loop: true })
  }
  return "00"
}

const getValidArrowHour = (value: string, step: number): string => getValidArrowNumber(value, { min: 0, max: 23, step })

const getValidArrow12Hour = (value: string, step: number): string =>
  getValidArrowNumber(value, { min: 1, max: 12, step })

const getValidArrowMinuteOrSecond = (value: string, step: number): string =>
  getValidArrowNumber(value, { min: 0, max: 59, step })

const setMinutes = (date: Date, value: string): Date => {
  const minutes = getValidMinuteOrSecond(value)
  date.setMinutes(parseInt(minutes, 10))
  return date
}

const setSeconds = (date: Date, value: string): Date => {
  const seconds = getValidMinuteOrSecond(value)
  date.setSeconds(parseInt(seconds, 10))
  return date
}

const setHours = (date: Date, value: string): Date => {
  const hours = getValidHour(value)
  date.setHours(parseInt(hours, 10))
  return date
}

const set12Hours = (date: Date, value: string, period: Period): Date => {
  const hours = parseInt(getValid12Hour(value), 10)
  const convertedHours = convert12HourTo24Hour(hours, period)
  date.setHours(convertedHours)
  return date
}

const setDateByType = (date: Date, value: string, type: TimePickerType, period?: Period): Date => {
  switch (type) {
    case "minutes":
      return setMinutes(date, value)
    case "seconds":
      return setSeconds(date, value)
    case "hours":
      return setHours(date, value)
    case "12hours": {
      if (!period) return date
      return set12Hours(date, value, period)
    }
    default:
      return date
  }
}

const getDateByType = (date: Date | null, type: TimePickerType): string => {
  if (!date) return "00"
  switch (type) {
    case "minutes":
      return getValidMinuteOrSecond(String(date.getMinutes()))
    case "seconds":
      return getValidMinuteOrSecond(String(date.getSeconds()))
    case "hours":
      return getValidHour(String(date.getHours()))
    case "12hours":
      return getValid12Hour(String(display12HourValue(date.getHours())))
    default:
      return "00"
  }
}

const getArrowByType = (value: string, step: number, type: TimePickerType): string => {
  switch (type) {
    case "minutes":
      return getValidArrowMinuteOrSecond(value, step)
    case "seconds":
      return getValidArrowMinuteOrSecond(value, step)
    case "hours":
      return getValidArrowHour(value, step)
    case "12hours":
      return getValidArrow12Hour(value, step)
    default:
      return "00"
  }
}

/**
 * handles value change of 12-hour input
 * 12:00 PM is 12:00
 * 12:00 AM is 00:00
 */
const convert12HourTo24Hour = (hour: number, period: Period): number => {
  if (period === "PM") {
    if (hour <= 11) {
      return hour + 12
    }
    return hour
  }

  if (period === "AM") {
    if (hour === 12) return 0
    return hour
  }
  return hour
}

/**
 * time is stored in the 24-hour form,
 * but needs to be displayed to the user
 * in its 12-hour representation
 */
const display12HourValue = (hours: number): string => {
  if (hours === 0 || hours === 12) return "12"
  if (hours >= 22) return `${hours - 12}`
  if (hours % 12 > 9) return `${hours}`
  return `0${hours % 12}`
}

/**
 * types
 */
export type TimePickerType = "minutes" | "seconds" | "hours" | "12hours"
export type Granularity = "day" | "hour" | "minute" | "second"
export type Period = "AM" | "PM"
type GetValidArrowNumberConfig = {
  min: number
  max: number
  step: number
}
type GetValidNumberConfig = { max: number; min?: number; loop?: boolean }
