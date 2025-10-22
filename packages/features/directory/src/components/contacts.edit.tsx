import { extractFormFilePayload, Form, makeFormFileValue, useForm } from "@compo/form"
import { useTranslation } from "@compo/localize"
import {
  FormTranslatableContent,
  FormTranslatableTabs,
  useContextualLanguage,
  useFormTranslatable,
} from "@compo/translations"
import { Ui } from "@compo/ui"
import { match } from "@compo/utils"
import { placeholder as servicePlaceholder, type Api } from "@services/dashboard"
import React from "react"
import { useDirectoryService } from "../service.context"

/**
 * ContactsEditDialog
 */
export const ContactsEditDialog: React.FC<Ui.QuickDialogProps<Api.Contact>> = ({ item, ...props }) => {
  const { _ } = useTranslation(dictionary)
  return (
    <Ui.QuickDialog
      title={_("title")}
      description={_("description")}
      {...props}
      classNames={{ content: "sm:max-w-4xl", header: "z-10", close: "z-10" }}
      sticky
    >
      {item !== false && <DialogForm {...props} item={item} />}
    </Ui.QuickDialog>
  )
}

/**
 * DialogForm
 */
const DialogForm: React.FC<Ui.QuickDialogSafeProps<Api.Contact>> = ({ close, mutate, item }) => {
  const { _ } = useTranslation(dictionary)
  const { service, getImageUrl } = useDirectoryService()
  const { current } = useContextualLanguage()
  const initialValues = {
    firstName: item.firstName,
    lastName: item.lastName,
    politicalParty: item.politicalParty,
    portraitImage: makeFormFileValue(getImageUrl(item.portraitImage, "preview")),
    squareImage: makeFormFileValue(getImageUrl(item.squareImage, "preview")),
    phones: item.phones,
    emails: item.emails,
    extras: item.extras,
    translations: useFormTranslatable(item.translations, servicePlaceholder.contact),
  }
  const form = useForm({
    allowSubmitAttempt: true,
    values: initialValues,
    onSubmit: async ({ values }) => {
      const payload = {
        ...values,
        portraitImage: extractFormFilePayload(values.portraitImage),
        squareImage: extractFormFilePayload(values.squareImage),
      }
      return match(await service.id(item.id).update(payload))
        .with({ failed: true }, async ({ except }) =>
          match(except?.name)
            .with("E_VALIDATION_FAILURE", () => Ui.toast.error(_("validation")))
            .otherwise(() => Ui.toast.error(_("failed")))
        )
        .otherwise(async ({ data: { contact } }) => {
          Ui.toast.success(_("updated"))
          await mutate?.(contact)
          close()
        })
    },
  })

  return (
    <Form.Root form={form} className='space-y-4'>
      <Form.Assertive />
      <FormTranslatableTabs defaultLanguage={current.id}>
        <div className='space-y-6 pt-6'>
          {/* Personal information */}
          <Form.Header title={_("personal-title")} description={_("personal-description")} />
          <div className='grid grid-cols-2 gap-4'>
            <Form.Input
              name='firstName'
              label={_("first-name-label")}
              placeholder={_("first-name-placeholder")}
              labelAside={<Form.Info title={_("first-name-label")} content={_("first-name-info")} />}
            />
            <Form.Input
              name='lastName'
              label={_("last-name-label")}
              placeholder={_("last-name-placeholder")}
              labelAside={<Form.Info title={_("last-name-label")} content={_("last-name-info")} />}
            />
          </div>
          <Form.Input
            name='politicalParty'
            label={_("political-party-label")}
            placeholder={_("political-party-placeholder")}
            labelAside={<Form.Info title={_("political-party-label")} content={_("political-party-info")} />}
          />

          {/* Images */}
          <Form.Header title={_("images-title")} description={_("images-description")} />
          <div className='grid grid-cols-2 gap-4'>
            <Form.ImageWithCrop
              name='portraitImage'
              label={_("portrait-label")}
              cropAspect={3 / 4}
              aspect='aspect-[3/4]'
              cropShape='rect'
              classNames={{ input: "max-w-xs" }}
              labelAside={<Form.Info title={_("portrait-label")} content={_("portrait-info")} />}
            />

            <Form.ImageWithCrop
              name='squareImage'
              label={_("square-label")}
              cropAspect={1}
              aspect='aspect-square'
              cropShape='rect'
              classNames={{ input: "max-w-xs" }}
              labelAside={<Form.Info title={_("square-label")} content={_("square-info")} />}
            />
          </div>

          {/* Translatable content */}
          <Form.Header title={_("content-title")} description={_("content-description")} />
          <Form.Fields name='translations'>
            <FormTranslatableContent>
              {({ code }) => (
                <div className='space-y-6'>
                  <Form.Textarea
                    name='description'
                    label={_("description-label")}
                    placeholder={_("description-placeholder")}
                    lang={code}
                    rows={4}
                    labelAside={<Form.Localized title={_("description-label")} content={_("description-info")} />}
                  />
                  <Form.TextEditor
                    name='biography'
                    label={_("biography-label")}
                    lang={code}
                    labelAside={<Form.Localized title={_("biography-label")} content={_("biography-info")} />}
                  />
                </div>
              )}
            </FormTranslatableContent>
          </Form.Fields>

          {/* Contact information */}
          <Form.Header title={_("contacts-title")} description={_("contacts-description")} />
          <Form.ExtraFields
            name='emails'
            label={_("emails-label")}
            t={_.prefixed("emails")}
            type='email'
            labelAside={<Form.Info title={_("emails-label")} content={_("emails-info")} />}
          />
          <Form.ExtraFields
            name='phones'
            label={_("phones-label")}
            t={_.prefixed("phones")}
            type='phone'
            labelAside={<Form.Info title={_("phones-label")} content={_("phones-info")} />}
          />
          <Form.ExtraFields
            name='extras'
            label={_("extras-label")}
            t={_.prefixed("extras")}
            canChangeType
            types={["text", "email", "phone", "url"]}
            labelAside={<Form.Info title={_("extras-label")} content={_("extras-info")} />}
          />
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
    title: "Edit contact",
    description: "Update the selected contact.",
    submit: "Save changes",
    updated: "Contact updated successfully",
    failed: "Failed to update contact",
    validation: "Some of your input is invalid. Please check your entries and try again.",
    "personal-title": "Personal information",
    "personal-description": "Basic information about the contact",
    "first-name-label": "First name",
    "first-name-placeholder": "Enter the first name",
    "first-name-info": "The contact's first name",
    "last-name-label": "Last name",
    "last-name-placeholder": "Enter the last name",
    "last-name-info": "The contact's last name",
    "political-party-label": "Political party",
    "political-party-placeholder": "Enter the political party",
    "political-party-info": "The contact's political party affiliation (if applicable)",
    "images-title": "Photos",
    "images-description": "Contact images",
    "portrait-label": "Portrait photo",
    "portrait-info": "Portrait format photo (3:4 ratio, recommended size: 600x800px)",
    "square-label": "Square photo",
    "square-info": "Square format photo (1:1 ratio, recommended size: 600x600px)",
    "content-title": "Description",
    "content-description": "Detailed information about the contact",
    "description-label": "Short description",
    "description-placeholder": "Enter a short description",
    "description-info": "A brief description of the contact",
    "biography-label": "Biography",
    "biography-info": "Detailed biography of the contact",
    "contacts-title": "Contact information",
    "contacts-description": "Ways to contact this person",
    "emails-label": "Email addresses",
    "emails-info": "Email addresses for contacting the person",
    emails: {
      "name-placeholder": "Label",
      "name-default": "Email",
      "value-placeholder": "email@example.com",
      "value-default": "",
      "button-add": "Add an email address",
      "button-delete": "Delete this email address",
    },
    "phones-label": "Phone numbers",
    "phones-info": "Phone numbers for contacting the person",
    phones: {
      "name-placeholder": "Label",
      "name-default": "Phone",
      "value-placeholder": "+352 123 456",
      "value-default": "",
      "button-add": "Add a phone number",
      "button-delete": "Delete this phone number",
    },
    "extras-label": "Additional information",
    "extras-info": "Other contact details or information",
    extras: {
      "name-placeholder": "Label",
      "name-default": "",
      "value-placeholder": "Enter the value",
      "value-default": "",
      "button-add": "Add some additional information",
      "button-delete": "Delete this additional information",
    },
  },
  fr: {
    title: "Modifier le contact",
    description: "Mettre à jour le contact sélectionné.",
    submit: "Enregistrer les modifications",
    updated: "Contact mis à jour avec succès",
    failed: "Échec de la mise à jour du contact",
    validation: "Certaines de vos entrées sont invalides. Veuillez vérifier vos entrées et réessayer.",
    "personal-title": "Informations personnelles",
    "personal-description": "Informations de base sur le contact",
    "first-name-label": "Prénom",
    "first-name-placeholder": "Saisissez le prénom",
    "first-name-info": "Le prénom du contact",
    "last-name-label": "Nom",
    "last-name-placeholder": "Saisissez le nom",
    "last-name-info": "Le nom de famille du contact",
    "political-party-label": "Parti politique",
    "political-party-placeholder": "Saisissez le parti politique",
    "political-party-info": "L'affiliation politique du contact (si applicable)",
    "images-title": "Photos",
    "images-description": "Images du contact",
    "portrait-label": "Photo portrait",
    "portrait-info": "Photo format portrait (ratio 3:4, taille recommandée : 600x800px)",
    "square-label": "Photo carrée",
    "square-info": "Photo format carré (ratio 1:1, taille recommandée : 600x600px)",
    "content-title": "Description",
    "content-description": "Informations détaillées sur le contact",
    "description-label": "Description courte",
    "description-placeholder": "Saisissez une description courte",
    "description-info": "Une brève description du contact",
    "biography-label": "Biographie",
    "biography-info": "Biographie détaillée du contact",
    "contacts-title": "Informations de contact",
    "contacts-description": "Moyens de contacter cette personne",
    "emails-label": "Adresses e-mail",
    "emails-info": "Adresses e-mail pour contacter la personne",
    emails: {
      "name-placeholder": "Label",
      "name-default": "E-mail",
      "value-placeholder": "email@example.com",
      "value-default": "",
      "button-add": "Ajouter une adresse e-mail",
      "button-delete": "Supprimer cette adresse e-mail",
    },
    "phones-label": "Numéros de téléphone",
    "phones-info": "Numéros de téléphone pour contacter la personne",
    phones: {
      "name-placeholder": "Label",
      "name-default": "Téléphone",
      "value-placeholder": "+352 123 456",
      "value-default": "",
      "button-add": "Ajouter un numéro de téléphone",
      "button-delete": "Supprimer ce numéro de téléphone",
    },
    "extras-label": "Informations supplémentaires",
    "extras-info": "Autres coordonnées ou informations",
    extras: {
      "name-placeholder": "Label",
      "name-default": "",
      "value-placeholder": "Saisissez la valeur",
      "value-default": "",
      "button-add": "Ajouter une information supplémentaire",
      "button-delete": "Supprimer cette information supplémentaire",
    },
  },
  de: {
    title: "Kontakt bearbeiten",
    description: "Den ausgewählten Kontakt aktualisieren.",
    submit: "Änderungen speichern",
    updated: "Kontakt erfolgreich aktualisiert",
    failed: "Kontakt konnte nicht aktualisiert werden",
    validation: "Einige Ihrer Eingaben sind ungültig. Bitte überprüfen Sie Ihre Eingaben und versuchen Sie es erneut.",
    "personal-title": "Persönliche Informationen",
    "personal-description": "Grundlegende Informationen über den Kontakt",
    "first-name-label": "Vorname",
    "first-name-placeholder": "Geben Sie den Vornamen ein",
    "first-name-info": "Der Vorname des Kontakts",
    "last-name-label": "Nachname",
    "last-name-placeholder": "Geben Sie den Nachnamen ein",
    "last-name-info": "Der Nachname des Kontakts",
    "political-party-label": "Politische Partei",
    "political-party-placeholder": "Geben Sie die politische Partei ein",
    "political-party-info": "Die politische Parteizugehörigkeit des Kontakts (falls zutreffend)",
    "images-title": "Fotos",
    "images-description": "Kontaktbilder",
    "portrait-label": "Porträtfoto",
    "portrait-info": "Foto im Hochformat (Verhältnis 3:4, empfohlene Größe: 600x800px)",
    "square-label": "Quadratisches Foto",
    "square-info": "Foto im quadratischen Format (Verhältnis 1:1, empfohlene Größe: 600x600px)",
    "content-title": "Beschreibung",
    "content-description": "Detaillierte Informationen über den Kontakt",
    "description-label": "Kurzbeschreibung",
    "description-placeholder": "Geben Sie eine Kurzbeschreibung ein",
    "description-info": "Eine kurze Beschreibung des Kontakts",
    "biography-label": "Biografie",
    "biography-info": "Detaillierte Biografie des Kontakts",
    "contacts-title": "Kontaktinformationen",
    "contacts-description": "Möglichkeiten, diese Person zu kontaktieren",
    "emails-label": "E-Mail-Adressen",
    "emails-info": "E-Mail-Adressen zur Kontaktaufnahme mit der Person",
    emails: {
      "name-placeholder": "Bezeichnung",
      "name-default": "E-Mail",
      "value-placeholder": "email@example.com",
      "value-default": "",
      "button-add": "E-Mail-Adresse hinzufügen",
      "button-delete": "Diese E-Mail-Adresse löschen",
    },
    "phones-label": "Telefonnummern",
    "phones-info": "Telefonnummern zur Kontaktaufnahme mit der Person",
    phones: {
      "name-placeholder": "Bezeichnung",
      "name-default": "Telefon",
      "value-placeholder": "+352 123 456",
      "value-default": "",
      "button-add": "Telefonnummer hinzufügen",
      "button-delete": "Diese Telefonnummer löschen",
    },
    "extras-label": "Zusätzliche Informationen",
    "extras-info": "Weitere Kontaktdaten oder Informationen",
    extras: {
      "name-placeholder": "Bezeichnung",
      "name-default": "",
      "value-placeholder": "Geben Sie den Wert ein",
      "value-default": "",
      "button-add": "Zusätzliche Information hinzufügen",
      "button-delete": "Diese zusätzliche Information löschen",
    },
  },
}
