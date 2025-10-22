import { useWorkspace } from "@/features/workspaces"
import {
  CategoriesCreateDialog,
  ContactsCreateDialog,
  DirectoryServiceProvider,
  useCreateCategory,
  useCreateOrganisation,
  useDirectoryService,
  useSwrOrganisation,
} from "@compo/directory"
import { OrganisationsCreateDialog } from "@compo/directory/src/components/organisations.create"
import { useCreateContact } from "@compo/directory/src/contacts.context.actions"
import { useTranslation } from "@compo/localize"
import { ContextualLanguageProvider, useLanguage } from "@compo/translations"
import { Ui } from "@compo/ui"
import { placeholder } from "@compo/utils"
import { placeholder as servicePlaceholder } from "@services/dashboard"
import { BookUser, Building2, Folders, Plus, Star, Users, UsersRound } from "lucide-react"
import React from "react"
import { Link } from "wouter"
import { routesTo } from "."

/**
 * Dashboard Directory Sidebar
 */
export const SidebarDirectory: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { workspace } = useWorkspace()
  const displayOrganisation = workspace.config.organisation.display
  const service = useDirectoryService()
  return (
    <ContextualLanguageProvider persistedId={`${workspace.id}-languages`}>
      <Ui.Sidebar.Menu>
        <Ui.Sidebar.CollapsibleMenuItem persistKey={`${workspace.id}-directory-sidebar`}>
          <Ui.Sidebar.CollapsibleMenuButton tooltip={_("title")}>
            <BookUser className="size-4" />
            <span>{_("title")}</span>
          </Ui.Sidebar.CollapsibleMenuButton>
          <Ui.Sidebar.CollapsibleMenuSub>
            {/* custom organisation */}
            {displayOrganisation && <OrganisationLink />}

            {/* contacts */}
            <Ui.Sidebar.CollapsibleMenuSubButton action={<ContactPlusButton />}>
              <Link to={routesTo.contacts.list()}>
                <Users aria-hidden />
                <span>{_("contacts")}</span>
              </Link>
            </Ui.Sidebar.CollapsibleMenuSubButton>

            {/* associations */}
            <Ui.Sidebar.CollapsibleMenuSubButton action={<AssociationPlusButton />}>
              <Link to={routesTo.associations.list()}>
                <UsersRound aria-hidden />
                <span>{_("associations")}</span>
              </Link>
            </Ui.Sidebar.CollapsibleMenuSubButton>

            {/* organisations */}
            <Ui.Sidebar.CollapsibleMenuSubButton action={<OrganisationPlusButton />}>
              <Link to={routesTo.organizations.list()}>
                <Building2 aria-hidden />
                <span>{_("organisations")}</span>
              </Link>
            </Ui.Sidebar.CollapsibleMenuSubButton>

            {/* categories */}
            <Ui.Sidebar.CollapsibleMenuSubButton action={<CategoriesPlusButton />}>
              <Link to={routesTo.categories.list()}>
                <Folders aria-hidden />
                <span>{_("categories")}</span>
              </Link>
            </Ui.Sidebar.CollapsibleMenuSubButton>
          </Ui.Sidebar.CollapsibleMenuSub>
        </Ui.Sidebar.CollapsibleMenuItem>
      </Ui.Sidebar.Menu>
    </ContextualLanguageProvider>
  )
}

/**
 * OrganisationLink
 * This link is used to navigate to the organisation page. It is only visible if the sidebar
 * is expanded and option "display organisation" is activated in workspace configuration.
 */
