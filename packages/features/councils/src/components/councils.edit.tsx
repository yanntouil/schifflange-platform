import { Form, useForm } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { useFormTranslatable } from "@compo/translations"
import { Ui } from "@compo/ui"
import { D, match } from "@compo/utils"
import { type Api, placeholder as servicePlaceholder } from "@services/dashboard"
import React from "react"
import { useCouncilsService } from "../service.context"
import { CouncilsForm } from "./councils.form"

/**
 * CouncilsEditDialog
 */
export const CouncilsEditDialog: React.FC<Ui.QuickDialogProps<Api.Council>> = ({ item, ...props }) => {
  const { _ } = useTranslation(dictionary)
  return (
    <Ui.QuickDialog
      title={_("title")}
      description={_("description")}
      {...props}
      classNames={{ content: "sm:max-w-3xl", header: "z-10", close: "z-10" }}
      sticky
    >
      {item && <DialogForm {...props} item={item} />}
    </Ui.QuickDialog>
  )
}

const DialogForm: React.FC<Ui.QuickDialogSafeProps<Api.Council>> = ({ item, close, mutate }) => {
  const { _ } = useTranslation(dictionary)
  const { service } = useCouncilsService()
  const form = useForm({
    values: {
      date: new Date(item.date),
      video: item.video,
      translations: useFormTranslatable(item.translations, servicePlaceholder.council),
    },
    onSubmit: async ({ values }) => {
      const payload = {
        date: values.date.toISOString(),
        video: values.video,
        translations: D.map(values.translations, ({ report, ...translation }) => ({
          ...translation,
          reportId: report?.id ?? null,
        })),
      }
      match(await service.id(item.id).update(payload))
        .with({ ok: true }, ({ data }) => {
          Ui.toast.success(_("updated"))
          mutate?.(data.council)
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
      <CouncilsForm />

      <Ui.QuickDialogStickyFooter>
        <Form.Submit className='w-full'>{_("submit")}</Form.Submit>
      </Ui.QuickDialogStickyFooter>
    </Form.Root>
  )
}

const dictionary = {
  fr: {
    title: "Modifier la réunion du conseil communal",
    description:
      "Modifiez les informations de cette réunion du conseil communal. Il est nécessaire de remplir tous les champs pour chacune des langues.",
    submit: "Mettre à jour",
    updated: "La réunion du conseil communal a été modifiée avec succès.",
    "validation-error": "Une erreur est survenue lors de la validation des données.",
  },
  en: {
    title: "Edit council meeting",
    description:
      "Edit the information for this council meeting. It is necessary to fill in all fields for each language.",
    submit: "Update",
    updated: "The council meeting has been edited successfully.",
    "validation-error": "An error occurred during the validation of the data.",
  },
  de: {
    title: "Gemeinderatssitzung bearbeiten",
    description:
      "Bearbeiten Sie die Informationen für diese Gemeinderatssitzung. Es ist notwendig, alle Felder für jede Sprache auszufüllen.",
    submit: "Aktualisieren",
    updated: "Die Gemeinderatssitzung wurde erfolgreich bearbeitet.",
    "validation-error": "Ein Fehler ist bei der Validierung der Daten aufgetreten.",
  },
}
