import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import React from "react"
import useBreadcrumbs from "./breadcrumbs"
import { Config } from "./config"

/**
 * AdminForwards
 * manage forwards
 */
export const Page: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const breadcrumbs = useBreadcrumbs()
  Dashboard.usePage(breadcrumbs, _("title"))
  return (
    <Dashboard.Container className="gap-0">
      <Dashboard.Header>
        <Dashboard.Title level={1}>{_("title")}</Dashboard.Title>
        <Dashboard.Description>{_("description")}</Dashboard.Description>
      </Dashboard.Header>
      <Config />
    </Dashboard.Container>
  )
}
export default Page

/**
 * translations
 */
const dictionary = {
  en: {
    title: "Site Configuration",
    description:
      "Configure your website's languages and URL structure. These settings will affect how your content is organized and accessible to visitors.",
  },
  fr: {
    title: "Configuration du site",
    description:
      "Configurez les langues de votre site et la structure des URLs. Ces paramètres affecteront l'organisation et l'accessibilité de votre contenu pour les visiteurs.",
  },
  de: {
    title: "Website-Konfiguration",
    description:
      "Konfigurieren Sie die Sprachen Ihrer Website und die URL-Struktur. Diese Einstellungen beeinflussen, wie Ihr Inhalt organisiert und für Besucher zugänglich ist.",
  },
}
