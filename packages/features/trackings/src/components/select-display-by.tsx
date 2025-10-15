import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { A, capitalize, match } from "@compo/utils"
import { Calendar, Calendar1, CalendarClock, CalendarDays, CalendarMinus2 } from "lucide-react"
import React from "react"
import { DisplayByName } from "../types"

/**
 * SelectDisplayBy
 */
type Props = {
  displayBy: DisplayByName
  setDisplayBy: (displayBy: DisplayByName) => void
  className?: string
} & React.ComponentProps<typeof Ui.Button>
export const SelectDisplayBy: React.FC<Props> = ({ displayBy, setDisplayBy, ...props }) => {
  const { _ } = useTranslation(dictionary)
  return (
    <Ui.DropdownMenu.Root>
      <Ui.DropdownMenu.Trigger asChild>
        <Ui.Button
          {...props}
          aria-label={props["aria-label"] ?? _("tooltip")}
          variant={props.variant ?? "outline"}
          size={props.size ?? "sm"}
        >
          <DisplayByIcon displayBy={displayBy} />
          <span className='line-clamp-1'>{_(`stats.${displayBy}`)}</span>
        </Ui.Button>
      </Ui.DropdownMenu.Trigger>
      <Ui.DropdownMenu.Content align='end'>
        {A.map(displayByRange, (item) => (
          <Ui.DropdownMenu.Item key={item} onClick={() => setDisplayBy(item)}>
            <DisplayByIcon displayBy={item} />
            {capitalize(_(`stats.${item}`))}
          </Ui.DropdownMenu.Item>
        ))}
      </Ui.DropdownMenu.Content>
    </Ui.DropdownMenu.Root>
  )
}

/**
 * DisplayByIcon
 * dispatch display by icon
 */
const DisplayByIcon: React.FC<{ displayBy: DisplayByName }> = ({ displayBy }) =>
  match(displayBy)
    .with("hours", () => <CalendarClock className='shrink-0' />)
    .with("days", () => <CalendarDays className='shrink-0' />)
    .with("weeks", () => <CalendarMinus2 className='shrink-0' />)
    .with("months", () => <Calendar1 className='shrink-0' />)
    .with("years", () => <Calendar className='shrink-0' />)
    .exhaustive()

/**
 * constants
 */
const displayByRange: DisplayByName[] = ["hours", "days", "weeks", "months", "years"]

/**
 * translation
 */
const dictionary = {
  fr: {
    tooltip: "Choisir comment les données sont agrégées",
    stats: {
      hours: "par heures",
      days: "par jours",
      weeks: "par semaines",
      months: "par mois",
      years: "par années",
    },
  },
  de: {
    tooltip: "Wählen Sie, wie oft die Daten aggregiert werden",
    stats: {
      hours: "pro Stunde",
      days: "pro Tag",
      weeks: "pro Woche",
      months: "pro Monat",
      years: "pro Jahr",
    },
  },
  en: {
    tooltip: "Choose how often the data is aggregated",
    stats: {
      hours: "per hours",
      days: "per days",
      weeks: "per weeks",
      months: "per months",
      years: "per years",
    },
  },
}
