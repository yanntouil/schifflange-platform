import { ExportedItem } from "@compo/contents"
import { proseVariants } from "../../../prose"
import { templates } from "./templates"

export const contentItem = {
  type: "medias-documents" as const,
  props: {
    level: "1",
    displayHeading: true,
    documents: [] as string[],
    template: "template-1" as keyof typeof templates,
  },
  translations: {
    fr: {
      title: "Titre des documents",
      subtitle: "Sous-titre optionnel",
      description: "Ajoutez une description pour présenter votre collection de documents",
    },
    en: {
      title: "Documents title",
      subtitle: "Optional subtitle",
      description: "Add a description to present your document collection",
    },
    de: {
      title: "Dokumententitel",
      subtitle: "Optionaler Untertitel",
      description: "Fügen Sie eine Beschreibung hinzu, um Ihre Dokumentensammlung zu präsentieren",
    },
  },
  dictionary: {
    fr: {
      "display-name": "Collection de documents",
      popover: {
        title: "Collection de documents",
        description:
          "Bloc permettant d'afficher une collection de documents téléchargeables avec différentes mises en page. Idéal pour présenter des PDF, guides, brochures ou ressources.",
      },
      form: {
        title: "Collection de documents",
        description: "Configurez votre collection de documents avec titre, description et sélection des fichiers à proposer au téléchargement.",
      },
    },
    en: {
      "display-name": "Document collection",
      popover: {
        title: "Document collection",
        description:
          "Block allowing to display a collection of downloadable documents with different layouts. Ideal for presenting PDFs, guides, brochures or resources.",
      },
      form: {
        title: "Document collection",
        description: "Configure your document collection with title, description and selection of files to offer for download.",
      },
    },
    de: {
      "display-name": "Dokumentensammlung",
      popover: {
        title: "Dokumentensammlung",
        description:
          "Block zur Anzeige einer Sammlung herunterladbarer Dokumente mit verschiedenen Layouts. Ideal für die Präsentation von PDFs, Leitfäden, Broschüren oder Ressourcen.",
      },
      form: {
        title: "Dokumentensammlung",
        description:
          "Konfigurieren Sie Ihre Dokumentensammlung mit Titel, Beschreibung und Auswahl der zum Download anzubietenden Dateien.",
      },
    },
  },
  templates,
  proses: {
    description: proseVariants({ variant: "heading" }),
  },
} satisfies ExportedItem
