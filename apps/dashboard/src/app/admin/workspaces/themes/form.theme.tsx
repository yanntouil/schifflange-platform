import { Form } from "@compo/form"
import { useTranslation } from "@compo/localize"
import React from "react"

/**
 * Theme form component
 */
export const ThemeForm: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  return (
    <div className="space-y-6">
      <Form.Input name="name" label={_("name")} placeholder={_("name-placeholder")} required />
      <Form.Textarea name="description" label={_("description")} placeholder={_("description-placeholder")} rows={3} />
      <Form.Image name="image" label={_("image")} />
      <Form.Switch name="isDefault" label={_("is-default")} />
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">{_("css-variables")}</h3>

        <Form.Fields name="config">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Light Theme */}
            <div className="space-y-4">
              <h4 className="text-md border-b pb-2 font-medium">{_("light-theme")}</h4>
              <Form.Fields name="light">
                <div className="space-y-4">
                  {/* Primary Colors */}
                  <div className="space-y-3">
                    <h5 className="text-muted-foreground text-sm font-medium">{_("primary-colors")}</h5>
                    <Form.Color name="primary" label={_("primary")} placeholder="hsla(222, 84%, 5%, 1)" />
                    <Form.Color name="primary-foreground" label={_("primary-foreground")} placeholder="hsla(210, 40%, 98%, 1)" />
                  </div>

                  {/* Secondary Colors */}
                  <div className="space-y-3">
                    <h5 className="text-muted-foreground text-sm font-medium">{_("secondary-colors")}</h5>
                    <Form.Color name="secondary" label={_("secondary")} placeholder="hsla(210, 40%, 96%, 1)" />
                    <Form.Color name="secondary-foreground" label={_("secondary-foreground")} placeholder="hsla(222, 84%, 5%, 1)" />
                  </div>

                  {/* Background Colors */}
                  <div className="space-y-3">
                    <h5 className="text-muted-foreground text-sm font-medium">{_("background-colors")}</h5>
                    <Form.Color name="background" label={_("background")} placeholder="hsla(0, 0%, 100%, 1)" />
                    <Form.Color name="foreground" label={_("foreground")} placeholder="hsla(222, 84%, 5%, 1)" />
                    <Form.Color name="muted" label={_("muted")} placeholder="hsla(210, 40%, 96%, 1)" />
                    <Form.Color name="muted-foreground" label={_("muted-foreground")} placeholder="hsla(215, 16%, 47%, 1)" />
                  </div>

                  {/* Accent & Destructive */}
                  <div className="space-y-3">
                    <h5 className="text-muted-foreground text-sm font-medium">{_("accent-colors")}</h5>
                    <Form.Color name="accent" label={_("accent")} placeholder="hsla(210, 40%, 96%, 1)" />
                    <Form.Color name="accent-foreground" label={_("accent-foreground")} placeholder="hsla(222, 84%, 5%, 1)" />
                    <Form.Color name="destructive" label={_("destructive")} placeholder="hsla(0, 84%, 60%, 1)" />
                    <Form.Color name="destructive-foreground" label={_("destructive-foreground")} placeholder="hsla(210, 40%, 98%, 1)" />
                  </div>

                  {/* Border & Input */}
                  <div className="space-y-3">
                    <h5 className="text-muted-foreground text-sm font-medium">{_("border-input")}</h5>
                    <Form.Color name="border" label={_("border")} placeholder="hsla(214, 32%, 91%, 1)" />
                    <Form.Color name="input" label={_("input")} placeholder="hsla(214, 32%, 91%, 1)" />
                    <Form.Color name="ring" label={_("ring")} placeholder="hsla(222, 84%, 5%, 1)" />
                  </div>

                  {/* Card & Popover */}
                  <div className="space-y-3">
                    <h5 className="text-muted-foreground text-sm font-medium">{_("card-popover")}</h5>
                    <Form.Color name="card" label={_("card")} placeholder="hsla(0, 0%, 100%, 1)" />
                    <Form.Color name="card-foreground" label={_("card-foreground")} placeholder="hsla(222, 84%, 5%, 1)" />
                    <Form.Color name="popover" label={_("popover")} placeholder="hsla(0, 0%, 100%, 1)" />
                    <Form.Color name="popover-foreground" label={_("popover-foreground")} placeholder="hsla(222, 84%, 5%, 1)" />
                  </div>

                  {/* Charts */}
                  <div className="space-y-3">
                    <h5 className="text-muted-foreground text-sm font-medium">{_("charts")}</h5>
                    <Form.Color name="chart-1" label={_("chart-1")} placeholder="oklch(0.646 0.222 41.116)" />
                    <Form.Color name="chart-2" label={_("chart-2")} placeholder="oklch(0.6 0.118 184.704)" />
                    <Form.Color name="chart-3" label={_("chart-3")} placeholder="oklch(0.398 0.07 227.392)" />
                    <Form.Color name="chart-4" label={_("chart-4")} placeholder="oklch(0.828 0.189 84.429)" />
                    <Form.Color name="chart-5" label={_("chart-5")} placeholder="oklch(0.769 0.188 70.08)" />
                  </div>
                </div>
              </Form.Fields>
            </div>

            {/* Dark Theme */}
            <div className="space-y-4">
              <h4 className="text-md border-b pb-2 font-medium">{_("dark-theme")}</h4>
              <Form.Fields name="dark">
                <div className="space-y-4">
                  {/* Primary Colors */}
                  <div className="space-y-3">
                    <h5 className="text-muted-foreground text-sm font-medium">{_("primary-colors")}</h5>
                    <Form.Color name="primary" label={_("primary")} placeholder="hsla(210, 40%, 98%, 1)" />
                    <Form.Color name="primary-foreground" label={_("primary-foreground")} placeholder="hsla(222, 84%, 5%, 1)" />
                  </div>

                  {/* Secondary Colors */}
                  <div className="space-y-3">
                    <h5 className="text-muted-foreground text-sm font-medium">{_("secondary-colors")}</h5>
                    <Form.Color name="secondary" label={_("secondary")} placeholder="hsla(217, 33%, 18%, 1)" />
                    <Form.Color name="secondary-foreground" label={_("secondary-foreground")} placeholder="hsla(210, 40%, 98%, 1)" />
                  </div>

                  {/* Background Colors */}
                  <div className="space-y-3">
                    <h5 className="text-muted-foreground text-sm font-medium">{_("background-colors")}</h5>
                    <Form.Color name="background" label={_("background")} placeholder="hsla(222, 84%, 5%, 1)" />
                    <Form.Color name="foreground" label={_("foreground")} placeholder="hsla(210, 40%, 98%, 1)" />
                    <Form.Color name="muted" label={_("muted")} placeholder="hsla(217, 33%, 18%, 1)" />
                    <Form.Color name="muted-foreground" label={_("muted-foreground")} placeholder="hsla(215, 20%, 65%, 1)" />
                  </div>

                  {/* Accent & Destructive */}
                  <div className="space-y-3">
                    <h5 className="text-muted-foreground text-sm font-medium">{_("accent-colors")}</h5>
                    <Form.Color name="accent" label={_("accent")} placeholder="hsla(217, 33%, 18%, 1)" />
                    <Form.Color name="accent-foreground" label={_("accent-foreground")} placeholder="hsla(210, 40%, 98%, 1)" />
                    <Form.Color name="destructive" label={_("destructive")} placeholder="hsla(0, 63%, 31%, 1)" />
                    <Form.Color name="destructive-foreground" label={_("destructive-foreground")} placeholder="hsla(210, 40%, 98%, 1)" />
                  </div>

                  {/* Border & Input */}
                  <div className="space-y-3">
                    <h5 className="text-muted-foreground text-sm font-medium">{_("border-input")}</h5>
                    <Form.Color name="border" label={_("border")} placeholder="hsla(217, 33%, 18%, 1)" />
                    <Form.Color name="input" label={_("input")} placeholder="hsla(217, 33%, 18%, 1)" />
                    <Form.Color name="ring" label={_("ring")} placeholder="hsla(213, 27%, 84%, 1)" />
                  </div>

                  {/* Card & Popover */}
                  <div className="space-y-3">
                    <h5 className="text-muted-foreground text-sm font-medium">{_("card-popover")}</h5>
                    <Form.Color name="card" label={_("card")} placeholder="hsla(222, 84%, 5%, 1)" />
                    <Form.Color name="card-foreground" label={_("card-foreground")} placeholder="hsla(210, 40%, 98%, 1)" />
                    <Form.Color name="popover" label={_("popover")} placeholder="hsla(222, 84%, 5%, 1)" />
                    <Form.Color name="popover-foreground" label={_("popover-foreground")} placeholder="hsla(210, 40%, 98%, 1)" />
                  </div>

                  {/* Charts */}
                  <div className="space-y-3">
                    <h5 className="text-muted-foreground text-sm font-medium">{_("charts")}</h5>
                    <Form.Color name="chart-1" label={_("chart-1")} placeholder="oklch(0.488 0.243 264.376)" />
                    <Form.Color name="chart-2" label={_("chart-2")} placeholder="oklch(0.696 0.17 162.48)" />
                    <Form.Color name="chart-3" label={_("chart-3")} placeholder="oklch(0.769 0.188 70.08)" />
                    <Form.Color name="chart-4" label={_("chart-4")} placeholder="oklch(0.627 0.265 303.9)" />
                    <Form.Color name="chart-5" label={_("chart-5")} placeholder="oklch(0.645 0.246 16.439)" />
                  </div>
                </div>
              </Form.Fields>
            </div>
          </div>
        </Form.Fields>
      </div>
    </div>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    name: "Name",
    "name-placeholder": "Enter theme name (e.g., Dark Mode, Corporate Blue)",
    description: "Description",
    "description-placeholder": "Describe this theme and when to use it",
    image: "Preview Image",
    "is-default": "Default Theme",
    "is-default-description": "Set as the default theme for new workspaces",

    // CSS Variables
    "css-variables": "CSS Variables",
    "light-theme": "Light Theme",
    "dark-theme": "Dark Theme",

    // Color Groups
    "primary-colors": "Primary Colors",
    "secondary-colors": "Secondary Colors",
    "background-colors": "Background Colors",
    "accent-colors": "Accent & Status Colors",
    "border-input": "Border & Input",
    "card-popover": "Card & Popover",
    charts: "Charts",

    // CSS Variables
    primary: "Primary",
    "primary-foreground": "Primary Foreground",
    secondary: "Secondary",
    "secondary-foreground": "Secondary Foreground",
    background: "Background",
    foreground: "Foreground",
    muted: "Muted",
    "muted-foreground": "Muted Foreground",
    accent: "Accent",
    "accent-foreground": "Accent Foreground",
    destructive: "Destructive",
    "destructive-foreground": "Destructive Foreground",
    border: "Border",
    input: "Input",
    ring: "Ring",
    card: "Card",
    "card-foreground": "Card Foreground",
    popover: "Popover",
    "popover-foreground": "Popover Foreground",
    "chart-1": "Chart 1",
    "chart-2": "Chart 2",
    "chart-3": "Chart 3",
    "chart-4": "Chart 4",
    "chart-5": "Chart 5",
  },
  fr: {
    name: "Nom",
    "name-placeholder": "Entrez le nom du thème (ex: Mode sombre, Bleu corporate)",
    description: "Description",
    "description-placeholder": "Décrivez ce thème et quand l'utiliser",
    image: "Image d'aperçu",
    "is-default": "Thème par défaut",
    "is-default-description": "Définir comme thème par défaut pour les nouveaux espaces de travail",

    // CSS Variables
    "css-variables": "Variables CSS",
    "light-theme": "Thème Clair",
    "dark-theme": "Thème Sombre",

    // Color Groups
    "primary-colors": "Couleurs Principales",
    "secondary-colors": "Couleurs Secondaires",
    "background-colors": "Couleurs d'Arrière-plan",
    "accent-colors": "Couleurs d'Accent et Statut",
    "border-input": "Bordure et Saisie",
    "card-popover": "Carte et Popover",
    charts: "Graphiques",

    // CSS Variables
    primary: "Principal",
    "primary-foreground": "Texte Principal",
    secondary: "Secondaire",
    "secondary-foreground": "Texte Secondaire",
    background: "Arrière-plan",
    foreground: "Premier plan",
    muted: "Atténué",
    "muted-foreground": "Texte Atténué",
    accent: "Accent",
    "accent-foreground": "Texte d'Accent",
    destructive: "Destructif",
    "destructive-foreground": "Texte Destructif",
    border: "Bordure",
    input: "Saisie",
    ring: "Anneau de focus",
    card: "Carte",
    "card-foreground": "Texte de Carte",
    popover: "Popover",
    "popover-foreground": "Texte de Popover",
    "chart-1": "Graphique 1",
    "chart-2": "Graphique 2",
    "chart-3": "Graphique 3",
    "chart-4": "Graphique 4",
    "chart-5": "Graphique 5",
  },
  de: {
    name: "Name",
    "name-placeholder": "Geben Sie den Namen des Themas ein (z.B. Dunkles Modus, Corporate-Blau)",
    description: "Beschreibung",
    "description-placeholder": "Beschreiben Sie dieses Thema und wann es verwendet werden soll",
    image: "Vorschaubild",
    "is-default": "Standard-Thema",
    "is-default-description": "Als Standard-Thema für neue Arbeitsbereiche festlegen",

    // CSS Variables
    "css-variables": "CSS-Variablen",
    "light-theme": "Hell-Thema",
    "dark-theme": "Dunkles Thema",

    // Color Groups
    "primary-colors": "Primäre Farben",
    "secondary-colors": "Sekundäre Farben",
    "background-colors": "Hintergrundfarben",
    "accent-colors": "Akzent- und Statusfarben",
    "border-input": "Rahmen und Eingabe",
    "card-popover": "Karte und Popover",
    charts: "Diagramme",

    // CSS Variables
    primary: "Primär",
    "primary-foreground": "Primärer Text",
    secondary: "Sekundär",
    "secondary-foreground": "Sekundärer Text",
    background: "Hintergrund",
    foreground: "Vordergrund",
    muted: "Leicht abgedunkelt",
    "muted-foreground": "Leicht abgedunkelter Text",
    accent: "Akzent",
    "accent-foreground": "Akzent-Text",
    destructive: "Zerstörend",
    "destructive-foreground": "Zerstörender Text",
    border: "Rahmen",
    input: "Eingabe",
    ring: "Ring",
    card: "Karte",
    "card-foreground": "Karten-Text",
    popover: "Popover",
    "popover-foreground": "Popover-Text",
    "chart-1": "Diagramm 1",
    "chart-2": "Graphique 2",
    "chart-3": "Diagramm 3",
    "chart-4": "Diagramm 4",
    "chart-5": "Diagramm 5",
  },
}
