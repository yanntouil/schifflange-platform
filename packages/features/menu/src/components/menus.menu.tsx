import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { Api } from "@services/dashboard"
import {
  FilePenLine,
  FilePlusIcon,
  SquareDashedMousePointer,
  SquareMousePointer,
  Trash2,
  Trash2Icon,
} from "lucide-react"
import React from "react"
import { useMenus } from "../menus.context"

/**
 * MenusMenu
 */
export const MenusMenu: React.FC<{ menu: Api.Menu & Api.WithMenuItems }> = ({ menu }) => {
  const { _ } = useTranslation(dictionary)
  const ctx = useMenus()
  const isContextMenu = Ui.useIsContextMenu()
  const isSelected = ctx.isSelected(menu)

  return (
    <>
      {isContextMenu &&
        (isSelected ? (
          <Ui.Menu.Item onClick={() => ctx.unselect(menu)}>
            <SquareDashedMousePointer aria-hidden />
            {_("unselect")}
          </Ui.Menu.Item>
        ) : (
          <Ui.Menu.Item onClick={() => ctx.select(menu)}>
            <SquareMousePointer aria-hidden />
            {_("select")}
          </Ui.Menu.Item>
        ))}

      <Ui.Menu.Item onClick={() => ctx.editMenu(menu)}>
        <FilePenLine aria-hidden />
        {_("edit")}
      </Ui.Menu.Item>

      <Ui.Menu.Separator />

      <Ui.Menu.Item onClick={() => ctx.confirmDeleteMenu(menu)}>
        <Trash2 aria-hidden />
        {_("delete")}
      </Ui.Menu.Item>

      {isContextMenu && (
        <>
          <Ui.Menu.Separator />
          <Ui.Menu.Item onClick={() => ctx.createMenu()}>
            <FilePlusIcon aria-hidden />
            {_("create")}
          </Ui.Menu.Item>
          {isSelected && (
            <>
              <Ui.Menu.Separator />
              <Ui.Menu.Item onClick={() => ctx.confirmDeleteSelection()}>
                <Trash2Icon aria-hidden />
                {_("delete-selection")}
              </Ui.Menu.Item>
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
  fr: {
    select: "Sélectionner le menu",
    unselect: "Désélectionner le menu",
    edit: "Modifier le menu",
    delete: "Supprimer le menu",
    create: "Nouveau menu",
    "delete-selection": "Supprimer les menus sélectionnés",
  },
  de: {
    select: "Menü auswählen",
    unselect: "Menü abwählen",
    edit: "Menü bearbeiten",
    delete: "Menü löschen",
    create: "Neues Menü",
    "delete-selection": "Ausgewählte Menüs löschen",
  },
  en: {
    select: "Select menu",
    unselect: "Deselect menu",
    edit: "Edit menu",
    delete: "Delete menu",
    create: "New menu",
    "delete-selection": "Delete selected menus",
  },
}
