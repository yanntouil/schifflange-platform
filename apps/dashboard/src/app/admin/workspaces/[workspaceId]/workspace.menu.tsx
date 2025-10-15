import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { ClipboardPenLine, SquarePen, Trash2 } from "lucide-react"
import React from "react"
import { useWorkspace } from "./context"

/**
 * Workspace Menu
 */
export const WorkspaceMenu: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { workspace, ...ctx } = useWorkspace()

  if (!workspace) return null

  return (
    <>
      <Ui.Menu.Item onClick={() => ctx.edit()}>
        <SquarePen className="size-4" />
        {_("edit")}
      </Ui.Menu.Item>
      <Ui.Menu.Item onClick={() => ctx.editProfile()}>
        <ClipboardPenLine className="size-4" />
        {_("edit-profile")}
      </Ui.Menu.Item>
      <Ui.Menu.Item onClick={() => ctx.delete()} className="text-destructive">
        <Trash2 className="size-4" />
        {_("delete")}
      </Ui.Menu.Item>
    </>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    edit: "Edit workspace",
    "edit-profile": "Edit profile",
    delete: "Delete workspace",
  },
  fr: {
    edit: "Modifier l'espace de travail",
    "edit-profile": "Modifier le profil",
    delete: "Supprimer l'espace de travail",
  },
  de: {
    edit: "Arbeitsbereich bearbeiten",
    "edit-profile": "Profil bearbeiten",
    delete: "Arbeitsbereich löschen",
  },
}
