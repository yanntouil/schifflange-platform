import { ExportedItem } from "@compo/contents"
import { proseVariants } from "../../../prose"
import { templates } from "./templates"

export const contentItem = {
  type: "articles-search" as const,
  props: {
    level: "1",
    displayHeading: true,
    limit: 6,
    // template: "template-1" as keyof typeof templates,
  },
  translations: {
    fr: {
      title: "Nos articles",
      subtitle: "Actualités et ressources",
      description: "Explorez nos derniers articles, actualités et ressources pour rester informé",
    },
    en: {
      title: "Our articles",
      subtitle: "News and resources",
      description: "Explore our latest articles, news and resources to stay informed",
    },
    de: {
      title: "Unsere Artikel",
      subtitle: "Neuigkeiten und Ressourcen",
      description: "Entdecken Sie unsere neuesten Artikel, Nachrichten und Ressourcen, um informiert zu bleiben",
    },
  },
  dictionary: {
    fr: {
      "display-name": "Recherche d'articles",
      popover: {
        title: "Moteur de recherche d'articles",
        description:
          "Page complète de recherche et filtrage d'articles avec barre de recherche, filtres par catégories et affichage paginé des résultats",
      },
      form: {
        title: "Configurer la recherche",
        description: "Personnalisez les options de recherche, le nombre d'articles par page et les filtres disponibles",
      },
    },
    en: {
      "display-name": "Article search",
      popover: {
        title: "Article search engine",
        description:
          "Complete article search and filtering page with search bar, category filters and paginated results display",
      },
      form: {
        title: "Configure search",
        description: "Customize search options, number of articles per page and available filters",
      },
    },
    de: {
      "display-name": "Artikelsuche",
      popover: {
        title: "Artikel-Suchmaschine",
        description:
          "Vollständige Artikelsuche und Filterseite mit Suchleiste, Kategoriefiltern und paginierter Ergebnisanzeige",
      },
      form: {
        title: "Suche konfigurieren",
        description: "Passen Sie Suchoptionen, Anzahl der Artikel pro Seite und verfügbare Filter an",
      },
    },
  },
  templates,
  proses: {
    description: proseVariants({ variant: "headings" }),
  },
} satisfies ExportedItem
