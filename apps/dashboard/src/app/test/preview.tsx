import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { A, T } from "@compo/utils"
import { MapPin, Repeat } from "lucide-react"
import React from "react"
import { makeSchedule, makeValues } from "./utils"

/**
 * Preview Component
 */
export const Preview: React.FC<{ values: ReturnType<typeof makeValues> }> = ({ values }) => {
  const { _, format } = useTranslation(dictionary)

  const daysOfWeek = React.useMemo(() => {
    const baseDate = new Date(2024, 0, 1)
    const startOfWeek = T.startOfWeek(baseDate, { weekStartsOn: 1 })
    const endOfWeek = T.endOfWeek(baseDate, { weekStartsOn: 1 })
    const interval = T.eachDayOfInterval({ start: startOfWeek, end: endOfWeek })
    return A.map(interval, (date) => ({
      value: T.getDay(date),
      label: format(date, "EEEE"),
    }))
  }, [format])

  const formatSchedule = (schedule: ReturnType<typeof makeSchedule>) => {
    if (schedule.allDay) {
      if (!schedule.startDate) return _("schedule-no-date")

      const startStr = format(schedule.startDate, "d MMM yyyy")
      const endStr = schedule.endDate ? format(schedule.endDate, "d MMM yyyy") : startStr

      if (T.isSameDay(schedule.startDate, schedule.endDate || schedule.startDate)) {
        return `${startStr} - ${_("all-day")}`
      }
      return `${startStr} → ${endStr} - ${_("all-day")}`
    } else {
      if (!schedule.startDateTime) return _("schedule-no-date")

      const startStr = format(schedule.startDateTime, "d MMM yyyy 'à' HH:mm")
      const endStr = schedule.endDateTime
        ? T.isSameDay(schedule.startDateTime, schedule.endDateTime)
          ? format(schedule.endDateTime, "HH:mm")
          : format(schedule.endDateTime, "d MMM yyyy 'à' HH:mm")
        : "?"

      return `${startStr} → ${endStr}`
    }
  }

  const formatRecurrence = (schedule: ReturnType<typeof makeSchedule>) => {
    if (!schedule.isRecurring) return null

    const parts: string[] = []

    // Frequency with interval
    if (schedule.interval > 1) {
      let unit = ""
      if (schedule.freq === "DAILY") unit = _("recurrence-days")
      if (schedule.freq === "WEEKLY") unit = _("recurrence-weeks")
      if (schedule.freq === "MONTHLY") unit = _("recurrence-months")
      if (schedule.freq === "YEARLY") unit = _("recurrence-years")
      parts.push(`${_("recurrence-every")} ${schedule.interval} ${unit}`)
    } else {
      let freqLabel = ""
      if (schedule.freq === "DAILY") freqLabel = _("recurrence-daily")
      if (schedule.freq === "WEEKLY") freqLabel = _("recurrence-weekly")
      if (schedule.freq === "MONTHLY") freqLabel = _("recurrence-monthly")
      if (schedule.freq === "YEARLY") freqLabel = _("recurrence-yearly")
      parts.push(freqLabel)
    }

    // Weekdays
    if (schedule.freq === "WEEKLY" && schedule.byWeekday.length > 0) {
      const days = schedule.byWeekday
        .sort()
        .map((d) => daysOfWeek[d]?.label)
        .filter(Boolean)
        .join(", ")
      parts.push(days)
    }

    // Until
    if (schedule.until) {
      parts.push(`${_("recurrence-until")} ${format(schedule.until, "d MMM yyyy")}`)
    }

    return parts.join(" • ")
  }

  return (
    <Ui.Card.Root className="border-primary bg-primary/5 mb-6 border-2">
      <Ui.Card.Header>
        <Ui.Card.Title level={4}>{_("title")}</Ui.Card.Title>
        <Ui.Card.Description>{_("description")}</Ui.Card.Description>
      </Ui.Card.Header>
      <Ui.Card.Content className="space-y-4">
        {/* Event Info */}
        <div className="space-y-2">
          <div className="text-lg font-semibold">{values.name || _("event-unnamed")}</div>
          {values.location && (
            <div className="text-primary w-full shrink-0 items-center rounded-md py-1 text-xs leading-4 font-light tracking-tight [&>svg]:mr-1 [&>svg]:mb-0.5 [&>svg]:inline-block [&>svg]:size-3.5 [&>svg]:stroke-[1.5]">
              <MapPin aria-label={_("location-label")} />
              {values.location}
            </div>
          )}
        </div>

        {/* Schedules */}
        {values.schedules.length > 0 && (
          <div className="space-y-3">
            <div className="text-muted-foreground text-xs font-medium uppercase">{_("schedules-title")}</div>
            <div className="space-y-2">
              {values.schedules.map((schedule, index) => {
                const timeStr = formatSchedule(schedule)
                const recurrenceStr = formatRecurrence(schedule)

                return (
                  <div key={schedule.id} className="bg-card rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-md text-sm font-semibold">
                        {index + 1}
                      </div>
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="text-sm font-medium">{timeStr}</div>
                        {recurrenceStr && (
                          <div className="text-muted-foreground flex items-center gap-1 text-xs">
                            <Repeat className="h-3 w-3" />
                            {recurrenceStr}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {values.schedules.length === 0 && <div className="text-muted-foreground py-8 text-center text-sm">{_("no-schedules")}</div>}
      </Ui.Card.Content>
    </Ui.Card.Root>
  )
}

/**
 * Translations
 */
const dictionary = {
  fr: {
    title: "Aperçu",
    description: "Visualisez votre événement avant de le créer",
    "event-unnamed": "Sans nom",
    "location-label": "Lieu",
    "schedules-title": "Plages horaires",
    "no-schedules": "Aucune plage horaire définie",
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
    "recurrence-on-days": "les jours",
    "recurrence-last-day": "dernier",
    "recurrence-until": "jusqu'au",
    "recurrence-occurrences": "occurrences",
    "recurrence-exception": "exception",
    "recurrence-exceptions": "exceptions",
  },
  en: {
    title: "Preview",
    description: "Preview your event before creating it",
    "event-unnamed": "Unnamed",
    "location-label": "Location",
    "schedules-title": "Time slots",
    "no-schedules": "No time slots defined",
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
    "recurrence-on-days": "on days",
    "recurrence-last-day": "last",
    "recurrence-until": "until",
    "recurrence-occurrences": "occurrences",
    "recurrence-exception": "exception",
    "recurrence-exceptions": "exceptions",
  },
  de: {
    title: "Vorschau",
    description: "Vorschau Ihrer Veranstaltung vor dem Erstellen",
    "event-unnamed": "Unbenannt",
    "location-label": "Ort",
    "schedules-title": "Zeitfenster",
    "no-schedules": "Keine Zeitfenster definiert",
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
    "recurrence-on-days": "an Tagen",
    "recurrence-last-day": "letzter",
    "recurrence-until": "bis",
    "recurrence-occurrences": "Vorkommen",
    "recurrence-exception": "Ausnahme",
    "recurrence-exceptions": "Ausnahmen",
  },
}
