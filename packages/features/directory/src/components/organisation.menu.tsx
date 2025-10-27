import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { FilePenLine, Pin, PinOff, Trash2 } from "lucide-react"
import React from "react"
import { useOrganisation } from "../organisation.context"

/**
 * OrganisationsMenu
 */
export const OrganisationMenu: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const ctx = useOrganisation()
  const { organisation } = ctx.swr
  const { isPinned, pin, unpin } = ctx.makePinnable(organisation.id)
  return (
    <>
      <Ui.Menu.Item onClick={() => ctx.editOrganisation()}>
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
    pin: "Pin organisation",
    unpin: "Unpin organisation",
    delete: "Delete organisation",
  },
  fr: {
    edit: "Modifier l'organisation",
    pin: "Épingler l'organisation",
    unpin: "Désépingler l'organisation",
    delete: "Supprimer l'organisation",
  },
  de: {
    edit: "Organisation bearbeiten",
    pin: "Organisation fixieren",
    unpin: "Organisation lösen",
    delete: "Organisation löschen",
  },
}
