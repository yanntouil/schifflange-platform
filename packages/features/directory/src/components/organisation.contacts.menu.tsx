import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { type Api } from "@services/dashboard"
import {
  Ellipsis,
  FilePenLine,
  FilePlusIcon,
  SquareArrowOutUpRight,
  SquareDashedMousePointer,
  SquareMinus,
  SquareMousePointer,
  Trash2,
  Trash2Icon,
} from "lucide-react"
import React from "react"
import { useOrganisation } from "../organisation.context"

/**
 * OrganisationContactsMenu
 */
export const OrganisationContactsMenu: React.FC<{ contactOrganisation: Api.ContactOrganisation }> = ({
  contactOrganisation,
}) => {
  const { _ } = useTranslation(dictionary)
  const ctx = useOrganisation()
  const isContextMenu = Ui.useIsContextMenu()
  const isSelected = ctx.isSelected(contactOrganisation)
  return (
    <>
      {isContextMenu &&
        (isSelected ? (
          <Ui.Menu.Item onClick={() => ctx.unselect(contactOrganisation)}>
            <SquareDashedMousePointer aria-hidden />
            {_("unselect")}
          </Ui.Menu.Item>
        ) : (
          <Ui.Menu.Item onClick={() => ctx.select(contactOrganisation)}>
            <SquareMousePointer aria-hidden />
            {_("select")}
          </Ui.Menu.Item>
        ))}

      <Ui.Menu.Item onClick={() => ctx.editContactOrganisation(contactOrganisation)}>
        <FilePenLine aria-hidden />
        {_("edit")}
      </Ui.Menu.Item>

      <Ui.Menu.Sub>
        <Ui.Menu.SubTrigger>
          <Ellipsis aria-hidden />
          {_("more-contact")}
        </Ui.Menu.SubTrigger>
        <Ui.Menu.SubContent>
          <Ui.Menu.Item onClick={() => ctx.displayContact(contactOrganisation.contact)}>
            <SquareArrowOutUpRight aria-hidden />
            {_("display")}
          </Ui.Menu.Item>
          <Ui.Menu.Item onClick={() => ctx.editContact(contactOrganisation.contact)}>
            <FilePenLine aria-hidden />
            {_("edit-contact")}
          </Ui.Menu.Item>
          <Ui.Menu.Item onClick={() => ctx.confirmDeleteContact(contactOrganisation)}>
            <Trash2 aria-hidden />
            {_("delete-contact")}
          </Ui.Menu.Item>
        </Ui.Menu.SubContent>
      </Ui.Menu.Sub>

      <Ui.Menu.Item onClick={() => ctx.confirmDeleteContactOrganisation(contactOrganisation)}>
        <SquareMinus aria-hidden />
        {_("remove")}
      </Ui.Menu.Item>
      {isContextMenu && (
        <>
          <Ui.Menu.Separator />
          <Ui.Menu.Item onClick={() => ctx.addContact()}>
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
    select: "Select",
    unselect: "Unselect",
    edit: "Edit contact in organisation",
    "more-contact": "More actions on contact",
    display: "Display contact",
    "edit-contact": "Edit contact",
    "delete-contact": "Delete contact",
    remove: "Remove from organisation",
    create: "Add contact",
    "delete-selection": "Remove selection",
  },
  fr: {
    select: "Sélectionner",
    unselect: "Désélectionner",
    edit: "Modifier le contact dans l'organisation",
    "more-contact": "Plus d'actions sur le contact",
    display: "Afficher le contact",
    "edit-contact": "Modifier le contact",
    "delete-contact": "Supprimer le contact",
    remove: "Retirer de l'organisation",
    create: "Ajouter un contact",
    "delete-selection": "Retirer la sélection",
  },
  de: {
    select: "Auswählen",
    unselect: "Abwählen",
    edit: "Kontakt in Organisation bearbeiten",
    "more-contact": "Weitere Aktionen am Kontakt",
    display: "Kontakt anzeigen",
    "edit-contact": "Kontakt bearbeiten",
    "delete-contact": "Kontakt löschen",
    remove: "Aus Organisation entfernen",
    create: "Kontakt hinzufügen",
    "delete-selection": "Auswahl entfernen",
  },
}
