import { Form, useForm } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import React from "react"
import { Preview } from "./preview"
import { FormSchedules } from "./schedules"
import { Event, Schedule } from "./types"
import { makeValues } from "./utils"

export const EventCreationUI: React.FC = () => {
  const { _ } = useTranslation(dictionary)

  const form = useForm({
    values: makeValues(),
    onSubmit: async ({ values }) => {
      const event: Partial<Event> = {
        name: values.name,
        description: values.description,
        location: values.location,
      }

      const schedules: Partial<Schedule>[] = values.schedules.map((s) => {
        const base: any = {
          eventId: "temp-id", // Will be set by backend
        }

        // Schedule time
        if (s.allDay) {
          base.allDay = true
          base.startDate = s.startDate
          base.endDate = s.endDate
        } else {
          base.allDay = false
          base.startDateTime = s.startDateTime
          base.endDateTime = s.endDateTime
        }

        // Recurrence
        if (s.isRecurring) {
          base.isRecurring = true
          base.freq = s.freq
          base.interval = s.interval
          if (s.byWeekday.length > 0) base.byWeekday = s.byWeekday
          if (s.until) base.until = s.until
        } else {
          base.isRecurring = false
        }

        return base as Partial<Schedule>
      })

      console.log("Event:", event)
      console.log("Schedules:", schedules)
    },
  })

  return (
    <Form.Root className="mx-auto min-h-screen max-w-5xl p-6" form={form}>
      {/* Event Section */}
      <Ui.Card.Root className="mb-6">
        <Ui.Card.Header>
          <Ui.Card.Title>{_("event.title")}</Ui.Card.Title>
          <Ui.Card.Description>{_("event.description")}</Ui.Card.Description>
        </Ui.Card.Header>

        <Ui.Card.Content className="space-y-4">
          <Form.Input
            name="name"
            label={_("event.name-label")}
            placeholder={_("event.name-placeholder")}
            labelAside={<Form.Info title={_("event.name-label")} content={_("event.name-info-content")} />}
            required
          />
          <Form.Input
            name="location"
            label={_("event.location-label")}
            placeholder={_("event.location-placeholder")}
            labelAside={<Form.Info title={_("event.location-label")} content={_("event.location-info-content")} />}
          />
          <Form.Textarea
            name="description"
            label={_("event.description-label")}
            placeholder={_("event.description-placeholder")}
            labelAside={<Form.Info title={_("event.description-label")} content={_("event.description-info-content")} />}
            rows={3}
          />
        </Ui.Card.Content>
      </Ui.Card.Root>

      {/* Schedules Section */}
      <FormSchedules name="schedules" />

      {/* Preview Section */}
      <Preview values={form.values} />

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Ui.Button type="button" variant="outline">
          {_("actions.cancel-button")}
        </Ui.Button>
        <Form.Submit>{_("actions.create-button")}</Form.Submit>
      </div>
    </Form.Root>
  )
}

/**
 * Translations
 */
const dictionary = {
  fr: {
    event: {
      title: "Informations de l'événement",
      description: "Définissez les détails généraux de votre événement",
      "name-label": "Nom de l'événement",
      "name-placeholder": "Ex: Foire d'automne, Cours de yoga, Concert...",
      "name-info-content":
        "Choisissez un nom clair et descriptif pour votre événement. Ce nom sera affiché sur le calendrier et dans toutes les communications.",
      "location-label": "Lieu",
      "location-placeholder": "Ex: Salle polyvalente, Parc municipal, 12 rue de la Gare...",
      "location-info-content":
        "Indiquez où se déroulera l'événement. Vous pouvez préciser une adresse complète, un nom de lieu ou des indications générales.",
      "description-label": "Description",
      "description-placeholder": "Décrivez votre événement, son déroulement, ce que les participants doivent savoir...",
      "description-info-content":
        "Ajoutez tous les détails importants : programme, matériel nécessaire, niveau requis, tarifs, etc. Plus votre description est complète, plus les participants seront informés.",
    },
    actions: {
      "cancel-button": "Annuler",
      "create-button": "Créer l'événement",
    },
  },
  en: {
    event: {
      title: "Event Information",
      description: "Define the general details of your event",
      "name-label": "Event name",
      "name-placeholder": "E.g: Autumn Fair, Yoga Class, Concert...",
      "name-info-content":
        "Choose a clear and descriptive name for your event. This name will be displayed on the calendar and in all communications.",
      "location-label": "Location",
      "location-placeholder": "E.g: Community Hall, City Park, 12 Main Street...",
      "location-info-content":
        "Indicate where the event will take place. You can specify a complete address, a place name, or general directions.",
      "description-label": "Description",
      "description-placeholder": "Describe your event, its course, what participants need to know...",
      "description-info-content":
        "Add all important details: program, required equipment, skill level, fees, etc. The more complete your description, the better informed participants will be.",
    },
    actions: {
      "cancel-button": "Cancel",
      "create-button": "Create event",
    },
  },
  de: {
    event: {
      title: "Veranstaltungsinformationen",
      description: "Definieren Sie die allgemeinen Details Ihrer Veranstaltung",
      "name-label": "Veranstaltungsname",
      "name-placeholder": "Z.B: Herbstmesse, Yoga-Kurs, Konzert...",
      "name-info-content":
        "Wählen Sie einen klaren und beschreibenden Namen für Ihre Veranstaltung. Dieser Name wird im Kalender und in allen Mitteilungen angezeigt.",
      "location-label": "Ort",
      "location-placeholder": "Z.B: Gemeindesaal, Stadtpark, Hauptstraße 12...",
      "location-info-content":
        "Geben Sie an, wo die Veranstaltung stattfindet. Sie können eine vollständige Adresse, einen Ortsnamen oder allgemeine Wegbeschreibungen angeben.",
      "description-label": "Beschreibung",
      "description-placeholder": "Beschreiben Sie Ihre Veranstaltung, ihren Ablauf, was die Teilnehmer wissen müssen...",
      "description-info-content":
        "Fügen Sie alle wichtigen Details hinzu: Programm, benötigte Ausrüstung, erforderliches Niveau, Gebühren usw. Je vollständiger Ihre Beschreibung ist, desto besser sind die Teilnehmer informiert.",
    },
    actions: {
      "cancel-button": "Abbrechen",
      "create-button": "Veranstaltung erstellen",
    },
  },
}
