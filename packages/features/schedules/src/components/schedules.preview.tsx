import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { A } from "@compo/utils"
import { Api } from "@services/dashboard"
import { Calendar, CalendarSync, CalendarX2 } from "lucide-react"
import React from "react"
import { useRecurrenceStr, useTimeStr } from "../hooks"
import { useSchedule } from "../schedules.context"

/**
 * SchedulePreview
 * the inner card content for the schedule
 */
export const SchedulePreview: React.FC = () => {
  const { _, format } = useTranslation(dictionary)
  const { schedule } = useSchedule()

  if (schedule.rules.length === 0) {
    return (
      <div className='text-muted-foreground flex flex-col items-center gap-2 py-8 text-center'>
        <Calendar className='h-8 w-8 opacity-50' />
        <p className='text-sm'>{_("no-rules")}</p>
      </div>
    )
  }

  return (
    <div className='space-y-3 px-6 pb-6'>
      {A.mapWithIndex(schedule.rules, (index, rule) => (
        <ScheduleRulePreview key={rule.id} rule={rule} index={index} />
      ))}
    </div>
  )
}

/**
 * ScheduleRulePreview
 */
type ScheduleRulePreviewProps = {
  rule: Api.ScheduleRule
  index: number
}
const ScheduleRulePreview: React.FC<ScheduleRulePreviewProps> = ({ rule, index }) => {
  const { _, format } = useTranslation(dictionary)

  const timeDisplay = useTimeStr(rule)
  const recurrenceDisplay = useRecurrenceStr(rule)

  const excludedDatesDisplay = React.useMemo(() => {
    if (!rule.isRecurring || !rule.excludedDates || rule.excludedDates.length === 0) return null

    return A.map(rule.excludedDates, (date) => format(new Date(date), "PPP")).join(", ")
  }, [rule, format])

  return (
    <div className='bg-card rounded-md border p-3'>
      <div className='flex items-start gap-3'>
        <div className='bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-md text-sm font-semibold'>
          {index + 1}
        </div>
        <div className='min-w-0 flex-1 flex flex-col'>
          <div className='text-sm font-medium pb-1'>{timeDisplay}</div>
          {recurrenceDisplay && (
            <Dashboard.Card.Field className='text-muted-foreground'>
              <CalendarSync aria-label={_("recurrence")} />
              {recurrenceDisplay}
            </Dashboard.Card.Field>
          )}
          {excludedDatesDisplay && (
            <Dashboard.Card.Field className='text-muted-foreground'>
              <CalendarX2 aria-label={_("excluded-dates")} />
              {excludedDatesDisplay}
            </Dashboard.Card.Field>
          )}
        </div>
      </div>
    </div>
  )
}

const dictionary = {
  fr: {
    "no-rules": "Aucune règle de planification définie",
    recurrence: "Récurrence",
    "excluded-dates": "Dates d'exception",
  },
  en: {
    "no-rules": "No schedule rules defined",
    recurrence: "Recurrence",
    "excluded-dates": "Excluded dates",
  },
  de: {
    "no-rules": "Keine Planungsregeln definiert",
    recurrence: "Wiederholung",
    "excluded-dates": "Ausgeschlossene Termine",
  },
}
