import { ExportedItem } from "@compo/contents"
import { proseVariants } from "../../../prose"
import { templates } from "./templates"

export const contentItem = {
  type: "headings-simple" as const,
  props: {
    level: "1",
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
      "display-name": "Entête simple",
      popover: {
        title: "Titre avec sous-titre",
        description: "Un bloc de titre classique avec la possibilité d'ajouter un sous-titre et une description",
      },
      form: {
        title: "Éditer le titre",
        description: "Personnalisez le titre, le sous-titre et la description de ce bloc",
      },
    },
    en: {
      "display-name": "Simple heading",
      popover: {
        title: "Heading with subtitle",
        description: "A classic heading block with the option to add a subtitle and description",
      },
      form: {
        title: "Edit heading",
        description: "Customize the title, subtitle and description of this block",
      },
    },
    de: {
      "display-name": "Einfache Überschrift",
      popover: {
        title: "Überschrift mit Untertitel",
        description:
          "Ein klassischer Überschriftenblock mit der Möglichkeit, einen Untertitel und eine Beschreibung hinzuzufügen",
      },
      form: {
        title: "Überschrift bearbeiten",
        description: "Passen Sie den Titel, Untertitel und die Beschreibung dieses Blocks an",
      },
    },
  },
  templates,
  proses: {
    "template-1": proseVariants({ variant: "quote-finch" }),
  },
} satisfies ExportedItem
