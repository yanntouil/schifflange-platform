import { ExportedItem } from "@compo/contents"
import { templates } from "./templates"

export const contentItem = {
  type: "contents-rich-text" as const,
  props: {
    level: "2",
    displayHeading: true,
    template: "template-1" as keyof typeof templates,
  },
  translations: {
    fr: {
      title: "Contenu riche",
      subtitle: "Exprimez-vous librement",
      description: "Utilisez l'éditeur de texte enrichi pour créer du contenu formaté avec style",
      content: `<p>Bienvenue dans l'éditeur de texte enrichi. Vous pouvez créer du contenu avec:</p>
<ul>
  <li><strong>Texte en gras</strong> pour l'emphase</li>
  <li><em>Texte en italique</em> pour la nuance</li>
  <li>Listes à puces ou numérotées</li>
  <li>Liens, citations et bien plus</li>
</ul>
<p>Commencez à écrire votre contenu ici...</p>`,
    },
    en: {
      title: "Rich content",
      subtitle: "Express yourself freely",
      description: "Use the rich text editor to create beautifully formatted content",
      content: `<p>Welcome to the rich text editor. You can create content with:</p>
<ul>
  <li><strong>Bold text</strong> for emphasis</li>
  <li><em>Italic text</em> for nuance</li>
  <li>Bullet or numbered lists</li>
  <li>Links, quotes and much more</li>
</ul>
<p>Start writing your content here...</p>`,
    },
    de: {
      title: "Rich-Content",
      subtitle: "Drücken Sie sich frei aus",
      description: "Verwenden Sie den Rich-Text-Editor, um formatierten Inhalt mit Stil zu erstellen",
      content: `<p>Willkommen im Rich-Text-Editor. Sie können Inhalte erstellen mit:</p>
<ul>
  <li><strong>Fettgedrucktem Text</strong> zur Betonung</li>
  <li><em>Kursivem Text</em> für Nuancen</li>
  <li>Aufzählungslisten oder nummerierten Listen</li>
  <li>Links, Zitaten und vielem mehr</li>
</ul>
<p>Beginnen Sie hier mit dem Schreiben Ihres Inhalts...</p>`,
    },
    lb: {
      title: "Rich content",
      subtitle: "Express yourself freely",
      description: "Use the rich text editor to create beautifully formatted content",
      content: `<p>Welcome to the rich text editor. You can create content with:</p>
<ul>
  <li><strong>Bold text</strong> for emphasis</li>
  <li><em>Italic text</em> for nuance</li>
  <li>Bullet or numbered lists</li>
  <li>Links, quotes and much more</li>
</ul>
<p>Start writing your content here...</p>`,
    },
  },
  dictionary: {
    fr: {
      "display-name": "Texte enrichi",
      popover: {
        title: "Contenu texte enrichi",
        description:
          "Bloc de contenu avec éditeur de texte complet. Idéal pour des articles, descriptions détaillées ou contenus formatés",
      },
      form: {
        title: "Éditer le contenu",
        description: "Rédigez votre contenu avec toutes les options de mise en forme disponibles",
      },
    },
    en: {
      "display-name": "Rich text",
      popover: {
        title: "Rich text content",
        description:
          "Content block with full text editor. Perfect for articles, detailed descriptions or formatted content",
      },
      form: {
        title: "Edit content",
        description: "Write your content with all available formatting options",
      },
    },
    de: {
      "display-name": "Rich-Text",
      popover: {
        title: "Rich-Text-Inhalt",
        description:
          "Inhaltsblock mit vollständigem Texteditor. Perfekt für Artikel, detaillierte Beschreibungen oder formatierten Inhalt",
      },
      form: {
        title: "Inhalt bearbeiten",
        description: "Schreiben Sie Ihren Inhalt mit allen verfügbaren Formatierungsoptionen",
      },
    },
  },
  templates,
  proses: {
    description: "",
    "template-1": "",
  },
} satisfies ExportedItem
