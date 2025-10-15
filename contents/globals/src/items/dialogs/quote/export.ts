import { ExportedItem } from "@compo/contents"
import { proseVariants } from "../../../prose"
import { templates } from "./templates"

export const contentItem = {
  type: "dialogs-quote" as const,
  props: {
    level: "2",
    // displayHeading: true,
    // template: "template-1" as keyof typeof templates,
  },
  translations: {
    fr: {
      title: "Citation importante",
      content: `<p>Ajoutez ici votre citation, témoignage ou point important à mettre en avant.</p>`,
    },
    en: {
      title: "Important quote",
      content: `<p>Add here your quote, testimonial or important point to highlight.</p>`,
    },
    de: {
      title: "Wichtiges Zitat",
      content: `<p>Fügen Sie hier Ihr Zitat, Zeugnis oder wichtigen Punkt zum Hervorheben hinzu.</p>`,
    },
  },
  dictionary: {
    fr: {
      "display-name": "Citation",
      popover: {
        title: "Bloc de citation",
        description:
          "Bloc pour mettre en avant des citations, témoignages ou points importants avec une mise en forme distinctive.",
      },
      form: {
        title: "Éditer la citation",
        description: "Rédigez votre citation ou témoignage à mettre en avant",
      },
    },
    en: {
      "display-name": "Quote",
      popover: {
        title: "Quote block",
        description:
          "Block to highlight quotes, testimonials or important points with distinctive formatting.",
      },
      form: {
        title: "Edit quote",
        description: "Write your quote or testimonial to highlight",
      },
    },
    de: {
      "display-name": "Zitat",
      popover: {
        title: "Zitat-Block",
        description:
          "Block zum Hervorheben von Zitaten, Testimonials oder wichtigen Punkten mit charakteristischer Formatierung.",
      },
      form: {
        title: "Zitat bearbeiten",
        description: "Schreiben Sie Ihr Zitat oder Testimonial zum Hervorheben",
      },
    },
  },
  templates,
  proses: {
    content: proseVariants({ variant: "default" }),
  },
} satisfies ExportedItem
