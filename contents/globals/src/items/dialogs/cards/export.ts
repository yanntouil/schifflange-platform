import { Cms, ExportedItem } from "@compo/contents"
import { proseVariants } from "../../../prose"
import { templates } from "./templates"

export const contentItem = {
  type: "dialogs-cards" as const,
  props: {
    level: "1",
    displayHeading: true,
    orderedCards: [] as string[],
    cards: {} as Record<string, CardProps>,
    // template: "template-1" as keyof typeof templates,
  },
  translations: {
    fr: {
      title: "Nos services",
      subtitle: "Ce que nous proposons",
      description: "Découvrez l'ensemble de nos services et solutions adaptées à vos besoins",
      cards: {} as Record<string, CardTranslationsProps>,
    },
    en: {
      title: "Our services",
      subtitle: "What we offer",
      description: "Discover all our services and solutions tailored to your needs",
      cards: {} as Record<string, CardTranslationsProps>,
    },
    de: {
      title: "Unsere Dienstleistungen",
      subtitle: "Was wir anbieten",
      description: "Entdecken Sie alle unsere Dienstleistungen und auf Ihre Bedürfnisse zugeschnittene Lösungen",
      cards: {} as Record<string, CardTranslationsProps>,
    },
  },
  dictionary: {
    fr: {
      "display-name": "Cartes",
      popover: {
        title: "Cartes de présentation",
        description:
          "Bloc de cartes personnalisables avec images, textes et liens. Parfait pour présenter des services, produits ou fonctionnalités avec différents styles visuels",
      },
      form: {
        title: "Gérer les cartes",
        description: "Ajoutez et personnalisez vos cartes avec titre, description, image et lien optionnel",
      },
    },
    en: {
      "display-name": "Cards",
      popover: {
        title: "Presentation cards",
        description:
          "Customizable card block with images, texts and links. Perfect for presenting services, products or features with different visual styles",
      },
      form: {
        title: "Manage cards",
        description: "Add and customize your cards with title, description, image and optional link",
      },
    },
    de: {
      "display-name": "Karten",
      popover: {
        title: "Präsentationskarten",
        description:
          "Anpassbarer Kartenblock mit Bildern, Texten und Links. Perfekt zur Präsentation von Dienstleistungen, Produkten oder Funktionen mit verschiedenen visuellen Stilen",
      },
      form: {
        title: "Karten verwalten",
        description:
          "Fügen Sie Ihre Karten hinzu und passen Sie sie mit Titel, Beschreibung, Bild und optionalem Link an",
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
