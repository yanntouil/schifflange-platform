import { Form, useFormContext } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { FormUser } from "@compo/users"
import { T } from "@compo/utils"
import React from "react"
import { usePublication } from "../publication.context"

/**
 * PublicationForm
 */
export const PublicationForm: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { values } = useFormContext<{
    isScheduled: boolean
  }>()
  const { publishedUsers, getImageUrl } = usePublication()
  const interval = { start: T.startOfYear(T.subYears(new Date(), 5)), end: T.endOfYear(T.addYears(new Date(), 5)) }
  return (
    <>
      <Form.Date
        name='publishedAt'
        label={_("published-at-label")}
        placeholder={_("published-at-placeholder")}
        highlightWeekends
        highlightHolidays
        minDate={interval.start}
        maxDate={interval.end}
        labelAside={<Form.Info title={_("published-at-label")} content={_("published-at-info")} />}
      />
      <FormUser.Select
        name='publishedById'
        label={_("published-by-label")}
        placeholder={_("published-by-placeholder")}
        labelAside={<Form.Info title={_("published-by-label")} content={_("published-by-info")} />}
        users={publishedUsers}
        getImageUrl={getImageUrl}
      />
      <Ui.Collapsible.Root open={values.isScheduled} className='space-y-4'>
        <div className='flex justify-between gap-6'>
          <Form.Header title={_("schedule-title")} description={_("schedule-secondary")} className='grow' />
          <Form.SimpleSwitch name='isScheduled' size='sm' classNames={{ switch: "mt-3" }} />
        </div>
        <Ui.Collapsible.Content className='overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down'>
          <div className='space-y-4 rounded-md border border-input p-4'>
            <Form.Date
              name='publishedFrom'
              label={_("published-from-label")}
              placeholder={_("published-from-placeholder")}
              minDate={interval.start}
              maxDate={interval.end}
              highlightWeekends
              highlightHolidays
              labelAside={<Form.Info title={_("published-from-label")} content={_("published-from-info")} />}
            />
            <Form.Date
              name='publishedTo'
              label={_("published-to-label")}
              placeholder={_("published-to-placeholder")}
              minDate={interval.start}
              maxDate={interval.end}
              highlightWeekends
              highlightHolidays
              labelAside={<Form.Info title={_("published-to-label")} content={_("published-to-info")} />}
            />
          </div>
        </Ui.Collapsible.Content>
      </Ui.Collapsible.Root>
    </>
  )
}

const dictionary = {
  fr: {
    // Publisher fields
    "published-by-label": "Publié par",
    "published-by-placeholder": "Sélectionner un éditeur",
    "published-by-info":
      "L'utilisateur responsable de la publication de ce contenu. Cette information sera visible publiquement.",

    // Publication date
    "published-at-label": "Date de publication",
    "published-at-placeholder": "Sélectionner une date",
    "published-at-info":
      "Date à laquelle le contenu a été publié ou sera publié. Utilisée pour l'ordre chronologique d'affichage.",

    // Scheduling
    "schedule-title": "Programmation",
    "schedule-secondary": "Définir une période de visibilité",

    "published-from-label": "Début de publication",
    "published-from-placeholder": "Date de début",
    "published-from-info":
      "Le contenu sera automatiquement visible à partir de cette date. Laissez vide pour publier immédiatement.",

    "published-to-label": "Fin de publication",
    "published-to-placeholder": "Date de fin",
    "published-to-info":
      "Le contenu sera automatiquement masqué après cette date. Laissez vide pour une publication permanente.",
  },
  en: {
    // Publisher fields
    "published-by-label": "Published by",
    "published-by-placeholder": "Select a publisher",
    "published-by-info": "The user responsible for publishing this content. This information will be publicly visible.",

    // Publication date
    "published-at-label": "Publication date",
    "published-at-placeholder": "Select a date",
    "published-at-info": "Date when the content was or will be published. Used for chronological display order.",

    // Scheduling
    "schedule-title": "Scheduling",
    "schedule-secondary": "Set a visibility period",

    "published-from-label": "Start publication",
    "published-from-placeholder": "Start date",
    "published-from-info":
      "Content will automatically become visible from this date. Leave empty for immediate publication.",

    "published-to-label": "End publication",
    "published-to-placeholder": "End date",
    "published-to-info": "Content will automatically be hidden after this date. Leave empty for permanent publication.",
  },
  de: {
    // Publisher fields
    "published-by-label": "Veröffentlicht von",
    "published-by-placeholder": "Einen Herausgeber auswählen",
    "published-by-info":
      "Der Benutzer, der für die Veröffentlichung dieses Inhalts verantwortlich ist. Diese Information wird öffentlich sichtbar sein.",

    // Publication date
    "published-at-label": "Veröffentlichungsdatum",
    "published-at-placeholder": "Datum auswählen",
    "published-at-info":
      "Datum, an dem der Inhalt veröffentlicht wurde oder wird. Wird für die chronologische Anzeigereihenfolge verwendet.",

    // Scheduling
    "schedule-title": "Zeitplanung",
    "schedule-secondary": "Sichtbarkeitszeitraum festlegen",

    "published-from-label": "Veröffentlichungsbeginn",
    "published-from-placeholder": "Startdatum",
    "published-from-info":
      "Der Inhalt wird ab diesem Datum automatisch sichtbar. Leer lassen für sofortige Veröffentlichung.",

    "published-to-label": "Veröffentlichungsende",
    "published-to-placeholder": "Enddatum",
    "published-to-info":
      "Der Inhalt wird nach diesem Datum automatisch ausgeblendet. Leer lassen für dauerhafte Veröffentlichung.",
  },
}
