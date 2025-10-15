import { ExportedItem } from "@compo/contents"
import { proseVariants } from "../../../prose"
import { templates } from "./templates"

export const contentItem = {
  type: "medias-videos" as const,
  props: {
    level: "1",
    displayHeading: true,
    orderedVideos: [] as string[],
    videos: {} as Record<string, VideoProps>,
    limit: 6,
    // template: "template-1" as keyof typeof templates,
  },
  translations: {
    fr: {
      title: "Nos publications",
      subtitle: "Documents et ressources",
      description: "Découvrez nos publications, brochures et documents téléchargeables",
      publications: {} as Record<string, VideoTranslationsProps>,
      moreText: "Découvrez d'autres publications",
    },
    en: {
      title: "Our publications",
      subtitle: "Documents and resources",
      description: "Discover our publications, brochures and downloadable documents",
      publications: {} as Record<string, VideoTranslationsProps>,
      moreText: "Discover more publications",
    },
    de: {
      title: "Unsere Publikationen",
      subtitle: "Dokumente und Ressourcen",
      description: "Entdecken Sie unsere Publikationen, Broschüren und herunterladbare Dokumente",
      publications: {} as Record<string, VideoTranslationsProps>,
      moreText: "Weitere Publikationen entdecken",
    },
  },
  dictionary: {
    fr: {
      "display-name": "Publications",
      popover: {
        title: "Bloc de publications",
        description:
          "Affichez vos documents PDF, brochures et autres publications téléchargeables avec aperçu et liens de téléchargement. Parfait pour une médiathèque ou centre de ressources.",
      },
      form: {
        title: "Gérer les publications",
        description: "Configurez la liste de vos publications avec miniatures, fichiers et liens de téléchargement.",
      },
    },
    en: {
      "display-name": "Publications",
      popover: {
        title: "Publications block",
        description:
          "Display your PDF documents, brochures and other downloadable publications with preview and download links. Perfect for a media library or resource center.",
      },
      form: {
        title: "Manage publications",
        description: "Configure your publications list with thumbnails, files and download links.",
      },
    },
    de: {
      "display-name": "Publikationen",
      popover: {
        title: "Publikationsblock",
        description:
          "Zeigen Sie Ihre PDF-Dokumente, Broschüren und andere herunterladbare Publikationen mit Vorschau und Download-Links an. Perfekt für eine Mediathek oder ein Ressourcenzentrum.",
      },
      form: {
        title: "Publikationen verwalten",
        description: "Konfigurieren Sie Ihre Publikationsliste mit Miniaturbildern, Dateien und Download-Links.",
      },
    },
  },
  templates,
  proses: {
    description: proseVariants({ variant: "headings" }),
    videoDescription: proseVariants({ variant: "default" }),
  },
} satisfies ExportedItem
type VideoProps = {
  thumbnail: string | null
  file: string | null
}
type VideoTranslationsProps = {
  title: string
  description: string
}
