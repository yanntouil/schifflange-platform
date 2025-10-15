import { Cms, ExportedItem } from "@compo/contents"
import { proseVariants } from "../../../prose"
import { templates } from "./templates"

export const contentItem = {
  type: "headings-video" as const,
  props: {
    level: "1",
    video: Cms.Videos.makeVideo(),
    // template: "template-1" as keyof typeof templates,
  },
  translations: {
    fr: {
      title: "Titre principal",
      subtitle: "Sous-titre optionnel",
      description: "Ajoutez une description pour accompagner votre titre et votre vidéo",
    },
    en: {
      title: "Main title",
      subtitle: "Optional subtitle",
      description: "Add a description to accompany your title and video",
    },
    de: {
      title: "Haupttitel",
      subtitle: "Optionaler Untertitel",
      description: "Fügen Sie eine Beschreibung hinzu, um Ihren Titel und Ihr Video zu begleiten",
    },
  },
  dictionary: {
    fr: {
      "display-name": "Entête vidéo",
      popover: {
        title: "Entête vidéo",
        description:
          "Entête contenant un titre, un sous-titre, une description et une vidéo décorative sur le côté. Idéal pour créer un impact visuel dynamique.",
      },
      form: {
        title: "Entête vidéo",
        description: "Entête contenant un titre, un sous-titre, une description et une vidéo décorative.",
      },
    },
    en: {
      "display-name": "Video heading",
      popover: {
        title: "Video heading",
        description:
          "Heading containing a title, a subtitle, a description and a decorative video on the side. Ideal for creating a dynamic visual impact.",
      },
      form: {
        title: "Video heading",
        description: "Heading containing a title, a subtitle, a description and a decorative video.",
      },
    },
    de: {
      "display-name": "Videoüberschrift",
      popover: {
        title: "Videoüberschrift",
        description:
          "Überschrift mit Titel, Untertitel, Beschreibung und dekorativem Video an der Seite. Ideal für einen dynamischen visuellen Eindruck.",
      },
      form: {
        title: "Videoüberschrift",
        description: "Überschrift mit Titel, Untertitel, Beschreibung und dekorativem Video.",
      },
    },
  },
  templates,
  proses: {
    description: proseVariants({ variant: "heading" }),
  },
} satisfies ExportedItem
