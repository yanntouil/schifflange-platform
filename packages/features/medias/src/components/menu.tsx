import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { type Api } from "@services/dashboard"
import { Folders, MinusSquare, PlusSquare } from "lucide-react"
import React from "react"
import { useMedias } from "../medias.context"

/**
 * CommonMenu
 * This component is used to display the common menu
 */
export const CommonMenu: React.FC<{
  item: Api.MediaFolderWithRelations | Api.MediaFileWithRelations
  children: React.ReactNode
}> = ({ item, children }) => {
  const { _ } = useTranslation(dictionary)
  const ctx = useMedias()
  const isContextMenu = Ui.useIsContextMenu()
  const isSelected = React.useMemo(
    () => ctx.selectable.selected.some(({ id }) => id === item.id),
    [ctx.selectable.selected, item]
  )
  return (
    <>
      {children}
      {isContextMenu && (
        <>
          <Ui.Menu.Separator />
          <Ui.Menu.Item onClick={() => ctx.createFolder()}>
            <PlusSquare aria-hidden />
            {_("create-folder")}
          </Ui.Menu.Item>
          {ctx.hasSelection && isSelected && (
            <>
              <Ui.Menu.Separator />
              <Ui.Menu.Item onClick={() => ctx.moveSelection()}>
                <Folders aria-hidden />
                {_("move-selection")}
              </Ui.Menu.Item>
              <Ui.Menu.Item onClick={() => ctx.confirmDeleteSelection()}>
                <MinusSquare aria-hidden />
                {_("delete-selection")}
              </Ui.Menu.Item>
            </>
          )}
        </>
      )}
    </>
  )
}

const dictionary = {
  fr: {
    "create-folder": "Nouveau dossier",
    "move-selection": "Déplacer la sélection",
    "delete-selection": "Supprimer la sélection",
  },
  en: {
    "create-folder": "New folder",
    "move-selection": "Move selection",
    "delete-selection": "Delete selection",
  },
  de: {
    "create-folder": "Neuer Ordner",
    "move-selection": "Auswahl verschieben",
    "delete-selection": "Auswahl löschen",
  },
}
