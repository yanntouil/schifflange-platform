import { Cms, ExportedItem } from "@compo/contents"
import { proseVariants } from "../../../prose"
import { templates } from "./templates"

export const contentItem = {
  type: "projects-related" as const,
  props: {
    level: "1",
    displayHeading: true,
    displayLink: false,
    link: Cms.Links.makeInitialLink(),
    categories: [] as string[],
    tags: [] as string[],
    projects: [] as string[],
    limit: 3,
    template: "template-1" as keyof typeof templates,
  },
  translations: {
    fr: {
      title: "Projets similaires",
      subtitle: "Explorez nos autres réalisations",
      description: "Découvrez d'autres projets qui pourraient vous intéresser",
      link: Cms.Links.makeInitialLinkTranslation({
        text: "Voir plus de projets",
      }),
    },
    en: {
      title: "Related projects",
      subtitle: "Explore our other achievements",
      description: "Discover other projects that might interest you",
      link: Cms.Links.makeInitialLinkTranslation({
        text: "View more projects",
      }),
    },
    de: {
      title: "Ähnliche Projekte",
      subtitle: "Entdecken Sie weitere Erfolge",
      description: "Entdecken Sie weitere Projekte, die Sie interessieren könnten",
      link: Cms.Links.makeInitialLinkTranslation({
        text: "Weitere Projekte anzeigen",
      }),
    },
  },
  dictionary: {
    fr: {
      "display-name": "Projets similaires",
      popover: {
        title: "Projets en relation",
        description:
          "Affiche des projets liés basés sur une sélection manuelle de projets spécifiques, des catégories ou des tags communs. Parfait pour encourager la navigation",
      },
      form: {
        title: "Configurer les relations",
        description:
          "Définissez les relations par projets spécifiques, catégories ou tags pour afficher du contenu pertinent",
      },
    },
    en: {
      "display-name": "Related projects",
      popover: {
        title: "Related projects",
        description:
          "Displays related projects based on manual selection of specific projects, shared categories or tags. Perfect for encouraging navigation",
      },
      form: {
        title: "Configure relationships",
        description: "Define relationships by specific projects, categories or tags to display relevant content",
      },
    },
    de: {
      "display-name": "Ähnliche Projekte",
      popover: {
        title: "Ähnliche Projekte",
        description:
          "Zeigt ähnliche Projekte basierend auf manueller Auswahl spezifischer Projekte, gemeinsamer Kategorien oder Tags an. Perfekt zur Förderung der Navigation",
      },
      form: {
        title: "Beziehungen konfigurieren",
        description:
          "Definieren Sie Beziehungen durch spezifische Projekte, Kategorien oder Tags, um relevante Inhalte anzuzeigen",
      },
    },
  },
  templates,
  proses: {
    description: proseVariants({ variant: "heading" }),
  },
} satisfies ExportedItem
