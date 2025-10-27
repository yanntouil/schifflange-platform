import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { useSwrPages } from "@compo/pages"
import { Hn } from "@compo/ui/src/components"
import React from "react"
import { Link } from "wouter"
import useBreadcrumbs from "./breadcrumbs"
import dashboardConfigRouteTo from "./config"
import dashboardForwardsRouteTo from "./forwards"
import dashboardMenusRouteTo from "./menus"
import dashboardSitemapRouteTo from "./sitemap"

/**
 * site home page
 */
const Page: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const breadcrumbs = useBreadcrumbs()
  Dashboard.usePage(breadcrumbs, _("title"))
  const swr = useSwrPages()
  const baseLevel = 1
  return (
    <Dashboard.Container>
      <Dashboard.Header>
        <Dashboard.Title level={baseLevel}>{_("title")}</Dashboard.Title>
        <Dashboard.Description>{_("description")}</Dashboard.Description>
      </Dashboard.Header>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link className="rounded-lg border p-6" to={dashboardForwardsRouteTo()}>
          <Hn level={baseLevel + 1} className="mb-2 font-semibold">
            {_("forwards-title")}
          </Hn>
          <p className="text-muted-foreground text-sm">{_("forwards-description")}</p>
        </Link>

        <Link className="rounded-lg border p-6" to={dashboardMenusRouteTo()}>
          <Hn level={baseLevel + 1} className="mb-2 font-semibold">
            {_("menus-title")}
          </Hn>
          <p className="text-muted-foreground text-sm">{_("menus-description")}</p>
        </Link>

        <Link className="rounded-lg border p-6" to={dashboardSitemapRouteTo()}>
          <Hn level={baseLevel + 1} className="mb-2 font-semibold">
            {_("sitemap-title")}
          </Hn>
          <p className="text-muted-foreground text-sm">{_("sitemap-description")}</p>
        </Link>

        <Link className="rounded-lg border p-6" to={dashboardConfigRouteTo()}>
          <Hn level={baseLevel + 1} className="mb-2 font-semibold">
            {_("config-title")}
          </Hn>
          <p className="text-muted-foreground text-sm">{_("config-description")}</p>
        </Link>
      </div>
    </Dashboard.Container>
  )
}

export default Page

/**
 * translations
 */
const dictionary = {
  en: {
    title: "Site Management",
    description: "Configure navigation, redirects, and site structure for your website",
    "forwards-title": "URL Redirects",
    "forwards-description": "Set up 301/302 redirects to manage moved content and prevent broken links",
    "menus-title": "Navigation Menus",
    "menus-description": "Create and organize navigation menus with drag-and-drop hierarchy management",
    "sitemap-title": "Sitemap",
    "sitemap-description": "View and manage your site's XML sitemap for search engine optimization",
    "config-title": "Site Configuration",
    "config-description": "Configure global site settings and preferences",
  },
  fr: {
    title: "Gestion du site",
    description: "Configurez la navigation, les redirections et la structure de votre site web",
    "forwards-title": "Redirections d'URL",
    "forwards-description": "Configurez des redirections 301/302 pour gérer le contenu déplacé et éviter les liens brisés",
    "menus-title": "Menus de navigation",
    "menus-description": "Créez et organisez les menus de navigation avec gestion hiérarchique par glisser-déposer",
    "sitemap-title": "Plan du site",
    "sitemap-description": "Visualisez et gérez le sitemap XML de votre site pour l'optimisation SEO",
    "config-title": "Configuration du site",
    "config-description": "Configurez les paramètres globaux et les préférences du site",
  },
  de: {
    title: "Site-Verwaltung",
    description: "Konfigurieren Sie Navigation, Weiterleitungen und Site-Struktur für Ihre Website",
    "forwards-title": "URL-Weiterleitungen",
    "forwards-description": "Richten Sie 301/302-Weiterleitungen ein, um verschobene Inhalte zu verwalten und defekte Links zu vermeiden",
    "menus-title": "Navigationsmenüs",
    "menus-description": "Erstellen und organisieren Sie Navigationsmenüs mit Drag-and-Drop-Hierarchieverwaltung",
    "sitemap-title": "Sitemap",
    "sitemap-description": "Betrachten und verwalten Sie die XML-Sitemap Ihrer Website für Suchmaschinenoptimierung",
    "config-title": "Website-Konfiguration",
    "config-description": "Konfigurieren Sie globale Website-Einstellungen und -Präferenzen",
  },
}
