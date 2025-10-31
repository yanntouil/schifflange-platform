import { FieldGroup, Form, InputNumber } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { Primitives, Ui, variants } from "@compo/ui"
import { G, T } from "@compo/utils"
import { Trash2 } from "lucide-react"
import React from "react"
import { makeRecurringFrequency, makeSchedule } from "./utils"

/**
 * Schedule Card Component
 */
export type ScheduleCardProps = {
  schedule: ReturnType<typeof makeSchedule>
  index: number
  canDelete: boolean
  onUpdate: (updates: Partial<ReturnType<typeof makeSchedule>>) => void
  onRemove: () => void
  daysOfWeek: Array<{ value: number; label: string }>
}
export const ScheduleCard: React.FC<ScheduleCardProps> = ({ schedule, index, canDelete, onUpdate, onRemove, daysOfWeek }) => {
  const { _ } = useTranslation(dictionary)
  const freqOptions = [
    { value: "DAILY", label: _("frequency-daily-label"), description: _("frequency-daily-description") },
    { value: "WEEKLY", label: _("frequency-weekly-label"), description: _("frequency-weekly-description") },
    { value: "MONTHLY", label: _("frequency-monthly-label"), description: _("frequency-monthly-description") },
    { value: "YEARLY", label: _("frequency-yearly-label"), description: _("frequency-yearly-description") },
  ]

  const id = React.useId()

  const endDateError = React.useMemo(
    () =>
      G.isNotNullable(schedule.endDate) && G.isNotNullable(schedule.startDate) && T.isBefore(schedule.endDate, schedule.startDate)
        ? _("end-date-invalid")
        : undefined,
    [schedule.endDate, schedule.startDate, _]
  )

  const endDateTimeError = React.useMemo(
    () =>
      G.isNotNullable(schedule.endDateTime) &&
      G.isNotNullable(schedule.startDateTime) &&
      T.isBefore(schedule.endDateTime, schedule.startDateTime)
        ? _("end-datetime-invalid")
        : undefined,
    [schedule.endDateTime, schedule.startDateTime, _]
  )

  return (
    <Ui.Card.Root className="@container/schedule-card">
      <Ui.Card.Header className="flex flex-row items-center justify-between">
        <Ui.Card.Title level={4}>
          {_("card-title")} {index + 1}
        </Ui.Card.Title>
        {canDelete && (
          <Ui.Button type="button" variant="ghost" size="sm" onClick={onRemove} aria-label={_("delete-button-aria")}>
            <Trash2 className="h-4 w-4" />
          </Ui.Button>
        )}
      </Ui.Card.Header>

      <Ui.Card.Content className="space-y-4">
        {/* All Day Toggle */}
        <div className="flex items-center justify-between space-x-2">
          <div className="flex items-center gap-2">
            <Ui.Label htmlFor={`${id}-allDay`} className="grow">
              {_("all-day-label")}
            </Ui.Label>
            <Form.Info title={_("all-day-label")} content={_("all-day-info-content")} />
          </div>
          <Ui.Switch id={`${id}-allDay`} checked={schedule.allDay} onCheckedChange={(checked) => onUpdate({ allDay: checked === true })} />
        </div>

        {/* Dates */}
        {schedule.allDay ? (
          <div className="grid gap-4 @3xl/schedule-card:grid-cols-2">
            <FieldGroup
              label={_("start-date-label")}
              id={`${id}-startDate`}
              labelAside={<Form.Info title={_("start-date-label")} content={_("start-date-info-content")} />}
            >
              <Ui.Datepicker
                id={`${id}-startDate`}
                value={schedule.startDate}
                onValueChange={(date) => onUpdate({ startDate: date })}
                placeholder={_("start-date-placeholder")}
                clearable
              />
            </FieldGroup>
            <FieldGroup
              label={_("end-date-label")}
              id={`${id}-endDate`}
              labelAside={<Form.Info title={_("end-date-label")} content={_("end-date-info-content")} />}
              error={endDateError}
            >
              <Ui.Datepicker
                id={`${id}-endDate`}
                value={schedule.endDate}
                onValueChange={(date) => onUpdate({ endDate: date })}
                placeholder={_("end-date-placeholder")}
                clearable
                minDate={schedule.startDate || undefined}
              />
            </FieldGroup>
          </div>
        ) : (
          <div className="grid gap-4 @3xl/schedule-card:grid-cols-2">
            <FieldGroup
              label={_("start-datetime-label")}
              id={`${id}-startDateTime`}
              labelAside={<Form.Info title={_("start-datetime-label")} content={_("start-datetime-info-content")} />}
            >
              <Ui.Datepicker
                id={`${id}-startDateTime`}
                value={schedule.startDateTime}
                onValueChange={(date) => onUpdate({ startDateTime: date })}
                placeholder={_("start-datetime-placeholder")}
                clearable
                withTime
                defaultTime="09:00"
              />
            </FieldGroup>
            <FieldGroup
              label={_("end-datetime-label")}
              id={`${id}-endDateTime`}
              labelAside={<Form.Info title={_("end-datetime-label")} content={_("end-datetime-info-content")} />}
              error={endDateTimeError}
            >
              <Ui.Datepicker
                id={`${id}-endDateTime`}
                value={schedule.endDateTime}
                onValueChange={(date) => onUpdate({ endDateTime: date })}
                placeholder={_("end-datetime-placeholder")}
                clearable
                withTime
                defaultTime="17:00"
                minDate={schedule.startDateTime || undefined}
              />
            </FieldGroup>
          </div>
        )}

        {/* Recurrence */}
        <div className="space-y-3">
          <div className="flex items-center justify-between space-x-2">
            <div className="flex items-center gap-2">
              <Ui.Label htmlFor={`recurring-${schedule.id}`} className="grow">
                {_("recurring-label")}
              </Ui.Label>
              <Form.Info title={_("recurring-label")} content={_("recurring-info-content")} />
            </div>
            <Ui.Switch
              id={`recurring-${schedule.id}`}
              checked={schedule.isRecurring}
              onCheckedChange={(checked) => onUpdate({ isRecurring: checked === true })}
            />
          </div>

          {schedule.isRecurring && (
            <Ui.Card.Root>
              <Ui.Card.Content className="space-y-4 pt-6">
                <FieldGroup
                  label={_("frequency-label")}
                  id={`${id}-freq`}
                  labelAside={<Form.Info title={_("frequency-label")} content={_("frequency-info-content")} />}
                >
                  <Primitives.ToggleGroup.Root
                    type="single"
                    id={`${id}-freq`}
                    value={schedule.freq}
                    onValueChange={(value: string) => value && onUpdate({ freq: makeRecurringFrequency(value) })}
                    className="grid grid-cols-1 gap-4 @lg/schedule-card:grid-cols-2 @3xl/schedule-card:grid-cols-4"
                  >
                    {freqOptions.map(({ label, value, description }) => (
                      <Primitives.ToggleGroup.Item
                        key={value}
                        value={value}
                        aria-label={label}
                        className={cxm(
                          variants.focusVisible(),
                          "group border-input flex flex-col gap-1 rounded-md border px-6 py-2",
                          "text-left",
                          "data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
                          "hover:bg-accent hover:text-accent-foreground",
                          "transition-colors duration-100 ease-in-out [&>*]:transition-colors [&>*]:duration-100 [&>*]:ease-in-out"
                        )}
                      >
                        <span className="group-data-[state=on]:text-primary-foreground text-sm font-medium">{label}</span>
                        <span className="text-muted-foreground group-data-[state=on]:text-primary-foreground text-xs">{description}</span>
                      </Primitives.ToggleGroup.Item>
                    ))}
                  </Primitives.ToggleGroup.Root>
                </FieldGroup>

                {schedule.freq === "WEEKLY" && (
                  <FieldGroup
                    label={_("weekdays-label")}
                    id={`${id}-weekDays`}
                    labelAside={<Form.Info title={_("weekdays-label")} content={_("weekdays-info-content")} />}
                  >
                    <Primitives.ToggleGroup.Root
                      type="multiple"
                      id={`${id}-weekDays`}
                      value={schedule.byWeekday.map(String)}
                      onValueChange={(value: string[]) => onUpdate({ byWeekday: value.map(Number) })}
                      className="flex flex-wrap gap-2"
                    >
                      {daysOfWeek.map((day) => (
                        <Primitives.ToggleGroup.Item
                          key={day.value}
                          value={String(day.value)}
                          aria-label={day.label}
                          className={cxm(
                            variants.focusVisible(),
                            "border-input rounded-md border px-6 py-2",
                            "text-xs uppercase",
                            "data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
                            "hover:bg-accent hover:text-accent-foreground",
                            "transition-colors duration-300 ease-in-out"
                          )}
                        >
                          {day.label}
                        </Primitives.ToggleGroup.Item>
                      ))}
                    </Primitives.ToggleGroup.Root>
                  </FieldGroup>
                )}
                <div className="grid gap-4 pt-4 @3xl/schedule-card:grid-cols-2">
                  <FieldGroup
                    label={_("interval-label")}
                    id={`${id}-interval`}
                    labelAside={<Form.Info title={_("interval-label")} content={_("interval-info-content")} />}
                  >
                    <InputNumber min={1} value={schedule.interval} onValueChange={(interval) => onUpdate({ interval })} />
                  </FieldGroup>

                  <FieldGroup
                    label={_("until-label")}
                    id={`${id}-until`}
                    labelAside={<Form.Info title={_("until-label")} content={_("until-info-content")} />}
                  >
                    <Ui.Datepicker
                      id={`${id}-until`}
                      value={schedule.until}
                      onValueChange={(date) => onUpdate({ until: date })}
                      placeholder={_("until-placeholder")}
                      clearable
                      minDate={schedule.startDate || schedule.startDateTime || undefined}
                    />
                  </FieldGroup>
                </div>
              </Ui.Card.Content>
            </Ui.Card.Root>
          )}
        </div>
      </Ui.Card.Content>
    </Ui.Card.Root>
  )
}

