import { Form, FormInfo } from "@compo/form"
import { useTranslation } from "@compo/localize"
import React from "react"
import { useCategoriesOptions } from "../hooks/use-categories-options"
import { useStateOptions } from "../hooks/use-state-options"

/**
 * EventsForm
 */
export const EventsForm: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const stateOptions = useStateOptions()
  const [categoryOptions] = useCategoriesOptions()
  return (
    <>
      <Form.Select
        label={_("state-label")}
        name='state'
        options={stateOptions}
        labelAside={<FormInfo title={_("state-label")} content={_("state-info")} />}
      />
      <Form.SelectMultiple
        label={_("category-ids-label")}
        name='categoryIds'
        placeholder={_("category-ids-placeholder")}
        noResultsFound={_("category-ids-empty")}
        options={categoryOptions}
        labelAside={<FormInfo title={_("category-ids-label")} content={_("category-ids-info")} />}
      />
    </>
  )
}

/**
 * dictionaries
 */
const dictionary = {
  en: {
    "state-label": "Status",
    "state-info": "The publication status of the event. Draft events are not visible to the public.",
    "category-ids-label": "Categories",
    "category-ids-placeholder": "Select categories...",
    "category-ids-empty": "No categories found",
    "category-ids-info": "Assign the event to one or more categories to help organize and filter events.",
  },
  fr: {
    "state-label": "Statut",
    "state-info":
      "Le statut de publication de l'événement. Les événements en brouillon ne sont pas visibles au public.",
    "category-ids-label": "Catégories",
    "category-ids-placeholder": "Sélectionnez des catégories...",
    "category-ids-empty": "Aucune catégorie trouvée",
    "category-ids-info":
      "Attribuez l'événement à une ou plusieurs catégories pour faciliter l'organisation et le filtrage des événements.",
  },
  de: {
    "state-label": "Status",
    "state-info":
      "Der Veröffentlichungsstatus der Veranstaltung. Entwurfs-Veranstaltungen sind nicht öffentlich sichtbar.",
    "category-ids-label": "Kategorien",
    "category-ids-placeholder": "Kategorien auswählen...",
    "category-ids-empty": "Keine Kategorien gefunden",
    "category-ids-info":
      "Ordnen Sie die Veranstaltung einer oder mehreren Kategorien zu, um Veranstaltungen zu organisieren und zu filtern.",
  },
}
