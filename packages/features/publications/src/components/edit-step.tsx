import { Form, useForm } from "@compo/form"
import { Translation, useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { dateToISO, match, parseDate } from "@compo/utils"
import { ArrowRight, SaveAll } from "lucide-react"
import React from "react"
import { PublicationContextType, usePublication } from "../publication.context"
import { PublicationProvider } from "../publication.context.provider"
import { PublicationForm } from "./form"

/**
 * PublicationEditStepDialog
 */
export type PublicationEditStepDialogProps = Omit<PublicationContextType, "contextId" | "edit"> &
  FormProps & {
    title: string
    description: string
  }
export const PublicationEditStepDialog: React.FC<PublicationEditStepDialogProps> = ({
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
      <PublicationProvider {...props}>
        <DialogForm {...formProps} />
      </PublicationProvider>
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
  const { publication, service, mutate } = usePublication()
  const initialValues = {
    publishedById: publication.publishedBy?.id ?? null,
    publishedAt: parseDate(publication.publishedAt),
    isScheduled: publication.publishedFrom || publication.publishedTo ? true : false,
    publishedFrom: parseDate(publication.publishedFrom),
    publishedTo: parseDate(publication.publishedTo),
  }
  const form = useForm({
    values: initialValues,
    onSubmit: async ({ values }) => {
      // socials are not implemented yet
      const payload = {
        publishedById: values.publishedById || null,
        publishedAt: dateToISO(values.publishedAt),
        publishedFrom: values.isScheduled ? dateToISO(values.publishedFrom) : null,
        publishedTo: values.isScheduled ? dateToISO(values.publishedTo) : null,
      }
      match(await service.update(payload))
        .with({ ok: true }, ({ data }) => {
          Ui.toast.success(_("updated"))
          mutate(data.publication)
          onNext()
        })
        .otherwise(({ except }) => {
          Ui.toast.error(_("validation-failure"))
        })
    },
  })
  return (
    <Form.Root form={form} className='space-y-4'>
      <Form.Assertive />
      <PublicationForm />
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
