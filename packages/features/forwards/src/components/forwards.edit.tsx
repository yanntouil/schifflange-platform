import { Form, useForm } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { FormSlug } from "@compo/slugs"
import { Ui } from "@compo/ui"
import { match } from "@compo/utils"
import { type Api } from "@services/dashboard"
import React from "react"
import { useForwardsService } from "../service.context"

/**
 * ForwardsEditDialog
 */
export const ForwardsEditDialog: React.FC<Ui.QuickDialogProps<Api.Forward, Api.Forward>> = ({ item, ...props }) => {
  const { _ } = useTranslation(dictionary)
  return (
    <Ui.QuickDialog
      title={_("title")}
      description={_("description")}
      {...props}
      classNames={{ content: "sm:max-w-lg", header: "z-10", close: "z-10" }}
      sticky
    >
      {item !== false && <DialogForm item={item} {...props} />}
    </Ui.QuickDialog>
  )
}

const DialogForm: React.FC<Ui.QuickDialogSafeProps<Api.Forward, Api.Forward>> = ({ item, close, mutate }) => {
  const { _ } = useTranslation(dictionary)
  const { service } = useForwardsService()
  const form = useForm({
    values: {
      path: item.path,
      slugId: item.slug.id,
    },
    onSubmit: async ({ values }) => {
      const payload = {
        ...values,
      }
      match(await service.id(item.id).update(payload))
        .with({ ok: true }, ({ data }) => {
          Ui.toast.success(_("updated"))
          mutate?.(data.forward)
          close()
        })
        .otherwise(({ except }) => {
          Ui.toast.error(_("validation-error"))
        })
    },
  })

  return (
    <Form.Root form={form} className='space-y-4'>
      <Form.Assertive />

      <Form.Input
        name='path'
        label={_("path-label")}
        placeholder={_("path-placeholder")}
        labelAside={<Form.Info title={_("path-label")} content={_("path-info")} />}
      />
      <FormSlug
        name='slugId'
        label={_("slug-label")}
        placeholder={_("slug-placeholder")}
        labelAside={<Form.Info title={_("slug-label")} content={_("slug-info")} />}
      />

      <Ui.QuickDialogStickyFooter>
        <Form.Submit className='w-full'>{_("submit")}</Form.Submit>
      </Ui.QuickDialogStickyFooter>
    </Form.Root>
  )
}

const dictionary = {
  fr: {
    title: "Modifier la redirection",
    description: "Modifiez les paramètres de cette règle de redirection.",
    submit: "Enregistrer les modifications",
    updated: "La redirection a été mise à jour avec succès.",
    "validation-error": "Une erreur est survenue lors de la validation des données.",
    "path-label": "Chemin source",
    "path-placeholder": "ancien-chemin",
    "path-info": "Le chemin que vous souhaitez rediriger (sans le slash de début)",
    "slug-label": "Destination",
    "slug-placeholder": "Sélectionner la page ou l'article de destination",
    "slug-info": "La page ou l'article vers lequel rediriger les visiteurs",
  },
  en: {
    title: "Edit redirect",
    description: "Edit the settings for this redirect rule.",
    submit: "Save changes",
    updated: "The redirect has been updated successfully.",
    "validation-error": "An error occurred during the validation of the data.",
    "path-label": "Source path",
    "path-placeholder": "old-path",
    "path-info": "The path you want to redirect from (without the leading slash)",
    "slug-label": "Destination",
    "slug-placeholder": "Select the destination page or article",
    "slug-info": "The page or article to redirect visitors to",
  },
  de: {
    title: "Weiterleitung bearbeiten",
    description: "Bearbeiten Sie die Einstellungen für diese Weiterleitungsregel.",
    submit: "Änderungen speichern",
    updated: "Die Weiterleitung wurde erfolgreich aktualisiert.",
    "validation-error": "Bei der Validierung der Daten ist ein Fehler aufgetreten.",
    "path-label": "Quellpfad",
    "path-placeholder": "alter-pfad",
    "path-info": "Der Pfad, den Sie weiterleiten möchten (ohne den führenden Schrägstrich)",
    "slug-label": "Ziel",
    "slug-placeholder": "Wählen Sie die Zielseite oder den Zielartikel aus",
    "slug-info": "Die Seite oder der Artikel, zu dem die Besucher weitergeleitet werden sollen",
  },
}
