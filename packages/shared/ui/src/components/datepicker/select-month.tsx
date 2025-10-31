import { useTranslation } from "@compo/localize"
import React from "react"
import { Select } from "../select"

/**
 * SelectMonth component
 */
type SelectMonthProps = {
  value: number
  onValueChange: (month: number) => void
}

export const SelectMonth: React.FC<SelectMonthProps> = ({ value, onValueChange }) => {
  const { format } = useTranslation()
  const months = React.useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const date = new Date(2024, i, 1)
      return {
        value: i.toString(),
        label: format(date, "MMMM"),
      }
    })
  }, [format])

  return (
    <Select.Root value={value.toString()} onValueChange={(v) => onValueChange(parseInt(v))}>
      <Select.Trigger className='h-8 w-auto min-w-[100px] text-sm font-semibold'>
        <Select.Value />
      </Select.Trigger>
      <Select.Content>
        {months.map((month) => (
          <Select.Item key={month.value} value={month.value}>
            {month.label}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  )
}
