import { Cms, ExportedItem } from "@compo/contents"
import { templates } from "./templates"

export const contentItem = {
  type: "contents-breadcrumbs" as const,
  props: {
    breadcrumbsOrdered: [] as string[],
    breadcrumbs: {} as Record<string, { link: Cms.Links.LinkProps }>,
  },
  translations: {
    fr: {
      breadcrumbs: {} as Record<string, { link: Cms.Links.LinkTranslationsProps }>,
    },
    en: {
      breadcrumbs: {} as Record<string, { link: Cms.Links.LinkTranslationsProps }>,
    },
    de: {
      breadcrumbs: {} as Record<string, { link: Cms.Links.LinkTranslationsProps }>,
    },
  },
  dictionary: {
    fr: {
      "display-name": "Fil d'Ariane",
      popover: {
        title: "Navigation par fil d'Ariane",
        description:
          "Affiche le chemin de navigation pour aider vos visiteurs à se repérer sur votre site. Montre où ils se trouvent et comment revenir aux pages précédentes",
      },
      form: {
        title: "Configurer le fil d'Ariane",
        description: "Définissez les liens de navigation qui apparaîtront dans l'ordre pour guider vos visiteurs",
      },
    },
    en: {
      "display-name": "Breadcrumbs",
      popover: {
        title: "Breadcrumb navigation",
        description:
          "Shows the navigation path to help your visitors orient themselves on your site. Displays where they are and how to navigate back to previous pages",
      },
      form: {
        title: "Configure breadcrumbs",
        description: "Define the navigation links that will appear in order to guide your visitors",
      },
    },
    de: {
      "display-name": "Brotkrümelnavigation",
      popover: {
        title: "Brotkrümel-Navigation",
        description:
          "Zeigt den Navigationspfad, um Ihren Besuchern bei der Orientierung auf Ihrer Website zu helfen. Zeigt an, wo sie sich befinden und wie sie zu vorherigen Seiten zurückkehren können",
      },
      form: {
        title: "Brotkrümel konfigurieren",
        description:
          "Definieren Sie die Navigationslinks, die in der Reihenfolge erscheinen, um Ihre Besucher zu führen",
      },
    },
  },
  templates,
  proses: {},
} satisfies ExportedItem

type BreadcrumbTranslation = {
  link: Cms.Links.LinkTranslationsProps
}
