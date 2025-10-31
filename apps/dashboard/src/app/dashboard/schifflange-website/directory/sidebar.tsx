import { useWorkspace } from "@/features/workspaces"
import {
  CategoriesCreateDialog,
  ContactsCreateDialog,
  DirectoryServiceProvider,
  useCreateCategory,
  useCreateOrganisation,
  useDirectoryService,
} from "@compo/directory"
import { OrganisationsCreateDialog } from "@compo/directory/src/components/organisations.create"
import { useCreateContact } from "@compo/directory/src/contacts.context.actions"
import { useTranslation } from "@compo/localize"
import { ContextualLanguageProvider } from "@compo/translations"
import { Ui } from "@compo/ui"
import { BookUser, Building2, Folders, Plus, Users, UsersRound } from "lucide-react"
import React from "react"
import { Link } from "wouter"
import { routesTo } from "."
import { SidebarPinned } from "./sidebar.pinned"

/**
 * Dashboard Directory Sidebar
 */
export const SidebarDirectory: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { workspace } = useWorkspace()

  return (
    <ContextualLanguageProvider persistedId={`${workspace.id}-languages`}>
      <Ui.Sidebar.Menu>
        <Ui.Sidebar.CollapsibleMenuItem persistKey={`${workspace.id}-directory-sidebar`}>
          <Ui.Sidebar.CollapsibleMenuButton tooltip={_("title")}>
            <BookUser className="size-4" />
            <span>{_("title")}</span>
          </Ui.Sidebar.CollapsibleMenuButton>
          <Ui.Sidebar.CollapsibleMenuSub>
            <SidebarPinned />
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
 * OrganisationPlusButton
 * This button is used to create an organisation. It is only visible if the sidebar is expanded.
 */
const OrganisationPlusButton: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const [create, props] = useCreateOrganisation()
  return (
    <>
      <Ui.Sidebar.MenuSubAction tooltip={_("create-organisation")} onClick={() => create()}>
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
      <Ui.Sidebar.MenuSubAction tooltip={_("create-category")} onClick={() => create()}>
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
      <Ui.Sidebar.MenuSubAction tooltip={_("create-contact")} onClick={() => create()}>
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
    contacts: "Gérer les contacts",
    "create-contact": "Créer un nouveau contact",
    associations: "Gérer les associations",
    organisations: "Gérer les organisations",
    "create-organisation": "Créer une nouvelle organisation",
    categories: "Gérer les catégories",
    "create-category": "Créer une nouvelle catégorie",
  },
  en: {
    title: "Directory",
    "loading-organisation": "Loading...",
    "organisation-placeholder": "Unnamed",
    contacts: "Manage contacts",
    "create-contact": "Create a new contact",
    associations: "Manage associations",
    organisations: "Manage organisations",
    "create-organisation": "Create a new organisation",
    categories: "Manage categories",
    "create-category": "Create a new category",
  },
  de: {
    title: "Verzeichnis",
    "loading-organisation": "Wird geladen...",
    "organisation-placeholder": "Unbenannt",
    contacts: "Kontakte verwalten",
    "create-contact": "Neuen Kontakt erstellen",
    associations: "Vereine verwalten",
    organisations: "Organisationen verwalten",
    "create-organisation": "Neue Organisation erstellen",
    categories: "Kategorien verwalten",
    "create-category": "Neue Kategorie erstellen",
  },
}
