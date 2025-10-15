import { Api } from "@/services"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { Edit, Eye, Trash } from "lucide-react"
import React from "react"
import { useThemes } from "./context"

/**
 * Theme menu
 */
export const ThemeMenu: React.FC<{ theme: Api.Admin.WorkspaceTheme }> = ({ theme }) => {
  const { _ } = useTranslation(dictionary)
  const ctx = useThemes()

  return (
    <>
      <Ui.Menu.Item onClick={() => ctx.edit(theme)}>
        <Edit aria-hidden />
        {_("edit")}
      </Ui.Menu.Item>
      <Ui.Menu.Item onClick={() => ctx.preview(theme)}>
        <Eye aria-hidden />
        {_("preview")}
      </Ui.Menu.Item>
      <Ui.Menu.Separator />
      <Ui.Menu.Item onClick={() => ctx.delete(theme.id)} className="text-destructive">
        <Trash aria-hidden />
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
    edit: "Edit theme",
    preview: "Preview theme",
    delete: "Delete theme",
  },
  fr: {
    edit: "Modifier le thème",
    preview: "Prévisualiser le thème",
    delete: "Supprimer le thème",
  },
  de: {
    edit: "Thema bearbeiten",
    preview: "Thema ansehen",
    delete: "Thema löschen",
  },
}
