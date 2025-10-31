import React from "react"
import { Select } from "../select"

/**
 * SelectYear component
 */
type SelectYearProps = {
  value: number
  onValueChange: (year: number) => void
}

export const SelectYear: React.FC<SelectYearProps> = ({ value, onValueChange }) => {
  const years = React.useMemo(() => {
    const startYear = value - 5
    return Array.from({ length: 11 }, (_, i) => ({
      value: (startYear + i).toString(),
      label: (startYear + i).toString(),
    }))
  }, [value])

  return (
    <Select.Root value={value.toString()} onValueChange={(v) => onValueChange(parseInt(v))}>
      <Select.Trigger className='h-8 w-auto min-w-[80px] text-sm font-semibold'>
        <Select.Value />
      </Select.Trigger>
      <Select.Content>
        {years.map((year) => (
          <Select.Item key={year.value} value={year.value}>
            {year.label}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  )
}
