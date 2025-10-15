import { useToday } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import * as React from "react"
import { A, T } from "@compo/utils"
import { Select } from "../select"

/**
 * SelectYear
 */
export type SelectYearProps = Omit<
  React.ComponentProps<typeof Select.Trigger>,
  "value" | "onValueChange" | "size" | "variant"
> & {
  value?: Date | null
  onValueChange?: (year: Date) => void
  formatString?: string
  interval?: {
    start: Date
    end: Date
  }
}
export const SelectYear: React.FC<SelectYearProps> = ({
  value,
  onValueChange,
  formatString = "yyyy",
  interval,
  ...props
}) => {
  const today = useToday()
  const { start, end } = React.useMemo(
    () => ({
      start: interval?.start ?? T.startOfYear(T.sub(today, { years: 100 })),
      end: interval?.end ?? T.endOfYear(T.add(today, { years: 100 })),
    }),
    [interval, today]
  )
  const { locale } = useTranslation()
  const years = React.useMemo(
    () =>
      A.map(T.eachYearOfInterval({ start, end }), (year) => ({
        label: T.format(year, formatString, { locale }),
        value: T.getYear(year).toString(),
      })),
    [locale, start, end, formatString]
  )

  return (
    <Select.Root
      value={T.getYear(value ?? today).toString()}
      onValueChange={(yearString) =>
        onValueChange && onValueChange(T.setYear(value ?? today, Number.parseInt(yearString, 10)))
      }
    >
      <Select.Trigger size='sm' variant='ghost' {...props}>
        <Select.Value />
      </Select.Trigger>
      <Select.Content>
        {years.map(({ label, value }) => (
          <Select.Item key={value} value={value.toString()}>
            {label}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  )
}
