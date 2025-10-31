import { Form, useForm } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { useFormTranslatable } from "@compo/translations"
import { Ui } from "@compo/ui"
import { A, D, match } from "@compo/utils"
import { type Api, placeholder as servicePlaceholder } from "@services/dashboard"
import React from "react"
import { useEventsService } from "../service.context"
import { EventsForm } from "./events.form"

/**
 * EventsEditDialog
 */
export const EventsEditDialog: React.FC<Ui.QuickDialogProps<Api.EventWithRelations>> = ({ item, ...props }) => {
  const { _ } = useTranslation(dictionary)
  return (
    <Ui.QuickDialog
      title={_("title")}
      description={_("description")}
      {...props}
      classNames={{ content: "sm:max-w-lg" }}
      sticky
    >
      {item !== false && <DialogForm {...props} item={item} />}
    </Ui.QuickDialog>
  )
}

/**
 * DialogForm
 */
const DialogForm: React.FC<Ui.QuickDialogSafeProps<Api.EventWithRelations>> = ({ close, mutate, item }) => {
  const { _ } = useTranslation(dictionary)
  const { service } = useEventsService()
  const serviceEvent = service.id(item.id)

  const initialValues = {
    props: item.props,
    state: item.state,
    categoryIds: A.map(item.categories, D.prop("id")),
    translations: useFormTranslatable(item.translations, servicePlaceholder.event),
  }
  const form = useForm({
    allowSubmitAttempt: true,
    values: initialValues,
    onSubmit: async ({ values }) => {
      const payload = {
        ...values,
      }
      return match(await serviceEvent.update(payload))
        .with({ failed: true }, async ({ except }) =>
          match(except?.name)
            .with("E_VALIDATION_FAILURE", () => Ui.toast.error(_("validation")))
            .otherwise(() => Ui.toast.error(_("failed")))
        )
        .otherwise(async ({ data: { event } }) => {
          Ui.toast.success(_("updated"))
          await mutate?.(event)
          close()
        })
    },
  })
  return (
    <Form.Root form={form} className='space-y-4 pt-2'>
      <Form.Assertive />
      <EventsForm />
      <Ui.QuickDialogStickyFooter>
        <Form.Submit className='w-full'>{_("submit")}</Form.Submit>
      </Ui.QuickDialogStickyFooter>
    </Form.Root>
  )
}

/**
 * dictionaries
 */
const dictionary = {
  en: {
    title: "Edit event",
    description: "Update the event status and settings.",
    submit: "Save changes",
    updated: "Event updated successfully",
    failed: "Failed to update event",
    validation: "Some of your input is invalid. Please check your entries and try again.",
  },
  fr: {
    title: "Modifier l'événement",
    description: "Mettre à jour le statut et les paramètres de l'événement.",
    submit: "Enregistrer les modifications",
    updated: "Événement mis à jour avec succès",
    failed: "Échec de la mise à jour de l'événement",
    validation: "Certaines de vos entrées sont invalides. Veuillez vérifier vos entrées et réessayer.",
  },
  de: {
    title: "Veranstaltung bearbeiten",
    description: "Den Veranstaltungs-Status und die Einstellungen aktualisieren.",
    submit: "Änderungen speichern",
    updated: "Veranstaltung erfolgreich aktualisiert",
    failed: "Fehler beim Aktualisieren der Veranstaltung",
    validation: "Einige Ihrer Eingaben sind ungültig. Bitte überprüfen Sie Ihre Eingaben und versuchen Sie es erneut.",
  },
}
