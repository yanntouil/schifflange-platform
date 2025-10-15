import { authStore, useAuth } from "@/features/auth"
import { Api, service } from "@/services"
import { extractFormFilePayload, Form, makeFormFileValue, useForm, useFormDirty } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { D, T } from "@compo/utils"
import { ImageDownIcon } from "lucide-react"
import React from "react"
import { AuthDialogContent } from "./content"
import { AuthDialogFooter } from "./footer"
import { AuthDialogHeader } from "./header"

export type AuthDialogTabProfile = {
  type: "profile"
  params: {}
}

/**
 * dialog profile
 * this component is used to display the profile tab in the auth dialog
 */
export const AuthDialogProfile: React.FC<{ tab: AuthDialogTabProfile }> = ({ tab }) => {
  const { _ } = useTranslation(dictionary)
  const { me } = useAuth()

  const initialValues = makeValuesFromUser(me)
  const form = useForm({
    values: initialValues,
    onSubmit: async ({ values }) => {
      const payload = {
        image: extractFormFilePayload(values.image),
        dob: values.dob ? T.formatISO(values.dob) : null,
        ...D.deleteKeys(values, ["image", "dob"]),
      }
      const res = await authStore.actions.updateProfile(payload)
      if (res.ok) {
        // reset the form
        form.setValues(makeValuesFromUser(res.data.user))
      } else {
        Ui.toast.error(_("error-unknown"))
      }
    },
  })
  const [isDirty] = useFormDirty(form, initialValues)
  return (
    <>
      <AuthDialogHeader title={_("title")} description={_("description")} sticky />
      <Form.Root form={form}>
        <AuthDialogContent className="@container space-y-6 pb-6">
          <Form.Alert variant="info">
            <p>{_("info")}</p>
          </Form.Alert>

          {/* personal information */}
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 @md:grid-cols-[16rem_1fr]">
            <div>
              <Form.Image name="image" aspect="aspect-square">
                <ImageDownIcon className="text-muted-foreground size-10 stroke-[1]" aria-hidden />
              </Form.Image>
            </div>
            <div className="space-y-6">
              <Form.Input name="firstname" label={_("firstname-label")} placeholder={_("firstname-placeholder")} />
              <Form.Input name="lastname" label={_("lastname-label")} placeholder={_("lastname-placeholder")} />
              <Form.Date name="dob" label={_("dob-label")} placeholder={_("dob-placeholder")} />
            </div>
          </div>

          {/* professional information */}
          <Form.CollapsibleSection
            persistedKey="professional-information"
            level={2}
            title={_("profession-title")}
            description={_("profession-description")}
            defaultOpen={false}
          >
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 @md:grid-cols-2">
              <Form.Input name="company" label={_("company-label")} placeholder={_("company-placeholder")} />
              <Form.Input name="position" label={_("position-label")} placeholder={_("position-placeholder")} />
            </div>
          </Form.CollapsibleSection>

          {/* contact information */}
          <Form.CollapsibleSection
            persistedKey="contact-information"
            level={2}
            title={_("contact-title")}
            description={_("contact-description")}
            defaultOpen={false}
          >
            <Form.ExtraFields name="emails" label={_("emails-label")} t={_.prefixed("emails")} />
            <Form.ExtraFields name="phones" label={_("phones-label")} t={_.prefixed("phones")} />
            <Form.ExtraFields name="extras" label={_("extras-label")} t={_.prefixed("extras")} />
          </Form.CollapsibleSection>

          {/* address */}
          <Form.CollapsibleSection
            persistedKey="address-information"
            level={2}
            title={_("address-title")}
            description={_("address-description")}
            defaultOpen={false}
          >
            <Form.Fields name="address">
              <div className="grid grid-cols-1 gap-x-8 gap-y-6 @md:grid-cols-2">
                <Form.Input
                  label={_("street-label")}
                  placeholder={_("street-placeholder")}
                  name="street"
                  classNames={{ item: "@md:col-span-2" }}
                />
                <Form.Input label={_("zip-label")} placeholder={_("zip-placeholder")} name="zip" />
                <Form.Input label={_("city-label")} placeholder={_("city-placeholder")} name="city" />
                <Form.Input label={_("state-label")} placeholder={_("state-placeholder")} name="state" />
                <Form.Input label={_("country-label")} placeholder={_("country-placeholder")} name="country" />
              </div>
            </Form.Fields>
          </Form.CollapsibleSection>
        </AuthDialogContent>
        {isDirty && (
          <AuthDialogFooter sticky>
            <Ui.Button type="submit">{_("submit")}</Ui.Button>
            <Ui.Button variant="ghost" type="button" onClick={() => form.reset()}>
              {_("cancel")}
            </Ui.Button>
          </AuthDialogFooter>
        )}
      </Form.Root>
    </>
  )
}

