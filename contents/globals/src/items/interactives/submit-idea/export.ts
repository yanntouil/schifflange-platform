import { ExportedItem } from "@compo/contents"
import { proseVariants } from "../../../prose"
import { templates } from "./templates"

export const contentItem = {
  type: "interactives-submit-idea" as const,
  props: {
    level: "1",
    displayHeading: true,
    template: "template-1" as keyof typeof templates,
  },
  translations: {
    fr: {
      title: "Titre principal",
      subtitle: "Sous-titre optionnel",
      description: "Ajoutez une description pour compléter votre titre",
    },
    en: {
      title: "Main title",
      subtitle: "Optional subtitle",
      description: "Add a description to complement your title",
    },
    de: {
      title: "Haupttitel",
      subtitle: "Optionaler Untertitel",
      description: "Fügen Sie eine Beschreibung hinzu, um Ihren Titel zu ergänzen",
    },
  },
  dictionary: {
    fr: {
      "display-name": "Soumettre une idée",
      popover: {
        title: "Déposez votre idée",
        description: "Ce bloc affiche un formulaire permettant de proposer pour une idée",
      },
      form: {
        title: "Éditer le formulaire",
        description: "Personnalisez le formulaire de soumission de l'idée",
      },
    },
    en: {
      "display-name": "Submit an idea",
      popover: {
        title: "Submit an idea",
        description: "This block displays a form allowing to submit an idea",
      },
      form: {
        title: "Edit form",
        description: "Customize the form of the idea submission",
      },
    },
    de: {
      "display-name": "Idee einreichen",
      popover: {
        title: "Idee einreichen",
        description: "Dieser Block zeigt ein Formular an, das es ermöglicht, eine Idee einzureichen",
      },
      form: {
        title: "Formular bearbeiten",
        description: "Passen Sie das Formular für die Ideeneingabe an",
      },
    },
  },
  templates,
  proses: {
    description: proseVariants({ variant: "quote-finch" }),
  },
} satisfies ExportedItem
