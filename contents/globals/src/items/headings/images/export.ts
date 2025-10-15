import { ExportedItem } from "@compo/contents"
import { proseVariants } from "../../../prose"
import { templates } from "./templates"

export const contentItem = {
  type: "headings-images" as const,
  props: {
    level: "1",
    images: [] as string[],
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
      "display-name": "Entête galerie d'images",
      popover: {
        title: "Entête galerie d'images",
        description:
          "Entête contenant un titre, un sous-titre, une description et une galerie d'images. Plusieurs variantes sont disponibles afin de l'adapter au design.",
      },
      form: {
        title: "Entête galerie d'images",
        description: "Entête contenant un titre, un sous-titre, une description et une galerie d'images.",
      },
    },
    en: {
      "display-name": "Heading gallery of images",
      popover: {
        title: "Heading gallery of images",
        description:
          "Heading containing a title, a subtitle, a description and a gallery of images. Several variants are available to adapt it to the design.",
      },
      form: {
        title: "Heading gallery of images",
        description: "Heading containing a title, a subtitle, a description and a gallery of images.",
      },
    },
    de: {
      "display-name": "Bildüberschrift galerie",
      popover: {
        title: "Bildüberschrift galerie",
        description:
          "Überschrift mit Titel, Untertitel, Beschreibung und galerie d'images. Mehrere Varianten sind verfügbar, um sie an das Design anzupassen.",
      },
      form: {
        title: "Bildüberschrift galerie",
        description: "Überschrift mit Titel, Untertitel, Beschreibung und galerie d'images.",
      },
    },
  },
  templates,
  proses: {
    description: proseVariants({ variant: "heading" }),
  },
} satisfies ExportedItem
