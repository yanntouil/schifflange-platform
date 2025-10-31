import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { type Api } from "@services/dashboard"
import {
  FilePenLine,
  FilePlusIcon,
  Pin,
  PinOff,
  SquareArrowOutUpRight,
  SquareDashedMousePointer,
  SquareMousePointer,
  Trash2,
  Trash2Icon,
} from "lucide-react"
import React from "react"
import { useLibraries } from "../libraries.context"

/**
 * LibrariesMenu
 */
export const LibrariesMenu: React.FC<{ library: Api.Library }> = ({ library }) => {
  const { _ } = useTranslation(dictionary)
  const ctx = useLibraries()
  const isContextMenu = Ui.useIsContextMenu()
  const isSelected = ctx.isSelected(library)
  const { isPinned, pin, unpin } = ctx.makePinnable(library.id)
  return (
    <>
      {isContextMenu &&
        (isSelected ? (
          <Ui.Menu.Item onClick={() => ctx.unselect(library)}>
            <SquareDashedMousePointer aria-hidden />
            {_("unselect")}
          </Ui.Menu.Item>
        ) : (
          <Ui.Menu.Item onClick={() => ctx.select(library)}>
            <SquareMousePointer aria-hidden />
            {_("select")}
          </Ui.Menu.Item>
        ))}
      <Ui.Menu.Item onClick={() => ctx.displayLibrary(library)}>
        <SquareArrowOutUpRight aria-hidden />
        {_("display")}
      </Ui.Menu.Item>
      <Ui.Menu.Item onClick={() => ctx.editLibrary(library)}>
        <FilePenLine aria-hidden />
        {_("edit")}
      </Ui.Menu.Item>
      {isPinned() ? (
        <Ui.Menu.Item onClick={() => unpin()}>
          <PinOff aria-hidden />
          {_("unpin")}
        </Ui.Menu.Item>
      ) : (
        <Ui.Menu.Item onClick={() => pin()}>
          <Pin aria-hidden />
          {_("pin")}
        </Ui.Menu.Item>
      )}
      <Ui.Menu.Item onClick={() => ctx.confirmDeleteLibrary(library)}>
        <Trash2 aria-hidden />
        {_("delete")}
      </Ui.Menu.Item>
      {isContextMenu && (
        <>
          <Ui.Menu.Separator />
          <Ui.Menu.Item onClick={() => ctx.createLibrary()}>
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
  en: {
    select: "Select library",
    unselect: "Deselect library",
    display: "Display library",
    edit: "Edit library",
    pin: "Pin library",
    unpin: "Unpin library",
    delete: "Delete library",
    create: "New library",
    "delete-selection": "Delete selected libraries",
  },
  fr: {
    select: "Sélectionner la bibliothèque",
    unselect: "Désélectionner la bibliothèque",
    display: "Afficher la bibliothèque",
    edit: "Modifier la bibliothèque",
    pin: "Épingler la bibliothèque",
    unpin: "Désépingler la bibliothèque",
    delete: "Supprimer la bibliothèque",
    create: "Nouvelle bibliothèque",
    "delete-selection": "Supprimer les bibliothèques sélectionnées",
  },
  de: {
    select: "Bibliothek auswählen",
    unselect: "Bibliothek abwählen",
    display: "Bibliothek anzeigen",
    edit: "Bibliothek bearbeiten",
    pin: "Bibliothek fixieren",
    unpin: "Bibliothek lösen",
    delete: "Bibliothek löschen",
    create: "Neue Bibliothek",
    "delete-selection": "Ausgewählte Bibliotheken löschen",
  },
}
