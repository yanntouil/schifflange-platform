import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { A, capitalize, cxm, match } from "@compo/utils"
import { CalendarMinus2 } from "lucide-react"
import React from "react"
import { RangeName } from "../types"

const ranges: RangeName[] = ["7days", "1month", "3months", "6months", "12months", "all"]

/**
 * SelectRange
 */
type Props = {
  range: RangeName
  setRange: (range: RangeName) => void
} & React.ComponentProps<typeof Ui.Button>
export const SelectRange: React.FC<Props> = ({ range, setRange, className, ...props }) => {
  const { _ } = useTranslation(dictionary)
  return (
    <Ui.DropdownMenu.Root>
      <Ui.DropdownMenu.Trigger asChild>
        <Ui.Button
          {...props}
          aria-label={props["aria-label"] ?? _("tooltip")}
          variant={props.variant ?? "outline"}
          size={props.size ?? "sm"}
          className={cxm(className)}
        >
          <RangeIcon range={range} />
          <span className='line-clamp-1'>{_(`stats.${range}`)}</span>
        </Ui.Button>
      </Ui.DropdownMenu.Trigger>
      <Ui.DropdownMenu.Content align='end'>
        {A.map(ranges, (item) => (
          <Ui.DropdownMenu.Item key={item} onClick={() => setRange(item)} className='[&>svg]:shrink-0'>
            <RangeIcon range={item} />
            {capitalize(_(`stats.${item}`))}
          </Ui.DropdownMenu.Item>
        ))}
      </Ui.DropdownMenu.Content>
    </Ui.DropdownMenu.Root>
  )
}

const RangeIcon: React.FC<{ range: RangeName }> = ({ range }) =>
  match(range)
    .with("7days", () => <CalendarMinus2 aria-hidden />)
    .with("1month", () => <CalendarMinus2 aria-hidden />)
    .with("3months", () => <CalendarMinus2 aria-hidden />)
    .with("6months", () => <CalendarMinus2 aria-hidden />)
    .with("12months", () => <CalendarMinus2 aria-hidden />)
    .with("all", () => <CalendarMinus2 aria-hidden />)
    .exhaustive()

const dictionary = {
  fr: {
    tooltip: "Set the time period for the statistics",
    stats: {
      "7days": "in the last 7 days",
      "1month": "in the last 1 month",
      "3months": "in the last 3 months",
      "6months": "in the last 6 months",
      "12months": "in the last 1 year",
      all: "since the beginning",
    },
  },
  de: {
    tooltip: "Zeitraum für die Statistiken festlegen",
    stats: {
      "7days": "in den letzten 7 Tagen",
      "1month": "im letzten Monat",
      "3months": "in den letzten 3 Monaten",
      "6months": "in den letzten 6 Monaten",
      "12months": "im letzten Jahr",
      all: "seit Beginn",
    },
  },
  en: {
    tooltip: "Set the time period for the statistics",
    stats: {
      "7days": "in the last 7 days",
      "1month": "in the last 1 month",
      "3months": "in the last 3 months",
      "6months": "in the last 6 months",
      "12months": "in the last 1 year",
      all: "since the beginning",
    },
  },
}