const OrganisationLink: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { workspace } = useWorkspace()
  const { translate } = useLanguage()
  const { organisationId } = workspace.config.organisation
  const { organisation, isLoading, isError } = useSwrOrganisation(organisationId)

  // Don't show anything if no organisation is configured
  if (!organisationId) return null

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex min-h-[var(--input-default-height)] items-center">
        <Ui.Sidebar.CollapsibleMenuSubButton className="grow" disabled>
          <span>
            <Star className="size-4 animate-pulse" aria-hidden />
            <span className="text-muted-foreground">{_("loading-organisation")}</span>
          </span>
        </Ui.Sidebar.CollapsibleMenuSubButton>
      </div>
    )
  }

  // Show error state
  if (isError || !organisation) return null

  const organisationName = placeholder(translate(organisation, servicePlaceholder.organisation).name, _("organisation-placeholder"))

  return (
    <div className="group/button flex items-center gap-1">
      <Ui.Sidebar.CollapsibleMenuSubButton className="grow">
        <Link to={routesTo.myMunicipality.list()}>
          <Star className="size-4" />
          <span>{organisationName}</span>
        </Link>
      </Ui.Sidebar.CollapsibleMenuSubButton>
    </div>
  )
}

/**
 * OrganisationPlusButton
 * This button is used to create an organisation. It is only visible if the sidebar is expanded.
 */
const OrganisationPlusButton: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const [create, props] = useCreateOrganisation()
  return (
    <>
      <Ui.Sidebar.MenuSubAction tooltip={_("create-organisation")} onClick={create}>
        <Plus aria-hidden />
      </Ui.Sidebar.MenuSubAction>
      <OrganisationsCreateDialog {...props} />
    </>
  )
}

/**
 * AssociationPlusButton
 * This button is used to create an association. It is only visible if the sidebar is expanded.
 */
const AssociationPlusButton: React.FC = () => {
  const service = useDirectoryService()
  return (
    <DirectoryServiceProvider
      {...service}
      organisationType="association"
      routesTo={{ ...service.routesTo, organizations: routesTo.associations }}
    >
      <OrganisationPlusButton />
    </DirectoryServiceProvider>
  )
}

/**
 * CategoriesPlusButton
 * This button is used to create a category. It is only visible if the sidebar is expanded.
 */
const CategoriesPlusButton: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { workspace } = useWorkspace()
  const [create, props] = useCreateCategory()
  return (
    <>
      <Ui.Sidebar.MenuSubAction tooltip={_("create-category")} onClick={create}>
        <Plus aria-hidden />
      </Ui.Sidebar.MenuSubAction>
      <CategoriesCreateDialog {...props} />
    </>
  )
}

/**
 * ContactPlusButton
 * This button is used to create a contact. It is only visible if the sidebar is expanded.
 */
const ContactPlusButton: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const [create, props] = useCreateContact()
  return (
    <>
      <Ui.Sidebar.MenuSubAction tooltip={_("create-contact")} onClick={create}>
        <Plus aria-hidden />
      </Ui.Sidebar.MenuSubAction>
      <ContactsCreateDialog {...props} />
    </>
  )
}

/**
 * translations
 */
const dictionary = {
  fr: {
    title: "Annuaire",
    "loading-organisation": "Chargement...",
    "organisation-placeholder": "Sans nom",
    contacts: "Contacts",
    "create-contact": "Créer un contact",
    associations: "Associations",
    organisations: "Organisations",
    "create-organisation": "Create an organisation",
    categories: "Catégories",
    "create-category": "Créer une catégorie",
  },
  en: {
    title: "Directory",
    "loading-organisation": "Loading...",
    "organisation-placeholder": "Unnamed",
    contacts: "Contacts",
    "create-contact": "Create a contact",
    associations: "Associations",
    organisations: "Organisations",
    "create-organisation": "Create an organisation",
    categories: "Categories",
    "create-category": "Create a category",
  },
  de: {
    title: "Verzeichnis",
    "loading-organisation": "Wird geladen...",
    "organisation-placeholder": "Unbenannt",
    contacts: "Kontakte",
    "create-contact": "Kontakt erstellen",
    associations: "Vereine",
    organisations: "Organisationen",
    "create-organisation": "Organisation erstellen",
    categories: "Kategorien",
    "create-category": "Kategorie erstellen",
  },
}
