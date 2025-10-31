import { useFormContext } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { T } from "@compo/utils"
import { Calendar, CalendarSync, Clock } from "lucide-react"
import React from "react"
import { useNextOccurrences, useRecurrenceStr, useTimeStr } from "../hooks"
import { FormScheduleRule } from "../utils"

/**
 * Preview Component for Schedule Rules
 */
export const FormRulesPreview: React.FC<{ name: string }> = () => {
  const { _ } = useTranslation(dictionary)
  const { values } = useFormContext<{ rules: FormScheduleRule[] }>()
  const { rules } = values

  if (rules.length === 0) {
    return null
  }

  return (
    <Ui.Card.Root className='border-primary bg-primary/5 border-2'>
      <Ui.Card.Header>
        <Ui.Card.Title level={4}>{_("title")}</Ui.Card.Title>
        <Ui.Card.Description>{_("description")}</Ui.Card.Description>
      </Ui.Card.Header>
      <Ui.Card.Content className='space-y-2'>
        {rules.map((rule, index) => (
          <Rule key={rule.id} rule={rule} index={index} />
        ))}
      </Ui.Card.Content>
    </Ui.Card.Root>
  )
}

/**
 * Schedule Rule Preview Item
 */
type RuleProps = {
  rule: FormScheduleRule
  index: number
}
const Rule: React.FC<RuleProps> = ({ rule, index }) => {
  const { _, format } = useTranslation(dictionary)

  const timeStr = useTimeStr(rule)
  const recurrenceStr = useRecurrenceStr(rule)
  const nextOccurrences = useNextOccurrences(rule, 8)

  return (
    <div className='bg-card rounded-lg border p-3'>
      <div className='flex items-start gap-3'>
        <div className='bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-md text-sm font-semibold'>
          {index + 1}
        </div>
        <div className='min-w-0 flex-1 space-y-1'>
          <div className='flex flex-col justify-center gap-1 min-h-10'>
            <div className='text-sm font-medium'>{timeStr}</div>
            {recurrenceStr && (
              <div className='text-muted-foreground flex items-center gap-1 text-xs'>
                <CalendarSync className='h-3 w-3' />
                {recurrenceStr}
              </div>
            )}
          </div>

          {/* Next Occurrences */}
          {nextOccurrences.length > 0 && (
            <div className='border-t pt-2 mt-2'>
              <div className='text-muted-foreground mb-1.5 text-xs font-medium'>{_("next-occurrences")}</div>
              <div className='flex flex-wrap gap-1.5'>
                {nextOccurrences.map((occurrence, idx) => (
                  <div
                    key={idx}
                    className='bg-muted text-muted-foreground flex items-center gap-1 rounded px-2 py-1 text-xs'
                  >
                    {rule.allDay ? <Calendar className='h-3 w-3' /> : <Clock className='h-3 w-3' />}
                    {rule.allDay
                      ? occurrence.end && !T.isSameDay(occurrence.start, occurrence.end)
                        ? `${format(occurrence.start, "EEE d MMM")} - ${format(occurrence.end, "EEE d MMM")}`
                        : format(occurrence.start, "EEE d MMM")
                      : occurrence.end
                        ? T.isSameDay(occurrence.start, occurrence.end)
                          ? `${format(occurrence.start, "EEE d MMM · HH:mm")} - ${format(occurrence.end, "HH:mm")}`
                          : `${format(occurrence.start, "EEE d MMM · HH:mm")} - ${format(occurrence.end, "d MMM · HH:mm")}`
                        : format(occurrence.start, "EEE d MMM 'à' HH:mm")}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * Translations
 */
const dictionary = {
  fr: {
    title: "Aperçu",
    description: "Visualisez vos plages horaires",
    "schedule-no-date": "Aucune date sélectionnée",
    "all-day": "Journée complète",
    "recurrence-daily": "quotidienne",
    "recurrence-weekly": "hebdomadaire",
    "recurrence-monthly": "mensuelle",
    "recurrence-yearly": "annuelle",
    "recurrence-every": "Tous les",
    "recurrence-days": "jours",
    "recurrence-weeks": "semaines",
    "recurrence-months": "mois",
    "recurrence-years": "ans",
    "recurrence-until": "jusqu'au",
    "next-occurrences": "Prochaines dates",
  },
  en: {
    title: "Preview",
    description: "Preview your time slots",
    "schedule-no-date": "No date selected",
    "all-day": "All day",
    "recurrence-daily": "daily",
    "recurrence-weekly": "weekly",
    "recurrence-monthly": "monthly",
    "recurrence-yearly": "yearly",
    "recurrence-every": "Every",
    "recurrence-days": "days",
    "recurrence-weeks": "weeks",
    "recurrence-months": "months",
    "recurrence-years": "years",
    "recurrence-until": "until",
    "next-occurrences": "Next dates",
  },
  de: {
    title: "Vorschau",
    description: "Vorschau Ihrer Zeitfenster",
    "schedule-no-date": "Kein Datum ausgewählt",
    "all-day": "Ganztägig",
    "recurrence-daily": "täglich",
    "recurrence-weekly": "wöchentlich",
    "recurrence-monthly": "monatlich",
    "recurrence-yearly": "jährlich",
    "recurrence-every": "Alle",
    "recurrence-days": "Tage",
    "recurrence-weeks": "Wochen",
    "recurrence-months": "Monate",
    "recurrence-years": "Jahre",
    "recurrence-until": "bis",
    "next-occurrences": "Nächste Termine",
  },
}
