import { Form, useForm, validator } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { FormTranslatableTabs, useContextualLanguage, useFormTranslatable } from "@compo/translations"
import { Ui } from "@compo/ui"
import { match } from "@compo/utils"
import { type Api, placeholder as servicePlaceholder } from "@services/dashboard"
import React from "react"
import { useOrganisation } from "../organisation.context"
import { useDirectoryService } from "../service.context"
import { FormDirectory } from "./form"
import { OrganisationContactsForm } from "./organisation.contacts.form"

/**
 * OrganisationContactsAddDialog
 */
export const OrganisationContactsAddDialog: React.FC<Ui.QuickDialogProps<void, Api.ContactOrganisation>> = (props) => {
  const { _ } = useTranslation(dictionary)
  return (
    <Ui.QuickDialog
      title={_("title")}
      description={_("description")}
      {...props}
      classNames={{ content: "sm:max-w-3xl", header: "z-10", close: "z-10" }}
      sticky
    >
      <DialogForm {...props} />
    </Ui.QuickDialog>
  )
}

/**
 * DialogForm
 */
const DialogForm: React.FC<Ui.QuickDialogSafeProps<void, Api.ContactOrganisation>> = ({ close, mutate }) => {
  const { _ } = useTranslation(dictionary)
  const { service } = useDirectoryService()
  const { current } = useContextualLanguage()
  const { swr } = useOrganisation()
  const organisation = swr.organisation
  const { min } = validator
  const initialValues = {
    contactId: "",
    organisationId: organisation.id,
    phones: [] as Api.ExtraField[],
    emails: [] as Api.ExtraField[],
    extras: [] as Api.ExtraField[],
    isPrimary: false,
    isResponsible: false,
    order: 0,
    startDate: null as Date | null,
    endDate: null as Date | null,
    translations: useFormTranslatable<Api.ContactOrganisationTranslation, Partial<Api.ContactOrganisationTranslation>>(
      [],
      servicePlaceholder.contactOrganisation
    ),
  }
  const form = useForm({
    allowSubmitAttempt: true,
    values: initialValues,
    validate: validator({
      contactId: [min(1, _("contact-id-required"))],
    }),
    onSubmit: async ({ values }) => {
      const { contactId, startDate, endDate, ...rest } = values
      const payload = {
        ...rest,
        startDate: startDate ? startDate.toISOString() : null,
        endDate: endDate ? endDate.toISOString() : null,
      }

      return match(await service.id(contactId).organisations.create(payload))
        .with({ ok: true }, async ({ data }) => {
          Ui.toast.success(_("created"))
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
          <FormDirectory.Contact
            name='contactId'
            label={_("contact-label")}
            placeholder={_("contact-placeholder")}
            labelAside={<Form.Info title={_("contact-label")} content={_("contact-info")} />}
          />
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
    title: "Add contact to organisation",
    description: "Associate a contact with this organisation and define their role.",
    submit: "Add contact",
    created: "Contact added successfully",
    failed: "Failed to add contact",
    validation: "Some of your input is invalid. Please check your entries and try again.",
    "contact-label": "Contact",
    "contact-placeholder": "Select a contact",
    "contact-info": "The person to associate with this organisation",
  },
  fr: {
    title: "Ajouter un contact à l'organisation",
    description: "Associer un contact à cette organisation et définir son rôle.",
    submit: "Ajouter le contact",
    created: "Contact ajouté avec succès",
    failed: "Échec de l'ajout du contact",
    validation: "Certaines de vos entrées sont invalides. Veuillez vérifier vos entrées et réessayer.",
    "contact-label": "Contact",
    "contact-placeholder": "Sélectionnez un contact",
    "contact-info": "La personne à associer à cette organisation",
  },
  de: {
    title: "Kontakt zur Organisation hinzufügen",
    description: "Einen Kontakt mit dieser Organisation verknüpfen und seine Rolle definieren.",
    submit: "Kontakt hinzufügen",
    created: "Kontakt erfolgreich hinzugefügt",
    failed: "Kontakt konnte nicht hinzugefügt werden",
    validation: "Einige Ihrer Eingaben sind ungültig. Bitte überprüfen Sie Ihre Eingaben und versuchen Sie es erneut.",
    "contact-label": "Kontakt",
    "contact-placeholder": "Kontakt auswählen",
    "contact-info": "Die Person, die mit dieser Organisation verknüpft werden soll",
  },
}
