import { Form, useForm } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { match } from "@compo/utils"
import { type Api } from "@services/dashboard"
import React from "react"
import { useMenusService } from "../service.context"

export const MenusEditDialog: React.FC<Ui.QuickDialogProps<Api.Menu & Api.WithMenuItems>> = ({ item, ...props }) => {
  const { _ } = useTranslation(dictionary)
  return (
    <Ui.QuickDialog
      title={_("title")}
      description={_("description")}
      {...props}
      classNames={{ content: "sm:max-w-lg", header: "z-10", close: "z-10" }}
      sticky
    >
      {item && <DialogForm item={item} {...props} />}
    </Ui.QuickDialog>
  )
}

const DialogForm: React.FC<Ui.QuickDialogSafeProps<Api.Menu & Api.WithMenuItems>> = ({ item, close, mutate }) => {
  const { _ } = useTranslation(dictionary)
  const { service } = useMenusService()
  const initialValues = {
    name: item.name,
    location: item.location,
  }
  const form = useForm({
    values: initialValues,
    onSubmit: async ({ values }) => {
      const payload = {
        ...values,
      }
      match(await service.id(item.id).update(payload))
        .with({ ok: true }, ({ data }) => {
          Ui.toast.success(_("updated"))
          mutate?.(data.menu)
          close()
        })
        .otherwise(({ except }) => {
          Ui.toast.error(_("validation-error"))
        })
    },
  })

  return (
    <Form.Root form={form} className='space-y-4 pt-4'>
      <Form.Assertive />

      <Form.Input name='name' label={_("name-label")} placeholder={_("name-placeholder")} />

      <Form.Select
        name='location'
        label={_("location-label")}
        placeholder={_("location-placeholder")}
        options={[
          { value: "header", label: _("location-header") },
          { value: "footer", label: _("location-footer") },
        ]}
      />

      <Ui.QuickDialogStickyFooter>
        <Form.Submit className='w-full'>{_("submit")}</Form.Submit>
      </Ui.QuickDialogStickyFooter>
    </Form.Root>
  )
}

const dictionary = {
  fr: {
    title: "Modifier le menu",
    description: "Modifiez les paramètres du menu de navigation.",
    submit: "Mettre à jour",
    updated: "Le menu a été mis à jour avec succès.",
    "validation-error": "Une erreur est survenue lors de la validation des données.",
    "name-label": "Nom du menu",
    "name-placeholder": "Menu principal",
    "location-label": "Position",
    "location-placeholder": "Sélectionner une position",
    "location-header": "En-tête",
    "location-footer": "Pied de page",
  },
  de: {
    title: "Menü bearbeiten",
    description: "Bearbeiten Sie die Navigationsmenü-Einstellungen.",
    submit: "Aktualisieren",
    updated: "Das Menü wurde erfolgreich aktualisiert.",
    "validation-error": "Ein Fehler ist bei der Datenvalidierung aufgetreten.",
    "name-label": "Menüname",
    "name-placeholder": "Hauptmenü",
    "location-label": "Position",
    "location-placeholder": "Position auswählen",
    "location-header": "Kopfzeile",
    "location-footer": "Fußzeile",
  },
  en: {
    title: "Edit menu",
    description: "Edit the navigation menu settings.",
    submit: "Update",
    updated: "The menu has been updated successfully.",
    "validation-error": "An error occurred during data validation.",
    "name-label": "Menu name",
    "name-placeholder": "Main menu",
    "location-label": "Location",
    "location-placeholder": "Select a location",
    "location-header": "Header",
    "location-footer": "Footer",
  },
}
