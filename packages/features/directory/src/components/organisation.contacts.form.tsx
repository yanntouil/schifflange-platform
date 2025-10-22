import { Form } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { FormTranslatableContent } from "@compo/translations"
import React from "react"

/**
 * OrganisationContactsForm
 */
export const OrganisationContactsForm: React.FC = () => {
  const { _ } = useTranslation(dictionary)

  return (
    <>
      <div className='space-y-6 pt-6'>
        <Form.Fields name='translations'>
          <FormTranslatableContent>
            {({ code }) => (
              <div className='space-y-6'>
                <Form.Input
                  name='role'
                  label={_("role-label")}
                  placeholder={_("role-placeholder")}
                  lang={code}
                  labelAside={<Form.Localized title={_("role-label")} content={_("role-info")} />}
                />
                <Form.TextEditor
                  name='roleDescription'
                  label={_("role-description-label")}
                  lang={code}
                  labelAside={
                    <Form.Localized title={_("role-description-label")} content={_("role-description-info")} />
                  }
                />
              </div>
            )}
          </FormTranslatableContent>
        </Form.Fields>
        <div className='grid @lg:grid-cols-2 gap-x-8'>
          <Form.Date
            label={_("start-date-label")}
            name='startDate'
            placeholder={_("start-date-placeholder")}
            labelAside={<Form.Info title={_("start-date-label")} content={_("start-date-info")} />}
          />
          <Form.Date
            label={_("end-date-label")}
            name='endDate'
            placeholder={_("end-date-placeholder")}
            labelAside={<Form.Info title={_("end-date-label")} content={_("end-date-info")} />}
          />
        </div>
        <div className='grid @lg:grid-cols-2 gap-x-8'>
          <Form.Switch
            label={_("is-primary-label")}
            name='isPrimary'
            labelAside={<Form.Info title={_("is-primary-label")} content={_("is-primary-info")} />}
          />
          <Form.Switch
            label={_("is-responsible-label")}
            name='isResponsible'
            labelAside={<Form.Info title={_("is-responsible-label")} content={_("is-responsible-info")} />}
          />
        </div>

        {/* contacts */}
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
        {/* Metadata */}
        <Form.Header title={_("metadata-title")} description={_("metadata-description")} />
        <div className='grid @lg:grid-cols-2 gap-x-8'>
          <Form.Number
            name='order'
            label={_("order-label")}
            labelAside={<Form.Info title={_("order-label")} content={_("order-info")} />}
          />
        </div>
      </div>
    </>
  )
}

/**
 * dictionaries
 */
