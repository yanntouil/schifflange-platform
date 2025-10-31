import { FormField, useFieldContext } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { A, D, S, T } from "@compo/utils"
import { Calendar, Plus } from "lucide-react"
import React from "react"
import { ScheduleCard } from "./schedule"
import { makeSchedule } from "./utils"

export const FormSchedules: React.FC<{ name: string }> = ({ name }) => {
  return (
    <FormField name={name}>
      <Schedules />
    </FormField>
  )
}
const Schedules: React.FC = () => {
  const { _, format } = useTranslation(dictionary)
  const { value, setFieldValue } = useFieldContext<ReturnType<typeof makeSchedule>[]>()

  const daysOfWeek = React.useMemo(() => {
    const baseDate = new Date(2024, 0, 1) // Monday, January 1, 2024
    const startOfWeek = T.startOfWeek(baseDate, { weekStartsOn: 1 })
    const endOfWeek = T.endOfWeek(baseDate, { weekStartsOn: 1 })
    const interval = T.eachDayOfInterval({ start: startOfWeek, end: endOfWeek })
    return A.map(interval, (date) => ({
      value: T.getDay(date),
      label: S.replace(format(date, "EEE"), ".", ""),
    }))
  }, [format])

  const addSchedule = () => setFieldValue(A.append(value, makeSchedule()))
  const removeSchedule = (id: string) => setFieldValue(A.filter(value, (s) => s.id !== id))
  const updateSchedule = (id: string, updates: Partial<ReturnType<typeof makeSchedule>>) =>
    setFieldValue(A.map(value, (s) => (s.id === id ? D.merge(s, updates) : s)))

  return (
    <Ui.Card.Root className="mb-6">
      <Ui.Card.Header className="flex flex-row items-center justify-between">
        <div>
          <Ui.Card.Title>{_("title")}</Ui.Card.Title>
          <Ui.Card.Description>{_("description")}</Ui.Card.Description>
        </div>
        <Ui.Button type="button" onClick={addSchedule} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          {_("add-button")}
        </Ui.Button>
      </Ui.Card.Header>

      <Ui.Card.Content className="space-y-6">
        {value.length === 0 && (
          <div className="text-muted-foreground flex flex-col items-center justify-center gap-2 py-12 text-center">
            <Calendar className="h-12 w-12 opacity-50" />
            <p>{_("empty-message")}</p>
            <Ui.Button type="button" onClick={addSchedule} variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              {_("add-first-button")}
            </Ui.Button>
          </div>
        )}

        {value.map((schedule, index) => (
          <ScheduleCard
            key={schedule.id}
            schedule={schedule}
            index={index}
            canDelete={value.length > 1}
            onUpdate={(updates) => updateSchedule(schedule.id, updates)}
            onRemove={() => removeSchedule(schedule.id)}
            daysOfWeek={daysOfWeek}
          />
        ))}
      </Ui.Card.Content>
    </Ui.Card.Root>
  )
}

/**
 * Translations
 */
const dictionary = {
  fr: {
    title: "Planifications",
    description:
      "Définissez quand l'événement aura lieu. Vous pouvez créer plusieurs plages horaires si l'événement se répète à des horaires différents.",
    "add-button": "Ajouter une plage",
    "add-first-button": "Ajouter une plage horaire",
    "empty-message": "Aucune plage horaire définie. Cliquez sur le bouton ci-dessous pour en ajouter une.",
  },
  en: {
    title: "Schedules",
    description: "Define when the event will take place. You can create multiple time slots if the event repeats at different times.",
    "add-button": "Add slot",
    "add-first-button": "Add a time slot",
    "empty-message": "No time slot defined. Click the button below to add one.",
  },
  de: {
    title: "Zeitpläne",
    description:
      "Definieren Sie, wann die Veranstaltung stattfindet. Sie können mehrere Zeitfenster erstellen, wenn die Veranstaltung zu unterschiedlichen Zeiten wiederholt wird.",
    "add-button": "Zeitfenster hinzufügen",
    "add-first-button": "Ein Zeitfenster hinzufügen",
    "empty-message": "Kein Zeitfenster definiert. Klicken Sie auf die Schaltfläche unten, um eines hinzuzufügen.",
  },
}
