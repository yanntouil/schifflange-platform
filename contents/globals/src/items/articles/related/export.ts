import { Cms, ExportedItem } from "@compo/contents"
import { proseVariants } from "../../../prose"
import { templates } from "./templates"

export const contentItem = {
  type: "articles-related" as const,
  props: {
    level: "1",
    displayHeading: true,
    displayLink: false,
    link: Cms.Links.makeInitialLink(),
    categories: [] as string[],
    tags: [] as string[],
    articles: [] as string[],
    limit: 3,
    template: "template-1" as keyof typeof templates,
  },
  translations: {
    fr: {
      title: "Articles connexes",
      subtitle: "Pour aller plus loin",
      description: "Découvrez d'autres articles qui pourraient vous intéresser",
      link: Cms.Links.makeInitialLinkTranslation({
        text: "Voir plus d'articles",
      }),
    },
    en: {
      title: "Related articles",
      subtitle: "Go further",
      description: "Discover other articles that might interest you",
      link: Cms.Links.makeInitialLinkTranslation({
        text: "View more articles",
      }),
    },
    de: {
      title: "Verwandte Artikel",
      subtitle: "Weiterlesen",
      description: "Entdecken Sie weitere Artikel, die Sie interessieren könnten",
      link: Cms.Links.makeInitialLinkTranslation({
        text: "Weitere Artikel anzeigen",
      }),
    },
  },
  dictionary: {
    fr: {
      "display-name": "Articles connexes",
      popover: {
        title: "Articles en relation",
        description:
          "Affiche des articles liés basés sur une sélection manuelle d'articles spécifiques, des catégories ou des tags communs. Parfait pour encourager la navigation",
      },
      form: {
        title: "Configurer les relations",
        description: "Définissez les relations par articles spécifiques, catégories ou tags pour afficher du contenu pertinent",
      },
    },
    en: {
      "display-name": "Related articles",
      popover: {
        title: "Related articles",
        description:
          "Displays related articles based on manual selection of specific articles, shared categories or tags. Perfect for encouraging navigation",
      },
      form: {
        title: "Configure relationships",
        description: "Define relationships by specific articles, categories or tags to display relevant content",
      },
    },
    de: {
      "display-name": "Verwandte Artikel",
      popover: {
        title: "Verwandte Artikel",
        description:
          "Zeigt verwandte Artikel basierend auf manueller Auswahl spezifischer Artikel, gemeinsamer Kategorien oder Tags an. Perfekt zur Förderung der Navigation",
      },
      form: {
        title: "Beziehungen konfigurieren",
        description: "Definieren Sie Beziehungen durch spezifische Artikel, Kategorien oder Tags, um relevante Inhalte anzuzeigen",
      },
    },
  },
  templates,
  proses: {
    description: proseVariants({ variant: "headings" }),
  },
} satisfies ExportedItem
