import { useWorkspace } from "@/features/workspaces"
import { service } from "@/services"
import { Dashboard } from "@compo/dashboard"
import { useSwrOrganisation } from "@compo/directory"
import { useTranslation } from "@compo/localize"
import { useLanguage } from "@compo/translations"
import { Icon, Ui } from "@compo/ui"
import { cn, getInitials, makeColorsFromString, placeholder } from "@compo/utils"
import { placeholder as servicePlaceholder } from "@services/dashboard"
import React from "react"
import { Link } from "wouter"
import { routesTo } from "."
import useBreadcrumbs from "./breadcrumbs"

/**
 * directory page
 */
const Page: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const breadcrumbs = useBreadcrumbs()
  Dashboard.usePage(breadcrumbs, _("title"))

  const { workspace } = useWorkspace()
  const displayOrganisation = workspace.config.organisation.display

  return (
    <Dashboard.Container>
      <Dashboard.Header>
        <Dashboard.Title level={1}>{_("title")}</Dashboard.Title>
        <Dashboard.Description>{_("description")}</Dashboard.Description>
      </Dashboard.Header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {displayOrganisation && <OrganisationLink className="md:col-span-2 lg:col-span-3" />}
        <Link className="rounded-lg border p-6" to={routesTo.contacts.list()}>
          <h2 className="mb-2 font-semibold">{_("contacts-title")}</h2>
          <p className="text-muted-foreground text-sm">{_("contacts-description")}</p>
        </Link>
        <Link className="rounded-lg border p-6" to={routesTo.associations.list()}>
          <h2 className="mb-2 font-semibold">{_("associations-title")}</h2>
          <p className="text-muted-foreground text-sm">{_("associations-description")}</p>
        </Link>
        <Link className="rounded-lg border p-6" to={routesTo.organizations.list()}>
          <h2 className="mb-2 font-semibold">{_("organizations-title")}</h2>
          <p className="text-muted-foreground text-sm">{_("organizations-description")}</p>
        </Link>
        <Link className="rounded-lg border p-6" to={routesTo.categories.list()}>
          <h2 className="mb-2 font-semibold">{_("categories-title")}</h2>
          <p className="text-muted-foreground text-sm">{_("categories-description")}</p>
        </Link>
      </div>
    </Dashboard.Container>
  )
}

export default Page

/**
 * OrganisationLink
 * This link is used to navigate to the organisation page. It is only visible if the sidebar
 * is expanded and option "display organisation" is activated in workspace configuration.
 */
const OrganisationLink: React.FC<{ className?: string }> = ({ className }) => {
  const { _ } = useTranslation(dictionary)
  const { scheme } = Ui.useTheme()
  const { workspace } = useWorkspace()
  const { translate } = useLanguage()
  const { organisationId } = workspace.config.organisation
  const { organisation, isLoading, isError } = useSwrOrganisation(organisationId)

  // Don't show anything if no organisation is configured
  if (!organisationId) return null

  // Show loading state
  if (isLoading) {
    return (
      <div className={cn("flex items-center gap-4 rounded-lg border p-6", className)}>
        <div className="bg-muted flex size-16 items-center justify-center rounded-lg border">
          <Icon.Loader className="size-8" />
        </div>
        <div className="flex-1">
          <h2 className="text-muted-foreground mb-2 font-semibold">{_("loading-organisation")}</h2>
          <p className="text-muted-foreground text-sm">{_("loading-organisation-description")}</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (isError || !organisation) return null

  const translated = translate(organisation, servicePlaceholder.organisation)
  const name = placeholder(translated.name, _("organisation-placeholder"))
  const { getImageUrl } = service
  const [light, dark] = makeColorsFromString(name)
  const initials = getInitials(name, "", 2)
  const style = scheme === "dark" ? { backgroundColor: dark, color: light } : { backgroundColor: light, color: dark }
  const image = getImageUrl(organisation.logoImage, "thumbnail")

  return (
    <Link
      className={cn("hover:bg-muted/50 flex items-center gap-4 rounded-lg border p-6 transition-colors", className)}
      to={routesTo.myMunicipality.list()}
    >
      {image ? (
        <Ui.Image
          src={image}
          classNames={{
            wrapper: "size-16 flex-none",
            image: "size-16 object-contain",
          }}
          alt={name}
        >
          <Ui.ImageEmpty />
        </Ui.Image>
      ) : (
        <div className="flex size-16 flex-none items-center justify-center rounded-lg border text-xl font-semibold" style={style}>
          {initials}
        </div>
      )}
      <div className="flex-1">
        <h2 className="mb-2 font-semibold">{name}</h2>
        <p className="text-muted-foreground text-sm">{_("organisation-description")}</p>
      </div>
    </Link>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    title: "Directory",
    description: "Manage contacts, organizations and associations",
    "loading-organisation": "Loading...",
    "loading-organisation-description": "Loading organization information",
    "organisation-placeholder": "Unnamed",
    "organisation-description": "Manage your organization information and settings",
    "contacts-title": "Contacts",
    "contacts-description": "Manage individual contacts and their information",
    "associations-title": "Associations",
    "associations-description": "Manage associations and community groups",
    "organizations-title": "Organizations",
    "organizations-description": "Manage companies, institutions and other organizations",
    "categories-title": "Categories",
    "categories-description": "Organize directory entries with custom categories",
  },
  fr: {
    title: "Annuaire",
    description: "Gérer les contacts, organisations et associations",
    "loading-organisation": "Chargement...",
    "loading-organisation-description": "Chargement des informations de l'organisation",
    "organisation-placeholder": "Sans nom",
    "organisation-description": "Gérer les informations et paramètres de votre organisation",
    "contacts-title": "Contacts",
    "contacts-description": "Gérer les contacts individuels et leurs informations",
    "associations-title": "Associations",
    "associations-description": "Gérer les associations et groupes communautaires",
    "organizations-title": "Organisations",
    "organizations-description": "Gérer les entreprises, institutions et autres organisations",
    "categories-title": "Catégories",
    "categories-description": "Organiser les entrées de l'annuaire avec des catégories personnalisées",
  },
  de: {
    title: "Verzeichnis",
    description: "Kontakte, Organisationen und Vereine verwalten",
    "loading-organisation": "Wird geladen...",
    "loading-organisation-description": "Organisationsinformationen werden geladen",
    "organisation-placeholder": "Unbenannt",
    "organisation-description": "Verwalten Sie die Informationen und Einstellungen Ihrer Organisation",
    "contacts-title": "Kontakte",
    "contacts-description": "Einzelne Kontakte und ihre Informationen verwalten",
    "associations-title": "Vereine",
    "associations-description": "Vereine und Gemeinschaftsgruppen verwalten",
    "organizations-title": "Organisationen",
    "organizations-description": "Unternehmen, Institutionen und andere Organisationen verwalten",
    "categories-title": "Kategorien",
    "categories-description": "Verzeichniseinträge mit benutzerdefinierten Kategorien organisieren",
  },
}
