import { Form, FormSimpleFileType, useFormContext } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { FormTranslatableContent, FormTranslatableTabs, useContextualLanguage } from "@compo/translations"
import { A, D } from "@compo/utils"
import { type Api } from "@services/dashboard"
import { ExtraField } from "@services/dashboard/src/types"
import React from "react"
import { useCategoryOptions } from "../hooks/use-category-options"
import { organisationTypes, useTypeOptions } from "../hooks/use-type-options"
import { useDirectoryService } from "../service.context"
import { FormDirectory } from "./form"
import { OrganisationAddress } from "./form/addresses"

/**
 * OrganisationsForm
 */
export const OrganisationsForm: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { organisationType } = useDirectoryService()
  const { current } = useContextualLanguage()
  const { values, setValues } = useFormContext<OrganisationsFormValues>()

  const typeOptions = useTypeOptions()

  const [categoryOptions] = useCategoryOptions(values.type)

  /**
   * State to preserve categories per type
   * Initializes an object with all organisation types as keys
   * Only the current type (item.type) contains existing categories,
   * other types are initialized with empty arrays
   */
  const [categoriesByType, setCategoriesByType] = React.useState(() =>
    A.reduce(organisationTypes, {} as Record<Api.OrganisationType, string[]>, (acc, type) =>
      D.set(acc, type, values.type === type ? values.categoryIds : [])
    )
  )

  /**
   * Handle category preservation when type changes
   * typeRef keeps track of the previous type to detect changes
   */
  const typeRef = React.useRef(values.type)
  React.useEffect(() => {
    // If type hasn't changed, do nothing (prevents infinite loops)
    const prevType = typeRef.current
    const newType = values.type
    if (prevType === newType) return
    typeRef.current = newType

    // Save current categories for the previous type before switching
    const currentCategories = [...values.categoryIds]
    const prevCategories = D.get(categoriesByType, prevType) ?? []
    const hasChanged = !A.every(currentCategories, (id) => A.includes(prevCategories, id))
    if (hasChanged) {
      setCategoriesByType((prev) => D.set(prev, prevType, currentCategories))
    }

    // Restore saved categories for the new type (or [] if none)
    setValues({ categoryIds: D.get(categoriesByType, newType) ?? [] })
  }, [values.type, values.categoryIds, setValues, categoriesByType])

  return (
    <FormTranslatableTabs defaultLanguage={current.id}>
      <div className='space-y-6 pt-6'>
        <Form.Fields name='translations'>
          <FormTranslatableContent>
            {({ code }) => (
              <div className='space-y-6'>
                <Form.Input
                  name='name'
                  label={_("name-label")}
                  placeholder={_("name-placeholder")}
                  lang={code}
                  labelAside={<Form.Localized title={_("name-label")} content={_("name-info")} />}
                />
                <Form.Textarea
                  name='shortDescription'
                  label={_("short-description-label")}
                  lang={code}
                  rows={2}
                  labelAside={
                    <Form.Localized title={_("short-description-label")} content={_("short-description-info")} />
                  }
                />
                <Form.TextEditor
                  name='description'
                  label={_("description-label")}
                  placeholder={_("description-placeholder")}
                  lang={code}
                  labelAside={<Form.Localized title={_("description-label")} content={_("description-info")} />}
                  prose='prose dark:prose-invert'
                />
              </div>
            )}
          </FormTranslatableContent>
        </Form.Fields>

        {/* metadata */}
        <Form.Header title={_("metadata-title")} description={_("metadata-description")} />
        <Form.Select
          label={_("type-label")}
          name='type'
          options={typeOptions}
          labelAside={<Form.Info title={_("type-label")} content={_("type-info")} />}
        />
        {/* {G.isNullable(organisationType) && ()} */}
        <Form.SelectMultiple
          label={_("categories-label")}
          name='categoryIds'
          placeholder={_("categories-placeholder")}
          noResultsFound={_("categories-empty")}
          options={categoryOptions}
          labelAside={<Form.Info title={_("categories-label")} content={_("categories-info")} />}
        />
        <Form.Image
          name='logoImage'
          label={_("logo-label")}
          aspect='aspect-square'
          classNames={{ input: "max-w-xs" }}
          labelAside={<Form.Info title={_("logo-label")} content={_("logo-info")} />}
        />
        <Form.Image
          name='cardImage'
          label={_("card-label")}
          aspect='aspect-video'
          classNames={{ input: "max-w-lg" }}
          labelAside={<Form.Info title={_("card-label")} content={_("card-info")} />}
        />

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
        <FormDirectory.Addresses
          name='addresses'
          label={_("addresses-label")}
          labelAside={<Form.Info title={_("addresses-label")} content={_("addresses-info")} />}
        />
      </div>
    </FormTranslatableTabs>
  )
}

/**
 * OrganisationsFormValues
 */
export type OrganisationsFormValues = {
  logoImage: FormSimpleFileType
  cardImage: FormSimpleFileType
  type: Api.OrganisationType
  phones: ExtraField[]
  emails: ExtraField[]
  extras: ExtraField[]
  addresses: OrganisationAddress[]
  categoryIds: string[]
  translations: Record<string, Api.OrganisationTranslation>
}

/**
 * dictionaries
 */
