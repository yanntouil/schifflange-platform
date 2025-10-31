import { isWorkspaceAdmin, useWorkspace, workspaceStore } from "@/features/workspaces"
import { useSwrAllOrganisations } from "@compo/directory"
import { Form, useForm, useFormDirty } from "@compo/form"
import { useSWRLanguages } from "@compo/languages"
import { Interpolate, useTranslation } from "@compo/localize"
import { useLanguage } from "@compo/translations"
import { Ui } from "@compo/ui"
import { A, D, match, placeholder } from "@compo/utils"
import { placeholder as servicePlaceholder } from "@services/dashboard"
import React from "react"

const { updateCurrentWorkspace } = workspaceStore.actions

/**
 * manage the site configuration
 */
export const Config: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { workspace, service } = useWorkspace()
  const { languages } = useSWRLanguages()
  const { translate } = useLanguage()
  const { organisations } = useSwrAllOrganisations()
  const isAdmin = isWorkspaceAdmin(workspace)
  const initialValues = {
    config: workspace.config,
    languages: A.map(workspace.languages, D.prop("id")),
  }
  const form = useForm({
    disabled: !isAdmin,
    values: initialValues,
    onSubmit: async ({ values, setValues }) => {
      let hasUpdated = false

      // Check if configuration has changed
      if (!isEqual(values.config, initialValues.config) || true) {
        const configResult = await service.config.update({ config: values.config })

        match(configResult)
          .with({ ok: true }, ({ data }) => {
            hasUpdated = true
            Ui.toast.success(_("configuration-updated"))
            updateCurrentWorkspace({ config: data.config })
            setValues({ ...values, config: data.config })
          })
          .otherwise(() => {
            Ui.toast.error(_("configuration-update-error"))
          })
      }

      // Check if languages have changed
      if (!isEqual(values.languages, initialValues.languages)) {
        const languagesResult = await service.config.updateLanguages({
          languages: values.languages,
        })

        match(languagesResult)
          .with({ ok: true }, ({ data }) => {
            hasUpdated = true
            Ui.toast.success(_("languages-updated"))
            updateCurrentWorkspace({ languages: data.languages })
            setValues({ ...values, languages: A.map(data.languages, D.prop("id")) })
          })
          .otherwise(() => {
            Ui.toast.error(_("languages-update-error"))
          })
      }

      // Show info if nothing was changed
      if (!hasUpdated) {
        Ui.toast.info(_("no-changes-detected"))
      }
    },
  })

  const languagesOptions = A.map(languages, (language) => ({
    label: language.name,
    value: language.id,
  }))

  const organisationsOptions = A.map(organisations, (organisation) => ({
    label: placeholder(translate(organisation, servicePlaceholder.organisation).name, _("organisation-placeholder")),
    value: organisation.id,
  }))

  const [isDirty] = useFormDirty(form, initialValues)

  return (
    <Form.Root form={form} className="@container space-y-6">
      {/* Section Langues */}
      <div className="space-y-6 rounded-lg border p-6">
        <Form.Header title={_("languages-section-title")} description={_("languages-section-description")} />

        <Form.Alert variant="warning">
          <p>
            <Interpolate text={_("languages-warning")} replacements={{ b: (text) => <b className="font-medium">{text}</b> }} />
          </p>
        </Form.Alert>

        <Form.SelectMultiple
          name="languages"
          options={languagesOptions}
          label={_("languages-label")}
          placeholder={_("languages-placeholder")}
          labelAside={<Form.Info title={_("languages-label")} content={_("languages-help")} />}
        />
      </div>

      {/* Section URLs */}
      <div className="space-y-6 rounded-lg border p-6">
        <Form.Header title={_("slugs-title")} description={_("slugs-description")} />

        <div className="grid gap-8 @3xl:grid-cols-2">
          {/* Articles */}
          <div className="space-y-3">
            <Form.Fields names={["config", "articles"]}>
              <Form.Input
                label={_("articles-slug-prefix-label")}
                name="slugPrefix"
                placeholder={_("articles-slug-prefix-placeholder")}
                maxLength={255}
                labelAside={<Form.Info title={_("articles-slug-prefix-label")} content={_("articles-slug-prefix-info")} />}
              />
            </Form.Fields>
            <p className="text-xs text-gray-600 dark:text-gray-400">{_("articles-example")}</p>
          </div>

          {/* Events */}
          <div className="space-y-3">
            <Form.Fields names={["config", "events"]}>
              <Form.Input
                label={_("events-slug-prefix-label")}
                name="slugPrefix"
                placeholder={_("events-slug-prefix-placeholder")}
                maxLength={255}
                labelAside={<Form.Info title={_("events-slug-prefix-label")} content={_("events-slug-prefix-info")} />}
              />
            </Form.Fields>
            <p className="text-xs text-gray-600 dark:text-gray-400">{_("events-example")}</p>
          </div>
        </div>

        {/* Note explicative pour les URLs */}
        <Form.Alert variant="info">
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100">{_("url-structure-title")}</p>
            <p>{_("url-structure-description")}</p>
          </div>
        </Form.Alert>
      </div>

      {/* Section Options du Site */}
      <div className="space-y-6 rounded-lg border p-6">
        <Form.Header title={_("site-options-title")} description={_("site-options-description")} />

        <div className="space-y-4">
          <Form.Fields names={["config", "site"]}>
            <Form.Input
              label={_("site-url-label")}
              name="url"
              type="url"
              placeholder={_("site-url-placeholder")}
              labelAside={<Form.Info title={_("site-url-label")} content={_("site-url-info")} />}
            />
          </Form.Fields>
          <p className="text-xs text-gray-600 dark:text-gray-400">{_("site-url-example")}</p>
        </div>

        <Form.Alert variant="info">
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100">{_("site-url-usage-title")}</p>
            <p>{_("site-url-usage-description")}</p>
          </div>
        </Form.Alert>

        {/* <div className="space-y-4 border-t pt-6">
          <Form.Fields names={["config", "organisation"]}>
            <Form.Switch
              label={_("organisation-display-label")}
              name="display"
              labelAside={<Form.Info title={_("organisation-display-label")} content={_("organisation-display-info")} />}
            />
            <Form.Select
              label={_("organisation-id-label")}
              name="organisationId"
              options={organisationsOptions}
              placeholder={_("organisation-id-placeholder")}
              labelAside={<Form.Info title={_("organisation-id-label")} content={_("organisation-id-info")} />}
            />
          </Form.Fields>
        </div> */}
      </div>

      {/* Actions */}
      {isDirty && (
        <div className="flex justify-end">
          <Form.Submit>{_("save-button")}</Form.Submit>
        </div>
      )}
    </Form.Root>
  )
}

