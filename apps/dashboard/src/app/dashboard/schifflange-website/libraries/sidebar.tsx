import { useWorkspace } from "@/features/workspaces"
import { LibrariesCreateDialog, useCreateLibrary, useSwrLibraries } from "@compo/libraries"
import { useTranslation } from "@compo/localize"
import { ContextualLanguageProvider, useLanguage } from "@compo/translations"
import { Ui } from "@compo/ui"
import { A, getInitials, makeColorsFromString, placeholder } from "@compo/utils"
import { Api, placeholder as servicePlaceholder } from "@services/dashboard"
import { Notebook, NotebookTabs, Plus } from "lucide-react"
import React from "react"
import { Link } from "wouter"
import { routesTo } from "."

/**
 * Dashboard Libraries Sidebar
 */
export const SidebarLibraries: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { translate } = useLanguage()
  const { workspace } = useWorkspace()
  const { libraries } = useSwrLibraries()

  return (
    <ContextualLanguageProvider persistedId={`${workspace.id}-languages`}>
      <Ui.Sidebar.Menu>
        <Ui.Sidebar.CollapsibleMenuItem persistKey={`${workspace.id}-directory-sidebar`}>
          <Ui.Sidebar.CollapsibleMenuButton tooltip={_("title")}>
            <Notebook className="size-4" />
            <span>{_("title")}</span>
          </Ui.Sidebar.CollapsibleMenuButton>
          <Ui.Sidebar.CollapsibleMenuSub>
            {A.map(libraries, (library) => (
              <LibraryButton key={library.id} library={library} />
            ))}
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
const LibraryButton: React.FC<{ library: Api.Library }> = ({ library }) => {
  const { _ } = useTranslation(dictionary)
  const { translate } = useLanguage()
  const title = placeholder(translate(library, servicePlaceholder.library).title, _("title-placeholder"))

  const { scheme } = Ui.useTheme()
  const [light, dark] = makeColorsFromString(title)
  const initials = getInitials(title, "", 3)
  const style = scheme === "dark" ? { backgroundColor: dark, color: light } : { backgroundColor: light, color: dark }

  return (
    <>
      <Ui.Sidebar.CollapsibleMenuSubButton>
        <Link to={routesTo.byId(library.id)}>
          <span
            className="border-muted-forground flex size-4 flex-none items-center justify-center rounded-sm text-[5px] font-medium"
            style={style}
          >
            {initials}
          </span>
          <span>{title}</span>
        </Link>
      </Ui.Sidebar.CollapsibleMenuSubButton>
    </>
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
      <Ui.Sidebar.MenuSubAction tooltip={_("create-library")} onClick={create}>
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
    "create-library": "Créer une bibliothèque",
  },
  en: {
    title: "Libraries",
    "title-placeholder": "Library without name",
    libraries: "Manage libraries",
    "create-library": "Create a library",
  },
  de: {
    title: "Bibliotheken",
    "title-placeholder": "Bibliothek ohne Name",
    libraries: "Bibliotheken verwalten",
    "create-library": "Bibliothek erstellen",
  },
}
