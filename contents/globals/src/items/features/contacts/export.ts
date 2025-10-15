import { Cms, ExportedItem } from "@compo/contents"
import { proseVariants } from "../../../prose"
import { templates } from "./templates"

export const contentItem = {
  type: "features-contacts" as const,
  props: {
    level: "1",
    displayHeading: true,
    orderedCards: [] as string[],
    cards: {} as Record<string, CardProps>,
    template: "template-1" as keyof typeof templates,
  },
  translations: {
    fr: {
      title: "Nos contacts",
      subtitle: "Contactez-nous",
      description: "Contactez-nous pour toute question ou demande de service",
      cards: {} as Record<string, CardTranslationsProps>,
    },
    en: {
      title: "Our contacts",
      subtitle: "Contact us",
      description: "Contact us for any question or service request",
      cards: {} as Record<string, CardTranslationsProps>,
    },
    de: {
      title: "Unsere Kontakte",
      subtitle: "Kontaktieren Sie uns",
      description: "Kontaktieren Sie uns für Fragen oder Serviceanfragen",
      cards: {} as Record<string, CardTranslationsProps>,
    },
  },
  dictionary: {
    fr: {
      "display-name": "Contacts",
      popover: {
        title: "Contacts",
        description:
          "Bloc de contacts personnalisables avec images, textes et liens. Parfait pour présenter des contacts avec différents styles visuels",
      },
      form: {
        title: "Gérer les contacts",
        description: "Ajoutez et personnalisez vos cartes avec titre, description, image et lien optionnel",
      },
    },
    en: {
      "display-name": "Contacts",
      popover: {
        title: "Presentation contacts",
        description:
          "Customizable contact block with images, texts and links. Perfect for presenting contacts with different visual styles",
      },
      form: {
        title: "Manage contacts",
        description: "Add and customize your cards with title, description, image and optional link",
      },
    },
    de: {
      "display-name": "Kontakte",
      popover: {
        title: "Präsentationskontakte",
        description:
          "Anpassbarer Kontaktblock mit Bildern, Texten und Links. Perfekt zur Präsentation von Kontakten mit verschiedenen visuellen Stilen",
      },
      form: {
        title: "Kontakte verwalten",
        description:
          "Fügen Sie Ihre Kontakte hinzu und passen Sie sie mit Titel, Beschreibung, Bild und optionalem Link an",
      },
    },
  },
  templates,
  proses: {
    description: proseVariants({ variant: "heading" }),
    cardDescription: proseVariants({ variant: "card" }),
  },
} satisfies ExportedItem

type CardProps = {
  image: string | null
  type: CardType
  displayLink: boolean
  link: Cms.Links.LinkProps
}
type CardTranslationsProps = {
  title: string
  subtitle: string
  description: string
  link: Cms.Links.LinkTranslationsProps
}
type CardType = "gold" | "finch" | "moss" | "glacier" | "white"
