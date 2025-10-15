import { Api, service } from "@/services"
import { useKeepOnly, useSelectable } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { match } from "@compo/utils"
import React from "react"
import { ThemesContext } from "./context"
import { CreateThemeDialog } from "./create"
import { EditThemeDialog } from "./edit"
import { PreviewThemeDialog } from "./preview"
import { useSwrThemes } from "./swr"

/**
 * provider
 */
export const ThemesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { _ } = useTranslation(dictionary)

  // swr
  const { themes, metadata, swr } = useSwrThemes()

  // actions on theme
  const [createTheme, createThemeProps] = Ui.useQuickDialog<void, Api.Admin.WorkspaceTheme>({
    mutate: async (theme) => swr.append(theme),
  })
  const [previewTheme, previewThemeProps] = Ui.useQuickDialog<Api.Admin.WorkspaceTheme>({
    mutate: async (theme) => swr.append(theme),
  })
  const [editTheme, editThemeProps] = Ui.useQuickDialog<Api.Admin.WorkspaceTheme>({
    mutate: async (theme) => swr.update(theme),
  })
  const [deleteTheme, deleteThemeProps] = Ui.useConfirm<string>({
    onAsyncConfirm: async (id) => {
      return match(await service.admin.workspaces.themes.id(id).delete())
        .with({ failed: true }, () => true)
        .otherwise(() => {
          swr.rejectById(id)
          return false
        })
    },
    t: _.prefixed(`confirm.delete`),
  })
  const actionsOnTheme = {
    create: createTheme,
    edit: editTheme,
    preview: previewTheme,
    delete: deleteTheme,
  }

  // actions on selection
  const selectable = useSelectable<{ id: string }>()
  useKeepOnly(themes, selectable.keepOnly)

  const [deleteSelection, deleteSelectionProps] = Ui.useConfirm<void, string>({
    onAsyncConfirm: async (id) => {
      return match(await service.admin.workspaces.themes.id(id).delete())
        .with({ failed: true }, () => true)
        .otherwise(() => {
          swr.rejectById(id)
          return false
        })
    },
    finally: () => void swr.mutate(),
    list: selectable.selectedIds,
    t: _.prefixed(`confirm.delete-selection`),
  })
  const actionsOnSelection = {
    deleteSelection,
  }

  const context = {
    ...selectable,
    ...actionsOnTheme,
    ...actionsOnSelection,
    themes,
    metadata,
    swr,
  }
  return (
    <ThemesContext.Provider value={context}>
      {children}
      <CreateThemeDialog {...createThemeProps} />
      <PreviewThemeDialog {...previewThemeProps} />
      <EditThemeDialog {...editThemeProps} />
      <Ui.Confirm {...deleteThemeProps} />
      <Ui.Confirm {...deleteSelectionProps} />
    </ThemesContext.Provider>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    confirm: {
      delete: {
        title: "Delete theme",
        success: "Theme has been deleted",
        error: "Error while deleting theme",
        progress: "Deleting theme",
      },
      "delete-selection": {
        title: "Delete selected themes",
        success: "Themes have been deleted",
        error: "Error while deleting themes",
        progress: "Deleting {{counter}} / {{total}}",
      },
    },
  },
  fr: {
    confirm: {
      delete: {
        title: "Supprimer le thème",
        success: "Le thème a été supprimé",
        error: "Erreur lors de la suppression du thème",
        progress: "Suppression du thème en cours",
      },
      "delete-selection": {
        title: "Supprimer les thèmes sélectionnés",
        success: "Les thèmes ont été supprimés",
        error: "Erreur lors de la suppression",
        progress: "Suppression de {{counter}} / {{total}}",
      },
    },
  },
  de: {
    confirm: {
      delete: {
        title: "Thema löschen",
        success: "Thema wurde gelöscht",
        error: "Fehler beim Löschen des Themas",
        progress: "Thema wird gelöscht",
      },
      "delete-selection": {
        title: "Ausgewählte Themen löschen",
        success: "Themen wurden gelöscht",
        error: "Fehler beim Löschen der Themen",
        progress: "Löschen von {{counter}} / {{total}}",
      },
    },
  },
}
