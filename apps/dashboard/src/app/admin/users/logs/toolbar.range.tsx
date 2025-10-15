import { Query } from "@/services"
import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { NonNullableRecord, T, Tz } from "@compo/utils"
import { DateValue, getLocalTimeZone, parseDate } from "@internationalized/date"
import React from "react"

/**
 * display toolbar for logs list
 */
type FilterBy = NonNullableRecord<Query.Admin.Users.SecurityLogs>["filterBy"]
type ToolbarRangeProps = {
  filterBy: FilterBy
  setFilterBy: (filterBy: FilterBy) => void
}
export const ToolbarRange: React.FC<ToolbarRangeProps> = ({ filterBy, setFilterBy }) => {
  const { _ } = useTranslation(dictionary)
  const { size: toolbarSize } = Dashboard.useToolbar()
  const range = React.useMemo(() => {
    const start = toCalendarSafe(filterBy.dateFrom)
    const end = toCalendarSafe(filterBy.dateTo)
    return start && end ? { start, end } : null
  }, [filterBy.dateFrom, filterBy.dateTo])
  const onRangeChange = (range: Ui.ReactAriaComponents.DateRange | null) => {
    if (range) {
      setFilterBy({ dateFrom: formatAsDate(range.start), dateTo: formatAsDate(range.end) })
    }
  }
  return (
    <Ui.ReactAriaComponents.DateRangePicker
      aria-label={_("label")}
      className="h-10"
      value={range}
      onChange={onRangeChange}
      size={toolbarSize}
    />
  )
}

/**
 * helpers use for date range picker
 */
const toCalendarSafe = (isoString?: string) => (isoString ? parseDate(isoString.slice(0, 10)) : undefined)
const formatAsDate = (d?: DateValue) =>
  d ? Tz.toZonedTime(T.endOfDay(d.toDate(getLocalTimeZone())), getLocalTimeZone()).toISOString() : undefined

/**
 * translations
 */
const dictionary = {
  en: {
    label: "Select date range",
  },
  fr: {
    label: "Sélectionner une période",
  },
  de: {
    label: "Datumsbereich auswählen",
  },
}
