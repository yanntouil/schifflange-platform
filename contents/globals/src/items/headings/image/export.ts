import { ExportedItem } from "@compo/contents"
import { proseVariants } from "../../../prose"
import { templates } from "./templates"

export const contentItem = {
  type: "headings-image" as const,
  props: {
    level: "1",
    image: null,
    template: "template-1" as keyof typeof templates,
  },
  translations: {
    fr: {
      title: "Titre principal",
      subtitle: "Sous-titre optionnel",
      description: "Ajoutez une description pour accompagner votre titre et votre image",
    },
    en: {
      title: "Main title",
      subtitle: "Optional subtitle",
      description: "Add a description to accompany your title and image",
    },
    de: {
      title: "Haupttitel",
      subtitle: "Optionaler Untertitel",
      description: "Fügen Sie eine Beschreibung hinzu, um Ihren Titel und Ihr Bild zu begleiten",
    },
  },
  dictionary: {
    fr: {
      "display-name": "Entête image",
      popover: {
        title: "Entête image",
        description:
          "Entête contenant un titre, un sous-titre, une description et une image décorative. Plusieurs variantes sont disponibles afin de l'adapter au design.",
      },
      form: {
        title: "Entête image",
        description: "Entête contenant un titre, un sous-titre, une description et une image décorative.",
      },
    },
    en: {
      "display-name": "Heading image",
      popover: {
        title: "Heading image",
        description:
          "Heading containing a title, a subtitle, a description and a decorative image. Several variants are available to adapt it to the design.",
      },
      form: {
        title: "Heading image",
        description: "Heading containing a title, a subtitle, a description and a decorative image.",
      },
    },
    de: {
      "display-name": "Bildüberschrift",
      popover: {
        title: "Bildüberschrift",
        description:
          "Überschrift mit Titel, Untertitel, Beschreibung und dekorativem Bild. Mehrere Varianten sind verfügbar, um sie an das Design anzupassen.",
      },
      form: {
        title: "Bildüberschrift",
        description: "Überschrift mit Titel, Untertitel, Beschreibung und dekorativem Bild.",
      },
    },
  },
  templates,
  proses: {
    description: proseVariants({ variant: "heading" }),
  },
} satisfies ExportedItem