/**
 * Translations
 */
const dictionary = {
  fr: {
    "card-title": "Plage horaire",
    "delete-button-aria": "Supprimer cette plage horaire",
    "end-date-invalid": "La date de fin doit être après la date de début",
    "end-datetime-invalid": "La date et l'heure de fin doivent être après la date et l'heure de début",
    "until-invalid": "La date de fin de récurrence doit être après la date de début de l'événement",
    "all-day-label": "Événement sur la journée complète",
    "all-day-info-content":
      "Activez cette option si l'événement dure toute la journée sans horaires précis (ex: festival, foire, exposition). Sinon, vous pourrez définir des horaires de début et de fin.",
    "start-date-label": "Date de début",
    "start-date-placeholder": "Sélectionner la date de début",
    "start-date-info-content": "Date à laquelle l'événement commence. Pour un événement sur plusieurs jours, indiquez le premier jour.",
    "end-date-label": "Date de fin",
    "end-date-placeholder": "Sélectionner la date de fin",
    "end-date-info-content":
      "Date à laquelle l'événement se termine. Pour un événement d'une seule journée, sélectionnez la même date que le début.",
    "start-datetime-label": "Début",
    "start-datetime-placeholder": "Sélectionner la date et l'heure de début",
    "start-datetime-info-content": "Moment précis où l'événement commence. Sélectionnez la date puis l'heure.",
    "end-datetime-label": "Fin",
    "end-datetime-placeholder": "Sélectionner la date et l'heure de fin",
    "end-datetime-info-content":
      "Moment précis où l'événement se termine. Si l'événement se termine le lendemain, sélectionnez la date du lendemain.",
    "recurring-label": "Événement récurrent",
    "recurring-info-content":
      "Activez cette option si l'événement se répète régulièrement (ex: cours hebdomadaire, réunion mensuelle). Vous pourrez ensuite définir la fréquence et les jours de répétition.",
    "frequency-label": "Fréquence de répétition",
    "frequency-info-content":
      "Choisissez à quelle fréquence l'événement se répète : tous les jours, toutes les semaines, tous les mois ou tous les ans.",
    "frequency-daily-label": "Quotidienne",
    "frequency-daily-description": "Tous les jours",
    "frequency-weekly-label": "Hebdomadaire",
    "frequency-weekly-description": "Toutes les semaines",
    "frequency-monthly-label": "Mensuelle",
    "frequency-monthly-description": "Tous les mois",
    "frequency-yearly-label": "Annuelle",
    "frequency-yearly-description": "Tous les ans",
    "interval-label": "Intervalle",
    "interval-info-content":
      "Définissez l'intervalle de répétition. Par exemple : '1' pour toutes les semaines, '2' pour toutes les 2 semaines, '3' pour tous les 3 mois, etc.",
    "weekdays-label": "Jours de la semaine",
    "weekdays-info-content":
      "Sélectionnez les jours de la semaine où l'événement doit se répéter. Vous pouvez choisir plusieurs jours (ex: lundi et mercredi pour un cours bi-hebdomadaire).",
    "monthdays-label": "Jours du mois",
    "monthdays-info-content":
      "Sélectionnez les jours du mois où l'événement doit se répéter. Vous pouvez choisir plusieurs jours (ex: 1 et 15 pour le début et mi-mois, ou '-1' pour le dernier jour du mois). Utile pour les réunions mensuelles récurrentes.",
    "monthdays-last-day": "Dernier",
    "recurrence-end-label": "Fin de la répétition",
    "recurrence-end-never": "Jamais (se répète indéfiniment)",
    "until-label": "Jusqu'à une date",
    "until-placeholder": "Sélectionner la date de fin",
    "until-info-content":
      "L'événement se répétera jusqu'à cette date incluse. Par exemple, pour un cours qui dure 3 mois, sélectionnez la date de fin de la session.",
    "count-label": "Nombre d'occurrences",
    "count-info-content":
      "Définissez combien de fois l'événement doit se répéter. Par exemple, '10' pour un cours de 10 séances, '52' pour un événement hebdomadaire d'un an. Alternative à la date de fin.",
    "excluded-dates-label": "Dates d'exception",
    "excluded-dates-info-content":
      "Sélectionnez les dates spécifiques où l'événement ne doit PAS avoir lieu, même si elles correspondent à la règle de répétition. Par exemple, pour exclure les jours fériés ou les vacances d'un cours hebdomadaire.",
    "excluded-dates-placeholder": "Sélectionner une date à exclure",
    "excluded-dates-add-button": "Ajouter une date d'exception",
    "excluded-dates-remove-aria": "Supprimer cette date d'exception",
  },
  en: {
    "card-title": "Time slot",
    "delete-button-aria": "Delete this time slot",
    "end-date-invalid": "End date must be after start date",
    "end-datetime-invalid": "End date and time must be after start date and time",
    "until-invalid": "Recurrence end date must be after event start date",
    "all-day-label": "All-day event",
    "all-day-info-content":
      "Enable this option if the event lasts all day without specific times (e.g: festival, fair, exhibition). Otherwise, you can define start and end times.",
    "start-date-label": "Start date",
    "start-date-placeholder": "Select start date",
    "start-date-info-content": "Date when the event starts. For a multi-day event, indicate the first day.",
    "end-date-label": "End date",
    "end-date-placeholder": "Select end date",
    "end-date-info-content": "Date when the event ends. For a single-day event, select the same date as the start.",
    "start-datetime-label": "Start",
    "start-datetime-placeholder": "Select start date and time",
    "start-datetime-info-content": "Exact moment when the event starts. Select the date then the time.",
    "end-datetime-label": "End",
    "end-datetime-placeholder": "Select end date and time",
    "end-datetime-info-content": "Exact moment when the event ends. If the event ends the next day, select the next day's date.",
    "recurring-label": "Recurring event",
    "recurring-info-content":
      "Enable this option if the event repeats regularly (e.g: weekly class, monthly meeting). You can then define the frequency and repetition days.",
    "frequency-label": "Repetition frequency",
    "frequency-info-content": "Choose how often the event repeats: daily, weekly, monthly, or yearly.",
    "frequency-daily-label": "Daily",
    "frequency-daily-description": "Every day",
    "frequency-weekly-label": "Weekly",
    "frequency-weekly-description": "Every week",
    "frequency-monthly-label": "Monthly",
    "frequency-monthly-description": "Every month",
    "frequency-yearly-label": "Yearly",
    "frequency-yearly-description": "Every year",
    "interval-label": "Interval",
    "interval-info-content":
      "Define the repetition interval. For example: '1' for every week, '2' for every 2 weeks, '3' for every 3 months, etc.",
    "weekdays-label": "Days of the week",
    "weekdays-info-content":
      "Select the days of the week when the event should repeat. You can choose multiple days (e.g: Monday and Wednesday for a bi-weekly class).",
    "monthdays-label": "Days of the month",
    "monthdays-info-content":
      "Select the days of the month when the event should repeat. You can choose multiple days (e.g: 1 and 15 for beginning and mid-month, or '-1' for the last day of the month). Useful for recurring monthly meetings.",
    "monthdays-last-day": "Last",
    "recurrence-end-label": "End of repetition",
    "recurrence-end-never": "Never (repeats indefinitely)",
    "until-label": "Until a date",
    "until-placeholder": "Select end date",
    "until-info-content":
      "The event will repeat until this date (inclusive). For example, for a 3-month course, select the session end date.",
    "count-label": "Number of occurrences",
    "count-info-content":
      "Define how many times the event should repeat. For example, '10' for a 10-session course, '52' for a year-long weekly event. Alternative to an end date.",
    "excluded-dates-label": "Exception dates",
    "excluded-dates-info-content":
      "Select specific dates when the event should NOT occur, even if they match the repetition rule. For example, to exclude holidays or vacations from a weekly course.",
    "excluded-dates-placeholder": "Select a date to exclude",
    "excluded-dates-add-button": "Add exception date",
    "excluded-dates-remove-aria": "Remove this exception date",
  },
  de: {
    "card-title": "Zeitfenster",
    "delete-button-aria": "Dieses Zeitfenster löschen",
    "end-date-invalid": "Enddatum muss nach dem Startdatum liegen",
    "end-datetime-invalid": "Enddatum und -zeit müssen nach dem Startdatum und -zeit liegen",
    "until-invalid": "Enddatum der Wiederholung muss nach dem Startdatum der Veranstaltung liegen",
    "all-day-label": "Ganztägige Veranstaltung",
    "all-day-info-content":
      "Aktivieren Sie diese Option, wenn die Veranstaltung den ganzen Tag ohne bestimmte Zeiten dauert (z.B: Festival, Messe, Ausstellung). Andernfalls können Sie Start- und Endzeiten definieren.",
    "start-date-label": "Startdatum",
    "start-date-placeholder": "Startdatum auswählen",
    "start-date-info-content": "Datum, an dem die Veranstaltung beginnt. Für eine mehrtägige Veranstaltung geben Sie den ersten Tag an.",
    "end-date-label": "Enddatum",
    "end-date-placeholder": "Enddatum auswählen",
    "end-date-info-content":
      "Datum, an dem die Veranstaltung endet. Für eine eintägige Veranstaltung wählen Sie das gleiche Datum wie den Beginn.",
    "start-datetime-label": "Beginn",
    "start-datetime-placeholder": "Startdatum und -zeit auswählen",
    "start-datetime-info-content": "Genauer Zeitpunkt, an dem die Veranstaltung beginnt. Wählen Sie das Datum und dann die Uhrzeit.",
    "end-datetime-label": "Ende",
    "end-datetime-placeholder": "Enddatum und -zeit auswählen",
    "end-datetime-info-content":
      "Genauer Zeitpunkt, an dem die Veranstaltung endet. Wenn die Veranstaltung am nächsten Tag endet, wählen Sie das Datum des nächsten Tages.",
    "recurring-label": "Wiederkehrende Veranstaltung",
    "recurring-info-content":
      "Aktivieren Sie diese Option, wenn die Veranstaltung regelmäßig wiederholt wird (z.B: wöchentlicher Kurs, monatliches Treffen). Sie können dann die Häufigkeit und Wiederholungstage definieren.",
    "frequency-label": "Wiederholungshäufigkeit",
    "frequency-info-content": "Wählen Sie, wie oft die Veranstaltung wiederholt wird: täglich, wöchentlich, monatlich oder jährlich.",
    "frequency-daily-label": "Täglich",
    "frequency-daily-description": "Jeden Tag",
    "frequency-weekly-label": "Wöchentlich",
    "frequency-weekly-description": "Jede Woche",
    "frequency-monthly-label": "Monatlich",
    "frequency-monthly-description": "Jeden Monat",
    "frequency-yearly-label": "Jährlich",
    "frequency-yearly-description": "Jedes Jahr",
    "interval-label": "Intervall",
    "interval-info-content":
      "Definieren Sie das Wiederholungsintervall. Zum Beispiel: '1' für jede Woche, '2' für alle 2 Wochen, '3' für alle 3 Monate usw.",
    "weekdays-label": "Wochentage",
    "weekdays-info-content":
      "Wählen Sie die Wochentage, an denen die Veranstaltung wiederholt werden soll. Sie können mehrere Tage auswählen (z.B: Montag und Mittwoch für einen zweiwöchentlichen Kurs).",
    "monthdays-label": "Tage des Monats",
    "monthdays-info-content":
      "Wählen Sie die Tage des Monats, an denen die Veranstaltung wiederholt werden soll. Sie können mehrere Tage auswählen (z.B: 1 und 15 für Anfang und Mitte des Monats, oder '-1' für den letzten Tag des Monats). Nützlich für wiederkehrende monatliche Treffen.",
    "monthdays-last-day": "Letzter",
    "recurrence-end-label": "Ende der Wiederholung",
    "recurrence-end-never": "Nie (wiederholt unbegrenzt)",
    "until-label": "Bis zu einem Datum",
    "until-placeholder": "Enddatum auswählen",
    "until-info-content":
      "Die Veranstaltung wird bis zu diesem Datum (einschließlich) wiederholt. Zum Beispiel, für einen 3-monatigen Kurs wählen Sie das Ende der Session.",
    "count-label": "Anzahl der Vorkommen",
    "count-info-content":
      "Definieren Sie, wie oft die Veranstaltung wiederholt werden soll. Zum Beispiel, '10' für einen 10-teiligen Kurs, '52' für eine ganzjährige wöchentliche Veranstaltung. Alternative zu einem Enddatum.",
    "excluded-dates-label": "Ausnahmedaten",
    "excluded-dates-info-content":
      "Wählen Sie bestimmte Daten, an denen die Veranstaltung NICHT stattfinden soll, auch wenn sie der Wiederholungsregel entsprechen. Zum Beispiel, um Feiertage oder Ferien von einem wöchentlichen Kurs auszuschließen.",
    "excluded-dates-placeholder": "Ein auszuschließendes Datum auswählen",
    "excluded-dates-add-button": "Ausnahmedatum hinzufügen",
    "excluded-dates-remove-aria": "Dieses Ausnahmedatum entfernen",
  },
}