const makeValuesFromUser = (user: Api.User) => {
  const initialValues = {
    lastname: user.profile.lastname,
    firstname: user.profile.firstname,
    company: user.profile.company,
    position: user.profile.position,
    emails: user.profile.emails,
    phones: user.profile.phones,
    extras: user.profile.extras,
    address: user.profile.address,
    dob: user.profile.dob,
    image: makeFormFileValue(service.getImageUrl(user.profile.image, "preview")),
  }
  return initialValues
}

/**
 * translations
 */
const dictionary = {
  en: {
    title: "Profile",
    description: "Manage your profile settings and preferences.",
    info: "These informations are public and not required, they will allow you to identify yourself to other members of your workspaces as well as when sharing your information with other users.",
    "image-label": "Profile image",
    "firstname-label": "First name",
    "firstname-placeholder": "Enter your first name",
    "lastname-label": "Last name",
    "lastname-placeholder": "Enter your last name",
    "dob-label": "Date of birth",
    "dob-placeholder": "Select your date of birth",
    "profession-title": "Professional information",
    "profession-description": "Tell us where you work and what you do.",
    "company-label": "Company",
    "company-placeholder": "Enter the name of your company",
    "position-label": "Position",
    "position-placeholder": "Enter your position",
    "contact-title": "Contact",
    "contact-description": "Add ways for others to get in touch with you.",
    "emails-label": "Emails",
    emails: {
      "name-placeholder": "Email name",
      "name-default": "Email",
      "value-placeholder": "email@website.com",
      "value-default": "",
      "button-add": "Add email",
      "button-delete": "Delete email",
    },
    "phones-label": "Phones",
    phones: {
      "name-placeholder": "Phone name",
      "name-default": "Phone",
      "value-placeholder": "+352 23 56 89",
      "value-default": "",
      "button-add": "Add phone",
      "button-delete": "Delete phone",
    },
    "extras-label": "Extras",
    extras: {
      "name-placeholder": "Extra name",
      "name-default": "",
      "value-placeholder": "Extra value",
      "value-default": "",
      "button-add": "Add extra",
      "button-delete": "Delete extra",
    },
    "address-title": "Address",
    "address-description": "Provide your complete address.",
    "street-label": "Street",
    "street-placeholder": "Enter your street",
    "zip-label": "Zip code",
    "zip-placeholder": "Enter your zip code",
    "city-label": "City",
    "city-placeholder": "Enter your city",
    "state-label": "State",
    "state-placeholder": "Enter your state",
    "country-label": "Country",
    "country-placeholder": "Enter your country",
    submit: "Save",
    cancel: "Cancel",
    "error-unknown": "An error occurred while updating your profile.",
  },
  fr: {
    title: "Profil",
    description: "Gérer vos paramètres et préférences de profil.",
    info: "Ces informations sont publiques et ne sont pas obligatoires, elles vous permettront de vous identifier auprès des autres membres de vos espaces de travail ainsi que lors des partages de vos informations avec d'autres utilisateurs.",
    "image-label": "Image de profil",
    "firstname-label": "Prénom",
    "firstname-placeholder": "Entrez votre prénom",
    "lastname-label": "Nom",
    "lastname-placeholder": "Entrez votre nom",
    "dob-label": "Date de naissance",
    "dob-placeholder": "Sélectionnez votre date de naissance",
    "profession-title": "Informations professionnelles",
    "profession-description": "Fournissez vos détails professionnels et votre poste actuel.",
    "company-label": "Entreprise",
    "company-placeholder": "Entrez le nom de votre entreprise",
    "position-label": "Fonction",
    "position-placeholder": "Entrez votre fonction",
    "contact-title": "Contact",
    "contact-description": "Fournissez vos coordonnées de contact.",
    "emails-label": "Emails",
    emails: {
      "name-placeholder": "Nom de l'email",
      "name-default": "Email",
      "value-placeholder": "email@website.lu",
      "value-default": "",
      "button-add": "Ajouter un email",
      "button-delete": "Supprimer cet email",
    },
    "phones-label": "Téléphone",
    phones: {
      "name-placeholder": "Nom du téléphone",
      "name-default": "Téléphone",
      "value-placeholder": "(+352) 23 56 89",
      "value-default": "",
      "button-add": "Ajouter un téléphone",
      "button-delete": "Supprimer ce téléphone",
    },
    "extras-label": "Extras",
    extras: {
      "name-placeholder": "Titre du champs",
      "name-default": "",
      "value-placeholder": "Contenu du champs",
      "value-default": "",
      "button-add": "Ajouter un champs supplémentaire",
      "button-delete": "Supprimer ce champs supplémentaire",
    },
    "address-title": "Adresse",
    "address-description": "Fournissez votre adresse complète.",
    "street-label": "Rue",
    "street-placeholder": "Entrez votre rue",
    "zip-label": "Code postal",
    "zip-placeholder": "Entrez votre code postal",
    "city-label": "Ville",
    "city-placeholder": "Entrez votre ville",
    "state-label": "Département",
    "state-placeholder": "Entrez votre département",
    "country-label": "Pays",
    "country-placeholder": "Entrez votre pays",
    submit: "Enregistrer",
    cancel: "Annuler",
    "error-unknown": "Une erreur est survenue lors de la mise à jour de votre profil.",
  },
  de: {
    title: "Profil",
    description: "Verwalten Sie Ihre Profileinstellungen und Präferenzen.",
    info: "Diese Informationen sind öffentlich und nicht verpflichtend. Sie ermöglichen es Ihnen, sich gegenüber anderen Mitgliedern Ihrer Arbeitsbereiche zu identifizieren sowie beim Teilen Ihrer Informationen mit anderen Benutzern.",
    "image-label": "Profilbild",
    "firstname-label": "Vorname",
    "firstname-placeholder": "Geben Sie Ihren Vornamen ein",
    "lastname-label": "Nachname",
    "lastname-placeholder": "Geben Sie Ihren Nachnamen ein",
    "dob-label": "Geburtsdatum",
    "dob-placeholder": "Wählen Sie Ihr Geburtsdatum",
    "profession-title": "Berufliche Informationen",
    "profession-description": "Erzählen Sie uns, wo Sie arbeiten und was Sie tun.",
    "company-label": "Unternehmen",
    "company-placeholder": "Geben Sie den Namen Ihres Unternehmens ein",
    "position-label": "Position",
    "position-placeholder": "Geben Sie Ihre Position ein",
    "contact-title": "Kontakt",
    "contact-description": "Fügen Sie Wege hinzu, wie andere Sie kontaktieren können.",
    "emails-label": "E-Mails",
    emails: {
      "name-placeholder": "E-Mail-Name",
      "name-default": "E-Mail",
      "value-placeholder": "email@website.de",
      "value-default": "",
      "button-add": "E-Mail hinzufügen",
      "button-delete": "E-Mail löschen",
    },
    "phones-label": "Telefone",
    phones: {
      "name-placeholder": "Telefon-Name",
      "name-default": "Telefon",
      "value-placeholder": "+49 30 12345678",
      "value-default": "",
      "button-add": "Telefon hinzufügen",
      "button-delete": "Telefon löschen",
    },
    "extras-label": "Extras",
    extras: {
      "name-placeholder": "Extra-Name",
      "name-default": "",
      "value-placeholder": "Extra-Wert",
      "value-default": "",
      "button-add": "Extra hinzufügen",
      "button-delete": "Extra löschen",
    },
    "address-title": "Adresse",
    "address-description": "Geben Sie Ihre vollständige Adresse an.",
    "street-label": "Straße",
    "street-placeholder": "Geben Sie Ihre Straße ein",
    "zip-label": "Postleitzahl",
    "zip-placeholder": "Geben Sie Ihre Postleitzahl ein",
    "city-label": "Stadt",
    "city-placeholder": "Geben Sie Ihre Stadt ein",
    "state-label": "Bundesland",
    "state-placeholder": "Geben Sie Ihr Bundesland ein",
    "country-label": "Land",
    "country-placeholder": "Geben Sie Ihr Land ein",
    submit: "Speichern",
    cancel: "Abbrechen",
    "error-unknown": "Ein Fehler ist beim Aktualisieren Ihres Profils aufgetreten.",
  },
}
