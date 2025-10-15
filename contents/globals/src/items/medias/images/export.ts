import { ExportedItem } from "@compo/contents"
import { proseVariants } from "../../../prose"
import { templates } from "./templates"

export const contentItem = {
  type: "medias-images" as const,
  props: {
    level: "1",
    displayHeading: true,
    images: [] as string[],
    template: "template-1" as keyof typeof templates,
  },
  translations: {
    fr: {
      title: "Titre de la galerie",
      subtitle: "Sous-titre optionnel",
      description: "Ajoutez une description pour présenter votre galerie d'images",
    },
    en: {
      title: "Gallery title",
      subtitle: "Optional subtitle",
      description: "Add a description to present your image gallery",
    },
    de: {
      title: "Galerietitel",
      subtitle: "Optionaler Untertitel",
      description: "Fügen Sie eine Beschreibung hinzu, um Ihre Bildergalerie zu präsentieren",
    },
  },
  dictionary: {
    fr: {
      "display-name": "Galerie d'images",
      popover: {
        title: "Galerie d'images",
        description:
          "Bloc de galerie permettant d'afficher plusieurs images avec différentes mises en page. Idéal pour présenter des portfolios, produits ou collections.",
      },
      form: {
        title: "Galerie d'images",
        description: "Configurez votre galerie d'images avec titre, description et sélection des images à afficher.",
      },
    },
    en: {
      "display-name": "Image gallery",
      popover: {
        title: "Image gallery",
        description:
          "Gallery block allowing to display multiple images with different layouts. Ideal for presenting portfolios, products or collections.",
      },
      form: {
        title: "Image gallery",
        description: "Configure your image gallery with title, description and selection of images to display.",
      },
    },
    de: {
      "display-name": "Bildergalerie",
      popover: {
        title: "Bildergalerie",
        description:
          "Galerieblock zur Anzeige mehrerer Bilder mit verschiedenen Layouts. Ideal für die Präsentation von Portfolios, Produkten oder Sammlungen.",
      },
      form: {
        title: "Bildergalerie",
        description:
          "Konfigurieren Sie Ihre Bildergalerie mit Titel, Beschreibung und Auswahl der anzuzeigenden Bilder.",
      },
    },
  },
  templates,
  proses: {
    description: proseVariants({ variant: "heading" }),
  },
} satisfies ExportedItem
