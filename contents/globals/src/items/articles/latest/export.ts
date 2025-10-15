import { Cms, ExportedItem } from "@compo/contents"
import { proseVariants } from "../../../prose"
import { templates } from "./templates"

export const contentItem = {
  type: "articles-latest" as const,
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
      title: "Derniers articles",
      subtitle: "Restez informé",
      description: "Découvrez nos publications les plus récentes et nos dernières actualités",
      link: Cms.Links.makeInitialLinkTranslation({
        text: "Voir tous les articles",
      }),
    },
    en: {
      title: "Latest articles",
      subtitle: "Stay informed",
      description: "Discover our most recent publications and latest news",
      link: Cms.Links.makeInitialLinkTranslation({
        text: "View all articles",
      }),
    },
    de: {
      title: "Neueste Artikel",
      subtitle: "Bleiben Sie informiert",
      description: "Entdecken Sie unsere neuesten Veröffentlichungen und aktuellen Nachrichten",
      link: Cms.Links.makeInitialLinkTranslation({
        text: "Alle Artikel anzeigen",
      }),
    },
  },
  dictionary: {
    fr: {
      "display-name": "Derniers articles",
      popover: {
        title: "Bloc des derniers articles",
        description:
          "Affiche automatiquement les articles les plus récents. Possibilité de filtrer par catégories ou tags pour cibler le contenu affiché",
      },
      form: {
        title: "Configurer les derniers articles",
        description: "Définissez le nombre d'articles à afficher et les filtres par catégories ou tags",
      },
    },
    en: {
      "display-name": "Latest articles",
      popover: {
        title: "Latest articles block",
        description:
          "Automatically displays the most recent articles. Can filter by categories or tags to target displayed content",
      },
      form: {
        title: "Configure latest articles",
        description: "Set the number of articles to display and filters by categories or tags",
      },
    },
    de: {
      "display-name": "Neueste Artikel",
      popover: {
        title: "Block der neuesten Artikel",
        description:
          "Zeigt automatisch die neuesten Artikel an. Kann nach Kategorien oder Tags gefiltert werden, um den angezeigten Inhalt zu steuern",
      },
      form: {
        title: "Neueste Artikel konfigurieren",
        description: "Legen Sie die Anzahl der anzuzeigenden Artikel und Filter nach Kategorien oder Tags fest",
      },
    },
  },
  templates,
  proses: {
    description: proseVariants({ variant: "headings" }),
  },
} satisfies ExportedItem
