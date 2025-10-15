import { ExportedItem } from "@compo/contents"
import { proseVariants } from "../../../prose"
import { templates } from "./templates"

export const contentItem = {
  type: "features-faq" as const,
  props: {
    level: "1",
    displayHeading: true,
    limit: 0,
    orderedCards: [] as string[],
    cards: {} as Record<string, CardProps>,
    // template: "" as keyof typeof templates,
  },
  translations: {
    fr: {
      title: "Questions fréquentes",
      subtitle: "Nous sommes là pour vous aider",
      description: "Retrouvez les réponses aux questions les plus fréquemment posées",
      cards: {} as Record<string, CardTranslationsProps>,
    },
    en: {
      title: "Frequently asked questions",
      subtitle: "We're here to help",
      description: "Find answers to the most frequently asked questions",
      cards: {} as Record<string, CardTranslationsProps>,
    },
    de: {
      title: "Häufig gestellte Fragen",
      subtitle: "Wir sind hier, um zu helfen",
      description: "Finden Sie Antworten auf die am häufigsten gestellten Fragen",
      cards: {} as Record<string, CardTranslationsProps>,
    },
  },
  dictionary: {
    fr: {
      "display-name": "FAQ",
      popover: {
        title: "Foire aux questions",
        description:
          "Section FAQ avec questions groupées par catégories. Idéal pour répondre aux interrogations courantes de vos visiteurs",
      },
      form: {
        title: "Gérer la FAQ",
        description: "Organisez vos questions-réponses par catégories pour faciliter la navigation",
      },
    },
    en: {
      "display-name": "FAQ",
      popover: {
        title: "Frequently asked questions",
        description: "FAQ section with questions grouped by categories. Ideal for answering common visitor questions",
      },
      form: {
        title: "Manage FAQ",
        description: "Organize your Q&A by categories to facilitate navigation",
      },
    },
    de: {
      "display-name": "FAQ",
      popover: {
        title: "Häufig gestellte Fragen",
        description:
          "FAQ-Bereich mit nach Kategorien gruppierten Fragen. Ideal zur Beantwortung häufiger Besucherfragen",
      },
      form: {
        title: "FAQ verwalten",
        description: "Organisieren Sie Ihre Fragen und Antworten nach Kategorien für eine einfache Navigation",
      },
    },
  },
  templates,
  proses: {
    description: proseVariants({ variant: "heading" }),
    cardDescription: proseVariants({ variant: "card" }),
    faqDescription: proseVariants({ variant: "default" }),
  },
} satisfies ExportedItem
type CardProps = {
  faq: string[]
}
type CardTranslationsProps = {
  title: string
  subtitle: string
  description: string
  faq: Record<string, FaqTranslationsProps>
}
type FaqTranslationsProps = {
  title: string
  description: string
}
