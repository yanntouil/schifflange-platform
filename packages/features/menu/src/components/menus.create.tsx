import { Form, useForm } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { match } from "@compo/utils"
import { type Api } from "@services/dashboard"
import React from "react"
import { useMenusService } from "../service.context"

export const MenusCreateDialog: React.FC<Ui.QuickDialogProps<void, Api.Menu & Api.WithMenuItems>> = ({
  item,
  ...props
}) => {
  const { _ } = useTranslation(dictionary)
  return (
    <Ui.QuickDialog
      title={_("title")}
      description={_("description")}
      {...props}
      classNames={{ content: "sm:max-w-lg", header: "z-10", close: "z-10" }}
      sticky
    >
      {item !== false && <DialogForm {...props} />}
    </Ui.QuickDialog>
  )
}

const DialogForm: React.FC<Ui.QuickDialogSafeProps<void, Api.Menu & Api.WithMenuItems>> = ({ close, mutate }) => {
  const { _ } = useTranslation(dictionary)
  const { service } = useMenusService()
  const initialValues = {
    name: "",
    location: "header" as const,
  }
  const form = useForm({
    values: initialValues,
    onSubmit: async ({ values }) => {
      const payload = {
        ...values,
      }
      match(await service.create(payload))
        .with({ ok: true }, ({ data }) => {
          Ui.toast.success(_("created"))
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
    title: "Créer un menu",
    description: "Créez un nouveau menu de navigation pour votre site web.",
    submit: "Créer le menu",
    created: "Le menu a été créé avec succès.",
    "validation-error": "Une erreur est survenue lors de la validation des données.",
    "name-label": "Nom du menu",
    "name-placeholder": "Menu principal",
    "location-label": "Position",
    "location-placeholder": "Sélectionner une position",
    "location-header": "En-tête",
    "location-footer": "Pied de page",
  },
  de: {
    title: "Menü erstellen",
    description: "Erstellen Sie ein neues Navigationsmenü für Ihre Website.",
    submit: "Menü erstellen",
    created: "Das Menü wurde erfolgreich erstellt.",
    "validation-error": "Ein Fehler ist bei der Datenvalidierung aufgetreten.",
    "name-label": "Menüname",
    "name-placeholder": "Hauptmenü",
    "location-label": "Position",
    "location-placeholder": "Position auswählen",
    "location-header": "Kopfzeile",
    "location-footer": "Fußzeile",
  },
  en: {
    title: "Create menu",
    description: "Create a new navigation menu for your website.",
    submit: "Create menu",
    created: "The menu has been created successfully.",
    "validation-error": "An error occurred during data validation.",
    "name-label": "Menu name",
    "name-placeholder": "Main menu",
    "location-label": "Location",
    "location-placeholder": "Select a location",
    "location-header": "Header",
    "location-footer": "Footer",
  },
}
