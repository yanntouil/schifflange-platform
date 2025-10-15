import { DropdownNavProps, DropdownProps } from "react-day-picker"
import { Select } from "../../select"
import { Calendar } from "./calendar"

const CalendarYearMonthSelect: React.FC<
  React.ComponentProps<typeof Calendar> & {
    value: Date | undefined
    onValueChange: (date: Date | undefined) => void
  }
> = ({ value, onValueChange, ...props }) => {
  const handleCalendarChange = (_value: string | number, _e: React.ChangeEventHandler<HTMLSelectElement>) => {
    const _event = {
      target: {
        value: String(_value),
      },
    } as React.ChangeEvent<HTMLSelectElement>
    _e(_event)
  }

  return (
    <Calendar
      mode='single'
      selected={value}
      onSelect={onValueChange}
      className='rounded-md border p-2'
      classNames={{
        month_caption: "mx-0",
      }}
      captionLayout='dropdown'
      defaultMonth={new Date()}
      startMonth={new Date(1980, 6)}
      hideNavigation
      components={{
        DropdownNav: (props: DropdownNavProps) => {
          return <div className='flex w-full items-center gap-2'>{props.children}</div>
        },
        Dropdown: (props: DropdownProps) => {
          return (
            <Select.Root
              value={String(props.value)}
              onValueChange={(value) => {
                if (props.onChange) {
                  handleCalendarChange(value, props.onChange)
                }
              }}
            >
              <Select.Trigger className='h-8 w-fit font-medium first:grow'>
                <Select.Value />
              </Select.Trigger>
              <Select.Content className='max-h-[min(26rem,var(--radix-select-content-available-height))]'>
                {props.options?.map((option) => (
                  <Select.Item key={option.value} value={String(option.value)} disabled={option.disabled}>
                    {option.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          )
        },
      }}
    />
  )
}
