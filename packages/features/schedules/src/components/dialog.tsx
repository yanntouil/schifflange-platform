import { Form, useForm } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { A, match } from "@compo/utils"
import React from "react"
import { useSchedule } from "../schedules.context"
import { apiScheduleRuleToForm, formScheduleRuleToApi, makeScheduleRule } from "../utils"
import { FormRules } from "./form-rules"
import { FormRulesPreview } from "./form-rules-preview"

/**
 * ScheduleDialog
 */
export const ScheduleDialog: React.FC<Ui.QuickDialogProps<void>> = ({ item, ...props }) => {
  const { _ } = useTranslation(dictionary)
  return (
    <Ui.QuickDialog
      title={_("title")}
      description={_("description")}
      {...props}
      classNames={{ content: "sm:max-w-5xl", header: "z-10", close: "z-10" }}
      sticky
    >
      {item !== false && <DialogForm {...props} />}
    </Ui.QuickDialog>
  )
}

const DialogForm: React.FC<Ui.QuickDialogSafeProps<void>> = ({ close }) => {
  const { _ } = useTranslation(dictionary)
  const { schedule, service, mutate } = useSchedule()
  const initialValues = React.useMemo(
    () => ({
      rules: schedule.rules.length > 0 ? A.map(schedule.rules, apiScheduleRuleToForm) : [makeScheduleRule()],
    }),
    [schedule.rules]
  )

  const form = useForm({
    values: initialValues,
    onSubmit: async ({ values }) => {
      const payload = {
        rules: A.map(values.rules, formScheduleRuleToApi),
      }
      console.log(payload)
      // return _("validation-failure")
      match(await service.update(schedule.id, payload))
        .with({ ok: true }, ({ data }) => {
          Ui.toast.success(_("updated"))
          mutate(data.schedule)
          close()
        })
        .otherwise(({ except }) => {
          Ui.toast.error(_("validation-failure"))
        })
    },
  })

  return (
    <Form.Root form={form} className='space-y-4 pt-2'>
      <Form.Assertive />
      <FormRules name='rules' />
      <FormRulesPreview name='rules' />
      <Ui.QuickDialogStickyFooter>
        <Form.Submit className='w-full'>{_("submit")}</Form.Submit>
      </Ui.QuickDialogStickyFooter>
    </Form.Root>
  )
}

const dictionary = {
  fr: {
    title: "Gérer les planifications",
    description: "Définissez les plages horaires et les règles de récurrence pour cet élément.",
    updated: "Les planifications ont été mises à jour avec succès",
    "validation-failure": "Erreur lors de la validation du formulaire",
    submit: "Enregistrer les modifications",
  },
  en: {
    title: "Manage schedules",
    description: "Define time slots and recurrence rules for this item.",
    updated: "Schedules have been successfully updated",
    "validation-failure": "Form validation error",
    submit: "Save changes",
  },
  de: {
    title: "Zeitpläne verwalten",
    description: "Definieren Sie Zeitfenster und Wiederholungsregeln für dieses Element.",
    updated: "Die Zeitpläne wurden erfolgreich aktualisiert",
    "validation-failure": "Formularvalidierungsfehler",
    submit: "Änderungen speichern",
  },
}
