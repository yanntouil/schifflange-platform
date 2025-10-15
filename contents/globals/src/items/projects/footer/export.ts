import { ExportedItem } from "@compo/contents"
import { proseVariants } from "../../../prose"
import { templates } from "./templates"

export const contentItem = {
  type: "projects-footer" as const,
  props: {
    level: "1",
    displayHeading: true,
  },
  translations: {
    fr: {
      title: "Une idée ?",
      subtitle: "Nous vous aidons à la concrétiser",
      description: `<p>Chez LumiQ, nous croyons que chaque professionnel est un acteur du changement. Nous mettons à votre disposition <b>des ressources concrètes</b> et <b>un accompagnement personnalisé</b> pour transformer votre idée en <b>action innovante</b>.</p>`,
    },
    en: {
      title: "Have an idea?",
      subtitle: "We help you concretize it",
      description: `<p>At LumiQ, we believe that every professional is an actor of change. We offer you <b>concrete resources</b> and <b>personalized support</b> to turn your idea into <b>innovative action</b>.</p>`,
    },
    de: {
      title: "Eine Idee?",
      subtitle: "Wir helfen Ihnen, sie zu verwirklichen",
      description: `<p>Bei LumiQ glauben wir, dass jeder Fachmann ein Akteur des Wandels ist. Wir bieten Ihnen <b>konkrete Ressourcen</b> und <b>persönlichen Support</b>, um Ihre Idee in <b>innovative Handlungen</b> zu verwandeln.</p>`,
    },
  },
  dictionary: {
    fr: {
      "display-name": "Pied de page des projets",
      popover: {
        title: "Pied de page des projets",
        description: "Pied de page des projets avec titre, sous-titre et description",
      },
      form: {
        title: "Configurer le pied de page",
        description: "Configurer le titre, le sous-titre et la description du pied de page",
      },
    },
    en: {
      "display-name": "Project footer",
      popover: {
        title: "Project footer",
        description: "Project footer with title, subtitle and description",
      },
      form: {
        title: "Configurer le pied de page",
        description: "Configurer le titre, le sous-titre et la description du pied de page",
      },
    },
    de: {
      "display-name": "Projekt-Pied de page",
      popover: {
        title: "Projekt-Pied de page",
        description: "Projekt-Pied de page mit Titel, Untertitel und Beschreibung",
      },
      form: {
        title: "Konfigurieren Sie das Projekt-Pied de page",
        description: "Konfigurieren Sie den Titel, den Untertitel und die Beschreibung des Projekt-Pied de page",
      },
    },
  },
  templates,
  proses: {
    description: proseVariants({ variant: "heading" }),
  },
} satisfies ExportedItem
