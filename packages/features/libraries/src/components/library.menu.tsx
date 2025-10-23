import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { FilePenLine, Trash2 } from "lucide-react"
import React from "react"
import { useLibrary } from "../library.context"

/**
 * LibraryMenu
 */
export const LibraryMenu: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const ctx = useLibrary()
  return (
    <>
      <Ui.Menu.Item onClick={() => ctx.editLibrary()}>
        <FilePenLine aria-hidden />
        {_("edit")}
      </Ui.Menu.Item>
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
    delete: "Delete library",
  },
  fr: {
    edit: "Modifier la bibliothèque",
    delete: "Supprimer la bibliothèque",
  },
  de: {
    edit: "Bibliothek bearbeiten",
    delete: "Bibliothek löschen",
  },
}
