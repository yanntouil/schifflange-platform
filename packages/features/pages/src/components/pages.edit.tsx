import { Form, useForm } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { match } from "@compo/utils"
import { type Api } from "@services/dashboard"
import React from "react"
import { usePagesService } from ".."
import { PagesForm } from "./pages.form"

/**
 * PagesEditDialog
 */
export const PagesEditDialog: React.FC<Ui.QuickDialogProps<Api.PageWithRelations>> = ({ item, ...props }) => {
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
const DialogForm: React.FC<Ui.QuickDialogSafeProps<Api.PageWithRelations>> = ({ close, mutate, item }) => {
  const { _ } = useTranslation(dictionary)
  const { service } = usePagesService()
  const servicePage = service.id(item.id)

  const initialValues = { state: item.state, lock: item.lock }
  const form = useForm({
    allowSubmitAttempt: true,
    values: initialValues,
    onSubmit: async ({ values }) =>
      match(await servicePage.update(values))
        .with({ failed: true }, async ({ except }) =>
          match(except?.name)
            .with("E_VALIDATION_FAILURE", () => Ui.toast.error(_("validation")))
            .otherwise(() => Ui.toast.error(_("failed")))
        )
        .otherwise(async ({ data: { page } }) => {
          Ui.toast.success(_("updated"))
          await mutate?.(page)
          close()
        }),
  })

  return (
    <Form.Root form={form} className='space-y-4'>
      <Form.Assertive />
      <PagesForm />
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
    title: "Edit page",
    description: "Update the page status and settings.",
    submit: "Save changes",
    updated: "Page updated successfully",
    failed: "Failed to update page",
    validation: "Some of your input is invalid. Please check your entries and try again.",
  },
  fr: {
    title: "Modifier la page",
    description: "Mettre à jour le statut et les paramètres de la page.",
    submit: "Enregistrer les modifications",
    updated: "Page mise à jour avec succès",
    failed: "Échec de la mise à jour de la page",
    validation: "Certaines de vos entrées sont invalides. Veuillez vérifier vos entrées et réessayer.",
  },
  de: {
    title: "Seite bearbeiten",
    description: "Status und Einstellungen der Seite aktualisieren.",
    submit: "Änderungen speichern",
    updated: "Seite erfolgreich aktualisiert",
    failed: "Seite konnte nicht aktualisiert werden",
    validation: "Einige Ihrer Eingaben sind ungültig. Bitte überprüfen Sie Ihre Eingaben und versuchen Sie es erneut.",
  },
}
