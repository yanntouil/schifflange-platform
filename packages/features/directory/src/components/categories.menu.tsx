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
import { useCategories } from "../categories.context"

/**
 * CategoriesMenu
 */
export const CategoriesMenu: React.FC<{ category: Api.OrganisationCategory }> = ({ category }) => {
  const { _ } = useTranslation(dictionary)
  const ctx = useCategories()
  const isContextMenu = Ui.useIsContextMenu()
  const isSelected = ctx.isSelected(category)
  return (
    <>
      {isContextMenu &&
        (isSelected ? (
          <Ui.Menu.Item onClick={() => ctx.unselect(category)}>
            <SquareDashedMousePointer aria-hidden />
            {_("unselect")}
          </Ui.Menu.Item>
        ) : (
          <Ui.Menu.Item onClick={() => ctx.select(category)}>
            <SquareMousePointer aria-hidden />
            {_("select")}
          </Ui.Menu.Item>
        ))}
      <Ui.Menu.Item onClick={() => ctx.editCategory(category)}>
        <FilePenLine aria-hidden />
        {_("edit")}
      </Ui.Menu.Item>
      <Ui.Menu.Item onClick={() => ctx.confirmDeleteCategory(category)}>
        <Trash2 aria-hidden />
        {_("delete")}
      </Ui.Menu.Item>
      {isContextMenu && (
        <>
          <Ui.Menu.Separator />
          <Ui.Menu.Item onClick={() => ctx.createCategory()}>
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
    select: "Select category",
    unselect: "Deselect category",
    edit: "Edit category",
    delete: "Delete category",
    create: "New category",
    "delete-selection": "Delete selected categories",
  },
  fr: {
    select: "Sélectionner la catégorie",
    unselect: "Désélectionner la catégorie",
    edit: "Modifier la catégorie",
    delete: "Supprimer la catégorie",
    create: "Nouvelle catégorie",
    "delete-selection": "Supprimer les catégories sélectionnées",
  },
  de: {
    select: "Kategorie auswählen",
    unselect: "Kategorie abwählen",
    edit: "Kategorie bearbeiten",
    delete: "Kategorie löschen",
    create: "Neue Kategorie",
    "delete-selection": "Ausgewählte Kategorien löschen",
  },
}
