import { Form, useForm } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { FormSlug } from "@compo/slugs"
import { Ui } from "@compo/ui"
import { match } from "@compo/utils"
import { type Api } from "@services/dashboard"
import React from "react"
import { useForwardsService } from "../service.context"

/**
 * ForwardsCreateDialog
 */
export const ForwardsCreateDialog: React.FC<Ui.QuickDialogProps<void, Api.Forward>> = ({ item, ...props }) => {
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

const DialogForm: React.FC<Ui.QuickDialogSafeProps<void, Api.Forward>> = ({ close, mutate }) => {
  const { _ } = useTranslation(dictionary)
  const { service } = useForwardsService()
  const initialValues = {
    path: "",
    slugId: "",
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
          mutate?.(data.forward)
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
    title: "Créer une redirection",
    description:
      "Créez une règle de redirection pour rediriger automatiquement les visiteurs d'une ancienne URL vers une nouvelle.",
    submit: "Créer la redirection",
    created: "La redirection a été créée avec succès.",
    "validation-error": "Une erreur est survenue lors de la validation des données.",
    "path-label": "Chemin source",
    "path-placeholder": "ancien-chemin",
    "path-info": "Le chemin que vous souhaitez rediriger (sans le slash de début)",
    "slug-label": "Destination",
    "slug-placeholder": "Sélectionner la page ou l'article de destination",
    "slug-info": "La page ou l'article vers lequel rediriger les visiteurs",
  },
  en: {
    title: "Create redirect",
    description: "Create a redirect rule to automatically redirect visitors from an old URL to a new one.",
    submit: "Create redirect",
    created: "The redirect has been created successfully.",
    "path-label": "Source path",
    "path-placeholder": "old-path",
    "path-info": "The path you want to redirect from (without the leading slash)",
    "slug-label": "Destination",
    "slug-placeholder": "Select the destination page or article",
    "slug-info": "The page or article to redirect visitors to",
  },
  de: {
    title: "Weiterleitung erstellen",
    description:
      "Erstellen Sie eine Weiterleitungsregel, um Besucher automatisch von einer alten URL zu einer neuen weiterzuleiten.",
    submit: "Weiterleitung erstellen",
    created: "Die Weiterleitung wurde erfolgreich erstellt.",
    "validation-error": "Bei der Validierung der Daten ist ein Fehler aufgetreten.",
    "path-label": "Quellpfad",
    "path-placeholder": "alter-pfad",
    "path-info": "Der Pfad, den Sie weiterleiten möchten (ohne den führenden Schrägstrich)",
    "slug-label": "Ziel",
    "slug-placeholder": "Wählen Sie die Zielseite oder den Zielartikel aus",
    "slug-info": "Die Seite oder der Artikel, zu dem die Besucher weitergeleitet werden sollen",
  },
}
