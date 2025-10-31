import { useWorkspace } from "@/features/workspaces"
import { LibrariesCreateDialog, useCreateLibrary } from "@compo/libraries"
import { useTranslation } from "@compo/localize"
import { ContextualLanguageProvider } from "@compo/translations"
import { Ui } from "@compo/ui"
import { Notebook, NotebookTabs, Plus } from "lucide-react"
import React from "react"
import { Link } from "wouter"
import { routesTo } from "."
import { SidebarPinned } from "./sidebar.pinned"

/**
 * Dashboard Libraries Sidebar
 */
export const SidebarLibraries: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { workspace } = useWorkspace()

  return (
    <ContextualLanguageProvider persistedId={`${workspace.id}-languages`}>
      <Ui.Sidebar.Menu>
        <Ui.Sidebar.CollapsibleMenuItem persistKey={`${workspace.id}-directory-sidebar`}>
          <Ui.Sidebar.CollapsibleMenuButton tooltip={_("title")}>
            <Notebook className="size-4" />
            <span>{_("title")}</span>
          </Ui.Sidebar.CollapsibleMenuButton>
          <Ui.Sidebar.CollapsibleMenuSub>
            <SidebarPinned />
            {/* libraries */}
            <Ui.Sidebar.CollapsibleMenuSubButton action={<LibraryPlusButton />}>
              <Link to={routesTo.list()}>
                <NotebookTabs aria-hidden />
                <span>{_("libraries")}</span>
              </Link>
            </Ui.Sidebar.CollapsibleMenuSubButton>
          </Ui.Sidebar.CollapsibleMenuSub>
        </Ui.Sidebar.CollapsibleMenuItem>
      </Ui.Sidebar.Menu>
    </ContextualLanguageProvider>
  )
}

/**
 * LibraryPlusButton
 * This button is used to create a library. It is only visible if the sidebar is expanded.
 */
const LibraryPlusButton: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const [create, props] = useCreateLibrary()
  return (
    <>
      <Ui.Sidebar.MenuSubAction tooltip={_("create-library")} onClick={() => create()}>
        <Plus aria-hidden />
      </Ui.Sidebar.MenuSubAction>
      <LibrariesCreateDialog {...props} />
    </>
  )
}

/**
 * translations
 */
const dictionary = {
  fr: {
    title: "Bibliothèques",
    "title-placeholder": "Bibliothèque sans nom",
    libraries: "Gérer les bibliothèques",
    "create-library": "Créer une nouvelle bibliothèque",
  },
  en: {
    title: "Libraries",
    "title-placeholder": "Library without name",
    libraries: "Manage libraries",
    "create-library": "Create a new library",
  },
  de: {
    title: "Bibliotheken",
    "title-placeholder": "Bibliothek ohne Name",
    libraries: "Bibliotheken verwalten",
    "create-library": "Neue Bibliothek erstellen",
  },
}
