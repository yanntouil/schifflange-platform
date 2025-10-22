import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { type Api } from "@services/dashboard"
import {
  FilePenLine,
  FilePlusIcon,
  SquareArrowOutUpRight,
  SquareDashedMousePointer,
  SquareMousePointer,
  Trash2,
  Trash2Icon,
} from "lucide-react"
import React from "react"
import { useContacts } from "../contacts.context"

/**
 * ContactsMenu
 */
export const ContactsMenu: React.FC<{ contact: Api.Contact }> = ({ contact }) => {
  const { _ } = useTranslation(dictionary)
  const ctx = useContacts()
  const isContextMenu = Ui.useIsContextMenu()
  const isSelected = ctx.isSelected(contact)
  return (
    <>
      {isContextMenu &&
        (isSelected ? (
          <Ui.Menu.Item onClick={() => ctx.unselect(contact)}>
            <SquareDashedMousePointer aria-hidden />
            {_("unselect")}
          </Ui.Menu.Item>
        ) : (
          <Ui.Menu.Item onClick={() => ctx.select(contact)}>
            <SquareMousePointer aria-hidden />
            {_("select")}
          </Ui.Menu.Item>
        ))}
      <Ui.Menu.Item onClick={() => ctx.displayContact(contact)}>
        <SquareArrowOutUpRight aria-hidden />
        {_("display")}
      </Ui.Menu.Item>
      <Ui.Menu.Item onClick={() => ctx.editContact(contact)}>
        <FilePenLine aria-hidden />
        {_("edit")}
      </Ui.Menu.Item>
      <Ui.Menu.Item onClick={() => ctx.confirmDeleteContact(contact)}>
        <Trash2 aria-hidden />
        {_("delete")}
      </Ui.Menu.Item>
      {isContextMenu && (
        <>
          <Ui.Menu.Separator />
          <Ui.Menu.Item onClick={() => ctx.createContact()}>
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
    select: "Select contact",
    unselect: "Deselect contact",
    display: "Display contact",
    edit: "Edit contact",
    delete: "Delete contact",
    create: "New contact",
    "delete-selection": "Delete selected contacts",
  },
  fr: {
    select: "Sélectionner le contact",
    unselect: "Désélectionner le contact",
    display: "Afficher le contact",
    edit: "Modifier le contact",
    delete: "Supprimer le contact",
    create: "Nouveau contact",
    "delete-selection": "Supprimer les contacts sélectionnés",
  },
  de: {
    select: "Kontakt auswählen",
    unselect: "Kontakt abwählen",
    display: "Kontakt anzeigen",
    edit: "Kontakt bearbeiten",
    delete: "Kontakt löschen",
    create: "Neuer Kontakt",
    "delete-selection": "Ausgewählte Kontakte löschen",
  },
}