/**
 * Simple deep equality check using JSON.stringify
 */
const isEqual = (a: any, b: any): boolean => {
  return JSON.stringify(a) === JSON.stringify(b)
}

/**
 * translations
 */
const dictionary = {
  en: {
    // Languages section
    "languages-section-title": "Supported Languages",
    "languages-section-description":
      "Choose which languages your website will support. This affects the available content languages and URL structure.",
    "languages-label": "Site languages",
    "languages-placeholder": "Select languages for your site",
    "languages-help":
      "Select one or more languages that your website will support. Visitors will be able to browse content in these languages.",
    "languages-warning":
      "{{b:Important:}} You must select at least one language for your site to work properly. The first language selected will be set as the default.",

    // URLs section
    "slugs-title": "URL Structure",
    "slugs-description": "Define URL prefixes for your content types. This helps organize your content and improves SEO.",
    "articles-slug-prefix-label": "Articles URL prefix",
    "articles-slug-prefix-placeholder": "blog",
    "articles-slug-prefix-info":
      "This prefix will be used when creating new articles to generate their initial URL. Existing articles keep their current URLs.",
    "articles-example": "Example: With 'blog' prefix → /blog/my-new-article-title",
    "events-slug-prefix-label": "Events URL prefix",
    "events-slug-prefix-placeholder": "events",
    "events-slug-prefix-info":
      "This prefix will be used when creating new events to generate their initial URL. Existing events keep their current URLs.",
    "events-example": "Example: With 'events' prefix → /events/my-new-event-title",

    // URL structure explanation
    "url-structure-title": "How URL structure works",
    "url-structure-description":
      "Your content URLs will follow this pattern: /language/prefix/content-slug (e.g., /en/blog/article-title or /fr/portfolio/project-name)",

    // Site options section
    "site-options-title": "Site Options",
    "site-options-description": "Configure your website settings and options that will be used throughout the application.",
    "site-url-label": "Site URL",
    "site-url-placeholder": "https://mywebsite.com",
    "site-url-info":
      "The main URL of your website. This will be used to generate absolute links in emails, sitemaps, and other places in the application.",
    "site-url-example": "Example: https://mywebsite.com (without trailing slash)",
    "site-url-usage-title": "How the site URL is used",
    "site-url-usage-description":
      "This URL will be used to create absolute links in email notifications, RSS feeds, sitemaps, and social media sharing.",

    // Organisation options
    // "organisation-display-label": "Add organisation to directory menu",
    // "organisation-display-info": "Enable to add a direct link to the selected organisation in the directory menu",
    // "organisation-id-label": "Organisation",
    // "organisation-id-placeholder": "Select an organisation",
    // "organisation-id-info": "Select the organisation to add as a shortcut in the directory menu",
    // "organisation-placeholder": "No organisation selected",

    // Actions and feedback
    "save-button": "Save configuration",
    "configuration-updated": "Configuration updated successfully",
    "configuration-update-error": "Failed to update configuration",
    "languages-updated": "Languages updated successfully",
    "languages-update-error": "Failed to update languages",
    "no-changes-detected": "No changes detected - configuration is already up to date",
  },
  fr: {
    // Languages section
    "languages-section-title": "Langues Supportées",
    "languages-section-description":
      "Choisissez les langues que votre site web supportera. Cela affecte les langues de contenu disponibles et la structure des URLs.",
    "languages-label": "Langues du site",
    "languages-placeholder": "Sélectionnez les langues de votre site",
    "languages-help":
      "Sélectionnez une ou plusieurs langues que votre site web supportera. Les visiteurs pourront naviguer dans le contenu dans ces langues.",
    "languages-warning":
      "{{b:Important:}} Vous devez sélectionner au moins une langue pour que votre site fonctionne correctement. La première langue sélectionnée sera définie par défaut.",

    // URLs section
    "slugs-title": "Structure des URLs",
    "slugs-description": "Définissez les préfixes d'URL pour vos types de contenu. Cela aide à organiser votre contenu et améliore le SEO.",
    "articles-slug-prefix-label": "Préfixe URL des articles",
    "articles-slug-prefix-placeholder": "blog",
    "articles-slug-prefix-info":
      "Ce préfixe sera utilisé lors de la création d'un nouvel article pour générer son URL initiale. Les articles existants conservent leur URL actuelle.",
    "articles-example": "Exemple : Avec le préfixe 'blog' → /blog/titre-de-mon-nouvel-article",
    "events-slug-prefix-label": "Préfixe URL des événements",
    "events-slug-prefix-placeholder": "evenements",
    "events-slug-prefix-info":
      "Ce préfixe sera utilisé lors de la création d'un nouvel événement pour générer son URL initiale. Les événements existants conservent leur URL actuelle.",
    "events-example": "Exemple : Avec le préfixe 'evenements' → /evenements/titre-de-mon-nouvel-evenement",

    // URL structure explanation
    "url-structure-title": "Comment fonctionne la structure des URLs",
    "url-structure-description":
      "Vos URLs de contenu suivront ce modèle : /langue/préfixe/slug-du-contenu (ex: /fr/blog/titre-article ou /en/portfolio/nom-projet)",

    // Site options section
    "site-options-title": "Options du Site",
    "site-options-description": "Configurez les paramètres de votre site web qui seront utilisés dans toute l'application.",
    "site-url-label": "URL du Site",
    "site-url-placeholder": "https://monsite.com",
    "site-url-info":
      "L'URL principale de votre site web. Elle sera utilisée pour générer des liens absolus dans les emails, sitemaps et autres endroits de l'application.",
    "site-url-example": "Exemple : https://monsite.com (sans slash final)",
    "site-url-usage-title": "Comment l'URL du site est utilisée",
    "site-url-usage-description":
      "Cette URL sera utilisée pour créer des liens absolus dans les notifications par email, flux RSS, sitemaps et partages sur les réseaux sociaux.",

    // Organisation options
    // "organisation-display-label": "Ajouter l'organisation au menu du répertoire",
    // "organisation-display-info": "Activer pour ajouter un lien direct vers l'organisation sélectionnée dans le menu du répertoire",
    // "organisation-id-label": "Organisation",
    // "organisation-id-placeholder": "Sélectionner une organisation",
    // "organisation-id-info": "Sélectionner l'organisation à ajouter comme raccourci dans le menu du répertoire",
    // "organisation-placeholder": "Aucune organisation sélectionnée",

    // Actions and feedback
    "save-button": "Enregistrer la configuration",
    "configuration-updated": "Configuration mise à jour avec succès",
    "configuration-update-error": "Échec de la mise à jour de la configuration",
    "languages-updated": "Langues mises à jour avec succès",
    "languages-update-error": "Échec de la mise à jour des langues",
    "no-changes-detected": "Aucun changement détecté - la configuration est déjà à jour",
  },
  de: {
    // Languages section
    "languages-section-title": "Unterstützte Sprachen",
    "languages-section-description":
      "Wählen Sie die Sprachen aus, die Ihre Website unterstützen soll. Dies betrifft die verfügbaren Inhaltssprachen und die URL-Struktur.",
    "languages-label": "Website-Sprachen",
    "languages-placeholder": "Wählen Sie Sprachen für Ihre Website",
    "languages-help":
      "Wählen Sie eine oder mehrere Sprachen aus, die Ihre Website unterstützen soll. Besucher können Inhalte in diesen Sprachen durchsuchen.",
    "languages-warning":
      "{{b:Wichtig:}} Sie müssen mindestens eine Sprache auswählen, damit Ihre Website ordnungsgemäß funktioniert. Die erste ausgewählte Sprache wird als Standard festgelegt.",

    // URLs section
    "slugs-title": "URL-Struktur",
    "slugs-description": "Definieren Sie URL-Präfixe für Ihre Inhaltstypen. Dies hilft, Ihre Inhalte zu organisieren und verbessert SEO.",
    "articles-slug-prefix-label": "Artikel URL-Präfix",
    "articles-slug-prefix-placeholder": "blog",
    "articles-slug-prefix-info":
      "Dieses Präfix wird beim Erstellen neuer Artikel verwendet, um deren anfängliche URL zu generieren. Bestehende Artikel behalten ihre aktuelle URL.",
    "articles-example": "Beispiel: Mit 'blog' Präfix → /blog/mein-neuer-artikel-titel",
    "events-slug-prefix-label": "Veranstaltungen URL-Präfix",
    "events-slug-prefix-placeholder": "veranstaltungen",
    "events-slug-prefix-info":
      "Dieses Präfix wird beim Erstellen neuer Veranstaltungen verwendet, um deren anfängliche URL zu generieren. Bestehende Veranstaltungen behalten ihre aktuelle URL.",
    "events-example": "Beispiel: Mit 'veranstaltungen' Präfix → /veranstaltungen/mein-neuer-veranstaltung-titel",

    // URL structure explanation
    "url-structure-title": "Wie die URL-Struktur funktioniert",
    "url-structure-description":
      "Ihre Inhalts-URLs folgen diesem Muster: /sprache/präfix/inhalt-slug (z.B. /de/blog/artikel-titel oder /fr/portfolio/projekt-name)",

    // Site options section
    "site-options-title": "Website-Optionen",
    "site-options-description":
      "Konfigurieren Sie Ihre Website-Einstellungen und Optionen, die in der gesamten Anwendung verwendet werden.",
    "site-url-label": "Website-URL",
    "site-url-placeholder": "https://meinewebsite.de",
    "site-url-info":
      "Die Haupt-URL Ihrer Website. Diese wird verwendet, um absolute Links in E-Mails, Sitemaps und anderen Stellen in der Anwendung zu generieren.",
    "site-url-example": "Beispiel: https://meinewebsite.de (ohne abschließenden Schrägstrich)",
    "site-url-usage-title": "Wie die Website-URL verwendet wird",
    "site-url-usage-description":
      "Diese URL wird verwendet, um absolute Links in E-Mail-Benachrichtigungen, RSS-Feeds, Sitemaps und Social-Media-Freigaben zu erstellen.",

    // Organisation options
    // "organisation-display-label": "Organisation zum Verzeichnismenü hinzufügen",
    // "organisation-display-info": "Aktivieren, um einen direkten Link zur ausgewählten Organisation im Verzeichnismenü hinzuzufügen",
    // "organisation-id-label": "Organisation",
    // "organisation-id-placeholder": "Organisation auswählen",
    // "organisation-id-info": "Wählen Sie die Organisation aus, die als Verknüpfung im Verzeichnismenü hinzugefügt werden soll",
    // "organisation-placeholder": "Keine Organisation ausgewählt",

    // Actions and feedback
    "save-button": "Konfiguration speichern",
    "configuration-updated": "Konfiguration erfolgreich aktualisiert",
    "configuration-update-error": "Fehler beim Aktualisieren der Konfiguration",
    "languages-updated": "Sprachen erfolgreich aktualisiert",
    "languages-update-error": "Fehler beim Aktualisieren der Sprachen",
    "no-changes-detected": "Keine Änderungen erkannt - Konfiguration ist bereits aktuell",
  },
}
