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
import { useOrganisations } from "../organisations.context"

/**
 * OrganisationsMenu
 */
export const OrganisationsMenu: React.FC<{ organisation: Api.Organisation }> = ({ organisation }) => {
  const { _ } = useTranslation(dictionary)
  const ctx = useOrganisations()
  const isContextMenu = Ui.useIsContextMenu()
  const isSelected = ctx.isSelected(organisation)
  return (
    <>
      {isContextMenu &&
        (isSelected ? (
          <Ui.Menu.Item onClick={() => ctx.unselect(organisation)}>
            <SquareDashedMousePointer aria-hidden />
            {_("unselect")}
          </Ui.Menu.Item>
        ) : (
          <Ui.Menu.Item onClick={() => ctx.select(organisation)}>
            <SquareMousePointer aria-hidden />
            {_("select")}
          </Ui.Menu.Item>
        ))}
      <Ui.Menu.Item onClick={() => ctx.displayOrganisation(organisation)}>
        <SquareArrowOutUpRight aria-hidden />
        {_("display")}
      </Ui.Menu.Item>
      <Ui.Menu.Item onClick={() => ctx.editOrganisation(organisation)}>
        <FilePenLine aria-hidden />
        {_("edit")}
      </Ui.Menu.Item>
      <Ui.Menu.Item onClick={() => ctx.confirmDeleteOrganisation(organisation)}>
        <Trash2 aria-hidden />
        {_("delete")}
      </Ui.Menu.Item>
      {isContextMenu && (
        <>
          <Ui.Menu.Separator />
          <Ui.Menu.Item onClick={() => ctx.createOrganisation()}>
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
    select: "Select organisation",
    unselect: "Deselect organisation",
    display: "Display organisation",
    edit: "Edit organisation",
    delete: "Delete organisation",
    create: "New organisation",
    "delete-selection": "Delete selected organisations",
  },
  fr: {
    select: "Sélectionner l'organisation",
    unselect: "Désélectionner l'organisation",
    display: "Afficher l'organisation",
    edit: "Modifier l'organisation",
    delete: "Supprimer l'organisation",
    create: "Nouvelle organisation",
    "delete-selection": "Supprimer les organisations sélectionnées",
  },
  de: {
    select: "Organisation auswählen",
    unselect: "Organisation abwählen",
    display: "Organisation anzeigen",
    edit: "Organisation bearbeiten",
    delete: "Organisation löschen",
    create: "Neue Organisation",
    "delete-selection": "Ausgewählte Organisationen löschen",
  },
}
