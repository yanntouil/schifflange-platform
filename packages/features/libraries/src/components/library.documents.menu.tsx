import { useTranslation } from "@compo/localize"
import { usePublication } from "@compo/publications"
import { Ui } from "@compo/ui"
import { type Api } from "@services/dashboard"
import { FilePenLine, Pen, Trash2 } from "lucide-react"
import React from "react"
import { useLibrary } from "../library.context"

/**
 * LibraryMenu
 */
export const LibraryDocumentsMenu: React.FC<{ document: Api.LibraryDocument }> = ({ document }) => {
  const { _ } = useTranslation(dictionary)
  const ctx = useLibrary()
  const { edit } = usePublication()
  return (
    <>
      <Ui.Menu.Item onClick={() => ctx.editLibraryDocument(document)}>
        <FilePenLine aria-hidden />
        {_("edit")}
      </Ui.Menu.Item>
      <Ui.Menu.Item onClick={() => edit()}>
        <Pen />
        {_("edit-publication")}
      </Ui.Menu.Item>
      <Ui.Menu.Item onClick={() => ctx.confirmDeleteLibraryDocument(document)}>
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
    edit: "Edit document",
    "edit-publication": "Edit publication",
    delete: "Delete document",
  },
  fr: {
    edit: "Modifier le document",
    "edit-publication": "Modifier la publication",
    delete: "Supprimer le document",
  },
  de: {
    edit: "Dokument bearbeiten",
    "edit-publication": "Publikation bearbeiten",
    delete: "Dokument löschen",
  },
}
