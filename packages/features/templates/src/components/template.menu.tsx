import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { CopyPlus, Ellipsis, Trash2 } from "lucide-react"
import React from "react"
import { useTemplate } from "../template.context"

/**
 * MenuButton
 */
export const MenuButton: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  return (
    <>
      <Ui.DropdownMenu.Quick menu={<PageMenu />}>
        <Ui.Tooltip.Quick tooltip={_("open-menu")} side='left' asChild>
          <Ui.Button variant='ghost' icon size='xs'>
            <Ellipsis aria-hidden />
            <Ui.SrOnly>{_("open-menu")}</Ui.SrOnly>
          </Ui.Button>
        </Ui.Tooltip.Quick>
      </Ui.DropdownMenu.Quick>
    </>
  )
}

const PageMenu: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { duplicateTemplate, confirmDelete } = useTemplate()
  return (
    <>
      <Ui.DropdownMenu.Item onClick={() => duplicateTemplate()}>
        <CopyPlus aria-hidden />
        {_("menu.duplicate")}
      </Ui.DropdownMenu.Item>
      <Ui.DropdownMenu.Separator />
      <Ui.DropdownMenu.Item onClick={() => confirmDelete()}>
        <Trash2 aria-hidden />
        {_("menu.delete")}
      </Ui.DropdownMenu.Item>
    </>
  )
}

/**
 * translations
 */
const dictionary = {
  fr: {
    "open-menu": "Ouvrir le menu du modèle",
    menu: {
      duplicate: "Dupliquer ce modèle",
      delete: "Supprimer ce modèle",
    },
  },
  en: {
    "open-menu": "Open template menu",
    menu: {
      duplicate: "Duplicate this template",
      delete: "Delete this template",
    },
  },
  de: {
    "open-menu": "Vorlagen-Menü öffnen",
    menu: {
      duplicate: "Diese Vorlage duplizieren",
      delete: "Diese Vorlage löschen",
    },
  },
}
