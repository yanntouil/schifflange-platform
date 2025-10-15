import { Cms, ExportedItem } from "@compo/contents"
import { proseVariants } from "../../../prose"
import { templates } from "./templates"

export const contentItem = {
  type: "projects-latest" as const,
  props: {
    level: "1",
    displayHeading: true,
    displayLink: false,
    link: Cms.Links.makeInitialLink(),
    categories: [] as string[],
    tags: [] as string[],
    limit: 3,
    template: "template-1" as keyof typeof templates,
  },
  translations: {
    fr: {
      title: "Derniers projets",
      subtitle: "Nos réalisations récentes",
      description: "Découvrez nos projets les plus récents et nos dernières réalisations",
      link: Cms.Links.makeInitialLinkTranslation({
        text: "Voir tous les projets",
      }),
    },
    en: {
      title: "Latest projects",
      subtitle: "Our recent achievements",
      description: "Discover our most recent projects and latest achievements",
      link: Cms.Links.makeInitialLinkTranslation({
        text: "View all projects",
      }),
    },
    de: {
      title: "Neueste Projekte",
      subtitle: "Unsere neuesten Erfolge",
      description: "Entdecken Sie unsere neuesten Projekte und jüngsten Erfolge",
      link: Cms.Links.makeInitialLinkTranslation({
        text: "Alle Projekte anzeigen",
      }),
    },
  },
  dictionary: {
    fr: {
      "display-name": "Derniers projets",
      popover: {
        title: "Bloc des derniers projets",
        description:
          "Affiche automatiquement les projets les plus récents. Possibilité de filtrer par catégories ou tags pour cibler le contenu affiché",
      },
      form: {
        title: "Configurer les derniers projets",
        description: "Définissez le nombre de projets à afficher et les filtres par catégories ou tags",
      },
    },
    en: {
      "display-name": "Latest projects",
      popover: {
        title: "Latest projects block",
        description:
          "Automatically displays the most recent projects. Can filter by categories or tags to target displayed content",
      },
      form: {
        title: "Configure latest projects",
        description: "Set the number of projects to display and filters by categories or tags",
      },
    },
    de: {
      "display-name": "Neueste Projekte",
      popover: {
        title: "Block der neuesten Projekte",
        description:
          "Zeigt automatisch die neuesten Projekte an. Kann nach Kategorien oder Tags gefiltert werden, um den angezeigten Inhalt zu steuern",
      },
      form: {
        title: "Neueste Projekte konfigurieren",
        description: "Legen Sie die Anzahl der anzuzeigenden Projekte und Filter nach Kategorien oder Tags fest",
      },
    },
  },
  templates,
  proses: {
    description: proseVariants({ variant: "heading" }),
  },
} satisfies ExportedItem
