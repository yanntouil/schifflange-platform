import { Form, useForm } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { useFormTranslatable } from "@compo/translations"
import { Ui } from "@compo/ui"
import { D, match } from "@compo/utils"
import { type Api, placeholder as servicePlaceholder } from "@services/dashboard"
import React from "react"
import { useEventsService } from "../service.context"
import { CategoriesForm } from "./categories.form"

/**
 * CategoriesCreateDialog
 */
export const CategoriesCreateDialog: React.FC<Ui.QuickDialogProps<void, Api.EventCategory>> = ({ item, ...props }) => {
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

const DialogForm: React.FC<Ui.QuickDialogSafeProps<void, Api.EventCategory>> = ({ close, mutate }) => {
  const { _ } = useTranslation(dictionary)
  const { service } = useEventsService()
  const initialValues = {
    translations: useFormTranslatable([] as Api.EventCategoryTranslation[], servicePlaceholder.eventCategory),
  }
  const form = useForm({
    values: initialValues,
    onSubmit: async ({ values }) => {
      const payload = {
        translations: D.map(values.translations, ({ image, ...translation }) => ({
          ...translation,
          imageId: image?.id || null,
        })),
      }
      match(await service.categories.create(payload))
        .with({ ok: true }, ({ data }) => {
          Ui.toast.success(_("created"))
          mutate?.(data.category)
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
      <CategoriesForm />
      <Ui.QuickDialogStickyFooter>
        <Form.Submit className='w-full'>{_("submit")}</Form.Submit>
      </Ui.QuickDialogStickyFooter>
    </Form.Root>
  )
}

const dictionary = {
  fr: {
    title: "Créer une catégorie",
    description:
      "Créez une nouvelle catégorie pour organiser vos événements. Il est nécessaire de remplir tous les champs pour chacune des langues.",
    submit: "Créer la catégorie",
    created: "La catégorie a été créée avec succès.",
    "validation-error": "Une erreur est survenue lors de la validation des données.",
  },
  en: {
    title: "Create category",
    description:
      "Create a new category to organize your events. It is necessary to fill in all fields for each language.",
    submit: "Create category",
    created: "The category has been created successfully.",
    "validation-error": "An error occurred during the validation of the data.",
  },
  de: {
    title: "Kategorie erstellen",
    description:
      "Erstellen Sie eine neue Kategorie, um Ihre Veranstaltungen zu organisieren. Es ist notwendig, alle Felder für jede Sprache auszufüllen.",
    submit: "Kategorie erstellen",
    created: "Die Kategorie wurde erfolgreich erstellt.",
    "validation-error": "Ein Fehler ist bei der Validierung der Daten aufgetreten.",
  },
}
