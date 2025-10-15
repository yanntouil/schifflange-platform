import { Form, useForm } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { useLanguages } from "@compo/translations"
import { Ui } from "@compo/ui"
import { match } from "@compo/utils"
import { type Api } from "@services/dashboard"
import React from "react"
import { useMenu } from "../../menu.context"
import { useMenusService } from "../../service.context"
import { ItemForm } from "./item-form"
import { getItemPayload, makeItemValues } from "./utils"

/**
 * CreateDialog
 */
export type CreateDialogProps = { order: number; parentId?: string }
export type CreateDialogMutate = { item: Api.MenuItemWithRelations; sortedIds: string[] }
export const CreateDialog: React.FC<Ui.QuickDialogProps<CreateDialogProps>> = ({ item, ...props }) => {
  const { _ } = useTranslation(dictionary)
  return (
    <Ui.QuickDialog
      title={_("title")}
      description={_("description")}
      {...props}
      classNames={{ content: "sm:max-w-2xl", header: "z-10", close: "z-10" }}
      sticky
    >
      {item !== false && <DialogForm item={item} {...props} />}
    </Ui.QuickDialog>
  )
}

/**
 * DialogForm
 */
const DialogForm: React.FC<Ui.QuickDialogSafeProps<CreateDialogProps>> = ({ close, item: { order, parentId } }) => {
  const { _ } = useTranslation(dictionary)
  const { service } = useMenusService()
  const { swr } = useMenu()
  const { languages } = useLanguages()

  const form = useForm({
    values: makeItemValues({}, languages),
    onSubmit: async ({ values }) => {
      const payload = getItemPayload(values)
      match(await service.id(swr.menu.id).items.create({ ...payload, order, parentId }))
        .with({ ok: true }, ({ data }) => {
          Ui.toast.success(_(`created`))
          swr.appendItem(data.item, data.sortedIds)
          close()
        })
        .otherwise(() => Ui.toast.error(_(`error`)))
    },
  })
  return (
    <Form.Root form={form} className='space-y-6'>
      <Form.Assertive />
      <ItemForm />
      <Ui.QuickDialogStickyFooter>
        <Form.Submit>{_("submit")}</Form.Submit>
      </Ui.QuickDialogStickyFooter>
    </Form.Root>
  )
}

/**
 * Dictionary
 */
const dictionary = {
  fr: {
    title: "Création d'un nouvel élément de menu",
    description: "Modifier les informations de l'élément de menu",
    submit: "Créer",
    created: "L'élément de menu a été créé",
    error: "Erreur lors de la création de l'élément de menu",
  },
  de: {
    title: "Neues Menüelement erstellen",
    description: "Informationen des Menüelements bearbeiten",
    submit: "Erstellen",
    created: "Das Menüelement wurde erstellt",
    error: "Fehler beim Erstellen des Menüelements",
  },
  en: {
    title: "Create a new menu item",
    description: "Update menu item information",
    submit: "Create",
    created: "The menu item has been created",
    error: "Error creating the menu item",
  },
}
