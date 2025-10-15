import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { type Api } from "@services/dashboard"
import {
  CopyPlus,
  Ellipsis,
  FileInput,
  FilePenLine,
  FilePlusIcon,
  SquareDashedMousePointer,
  SquareMousePointer,
  Trash2,
  Trash2Icon,
} from "lucide-react"
import React from "react"
import { useTemplates } from "../templates.context"

/**
 * TemplatesMenu
 */
export const TemplatesMenu: React.FC<{ template: Api.TemplateWithRelations }> = ({ template }) => {
  const { _ } = useTranslation(dictionary)
  const ctx = useTemplates()
  const isContextMenu = Ui.useIsContextMenu()
  const isSelected = ctx.isSelected(template)
  return (
    <>
      {isContextMenu &&
        (isSelected ? (
          <Ui.Menu.Item onClick={() => ctx.unselect(template)}>
            <SquareDashedMousePointer aria-hidden />
            {_("unselect")}
          </Ui.Menu.Item>
        ) : (
          <Ui.Menu.Item onClick={() => ctx.select(template)}>
            <SquareMousePointer aria-hidden />
            {_("select")}
          </Ui.Menu.Item>
        ))}
      <Ui.Menu.Item onClick={() => ctx.displayTemplate(template)}>
        <FileInput aria-hidden />
        {_("view")}
      </Ui.Menu.Item>
      <Ui.Menu.Item onClick={() => ctx.editTemplate(template)}>
        <FilePenLine aria-hidden />
        {_("edit")}
      </Ui.Menu.Item>
      <Ui.Menu.Item onClick={() => ctx.duplicateTemplate(template)}>
        <CopyPlus aria-hidden />
        {_("duplicate")}
      </Ui.Menu.Item>

      <Ui.Menu.Sub>
        <Ui.Menu.SubTrigger>
          <Ellipsis aria-hidden />
          {_("more")}
        </Ui.Menu.SubTrigger>
        <Ui.Menu.SubContent>
          <Ui.Menu.Item onClick={() => ctx.confirmDeleteTemplate(template)}>
            <Trash2 aria-hidden />
            {_("delete")}
          </Ui.Menu.Item>
        </Ui.Menu.SubContent>
      </Ui.Menu.Sub>
      {isContextMenu && (
        <>
          <Ui.Menu.Separator />
          <Ui.Menu.Item onClick={() => ctx.createTemplate()}>
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
    select: "Select template",
    unselect: "Deselect template",
    view: "Go to template",
    edit: "Edit template settings",
    duplicate: "Duplicate template",
    delete: "Delete template",
    create: "New template",
    "delete-selection": "Delete selected templates",
    more: "More actions",
  },
  fr: {
    select: "Sélectionner le modèle",
    unselect: "Désélectionner le modèle",
    view: "Aller au modèle",
    edit: "Modifier les paramètres",
    duplicate: "Dupliquer le modèle",
    delete: "Supprimer le modèle",
    create: "Nouveau modèle",
    "delete-selection": "Supprimer les modèles sélectionnés",
    more: "Plus d'actions",
  },
  de: {
    select: "Vorlage auswählen",
    unselect: "Auswahl aufheben",
    view: "Zur Vorlage gehen",
    edit: "Vorlage bearbeiten",
    duplicate: "Vorlage duplizieren",
    delete: "Vorlage löschen",
    create: "Neue Vorlage",
    "delete-selection": "Ausgewählte Vorlagen löschen",
    more: "Weitere Aktionen",
  },
}
