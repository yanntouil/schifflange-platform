import { ExportedItem } from "@compo/contents"
import { proseVariants } from "../../../prose"
import { templates } from "./templates"

export const contentItem = {
  type: "features-activities" as const,
  props: {
    level: "1",
    displayHeading: true,
    orderedCards: [] as string[],
    cards: {} as Record<string, CardProps>,
    template: "template-1" as keyof typeof templates,
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
      "display-name": "Activités",
      popover: {
        title: "Activités de présentation",
        description:
          "Bloc d'activités personnalisables avec images, textes et liens. Parfait pour présenter des services, produits ou fonctionnalités avec différents styles visuels",
      },
      form: {
        title: "Gérer les activités",
        description: "Ajoutez et personnalisez vos activités avec titre, description, image et lien optionnel",
      },
    },
    en: {
      "display-name": "Activities",
      popover: {
        title: "Presentation activities",
        description:
          "Customizable activities block with images, texts and links. Perfect for presenting services, products or features with different visual styles",
      },
      form: {
        title: "Manage activities",
        description: "Add and customize your activities with title, description, image and optional link",
      },
    },
    de: {
      "display-name": "Aktivitäten",
      popover: {
        title: "Präsentationsaktivitäten",
        description:
          "Anpassbarer Aktivitätenblock mit Bildern, Texten und Links. Perfekt zur Präsentation von Dienstleistungen, Produkten oder Funktionen mit verschiedenen visuellen Stilen",
      },
      form: {
        title: "Aktivitäten verwalten",
        description:
          "Fügen Sie Ihre Aktivitäten hinzu und passen Sie sie mit Titel, Beschreibung, Bild und optionalem Link an",
      },
    },
  },
  templates,
  proses: {
    description: proseVariants({ variant: "heading" }),
    cardDescription: proseVariants({ variant: "card" }),
    // buttonLink: "",
    // buttonPrimary: "",
    // buttonSecondary: "",
    // buttonHighlight: "",
  },
} satisfies ExportedItem

type CardProps = {
  image: string | null
}
type CardTranslationsProps = {
  title: string
  subtitle: string
  description: string
}