const dictionary = {
  en: {
    "name-label": "Organisation name",
    "name-placeholder": "Enter the organisation name",
    "name-info": "The official name of the organisation",
    "description-label": "Description",
    "description-placeholder": "Enter a description",
    "description-info": "A detailed description of the organisation",
    "short-description-label": "Short description",
    "short-description-info": "A brief summary of the organisation (displayed on cards)",
    "metadata-title": "Metadata",
    "metadata-description": "Additional information about the organisation",
    "categories-label": "Categories",
    "categories-placeholder": "Select categories",
    "categories-empty": "No category available for this type",
    "categories-info": "Select one or more categories for this organisation",
    "type-label": "Organisation type",
    "type-info": "The type of organisation (e.g., municipality, service, association, commission, company)",
    "logo-label": "Logo",
    "logo-info": "The organisation's logo (square format, will be displayed at 256x256px)",
    "card-label": "Card image",
    "card-info": "Image displayed on the organisation card (16:9 format, recommended size: 1280x720px)",
    "contacts-title": "Contact information",
    "contacts-description": "Ways to contact the organisation",
    "emails-label": "Email addresses",
    "emails-info": "Email addresses for contacting the organisation",
    emails: {
      "name-placeholder": "Label",
      "name-default": "Email",
      "value-placeholder": "email@website.com",
      "value-default": "",
      "button-add": "Add an email address",
      "button-delete": "Delete this email address",
    },
    "phones-label": "Phone numbers",
    "phones-info": "Phone numbers for contacting the organisation",
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
    "addresses-label": "Addresses",
    "addresses-info": "Physical addresses of the organisation",
  },
  fr: {
    "name-label": "Nom de l'organisation",
    "name-placeholder": "Saisissez le nom de l'organisation",
    "name-info": "Le nom officiel de l'organisation",
    "description-label": "Description",
    "description-placeholder": "Saisissez une description",
    "description-info": "Une description détaillée de l'organisation",
    "short-description-label": "Description courte",
    "short-description-info": "Un résumé bref de l'organisation (affiché sur les cartes)",
    "metadata-title": "Métadonnées",
    "metadata-description": "Informations supplémentaires sur l'organisation",
    "categories-label": "Catégories",
    "categories-placeholder": "Sélectionnez les catégories",
    "categories-empty": "Aucune categorie disponible pour ce type",
    "categories-info": "Sélectionnez une ou plusieurs catégories pour cette organisation",
    "type-label": "Type d'organisation",
    "type-info": "Le type d'organisation (ex : commune, service communal, association, commission, entreprise)",
    "logo-label": "Logo",
    "logo-info": "Le logo de l'organisation (format carré, sera affiché en 256x256px)",
    "card-label": "Image de carte",
    "card-info": "Image affichée sur la carte de l'organisation (format 16:9, taille recommandée : 1280x720px)",
    "contacts-title": "Informations de contact",
    "contacts-description": "Moyens de contacter l'organisation",
    "emails-label": "Adresses e-mail",
    "emails-info": "Adresses e-mail pour contacter l'organisation",
    emails: {
      "name-placeholder": "Label",
      "name-default": "E-mail",
      "value-placeholder": "email@example.com",
      "value-default": "",
      "button-add": "Ajouter une adresse e-mail",
      "button-delete": "Supprimer cette adresse e-mail",
    },
    "phones-label": "Numéros de téléphone",
    "phones-info": "Numéros de téléphone pour contacter l'organisation",
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
    "addresses-label": "Adresses",
    "addresses-info": "Adresses physiques de l'organisation",
  },
  de: {
    "name-label": "Name der Organisation",
    "name-placeholder": "Geben Sie den Namen der Organisation ein",
    "name-info": "Der offizielle Name der Organisation",
    "description-label": "Beschreibung",
    "description-placeholder": "Geben Sie eine Beschreibung ein",
    "description-info": "Eine detaillierte Beschreibung der Organisation",
    "short-description-label": "Kurzbeschreibung",
    "short-description-info": "Eine kurze Zusammenfassung der Organisation (wird auf Karten angezeigt)",
    "metadata-title": "Metadaten",
    "metadata-description": "Zusätzliche Informationen über die Organisation",
    "categories-label": "Kategorien",
    "categories-placeholder": "Kategorien auswählen",
    "categories-empty": "Keine Kategorie für diesen Typ verfügbar",
    "categories-info": "Wählen Sie eine oder mehrere Kategorien für diese Organisation",
    "type-label": "Organisationstyp",
    "type-info": "Der Typ der Organisation (z.B. Gemeinde, Dienst, Verein, Kommission, Unternehmen)",
    "logo-label": "Logo",
    "logo-info": "Das Logo der Organisation (quadratisches Format, wird in 256x256px angezeigt)",
    "card-label": "Kartenbild",
    "card-info": "Bild auf der Organisationskarte (Format 16:9, empfohlene Größe: 1280x720px)",
    "contacts-title": "Kontaktinformationen",
    "contacts-description": "Möglichkeiten, die Organisation zu kontaktieren",
    "emails-label": "E-Mail-Adressen",
    "emails-info": "E-Mail-Adressen zur Kontaktaufnahme mit der Organisation",
    emails: {
      "name-placeholder": "Bezeichnung",
      "name-default": "E-Mail",
      "value-placeholder": "email@example.com",
      "value-default": "",
      "button-add": "E-Mail-Adresse hinzufügen",
      "button-delete": "Diese E-Mail-Adresse löschen",
    },
    "phones-label": "Telefonnummern",
    "phones-info": "Telefonnummern zur Kontaktaufnahme mit der Organisation",
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
    "addresses-label": "Adressen",
    "addresses-info": "Physische Adressen der Organisation",
  },
}
