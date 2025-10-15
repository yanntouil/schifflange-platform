import { Api } from "@/services"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { A } from "@compo/utils"
import {
  ClipboardPenLine,
  Layers2,
  SquareDashedMousePointerIcon,
  SquareMousePointerIcon,
  SquarePen,
  Trash,
  Trash2,
  UserPlus,
} from "lucide-react"
import React from "react"
import { useWorkspaces } from "./context"

/**
 * display the workspace menu
 */
export const WorkspaceMenu: React.FC<{ workspace: Api.Admin.Workspace }> = ({ workspace }) => {
  const { _ } = useTranslation(dictionary)
  const ctx = useWorkspaces()

  const isContextMenu = Ui.useIsContextMenu()
  const isSelected = React.useMemo(() => A.includes(ctx.selectedIds, workspace.id), [ctx.selectedIds, workspace.id])

  return (
    <>
      {isContextMenu && (
        <>
          {isSelected ? (
            <Ui.Menu.Item onClick={() => ctx.unselect({ id: workspace.id })}>
              <SquareDashedMousePointerIcon aria-hidden />
              {_("unselect")}
            </Ui.Menu.Item>
          ) : (
            <Ui.Menu.Item onClick={() => ctx.select({ id: workspace.id })}>
              <SquareMousePointerIcon aria-hidden />
              {_("select")}
            </Ui.Menu.Item>
          )}
        </>
      )}
      <Ui.Menu.Item onClick={() => ctx.display(workspace)}>
        <Layers2 aria-hidden />
        {_("view")}
      </Ui.Menu.Item>
      <Ui.Menu.Item onClick={() => ctx.edit(workspace)}>
        <SquarePen aria-hidden />
        {_("edit")}
      </Ui.Menu.Item>
      <Ui.Menu.Item onClick={() => ctx.editProfile(workspace)}>
        <ClipboardPenLine aria-hidden />
        {_("edit-profile")}
      </Ui.Menu.Item>

      {workspace.status === "deleted" ? (
        <Ui.Menu.Item onClick={() => ctx.delete(workspace.id)}>
          <Trash2 aria-hidden />
          {_("delete-permanently")}
        </Ui.Menu.Item>
      ) : (
        <Ui.Menu.Item onClick={() => ctx.delete(workspace.id)}>
          <Trash aria-hidden />
          {_("delete")}
        </Ui.Menu.Item>
      )}
      {isContextMenu && (
        <>
          <Ui.Menu.Separator />
          <Ui.Menu.Item onClick={() => ctx.create()}>
            <UserPlus aria-hidden />
            {_("create")}
          </Ui.Menu.Item>
          {isSelected && (
            <>
              <Ui.Menu.Separator />
              {workspace.status === "deleted" ? (
                <Ui.Menu.Item onClick={() => ctx.deleteSelection()}>
                  <Trash2 aria-hidden />
                  {_("delete-permanently-selection")}
                </Ui.Menu.Item>
              ) : (
                <Ui.Menu.Item onClick={() => ctx.deleteSelection()}>
                  <Trash aria-hidden />
                  {_("delete-selection")}
                </Ui.Menu.Item>
              )}
            </>
          )}
        </>
      )}
    </>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    select: "Select",
    unselect: "Unselect",
    view: "View workspace",
    edit: "Edit workspace",
    "edit-profile": "Edit workspace profile",
    delete: "Delete this workspace",
    "delete-permanently": "Delete permanently this workspace",
    create: "Add a new workspace",
    "delete-selection": "Delete selected workspaces",
    "delete-permanently-selection": "Delete permanently selected workspaces",
  },
  fr: {
    select: "Sélectionner",
    unselect: "Désélectionner",
    view: "Voir l'espace de travail",
    edit: "Modifier l'espace de travail",
    "edit-profile": "Modifier le profil de l'espace de travail",
    delete: "Supprimer cet espace de travail",
    "delete-permanently": "Supprimer définitivement cet espace de travail",
    create: "Ajouter un nouvel espace de travail",
    "delete-selection": "Supprimer les espaces de travail sélectionnés",
    "delete-permanently-selection": "Supprimer définitivement les espaces de travail sélectionnés",
  },
  de: {
    select: "Auswählen",
    unselect: "Abwählen",
    view: "Arbeitsbereich anzeigen",
    edit: "Arbeitsbereich bearbeiten",
    "edit-profile": "Arbeitsbereich-Profil bearbeiten",
    delete: "Diesen Arbeitsbereich löschen",
    "delete-permanently": "Diesen Arbeitsbereich endgültig löschen",
    create: "Neuen Arbeitsbereich hinzufügen",
    "delete-selection": "Ausgewählte Arbeitsbereiche löschen",
    "delete-permanently-selection": "Ausgewählte Arbeitsbereiche endgültig löschen",
  },
}
