import { Form, useForm } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { FormTranslatableTabs, useContextualLanguage, useFormTranslatable } from "@compo/translations"
import { Ui } from "@compo/ui"
import { match, T } from "@compo/utils"
import { type Api, placeholder as servicePlaceholder } from "@services/dashboard"
import React from "react"
import { useDirectoryService } from "../service.context"
import { OrganisationContactsForm } from "./organisation.contacts.form"

/**
 * OrganisationContactsEditDialog
 */
export const OrganisationContactsEditDialog: React.FC<Ui.QuickDialogProps<Api.ContactOrganisation>> = ({
  item,
  ...props
}) => {
  const { _ } = useTranslation(dictionary)
  return (
    <Ui.QuickDialog
      title={_("title")}
      description={_("description")}
      {...props}
      classNames={{ content: "sm:max-w-3xl", header: "z-10", close: "z-10" }}
      sticky
    >
      {item !== false && <DialogForm {...props} item={item} />}
    </Ui.QuickDialog>
  )
}

/**
 * DialogForm
 */
const DialogForm: React.FC<Ui.QuickDialogSafeProps<Api.ContactOrganisation>> = ({ close, mutate, item }) => {
  const { _ } = useTranslation(dictionary)
  const { service } = useDirectoryService()
  const { current } = useContextualLanguage()
  const initialValues = {
    phones: item.phones,
    emails: item.emails,
    extras: item.extras,
    isPrimary: item.isPrimary,
    isResponsible: item.isResponsible,
    order: item.order,
    startDate: item.startDate ? T.parseISO(item.startDate) : null,
    endDate: item.endDate ? T.parseISO(item.endDate) : null,
    translations: useFormTranslatable(item.translations, servicePlaceholder.contactOrganisation),
  }
  const form = useForm({
    allowSubmitAttempt: true,
    values: initialValues,
    onSubmit: async ({ values }) => {
      const { startDate, endDate, ...rest } = values
      const payload = {
        ...rest,
        startDate: startDate ? startDate.toISOString() : null,
        endDate: endDate ? endDate.toISOString() : null,
      }

      return match(await service.id(item.contactId).organisations.id(item.id).update(payload))
        .with({ ok: true }, async ({ data }) => {
          Ui.toast.success(_("updated"))
          await mutate?.(data.contactOrganisation)
          close()
        })
        .otherwise(async ({ except }) =>
          match(except?.name)
            .with("E_VALIDATION_FAILURE", () => Ui.toast.error(_("validation")))
            .otherwise(() => Ui.toast.error(_("failed")))
        )
    },
  })

  return (
    <Form.Root form={form} className='space-y-4 @container'>
      <Form.Assertive />
      <FormTranslatableTabs defaultLanguage={current.id}>
        <div className='space-y-6 pt-6'>
          <OrganisationContactsForm />
        </div>
      </FormTranslatableTabs>
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
    title: "Edit contact in organisation",
    description: "Update the contact's role and information in this organisation.",
    submit: "Save changes",
    updated: "Contact updated successfully",
    failed: "Failed to update contact",
    validation: "Some of your input is invalid. Please check your entries and try again.",
  },
  fr: {
    title: "Modifier le contact dans l'organisation",
    description: "Mettre à jour le rôle et les informations du contact dans cette organisation.",
    submit: "Enregistrer les modifications",
    updated: "Contact mis à jour avec succès",
    failed: "Échec de la mise à jour du contact",
    validation: "Certaines de vos entrées sont invalides. Veuillez vérifier vos entrées et réessayer.",
  },
  de: {
    title: "Kontakt in Organisation bearbeiten",
    description: "Rolle und Informationen des Kontakts in dieser Organisation aktualisieren.",
    submit: "Änderungen speichern",
    updated: "Kontakt erfolgreich aktualisiert",
    failed: "Kontakt konnte nicht aktualisiert werden",
    validation: "Einige Ihrer Eingaben sind ungültig. Bitte überprüfen Sie Ihre Eingaben und versuchen Sie es erneut.",
  },
}
