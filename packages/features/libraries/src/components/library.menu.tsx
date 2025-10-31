import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { FilePenLine, Pin, PinOff, Trash2 } from "lucide-react"
import React from "react"
import { useLibrary } from "../library.context"

/**
 * LibraryMenu
 */
export const LibraryMenu: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const ctx = useLibrary()
  const { isPinned, pin, unpin } = ctx.makePinned(ctx.swr.library.id)
  return (
    <>
      <Ui.Menu.Item onClick={() => ctx.editLibrary()}>
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
      <Ui.Menu.Item onClick={() => ctx.confirmDeleteLibrary()}>
        <Trash2 aria-hidden />
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
    edit: "Edit library",
    pin: "Pin library",
    unpin: "Unpin library",
    delete: "Delete library",
  },
  fr: {
    edit: "Modifier la bibliothèque",
    pin: "Épingler la bibliothèque",
    unpin: "Désépingler la bibliothèque",
    delete: "Supprimer la bibliothèque",
  },
  de: {
    edit: "Bibliothek bearbeiten",
    pin: "Bibliothek fixieren",
    unpin: "Bibliothek lösen",
    delete: "Bibliothek löschen",
  },
}
