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
import { useTags } from "../tags.context"

/**
 * TagsMenu
 */
export const TagsMenu: React.FC<{ tag: Api.ProjectTag }> = ({ tag }) => {
  const { _ } = useTranslation(dictionary)
  const ctx = useTags()
  const isContextMenu = Ui.useIsContextMenu()
  const isSelected = ctx.isSelected(tag)
  return (
    <>
      {isContextMenu &&
        (isSelected ? (
          <Ui.Menu.Item onClick={() => ctx.unselect(tag)}>
            <SquareDashedMousePointer aria-hidden />
            {_("unselect")}
          </Ui.Menu.Item>
        ) : (
          <Ui.Menu.Item onClick={() => ctx.select(tag)}>
            <SquareMousePointer aria-hidden />
            {_("select")}
          </Ui.Menu.Item>
        ))}
      <Ui.Menu.Item onClick={() => ctx.editTag(tag)}>
        <FilePenLine aria-hidden />
        {_("edit")}
      </Ui.Menu.Item>
      <Ui.Menu.Item onClick={() => ctx.confirmDeleteTag(tag)}>
        <Trash2 aria-hidden />
        {_("delete")}
      </Ui.Menu.Item>
      {isContextMenu && (
        <>
          <Ui.Menu.Separator />
          <Ui.Menu.Item onClick={() => ctx.createTag()}>
            <FilePlusIcon aria-hidden />
            {_("create")}
          </Ui.Menu.Item>
          {isSelected && (
            <>
              <Ui.Menu.Separator />
              <Ui.Menu.Item onClick={() => ctx.confirmDeleteSelectionTag()}>
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
    select: "Select tag",
    unselect: "Deselect tag",
    edit: "Edit tag",
    delete: "Delete tag",
    create: "New tag",
    "delete-selection": "Delete selected tags",
  },
  fr: {
    select: "Sélectionner le tag",
    unselect: "Désélectionner le tag",
    edit: "Modifier le tag",
    delete: "Supprimer le tag",
    create: "Nouveau tag",
    "delete-selection": "Supprimer les tags sélectionnés",
  },
  de: {
    select: "Kategorie auswählen",
    unselect: "Tag abwählen",
    edit: "Tag bearbeiten",
    delete: "Tag löschen",
    create: "Neuer Tag",
    "delete-selection": "Ausgewählte Tags löschen",
  },
}
