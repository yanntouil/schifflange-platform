import { Cms, ExportedItem } from "@compo/contents"
import { templates } from "./templates"

export const contentItem = {
  type: "contents-navigate" as const,
  props: {
    previous: { display: true, link: Cms.Links.makeInitialLink() },
    next: { display: true, link: Cms.Links.makeInitialLink() },
  },
  translations: {
    fr: {
      previous: {
        link: Cms.Links.makeInitialLinkTranslation({
          text: "Précédent",
        }),
      },
      next: {
        link: Cms.Links.makeInitialLinkTranslation({
          text: "Suivant",
        }),
      },
    },
    en: {
      previous: {
        link: Cms.Links.makeInitialLinkTranslation({
          text: "Previous",
        }),
        next: Cms.Links.makeInitialLinkTranslation({
          text: "Next",
        }),
      },
    },
    de: {
      previous: {
        link: Cms.Links.makeInitialLinkTranslation({
          text: "Vorherige",
        }),
        next: Cms.Links.makeInitialLinkTranslation({
          text: "Nächste",
        }),
      },
    },
  },
  dictionary: {
    fr: {
      "display-name": "Navigation précédente/suivante",
      popover: {
        title: "Liens de navigation contextuelle",
        description:
          "Ajoutez des boutons de navigation pour permettre à vos visiteurs de passer facilement à la page précédente ou suivante. Idéal pour les articles de blog, les galeries ou les étapes de processus",
      },
      form: {
        title: "Configurer les liens de navigation",
        description:
          "Personnalisez les liens vers les pages précédente et suivante pour créer un parcours fluide sur votre site",
      },
    },
    en: {
      "display-name": "Previous/Next Navigation",
      popover: {
        title: "Contextual navigation links",
        description:
          "Add navigation buttons to let your visitors easily move to the previous or next page. Perfect for blog posts, galleries, or process steps",
      },
      form: {
        title: "Configure navigation links",
        description: "Customize the links to previous and next pages to create a smooth journey through your site",
      },
    },
    de: {
      "display-name": "Vorherige/Nächste Navigation",
      popover: {
        title: "Kontextuelle Navigationslinks",
        description:
          "Fügen Sie Navigationsschaltflächen hinzu, damit Ihre Besucher einfach zur vorherigen oder nächsten Seite wechseln können. Perfekt für Blogbeiträge, Galerien oder Prozessschritte",
      },
      form: {
        title: "Navigationslinks konfigurieren",
        description:
          "Passen Sie die Links zu vorherigen und nächsten Seiten an, um eine nahtlose Navigation durch Ihre Website zu erstellen",
      },
    },
  },
  templates,
  proses: {},
} satisfies ExportedItem

type BreadcrumbTranslation = {
  link: Cms.Links.LinkTranslationsProps
}
