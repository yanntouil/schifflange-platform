import { Form, useForm } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { useLanguages } from "@compo/translations"
import { Ui } from "@compo/ui"
import { match } from "@compo/utils"
import { type Api } from "@services/dashboard"
import React from "react"
import { useMenu } from "../../menu.context"
import { useMenusService } from "../../service.context"
import { HeaderForm } from "./header-form"
import { getSubItemPayload, makeSubItemValues } from "./utils"

/**
 * EditDialog
 */
export const EditDialog: React.FC<Ui.QuickDialogProps<Api.MenuItemWithRelations>> = ({ item, ...props }) => {
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
const DialogForm: React.FC<Ui.QuickDialogSafeProps<Api.MenuItemWithRelations>> = ({ close, item }) => {
  const { _ } = useTranslation(dictionary)
  const { service } = useMenusService()
  const { swr } = useMenu()
  const { languages } = useLanguages()

  const form = useForm({
    values: makeSubItemValues(item, languages),
    onSubmit: async ({ values }) => {
      const payload = getSubItemPayload(values)
      return match(await service.id(swr.menu.id).items.id(item.id).update(payload))
        .with({ ok: true }, ({ data }) => {
          Ui.toast.success(_(`updated`))
          swr.updateItem(data.item)
          close()
        })
        .otherwise(() => Ui.toast.error(_(`error`)))
    },
  })

  return (
    <Form.Root form={form} className='space-y-6'>
      <Form.Assertive />
      <HeaderForm />
      <Ui.QuickDialogStickyFooter>
        <Form.Submit>{_("submit")}</Form.Submit>
      </Ui.QuickDialogStickyFooter>
    </Form.Root>
  )
}

/**
 * translations
 */
const dictionary = {
  fr: {
    title: "Modification d'un élément de menu",
    description: "Modifier les informations de l'élément de menu",
    submit: "Modifier",
    updated: "L'élément de menu a été modifié",
    error: "Erreur lors de la modification de l'élément de menu",
  },
  de: {
    title: "Menüelement bearbeiten",
    description: "Informationen des Menüelements aktualisieren",
    submit: "Aktualisieren",
    updated: "Das Menüelement wurde aktualisiert",
    error: "Fehler beim Aktualisieren des Menüelements",
  },
  en: {
    title: "Edit a menu item",
    description: "Update menu item information",
    submit: "Update",
    updated: "The menu item has been updated",
    error: "Error updating the menu item",
  },
}
