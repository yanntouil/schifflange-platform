import { Form, useForm } from "@compo/form"
import { Translation, useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { A, match } from "@compo/utils"
import { ArrowRight, SaveAll } from "lucide-react"
import React from "react"
import { ScheduleContextType, useSchedule } from "../schedules.context"
import { ScheduleProvider } from "../schedules.context.provider"
import { apiScheduleRuleToForm, formScheduleRuleToApi, makeScheduleRule } from "../utils"
import { FormRules } from "./form-rules"
import { FormRulesPreview } from "./form-rules-preview"

/**
 * ScheduleEditStepDialog
 */
export type ScheduleEditStepDialogProps = Omit<ScheduleContextType, "contextId" | "edit"> &
  FormProps & {
    title: string
    description: string
  }
export const ScheduleEditStepDialog: React.FC<ScheduleEditStepDialogProps> = ({
  title,
  description,
  onNext,
  nextLabel,
  onSkip,
  skipLabel,
  ...props
}) => {
  const formProps = { onNext, nextLabel, onSkip, skipLabel }
  return (
    <Ui.QuickDialogContent
      {...{ title, description }}
      classNames={{ content: "sm:max-w-screen-md", header: "z-10", close: "z-10" }}
      sticky
    >
      <ScheduleProvider {...props}>
        <DialogForm {...formProps} />
      </ScheduleProvider>
    </Ui.QuickDialogContent>
  )
}
type FormProps = {
  onNext: () => void
  nextLabel: string
  onSkip?: () => void
  skipLabel?: string
}
const DialogForm: React.FC<FormProps> = ({ onNext, nextLabel, onSkip, skipLabel }) => {
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
          mutate(data.schedule)
          onNext()
        })
        .otherwise(() => _("validation"))
    },
  })
  return (
    <Form.Root form={form} className='space-y-4'>
      <Form.Assertive />
      <FormRules name='rules' />
      <FormRulesPreview name='rules' />
      <Ui.QuickDialogStickyFooter>
        <Ui.Button type='submit'>
          <SaveAll aria-hidden />
          {nextLabel}
        </Ui.Button>
        {onSkip && skipLabel && (
          <Ui.Button variant='outline' onClick={onSkip}>
            {skipLabel}
            <ArrowRight aria-hidden />
          </Ui.Button>
        )}
      </Ui.QuickDialogStickyFooter>
    </Form.Root>
  )
}

const dictionary = {
  fr: {
    validation: "Erreur lors de la validation du formulaire",
  },
  en: {
    validation: "An error occurred during the validation of the data.",
  },
  de: {
    validation: "Fehler bei der Validierung des Formulars",
  },
} satisfies Translation
