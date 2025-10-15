import { useToday } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { ChevronLeft } from "lucide-react"
import * as React from "react"
import { DayPicker } from "react-day-picker"
import { cx, cxm, match, T } from "@compo/utils"
import { Button, buttonVariants } from "../button"
import { SelectMonth } from "./select-month"
import { SelectYear } from "./select-year"

/**
 * Calendar
 */
export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  interval?: { start: Date; end: Date }
}
export const Calendar: React.FC<CalendarProps> = ({
  className,
  classNames,
  showOutsideDays = true,
  showWeekNumber = false,
  interval,
  ...props
}) => {
  const today = useToday()
  const { locale } = useTranslation()
  const { start, end } = React.useMemo(
    () => ({
      start: interval?.start ?? T.startOfYear(T.sub(today, { years: 100 })),
      end: interval?.end ?? T.endOfYear(T.add(today, { years: 100 })),
    }),
    [interval, today]
  )
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cxm("p-3", className)}
      locale={locale}
      weekStartsOn={locale.options?.weekStartsOn}
      showWeekNumber={showWeekNumber}
      classNames={{
        months: "flex flex-col",
        month: "flex flex-col items-center gap-3",
        month_caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "relative w-full", // nav contains the previous and next buttons
        button_previous: cxm(
          buttonVariants({
            variant: "ghost",
            size: "sm",
            className: "bg-transparent shadow-none text-muted-foreground size-8 absolute left-[1px] top-0",
          })
        ),
        button_next: cxm(
          buttonVariants({
            variant: "ghost",
            size: "sm",
            className: "bg-transparent shadow-none text-muted-foreground size-8 absolute right-0 top-0",
          })
        ),
        month_grid: "border-collapse space-y-1", // table
        week_number: "flex size-9 items-center justify-start text-muted-foreground font-normal text-xs",
        weekdays: cx("flex gap-1", showWeekNumber && "justify-end"),
        weekday: "flex size-9 items-center justify-center text-muted-foreground font-normal text-sm rounded-sm",
        week: "flex gap-1 mt-1",
        day: cx("group/day relative size-9 p-0 rounded-sm", "text-center text-sm"),
        day_button: cxm(buttonVariants({ variant: "ghost" }), "size-9 p-0 aria-selected:opacity-100 rounded-sm"),
        range_end: "",
        selected:
          "[&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary [&>button]:hover:text-primary-foreground [&>button]:focus:bg-primary [&>button]:focus:text-primary-foreground",
        today:
          "[&>button]:border-accent [&[aria-selected=true]>button]:text-primary-foreground [&>button]:text-primary [&>button]:font-bold [&[aria-selected=true]>button]:border-primary",
        outside: "[&[aria-selected=true]>button]:bg-primary/50 [&>button]:text-muted/75 [&>button]:font-normal",
        disabled: "text-muted-foreground opacity-50",
        range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        hidden: "invisible",
        ...classNames,
      }}
      disabled={[{ before: start }, { after: end }]}
      components={{
        Button: ({ ...props }) => <Button {...props} />,
        Chevron: ({ orientation }) => (
          <ChevronLeft
            className={cx(
              "size-3.5",
              match(orientation)
                .with("up", () => "rotate-90")
                .with("right", () => "rotate-180")
                .with("down", () => "rotate-270")
                .otherwise(() => null)
            )}
          />
        ),
        MonthCaption: () => (
          <div className='inline-flex items-center justify-center'>
            <SelectMonth
              value={props.month}
              onValueChange={props.onMonthChange}
              className={buttonVariants({ size: "sm", variant: "ghost", className: "[&_svg]:size-3.5" })}
              interval={interval}
            />
            <SelectYear
              value={props.month}
              onValueChange={props.onMonthChange}
              className={buttonVariants({ size: "sm", variant: "ghost", className: "[&_svg]:size-3.5" })}
              interval={interval}
            />
          </div>
        ),
      }}
      {...props}
    />
  )
}
