import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { type Api } from "@services/dashboard"
import {
  FilePenLine,
  FilePlusIcon,
  SquareDashedMousePointer,
  SquareMousePointer,
  Trash2,
  Trash2Icon,
} from "lucide-react"
import React from "react"
import { useCouncils } from "../councils.context"

/**
 * CouncilsMenu
 */
export const CouncilsMenu: React.FC<{ council: Api.Council }> = ({ council }) => {
  const { _ } = useTranslation(dictionary)
  const ctx = useCouncils()
  const isContextMenu = Ui.useIsContextMenu()
  const isSelected = ctx.isSelected(council)
  return (
    <>
      {isContextMenu &&
        (isSelected ? (
          <Ui.Menu.Item onClick={() => ctx.unselect(council)}>
            <SquareDashedMousePointer aria-hidden />
            {_("unselect")}
          </Ui.Menu.Item>
        ) : (
          <Ui.Menu.Item onClick={() => ctx.select(council)}>
            <SquareMousePointer aria-hidden />
            {_("select")}
          </Ui.Menu.Item>
        ))}
      <Ui.Menu.Item onClick={() => ctx.editCouncil(council)}>
        <FilePenLine aria-hidden />
        {_("edit")}
      </Ui.Menu.Item>
      <Ui.Menu.Item onClick={() => ctx.confirmDeleteCouncil(council)}>
        <Trash2 aria-hidden />
        {_("delete")}
      </Ui.Menu.Item>
      {isContextMenu && (
        <>
          <Ui.Menu.Separator />
          <Ui.Menu.Item onClick={() => ctx.createCouncil()}>
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
    select: "Select council meeting",
    unselect: "Deselect council meeting",
    edit: "Edit council meeting",
    delete: "Delete council meeting",
    create: "New council meeting",
    "delete-selection": "Delete selected council meetings",
  },
  fr: {
    select: "Sélectionner la réunion du conseil communal",
    unselect: "Désélectionner la réunion du conseil communal",
    edit: "Modifier la réunion du conseil communal",
    delete: "Supprimer la réunion du conseil communal",
    create: "Nouvelle réunion du conseil communal",
    "delete-selection": "Supprimer les réunions du conseil communal sélectionnées",
  },
  de: {
    select: "Gemeinderatssitzung auswählen",
    unselect: "Gemeinderatssitzung abwählen",
    edit: "Gemeinderatssitzung bearbeiten",
    delete: "Gemeinderatssitzung löschen",
    create: "Neue Gemeinderatssitzung",
    "delete-selection": "Ausgewählte Gemeinderatssitzungen löschen",
  },
}
