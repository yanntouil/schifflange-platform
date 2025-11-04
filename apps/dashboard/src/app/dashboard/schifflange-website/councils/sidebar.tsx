import { useWorkspace } from "@/features/workspaces"
import { CouncilsCreateDialog, useCreateCouncil, useMutateCouncils } from "@compo/councils"
import { useTranslation } from "@compo/localize"
import { ContextualLanguageProvider } from "@compo/translations"
import { Ui } from "@compo/ui"
import { CalendarDays, Plus } from "lucide-react"
import React from "react"
import { Link } from "wouter"
import { routesTo } from "."

/**
 * Dashboard Councils Sidebar
 */
export const SidebarCouncils: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { workspace } = useWorkspace()

  return (
    <ContextualLanguageProvider persistedId={`${workspace.id}-languages`}>
      <Ui.Sidebar.Menu>
        <Ui.Sidebar.MenuItem>
          <div className="group/menu-item flex items-center">
            <Ui.Sidebar.MenuButton tooltip={_("title")} asChild>
              <Link to={routesTo.list()} className="-mr-[21px] grow">
                <CalendarDays className="size-4" aria-hidden />
                <span>{_("title")}</span>
              </Link>
            </Ui.Sidebar.MenuButton>
            <CouncilsPlusButton />
          </div>
        </Ui.Sidebar.MenuItem>
      </Ui.Sidebar.Menu>
    </ContextualLanguageProvider>
  )
}

/**
 * CouncilsPlusButton
 * This button is used to create a council. It is only visible if the sidebar is expanded.
 */
const CouncilsPlusButton: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { append } = useMutateCouncils()
  const [create, props] = useCreateCouncil(append)
  const { state } = Ui.useSidebar()
  const isExpanded = state === "expanded"
  if (!isExpanded) return null
  return (
    <>
      <Ui.Tooltip.Quick tooltip={_("create-council")} asChild side="right">
        <Ui.Button
          variant="ghost"
          icon
          size="sm"
          onClick={() => create()}
          className="bg-sidebar-accent flex opacity-0 transition-opacity duration-300 group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100"
        >
          <Plus aria-hidden />
          <Ui.SrOnly>{_("create-council")}</Ui.SrOnly>
        </Ui.Button>
      </Ui.Tooltip.Quick>

      <CouncilsCreateDialog {...props} />
    </>
  )
}

/**
 * translations
 */
const dictionary = {
  fr: {
    title: "Réunions du conseil communal",
    "create-council": "Créer une nouvelle réunion",
  },
  en: {
    title: "Council Meetings",
    "create-council": "Create a new meeting",
  },
  de: {
    title: "Gemeinderatssitzungen",
    "create-council": "Neue Sitzung erstellen",
  },
}
