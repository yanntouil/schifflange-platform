import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { FilePenLine, Trash2 } from "lucide-react"
import React from "react"
import { useContact } from "../contact.context"

/**
 * ContactMenu
 */
export const ContactMenu: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const ctx = useContact()
  return (
    <>
      <Ui.Menu.Item onClick={ctx.edit}>
        <FilePenLine aria-hidden />
        {_("edit")}
      </Ui.Menu.Item>
      <Ui.Menu.Separator />
      <Ui.Menu.Item onClick={ctx.confirmDelete}>
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
    edit: "Edit contact",
    delete: "Delete contact",
  },
  fr: {
    edit: "Modifier le contact",
    delete: "Supprimer le contact",
  },
  de: {
    edit: "Kontakt bearbeiten",
    delete: "Kontakt löschen",
  },
}
