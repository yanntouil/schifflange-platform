import { Api } from "@/services"
import { Form, useForm } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { Recharts, Ui } from "@compo/ui"
import { F } from "@compo/utils"
import { Palette } from "lucide-react"
import React from "react"
import { makeThemeStyles } from "./utils"

/**
 * dialog use to preview a theme
 */
export const PreviewThemeDialog: React.FC<Ui.QuickDialogProps<Api.Admin.WorkspaceTheme>> = ({ item, ...props }) => {
  const { _ } = useTranslation(dictionary)
  return (
    <Ui.QuickDialog
      {...props}
      title={_(`title`)}
      description={_(`description`)}
      classNames={{ content: "sm:max-w-4xl", close: "z-10", header: "z-10" }}
      sticky
    >
      {item !== false && <Content item={item} {...props} />}
    </Ui.QuickDialog>
  )
}

/**
 * form to preview a theme
 */
const Content: React.FC<Ui.QuickDialogSafeProps<Api.Admin.WorkspaceTheme>> = ({ item: theme, close }) => {
  const { _ } = useTranslation(dictionary)
  const { scheme } = Ui.useTheme()
  const stylesTheme = makeThemeStyles(theme.config)
  const styles = scheme === "dark" ? stylesTheme.dark : stylesTheme.light
  const form = useForm({
    values: {
      name: "John Doe",
      message: "This is a sample message for the theme preview",
      country: "fr",
      themePreference: "auto",
      analytics: false,
      notifications: true,
    },
    onSubmit: F.identity,
  })
  return (
    <div className="@container relative isolate z-0" style={styles}>
      <Form.Root form={form}>
        <div className="space-y-12 p-6">
          {/* Buttons Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{_("buttons")}</h3>
            <div className="flex flex-wrap gap-3">
              <Ui.Button variant="default">{_("default")}</Ui.Button>
              <Ui.Button variant="secondary">{_("secondary")}</Ui.Button>
              <Ui.Button variant="destructive">{_("destructive")}</Ui.Button>
              <Ui.Button variant="outline">{_("outline")}</Ui.Button>
              <Ui.Button variant="ghost">{_("ghost")}</Ui.Button>
              <Ui.Button variant="link">{_("link")}</Ui.Button>
            </div>
            <div className="flex flex-wrap gap-3">
              <Ui.Button size="xxs">{_("xx-small")}</Ui.Button>
              <Ui.Button size="xs">{_("x-small")}</Ui.Button>
              <Ui.Button size="sm">{_("small")}</Ui.Button>
              <Ui.Button size="default">{_("default")}</Ui.Button>
              <Ui.Button size="lg">{_("large")}</Ui.Button>
              <Ui.Button disabled>{_("disabled")}</Ui.Button>
            </div>
            <div className="flex flex-wrap gap-3">
              <Ui.Button variant="default" icon>
                <Palette />
              </Ui.Button>
              <Ui.Button variant="secondary" icon>
                <Palette />
              </Ui.Button>
              <Ui.Button variant="destructive" icon>
                <Palette />
              </Ui.Button>
              <Ui.Button variant="outline" icon>
                <Palette />
              </Ui.Button>
              <Ui.Button variant="ghost" icon>
                <Palette />
              </Ui.Button>
              <Ui.Button variant="link" icon>
                <Palette />
              </Ui.Button>
            </div>
            <div className="flex flex-wrap gap-3">
              <Ui.Button size="xxs" icon>
                <Palette />
              </Ui.Button>
              <Ui.Button size="xs" icon>
                <Palette />
              </Ui.Button>
              <Ui.Button size="sm" icon>
                <Palette />
              </Ui.Button>
              <Ui.Button size="default" icon>
                <Palette />
              </Ui.Button>
              <Ui.Button size="lg" icon>
                <Palette />
              </Ui.Button>
              <Ui.Button disabled icon>
                <Palette />
              </Ui.Button>
            </div>
          </div>

          {/* Cards Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{_("cards")}</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Ui.Card.Root>
                <Ui.Card.Header>
                  <Ui.Card.Title>{_("card-title")}</Ui.Card.Title>
                  <Ui.Card.Description>{_("card-description")}</Ui.Card.Description>
                </Ui.Card.Header>
                <Ui.Card.Content>
                  <p className="text-muted-foreground text-sm">{_("card-content")}</p>
                </Ui.Card.Content>
                <Ui.Card.Footer>
                  <Ui.Button size="sm">{_("action")}</Ui.Button>
                </Ui.Card.Footer>
              </Ui.Card.Root>

              <Ui.Card.Root>
                <Ui.Card.Header>
                  <Ui.Card.Title>{_("settings")}</Ui.Card.Title>
                </Ui.Card.Header>
                <Ui.Card.Content className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{_("notifications")}</span>
                    <Ui.Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{_("dark-mode")}</span>
                    <Ui.Switch checked />
                  </div>
                </Ui.Card.Content>
              </Ui.Card.Root>
            </div>
          </div>

          {/* Form Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{_("forms")}</h3>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="space-y-4">
                <Form.Input name="name" label={_("name")} placeholder={_("enter-name")} />
                <Form.Textarea name="message" label={_("message")} placeholder={_("enter-message")} rows={3} />
                <Form.Select name="country" label={_("country")}>
                  <Ui.Select.Item value="fr">{_("france")}</Ui.Select.Item>
                  <Ui.Select.Item value="en">{_("england")}</Ui.Select.Item>
                  <Ui.Select.Item value="es">{_("spain")}</Ui.Select.Item>
                </Form.Select>
              </div>
              <div className="space-y-4">
                <Form.RadioGroup
                  name="themePreference"
                  label={_("theme-preference")}
                  options={[
                    { value: "light", label: _("light") },
                    { value: "dark", label: _("dark") },
                    { value: "auto", label: _("auto") },
                  ]}
                />
                <div className="space-y-3">
                  <h4 className="flex min-h-6 items-center justify-between text-sm font-medium">{_("features")}</h4>
                  <Form.Checkbox name="analytics" label={_("analytics")} />
                  <Form.Checkbox name="notifications" label={_("notifications")} />
                </div>
              </div>
            </div>
          </div>

          {/* Navigation & State Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{_("navigation")}</h3>
            <div className="space-y-4">
              <Ui.Tabs.Root defaultValue="overview">
                <Ui.Tabs.List>
                  <Ui.Tabs.Trigger value="overview">{_("overview")}</Ui.Tabs.Trigger>
                  <Ui.Tabs.Trigger value="analytics">{_("analytics")}</Ui.Tabs.Trigger>
                  <Ui.Tabs.Trigger value="settings">{_("settings")}</Ui.Tabs.Trigger>
                </Ui.Tabs.List>
                <Ui.Tabs.Content value="overview" className="mt-4">
                  <Ui.Card.Root>
                    <Ui.Card.Content className="pt-6">
                      <p className="text-muted-foreground text-sm">{_("overview-content")}</p>
                    </Ui.Card.Content>
                  </Ui.Card.Root>
                </Ui.Tabs.Content>
                <Ui.Tabs.Content value="analytics" className="mt-4">
                  <div className="space-y-2">
                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950">
                      <p className="text-sm text-blue-800 dark:text-blue-200">{_("alert-info")}</p>
                    </div>
                  </div>
                </Ui.Tabs.Content>
                <Ui.Tabs.Content value="settings" className="mt-4">
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950">
                    <h4 className="mb-1 text-sm font-medium text-red-800 dark:text-red-200">{_("warning")}</h4>
                    <p className="text-sm text-red-700 dark:text-red-300">{_("alert-warning")}</p>
                  </div>
                </Ui.Tabs.Content>
              </Ui.Tabs.Root>

              <div className="flex items-center gap-4 py-2">
                <Ui.Badge>{_("new")}</Ui.Badge>
                <Ui.Badge variant="secondary">{_("updated")}</Ui.Badge>
                <Ui.Badge variant="destructive">{_("urgent")}</Ui.Badge>
                <Ui.Badge variant="outline">{_("draft")}</Ui.Badge>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{_("charts")}</h3>
            <div className="flex flex-col gap-8">
              {/* Bar Chart */}
              <div className="space-y-3">
                <h4 className="text-muted-foreground text-sm font-medium">{_("bar-chart")}</h4>
                <Ui.Chart.Container
                  config={{
                    users: {
                      label: _("users"),
                      color: "var(--chart-1)",
                    },
                    growth: {
                      label: _("growth"),
                      color: "var(--chart-2)",
                    },
                  }}
                  className="h-[300px] w-full"
                >
                  <Recharts.BarChart
                    data={[
                      { month: _("jan"), users: 186, growth: 80 },
                      { month: _("feb"), users: 305, growth: 200 },
                      { month: _("mar"), users: 237, growth: 120 },
                      { month: _("apr"), users: 273, growth: 190 },
                      { month: _("may"), users: 209, growth: 130 },
                      { month: _("jun"), users: 314, growth: 140 },
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <Recharts.CartesianGrid strokeDasharray="3 3" />
                    <Recharts.XAxis dataKey="month" />
                    <Recharts.YAxis />
                    <Ui.Chart.Tooltip content={<Ui.Chart.TooltipContent />} />
                    <Recharts.Bar dataKey="users" fill="var(--color-users)" />
                    <Recharts.Bar dataKey="growth" fill="var(--color-growth)" />
                  </Recharts.BarChart>
                </Ui.Chart.Container>
              </div>

              {/* Line Chart */}
              <div className="space-y-3">
                <h4 className="text-muted-foreground text-sm font-medium">{_("line-chart")}</h4>
                <Ui.Chart.Container
                  config={{
                    revenue: {
                      label: _("revenue"),
                      color: "var(--chart-3)",
                    },
                    profit: {
                      label: _("profit"),
                      color: "var(--chart-4)",
                    },
                  }}
                  className="h-[300px] w-full"
                >
                  <Recharts.LineChart
                    data={[
                      { month: _("jan"), revenue: 4000, profit: 2400 },
                      { month: _("feb"), revenue: 3000, profit: 1398 },
                      { month: _("mar"), revenue: 2000, profit: 9800 },
                      { month: _("apr"), revenue: 2780, profit: 3908 },
                      { month: _("may"), revenue: 1890, profit: 4800 },
                      { month: _("jun"), revenue: 2390, profit: 3800 },
                    ]}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <Recharts.CartesianGrid strokeDasharray="3 3" />
                    <Recharts.XAxis dataKey="month" />
                    <Recharts.YAxis />
                    <Ui.Chart.Tooltip content={<Ui.Chart.TooltipContent />} />
                    <Recharts.Line type="monotone" dataKey="revenue" stroke="var(--color-revenue)" strokeWidth={2} />
                    <Recharts.Line type="monotone" dataKey="profit" stroke="var(--color-profit)" strokeWidth={2} />
                  </Recharts.LineChart>
                </Ui.Chart.Container>
              </div>
            </div>
          </div>

          {/* Data Display */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{_("data-display")}</h3>
            <Ui.Table.Root>
              <Ui.Table.Header>
                <Ui.Table.Row>
                  <Ui.Table.Head>{_("name")}</Ui.Table.Head>
                  <Ui.Table.Head>{_("status")}</Ui.Table.Head>
                  <Ui.Table.Head>{_("role")}</Ui.Table.Head>
                </Ui.Table.Row>
              </Ui.Table.Header>
              <Ui.Table.Body>
                <Ui.Table.Row>
                  <Ui.Table.Cell>John Doe</Ui.Table.Cell>
                  <Ui.Table.Cell>
                    <Ui.Badge variant="secondary">{_("active")}</Ui.Badge>
                  </Ui.Table.Cell>
                  <Ui.Table.Cell>{_("admin")}</Ui.Table.Cell>
                </Ui.Table.Row>
                <Ui.Table.Row>
                  <Ui.Table.Cell>Jane Smith</Ui.Table.Cell>
                  <Ui.Table.Cell>
                    <Ui.Badge variant="secondary">{_("pending")}</Ui.Badge>
                  </Ui.Table.Cell>
                  <Ui.Table.Cell>{_("user")}</Ui.Table.Cell>
                </Ui.Table.Row>
              </Ui.Table.Body>
            </Ui.Table.Root>
          </div>
        </div>
      </Form.Root>
      <Ui.QuickDialogStickyFooter>
        <Ui.Button onClick={close}>{_(`close`)}</Ui.Button>
      </Ui.QuickDialogStickyFooter>
    </div>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    title: "Preview Theme",
    description: "Preview the theme",
    close: "Close preview",

    // Sections
    buttons: "Buttons",
    cards: "Cards",
    forms: "Forms",
    navigation: "Navigation",
    charts: "Charts",
    "data-display": "Data Display",

    // Button variants
    default: "Default",
    secondary: "Secondary",
    destructive: "Destructive",
    outline: "Outline",
    ghost: "Ghost",
    link: "Link",
    "xx-small": "XX-Small",
    "x-small": "X-Small",
    small: "Small",
    large: "Large",
    disabled: "Disabled",

    // Cards
    "card-title": "Card Title",
    "card-description": "This is a card description example",
    "card-content": "This is the card content with some example text to show how it looks.",
    action: "Action",
    settings: "Settings",
    notifications: "Notifications",
    "dark-mode": "Dark Mode",

    // Forms
    name: "Name",
    "enter-name": "Enter your name",
    message: "Message",
    "enter-message": "Enter your message here",
    country: "Country",
    france: "France",
    england: "England",
    spain: "Spain",
    "theme-preference": "Theme Preference",
    light: "Light",
    dark: "Dark",
    auto: "Auto",
    features: "Features",
    analytics: "Analytics",

    // Navigation
    overview: "Overview",
    "overview-content": "This is the overview tab content showing basic information and metrics.",
    "alert-info": "This is an informational alert message.",
    warning: "Warning",
    "alert-warning": "This is a warning alert. Please pay attention to this message.",

    // Badges
    new: "New",
    updated: "Updated",
    urgent: "Urgent",
    draft: "Draft",

    // Charts
    "bar-chart": "Bar Chart",
    "line-chart": "Line Chart",
    users: "Users",
    growth: "Growth",
    revenue: "Revenue",
    profit: "Profit",
    jan: "Jan",
    feb: "Feb",
    mar: "Mar",
    apr: "Apr",
    may: "May",
    jun: "Jun",

    // Table
    status: "Status",
    role: "Role",
    active: "Active",
    pending: "Pending",
    admin: "Admin",
    user: "User",
  },
  fr: {
    title: "Prévisualiser le thème",
    description: "Prévisualiser le thème",
    close: "Fermer la prévisualisation",

    // Sections
    buttons: "Boutons",
    cards: "Cartes",
    forms: "Formulaires",
    navigation: "Navigation",
    charts: "Graphiques",
    "data-display": "Affichage des données",

    // Button variants
    default: "Défaut",
    secondary: "Secondaire",
    destructive: "Destructif",
    outline: "Contour",
    ghost: "Fantôme",
    link: "Lien",
    "xx-small": "XX-Petit",
    "x-small": "X-Petit",
    small: "Petit",
    large: "Grand",
    disabled: "Désactivé",

    // Cards
    "card-title": "Titre de carte",
    "card-description": "Ceci est un exemple de description de carte",
    "card-content": "Ceci est le contenu de la carte avec du texte d'exemple pour montrer l'apparence.",
    action: "Action",
    settings: "Paramètres",
    notifications: "Notifications",
    "dark-mode": "Mode sombre",

    // Forms
    name: "Nom",
    "enter-name": "Entrez votre nom",
    message: "Message",
    "enter-message": "Entrez votre message ici",
    country: "Pays",
    france: "France",
    england: "Angleterre",
    spain: "Espagne",
    "theme-preference": "Préférence de thème",
    light: "Clair",
    dark: "Sombre",
    auto: "Auto",
    features: "Fonctionnalités",
    analytics: "Analytiques",

    // Navigation
    overview: "Vue d'ensemble",
    "overview-content": "Ceci est le contenu de l'onglet vue d'ensemble montrant les informations de base et les métriques.",
    "alert-info": "Ceci est un message d'alerte informatif.",
    warning: "Attention",
    "alert-warning": "Ceci est une alerte d'avertissement. Veuillez porter attention à ce message.",

    // Badges
    new: "Nouveau",
    updated: "Mis à jour",
    urgent: "Urgent",
    draft: "Brouillon",

    // Charts
    "bar-chart": "Graphique en barres",
    "line-chart": "Graphique en ligne",
    users: "Utilisateurs",
    growth: "Croissance",
    revenue: "Revenus",
    profit: "Bénéfices",
    jan: "Jan",
    feb: "Fév",
    mar: "Mar",
    apr: "Avr",
    may: "Mai",
    jun: "Juin",

    // Table
    status: "Statut",
    role: "Rôle",
    active: "Actif",
    pending: "En attente",
    admin: "Administrateur",
    user: "Utilisateur",
  },
  de: {
    title: "Thema-Vorschau",
    description: "Thema in der Vorschau anzeigen",
    close: "Vorschau schließen",

    // Sections
    buttons: "Schaltflächen",
    cards: "Karten",
    forms: "Formulare",
    navigation: "Navigation",
    charts: "Diagramme",
    "data-display": "Datenanzeige",

    // Button variants
    default: "Standard",
    secondary: "Sekundär",
    destructive: "Destruktiv",
    outline: "Umriss",
    ghost: "Geist",
    link: "Link",
    "xx-small": "XX-Klein",
    "x-small": "X-Klein",
    small: "Klein",
    large: "Groß",
    disabled: "Deaktiviert",

    // Cards
    "card-title": "Kartentitel",
    "card-description": "Dies ist ein Beispiel für eine Kartenbeschreibung",
    "card-content": "Dies ist der Karteninhalt mit etwas Beispieltext, um zu zeigen, wie er aussieht.",
    action: "Aktion",
    settings: "Einstellungen",
    notifications: "Benachrichtigungen",
    "dark-mode": "Dunkler Modus",

    // Forms
    name: "Name",
    "enter-name": "Geben Sie Ihren Namen ein",
    message: "Nachricht",
    "enter-message": "Geben Sie hier Ihre Nachricht ein",
    country: "Land",
    france: "Frankreich",
    england: "England",
    spain: "Spanien",
    "theme-preference": "Design-Präferenz",
    light: "Hell",
    dark: "Dunkel",
    auto: "Automatisch",
    features: "Funktionen",
    analytics: "Analytik",

    // Navigation
    overview: "Übersicht",
    "overview-content": "Dies ist der Inhalt des Übersicht-Tabs mit grundlegenden Informationen und Metriken.",
    "alert-info": "Dies ist eine informative Warnmeldung.",
    warning: "Warnung",
    "alert-warning": "Dies ist eine Warnmeldung. Bitte beachten Sie diese Nachricht.",

    // Badges
    new: "Neu",
    updated: "Aktualisiert",
    urgent: "Dringend",
    draft: "Entwurf",

    // Charts
    "bar-chart": "Balkendiagramm",
    "line-chart": "Liniendiagramm",
    users: "Benutzer",
    growth: "Wachstum",
    revenue: "Umsatz",
    profit: "Gewinn",
    jan: "Jan",
    feb: "Feb",
    mar: "Mär",
    apr: "Apr",
    may: "Mai",
    jun: "Jun",

    // Table
    status: "Status",
    role: "Rolle",
    active: "Aktiv",
    pending: "Ausstehend",
    admin: "Administrator",
    user: "Benutzer",
  },
}
