import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { type Api } from "@services/dashboard"
import { Edit, Ellipsis, FolderInput, Folders, SquareDashedMousePointer, SquareMousePointer, Trash } from "lucide-react"
import React from "react"
import { useMedias } from "../../medias.context"
import { CommonMenu } from "../menu"

/**
 * FolderMenu
 * This component is used to display the folder menu
 */
export const FolderMenu: React.FC<{ item: Api.MediaFolderWithRelations }> = ({ item }) => {
  const ctx = useMedias()
  const { _ } = useTranslation(dictionary)
  const isContextMenu = Ui.useIsContextMenu()
  const isSelected = React.useMemo(
    () => ctx.selectable.selected.some(({ id }) => id === item.id),
    [ctx.selectable.selected, item]
  )
  return (
    <CommonMenu item={item}>
      {/* Sélection - une seule action visible */}
      {isContextMenu &&
        ctx.canSelectFolder &&
        (isSelected ? (
          <Ui.Menu.Item onClick={() => ctx.unselect(item)}>
            <SquareDashedMousePointer aria-hidden />
            {_("unselect")}
          </Ui.Menu.Item>
        ) : (
          <Ui.Menu.Item onClick={() => ctx.select(item)}>
            <SquareMousePointer aria-hidden />
            {_("select")}
          </Ui.Menu.Item>
        ))}

      {/* Actions principales - ouvrir et renommer */}
      <Ui.Menu.Item onClick={() => ctx.displayFolder(item)}>
        <FolderInput aria-hidden />
        {_("display")}
      </Ui.Menu.Item>

      <Ui.Menu.Item onClick={() => ctx.editFolder(item)}>
        <Edit aria-hidden />
        {_("edit")}
      </Ui.Menu.Item>

      {/* Menu More avec actions secondaires */}
      <Ui.Menu.Sub>
        <Ui.Menu.SubTrigger>
          <Ellipsis aria-hidden />
          {_("more")}
        </Ui.Menu.SubTrigger>
        <Ui.Menu.SubContent>
          <Ui.Menu.Item onClick={() => ctx.moveFolder(item)}>
            <Folders aria-hidden />
            {_("move")}
          </Ui.Menu.Item>

          <Ui.Menu.Separator />

          <Ui.Menu.Item onClick={() => ctx.confirmDeleteFolder(item)}>
            <Trash aria-hidden />
            {_("delete")}
          </Ui.Menu.Item>
        </Ui.Menu.SubContent>
      </Ui.Menu.Sub>
    </CommonMenu>
  )
}

const dictionary = {
  fr: {
    select: "Sélectionner",
    unselect: "Désélectionner",
    display: "Ouvrir",
    edit: "Renommer",
    delete: "Supprimer",
    move: "Déplacer vers...",
    more: "Plus d'actions",
  },
  de: {
    select: "Auswählen",
    unselect: "Abwählen",
    display: "Öffnen",
    edit: "Umbenennen",
    delete: "Löschen",
    move: "Verschieben nach...",
    more: "Weitere Aktionen",
  },
  en: {
    select: "Select",
    unselect: "Unselect",
    display: "Open",
    edit: "Rename",
    delete: "Delete",
    move: "Move to...",
    more: "More actions",
  },
}
