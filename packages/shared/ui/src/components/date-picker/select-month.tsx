import { useToday } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import * as React from "react"
import { A, G, T } from "@compo/utils"
import { Select } from "../select"

/**
 * SelectMonth
 */
export type SelectMonthProps = Omit<
  React.ComponentProps<typeof Select.Trigger>,
  "value" | "onValueChange" | "size" | "variant"
> & {
  value?: Date | null
  onValueChange?: (month: Date) => void
  formatString?: string
  interval?: {
    start: Date
    end: Date
  }
}
export const SelectMonth: React.FC<SelectMonthProps> = ({
  value,
  onValueChange,
  formatString = "MMMM",
  interval,
  ...props
}) => {
  const { locale } = useTranslation()
  const today = useToday()
  const displayedDate = value ?? today
  const months = React.useMemo(
    () =>
      A.map(
        T.eachMonthOfInterval({
          start: T.startOfYear(displayedDate),
          end: T.endOfYear(displayedDate),
        }),
        (month) => ({
          label: T.format(month, formatString, { locale }),
          value: T.getMonth(month).toString(),
          disabled: G.isNotNullable(interval)
            ? !monthIsWithinInterval(T.getMonth(month), T.getYear(displayedDate), interval)
            : false,
        })
      ),
    [locale, displayedDate, formatString, interval]
  )

  return (
    <Select.Root
      value={T.getMonth(displayedDate).toString()}
      onValueChange={(monthString) =>
        onValueChange && onValueChange(T.setMonth(displayedDate, Number.parseInt(monthString, 10)))
      }
    >
      <Select.Trigger size='sm' variant='ghost' {...props}>
        <Select.Value />
      </Select.Trigger>
      <Select.Content>
        {months.map(({ label, value, disabled }) => (
          <Select.Item key={value} value={value.toString()} disabled={disabled}>
            {label}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  )
}
const monthIsWithinInterval = (month: number, year: number, interval: { start: Date; end: Date }) => {
  const monthStart = T.startOfMonth(new Date(year, month, 1))
  const monthEnd = T.endOfMonth(new Date(year, month, 1))
  return T.isWithinInterval(monthStart, interval) || T.isWithinInterval(monthEnd, interval)
}
