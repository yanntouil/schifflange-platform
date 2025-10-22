import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { FilePenLine, Trash2 } from "lucide-react"
import React from "react"
import { useOrganisation } from "../organisation.context"

/**
 * OrganisationsMenu
 */
export const OrganisationMenu: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const ctx = useOrganisation()
  const { organisation } = ctx.swr
  return (
    <>
      <Ui.Menu.Item onClick={() => ctx.editOrganisation()}>
        <FilePenLine aria-hidden />
        {_("edit")}
      </Ui.Menu.Item>
      <Ui.Menu.Item onClick={() => ctx.confirmDelete()}>
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
    edit: "Edit organisation",
    delete: "Delete organisation",
  },
  fr: {
    edit: "Modifier l'organisation",
    delete: "Supprimer l'organisation",
  },
  de: {
    edit: "Organisation bearbeiten",
    delete: "Organisation löschen",
  },
}
