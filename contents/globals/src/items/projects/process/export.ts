import { Cms, ExportedItem } from "@compo/contents"
import { proseVariants } from "../../../prose"
import { templates } from "./templates"

export const contentItem = {
  type: "projects-process" as const,
  props: {
    level: "1",
    displayHeading: true,
    cards: {
      consultation: {
        display: true,
        link: Cms.Links.makeInitialLink(),
      },
      incubation: {
        display: true,
        link: Cms.Links.makeInitialLink(),
      },
      scaling: {
        display: true,
        link: Cms.Links.makeInitialLink(),
      },
    },
    // template: "" as keyof typeof templates,
  },
  translations: {
    fr: {
      title: "Notre processus",
      subtitle: "De l'idée à la réalisation",
      description: "Découvrez les étapes clés de notre méthodologie pour mener à bien vos projets",
      cards: {
        consultation: {
          title: "Période de consultation",
          description: "Nous analysons vos besoins et définissons ensemble les objectifs de votre projet",
          link: Cms.Links.makeInitialLinkTranslation({ text: "Consulter" }),
        },
        incubation: {
          title: "Période d'incubation",
          description: "Nous développons et prototypons les solutions adaptées à vos enjeux",
          link: Cms.Links.makeInitialLinkTranslation({ text: "Consulter" }),
        },
        scaling: {
          title: "Période de multiplication",
          description: "Nous accompagnons la mise en œuvre et l'évolution de votre solution",
          link: Cms.Links.makeInitialLinkTranslation({ text: "Consulter" }),
        },
      },
    },
    en: {
      title: "Our process",
      subtitle: "From idea to realization",
      description: "Discover the key steps of our methodology to successfully complete your projects",
      cards: {
        consultation: {
          title: "Consultation period",
          description: "We analyze your needs and define together the objectives of your project",
          link: Cms.Links.makeInitialLinkTranslation({ text: "View details" }),
        },
        incubation: {
          title: "Incubation period",
          description: "We develop and prototype solutions adapted to your challenges",
          link: Cms.Links.makeInitialLinkTranslation({ text: "View details" }),
        },
        scaling: {
          title: "Scaling period",
          description: "We support the implementation and evolution of your solution",
          link: Cms.Links.makeInitialLinkTranslation({ text: "View details" }),
        },
      },
    },
    de: {
      title: "Unser Prozess",
      subtitle: "Von der Idee zur Umsetzung",
      description: "Entdecken Sie die wichtigsten Schritte unserer Methodik für erfolgreiche Projekte",
      cards: {
        consultation: {
          title: "Beratungsphase",
          description: "Wir analysieren Ihre Bedürfnisse und definieren gemeinsam die Ziele Ihres Projekts",
          link: Cms.Links.makeInitialLinkTranslation({ text: "Details anzeigen" }),
        },
        incubation: {
          title: "Inkubationsphase",
          description:
            "Wir entwickeln und erstellen Prototypen für Lösungen, die auf Ihre Herausforderungen zugeschnitten sind",
          link: Cms.Links.makeInitialLinkTranslation({ text: "Details anzeigen" }),
        },
        scaling: {
          title: "Skalierungsphase",
          description: "Wir begleiten die Implementierung und Weiterentwicklung Ihrer Lösung",
          link: Cms.Links.makeInitialLinkTranslation({ text: "Details anzeigen" }),
        },
      },
    },
  },
  dictionary: {
    fr: {
      "display-name": "Processus",
      popover: {
        title: "Bloc processus",
        description:
          "Présentation en 3 étapes de votre méthodologie ou processus de travail. Idéal pour expliquer votre approche de manière structurée",
      },
      form: {
        title: "Configurer le processus",
        description: "Personnalisez les 3 étapes de votre processus avec titres, descriptions et liens",
      },
    },
    en: {
      "display-name": "Process",
      popover: {
        title: "Process block",
        description:
          "3-step presentation of your methodology or work process. Ideal for explaining your approach in a structured way",
      },
      form: {
        title: "Configure process",
        description: "Customize the 3 steps of your process with titles, descriptions and links",
      },
    },
    de: {
      "display-name": "Prozess",
      popover: {
        title: "Prozessblock",
        description:
          "3-stufige Darstellung Ihrer Methodik oder Ihres Arbeitsprozesses. Ideal, um Ihren Ansatz strukturiert zu erklären",
      },
      form: {
        title: "Prozess konfigurieren",
        description: "Passen Sie die 3 Schritte Ihres Prozesses mit Titeln, Beschreibungen und Links an",
      },
    },
  },
  templates,
  proses: {
    description: proseVariants({ variant: "heading" }),
    cardDescription: proseVariants({ variant: "card" }),
  },
} satisfies ExportedItem
