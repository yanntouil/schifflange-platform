import { ExportedItem } from "@compo/contents"
import { proseVariants } from "../../../prose"
import { templates } from "./templates"

export const contentItem = {
  type: "projects-search" as const,
  props: {
    level: "1",
    displayHeading: true,
    limit: 6,
    // template: "template-1" as keyof typeof templates,
  },
  translations: {
    fr: {
      title: "Nos projets",
      subtitle: "Réalisations et portfolio",
      description: "Explorez nos derniers projets et réalisations pour découvrir notre savoir-faire",
    },
    en: {
      title: "Our projects",
      subtitle: "Achievements and portfolio",
      description: "Explore our latest projects and achievements to discover our expertise",
    },
    de: {
      title: "Unsere Projekte",
      subtitle: "Erfolge und Portfolio",
      description: "Entdecken Sie unsere neuesten Projekte und Erfolge, um unser Know-how kennenzulernen",
    },
  },
  dictionary: {
    fr: {
      "display-name": "Recherche de projets",
      popover: {
        title: "Moteur de recherche de projets",
        description:
          "Page complète de recherche et filtrage de projets avec barre de recherche, filtres par catégories et affichage paginé des résultats",
      },
      form: {
        title: "Configurer la recherche",
        description: "Personnalisez les options de recherche, le nombre de projets par page et les filtres disponibles",
      },
    },
    en: {
      "display-name": "Project search",
      popover: {
        title: "Project search engine",
        description:
          "Complete project search and filtering page with search bar, category filters and paginated results display",
      },
      form: {
        title: "Configure search",
        description: "Customize search options, number of projects per page and available filters",
      },
    },
    de: {
      "display-name": "Projektsuche",
      popover: {
        title: "Projekt-Suchmaschine",
        description:
          "Vollständige Projektsuche und Filterseite mit Suchleiste, Kategoriefiltern und paginierter Ergebnisanzeige",
      },
      form: {
        title: "Suche konfigurieren",
        description: "Passen Sie Suchoptionen, Anzahl der Projekte pro Seite und verfügbare Filter an",
      },
    },
  },
  templates,
  proses: {
    description: proseVariants({ variant: "heading" }),
  },
} satisfies ExportedItem
