import { Form, useForm } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { useFormTranslatable } from "@compo/translations"
import { Ui } from "@compo/ui"
import { D, match } from "@compo/utils"
import { type Api, placeholder as servicePlaceholder } from "@services/dashboard"
import React from "react"
import { useArticlesService } from "../service.context"
import { CategoryForm } from "./categories.form"

/**
 * CategoriesEditDialog
 */
export const CategoriesEditDialog: React.FC<Ui.QuickDialogProps<Api.ArticleCategory>> = ({ item, ...props }) => {
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

const DialogForm: React.FC<Ui.QuickDialogSafeProps<Api.ArticleCategory>> = ({ item, close, mutate }) => {
  const { _ } = useTranslation(dictionary)
  const { service } = useArticlesService()
  const form = useForm({
    values: {
      translations: useFormTranslatable(item.translations, servicePlaceholder.articleCategory),
    },
    onSubmit: async ({ values }) => {
      const payload = {
        translations: D.map(values.translations, ({ image, ...translation }) => ({
          ...translation,
          imageId: image?.id || null,
        })),
      }
      match(await service.categories.id(item.id).update(payload))
        .with({ ok: true }, ({ data }) => {
          Ui.toast.success(_("updated"))
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
      <CategoryForm />
      <Ui.QuickDialogStickyFooter>
        <Form.Submit className='w-full'>{_("submit")}</Form.Submit>
      </Ui.QuickDialogStickyFooter>
    </Form.Root>
  )
}

const dictionary = {
  fr: {
    title: "Modifier la catégorie",
    description:
      "Modifiez les informations de cette catégorie. Il est nécessaire de remplir tous les champs pour chacune des langues.",
    submit: "Mettre à jour",
    updated: "La catégorie a été modifiée avec succès.",
    "validation-error": "Une erreur est survenue lors de la validation des données.",
  },
  en: {
    title: "Edit category",
    description: "Edit the information for this category. It is necessary to fill in all fields for each language.",
    submit: "Update",
    updated: "The category has been edited successfully.",
    "validation-error": "An error occurred during the validation of the data.",
  },
  de: {
    title: "Kategorie bearbeiten",
    description:
      "Bearbeiten Sie die Informationen für diese Kategorie. Es ist notwendig, alle Felder für jede Sprache auszufüllen.",
    submit: "Aktualisieren",
    updated: "Die Kategorie wurde erfolgreich bearbeitet.",
    "validation-error": "Ein Fehler ist bei der Validierung der Daten aufgetreten.",
  },
}
