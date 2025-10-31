import { FormField, useFieldContext } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { A, D, S, T } from "@compo/utils"
import { Calendar, Plus } from "lucide-react"
import React from "react"
import { FormScheduleRule, makeScheduleRule } from "../utils"
import { ScheduleRuleCard } from "./form-rules.card"

export const FormRules: React.FC<{ name: string }> = ({ name }) => {
  return (
    <FormField name={name}>
      <ScheduleRules />
    </FormField>
  )
}

const ScheduleRules: React.FC = () => {
  const { _, format } = useTranslation(dictionary)
  const { value, setFieldValue } = useFieldContext<FormScheduleRule[]>()

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

  const addRule = () => setFieldValue(A.append(value, makeScheduleRule()))
  const removeRule = (id: string) => setFieldValue(A.filter(value, (r) => r.id !== id))
  const updateRule = (id: string, updates: Partial<FormScheduleRule>) =>
    setFieldValue(A.map(value, (r) => (r.id === id ? D.merge(r, updates) : r)))

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='text-lg font-medium'>{_("title")}</h3>
          <p className='text-muted-foreground text-sm'>{_("description")}</p>
        </div>
        <Ui.Button type='button' onClick={addRule} size='sm'>
          <Plus className='mr-2 h-4 w-4' />
          {_("add-button")}
        </Ui.Button>
      </div>

      {value.length === 0 && (
        <div className='text-muted-foreground flex flex-col items-center justify-center gap-2 rounded-md border border-dashed py-12 text-center'>
          <Calendar className='h-12 w-12 opacity-50' />
          <p>{_("empty-message")}</p>
          <Ui.Button type='button' onClick={addRule} variant='outline' size='sm'>
            <Plus className='mr-2 h-4 w-4' />
            {_("add-first-button")}
          </Ui.Button>
        </div>
      )}

      <div className='space-y-4'>
        {value.map((rule, index) => (
          <ScheduleRuleCard
            key={rule.id}
            rule={rule}
            index={index}
            canDelete={value.length > 1}
            onUpdate={(updates) => updateRule(rule.id, updates)}
            onRemove={() => removeRule(rule.id)}
            daysOfWeek={daysOfWeek}
          />
        ))}
      </div>
    </div>
  )
}

/**
 * Translations
 */
const dictionary = {
  fr: {
    title: "Planifications",
    description: "Définissez les plages horaires et les règles de récurrence.",
    "add-button": "Ajouter une plage",
    "add-first-button": "Ajouter une plage horaire",
    "empty-message": "Aucune plage horaire définie. Cliquez sur le bouton ci-dessous pour en ajouter une.",
  },
  en: {
    title: "Schedules",
    description: "Define time slots and recurrence rules.",
    "add-button": "Add slot",
    "add-first-button": "Add a time slot",
    "empty-message": "No time slot defined. Click the button below to add one.",
  },
  de: {
    title: "Zeitpläne",
    description: "Definieren Sie Zeitfenster und Wiederholungsregeln.",
    "add-button": "Zeitfenster hinzufügen",
    "add-first-button": "Ein Zeitfenster hinzufügen",
    "empty-message": "Kein Zeitfenster definiert. Klicken Sie auf die Schaltfläche unten, um eines hinzuzufügen.",
  },
}
