import { Form, useForm } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { FormMedia } from "@compo/medias"
import { useFormTranslatable } from "@compo/translations"
import { Ui } from "@compo/ui"
import { D, match } from "@compo/utils"
import { type Api, placeholder as servicePlaceholder } from "@services/dashboard"
import React from "react"
import { useCouncilsService } from "../service.context"
import { CouncilsForm } from "./councils.form"

/**
 * CouncilsCreateDialog
 */
export const CouncilsCreateDialog: React.FC<Ui.QuickDialogProps<void, Api.Council>> = ({ item, ...props }) => {
  const { _ } = useTranslation(dictionary)
  return (
    <Ui.QuickDialog
      title={_("title")}
      description={_("description")}
      {...props}
      classNames={{ content: "sm:max-w-3xl", header: "z-10", close: "z-10" }}
      sticky
    >
      {item !== false && <DialogForm {...props} />}
    </Ui.QuickDialog>
  )
}

const DialogForm: React.FC<Ui.QuickDialogSafeProps<void, Api.Council>> = ({ close, mutate }) => {
  const { _ } = useTranslation(dictionary)
  const { service } = useCouncilsService()
  const initialValues = {
    date: new Date(),
    video: FormMedia.makeVideoValue({ type: "embed" }),
    translations: useFormTranslatable([] as Api.CouncilTranslation[], servicePlaceholder.council),
  }
  const form = useForm({
    values: initialValues,
    onSubmit: async ({ values }) => {
      const payload = {
        date: values.date.toISOString(),
        video: FormMedia.prepareVideoPayload(values.video),
        translations: D.map(values.translations, ({ report, ...translation }) => ({
          ...translation,
          reportId: report?.id ?? null,
        })),
      }
      match(await service.create(payload))
        .with({ ok: true }, ({ data }) => {
          Ui.toast.success(_("created"))
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
    title: "Créer une réunion du conseil communal",
    description:
      "Créez une nouvelle réunion du conseil communal. Il est nécessaire de remplir tous les champs pour chacune des langues.",
    submit: "Créer la réunion",
    created: "La réunion du conseil communal a été créée avec succès.",
    "validation-error": "Une erreur est survenue lors de la validation des données.",
  },
  en: {
    title: "Create council meeting",
    description: "Create a new council meeting. It is necessary to fill in all fields for each language.",
    submit: "Create meeting",
    created: "The council meeting has been created successfully.",
    "validation-error": "An error occurred during the validation of the data.",
  },
  de: {
    title: "Gemeinderatssitzung erstellen",
    description:
      "Erstellen Sie eine neue Gemeinderatssitzung. Es ist notwendig, alle Felder für jede Sprache auszufüllen.",
    submit: "Sitzung erstellen",
    created: "Die Gemeinderatssitzung wurde erfolgreich erstellt.",
    "validation-error": "Ein Fehler ist bei der Validierung der Daten aufgetreten.",
  },
}