const dictionary = {
  en: {
    "role-label": "Role in the organisation",
    "role-placeholder": "Enter the role",
    "role-info": "The role or position of the contact within this organisation (e.g., President, Secretary, Member)",
    "role-description-label": "Role description",
    "role-description-info": "Detailed description of the contact's responsibilities and role within the organisation",
    "start-date-label": "Entry date",
    "start-date-placeholder": "Select entry date",
    "start-date-info": "Date when the contact joined this organisation in this role",
    "end-date-label": "Exit date",
    "end-date-placeholder": "Select exit date",
    "end-date-info": "Date when the contact left this role (leave empty if still active)",
    "metadata-title": "Settings",
    "metadata-description": "Contact relationship settings",
    "is-primary-label": "Primary contact of the organisation",
    "is-primary-info": "Mark this person as the primary contact for this organisation",
    "is-responsible-label": "Responsible person",
    "is-responsible-info": "Mark this contact as a responsible person for this organisation",
    "order-label": "Display order",
    "order-info": "Order in which this contact appears in lists (lower numbers appear first)",
    "contacts-title": "Contact information",
    "contacts-description": "Specific contact details for this role (overrides the contact's default information)",
    "emails-label": "Email addresses",
    "emails-info": "Email addresses specific to this role",
    emails: { add: "Add email", label: "Label", value: "Email address" },
    "phones-label": "Phone numbers",
    "phones-info": "Phone numbers specific to this role",
    phones: { add: "Add phone", label: "Label", value: "Phone number" },
    "extras-label": "Additional fields",
    "extras-info": "Additional contact information (website, social media, etc.)",
    extras: { add: "Add field", label: "Label", value: "Value", type: "Type" },
  },
  fr: {
    "role-label": "Rôle dans l'organisation",
    "role-placeholder": "Saisissez le rôle",
    "role-info": "Le rôle ou la position du contact au sein de cette organisation (ex: Président, Secrétaire, Membre)",
    "role-description-label": "Description du rôle",
    "role-description-info":
      "Description détaillée des responsabilités et du rôle du contact au sein de l'organisation",
    "start-date-label": "Date d'entrée",
    "start-date-placeholder": "Sélectionnez la date d'entrée",
    "start-date-info": "Date à laquelle le contact a rejoint cette organisation dans ce rôle",
    "end-date-label": "Date de sortie",
    "end-date-placeholder": "Sélectionnez la date de sortie",
    "end-date-info": "Date à laquelle le contact a quitté ce rôle (laissez vide si toujours actif)",
    "metadata-title": "Paramètres",
    "metadata-description": "Paramètres de la relation avec le contact",
    "is-primary-label": "Contact principal de l'organisation",
    "is-primary-info": "Marquer cette personne comme contact principal de cette organisation",
    "is-responsible-label": "Personne responsable",
    "is-responsible-info": "Marquer ce contact comme personne responsable de cette organisation",
    "order-label": "Ordre d'affichage",
    "order-info": "Ordre d'apparition de ce contact dans les listes (les numéros inférieurs apparaissent en premier)",
    "contacts-title": "Informations de contact",
    "contacts-description": "Coordonnées spécifiques à ce rôle (remplacent les informations par défaut du contact)",
    "emails-label": "Adresses e-mail",
    "emails-info": "Adresses e-mail spécifiques à ce rôle",
    emails: { add: "Ajouter un e-mail", label: "Libellé", value: "Adresse e-mail" },
    "phones-label": "Numéros de téléphone",
    "phones-info": "Numéros de téléphone spécifiques à ce rôle",
    phones: { add: "Ajouter un téléphone", label: "Libellé", value: "Numéro de téléphone" },
    "extras-label": "Champs supplémentaires",
    "extras-info": "Informations de contact supplémentaires (site web, réseaux sociaux, etc.)",
    extras: { add: "Ajouter un champ", label: "Libellé", value: "Valeur", type: "Type" },
  },
  de: {
    "role-label": "Rolle in der Organisation",
    "role-placeholder": "Rolle eingeben",
    "role-info":
      "Die Rolle oder Position des Kontakts innerhalb dieser Organisation (z.B. Präsident, Sekretär, Mitglied)",
    "role-description-label": "Rollenbeschreibung",
    "role-description-info":
      "Detaillierte Beschreibung der Verantwortlichkeiten und Rolle des Kontakts innerhalb der Organisation",
    "start-date-label": "Eintrittsdatum",
    "start-date-placeholder": "Eintrittsdatum auswählen",
    "start-date-info": "Datum, an dem der Kontakt dieser Organisation in dieser Rolle beigetreten ist",
    "end-date-label": "Austrittsdatum",
    "end-date-placeholder": "Austrittsdatum auswählen",
    "end-date-info": "Datum, an dem der Kontakt diese Rolle verlassen hat (leer lassen, wenn noch aktiv)",
    "metadata-title": "Einstellungen",
    "metadata-description": "Einstellungen der Kontaktbeziehung",
    "is-primary-label": "Hauptkontakt der Organisation",
    "is-primary-info": "Diese Person als Hauptkontakt für diese Organisation markieren",
    "is-responsible-label": "Verantwortliche Person",
    "is-responsible-info": "Diesen Kontakt als verantwortliche Person für diese Organisation markieren",
    "order-label": "Anzeigereihenfolge",
    "order-info": "Reihenfolge, in der dieser Kontakt in Listen erscheint (niedrigere Zahlen erscheinen zuerst)",
    "contacts-title": "Kontaktinformationen",
    "contacts-description":
      "Spezifische Kontaktdaten für diese Rolle (überschreiben die Standardinformationen des Kontakts)",
    "emails-label": "E-Mail-Adressen",
    "emails-info": "E-Mail-Adressen spezifisch für diese Rolle",
    emails: { add: "E-Mail hinzufügen", label: "Bezeichnung", value: "E-Mail-Adresse" },
    "phones-label": "Telefonnummern",
    "phones-info": "Telefonnummern spezifisch für diese Rolle",
    phones: { add: "Telefon hinzufügen", label: "Bezeichnung", value: "Telefonnummer" },
    "extras-label": "Zusätzliche Felder",
    "extras-info": "Zusätzliche Kontaktinformationen (Website, soziale Medien usw.)",
    extras: { add: "Feld hinzufügen", label: "Bezeichnung", value: "Wert", type: "Typ" },
  },
}
