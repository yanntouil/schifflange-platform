import { Form, FormLocalized, useForm } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { FormMedia } from "@compo/medias"
import { FormTranslatableTabs, useContextualLanguage, useFormTranslatable } from "@compo/translations"
import { Ui } from "@compo/ui"
import { D, match } from "@compo/utils"
import { type Api, placeholder as servicePlaceholder } from "@services/dashboard"
import React from "react"
import { useProjectsService } from "../service.context"

/**
 * CategoriesEditDialog
 */
export const CategoriesEditDialog: React.FC<Ui.QuickDialogProps<Api.ProjectCategory>> = ({ item, ...props }) => {
  const { _ } = useTranslation(dictionary)
  return (
    <Ui.QuickDialog
      title={_("title")}
      description={_("description")}
      {...props}
      classNames={{ content: "sm:max-w-lg", header: "z-10", close: "z-10" }}
      sticky
    >
      {item && <DialogForm {...props} item={item} />}
    </Ui.QuickDialog>
  )
}

const DialogForm: React.FC<Ui.QuickDialogSafeProps<Api.ProjectCategory>> = ({ item, close, mutate }) => {
  const { _ } = useTranslation(dictionary)
  const { current } = useContextualLanguage()
  const { service } = useProjectsService()
  const form = useForm({
    values: {
      translations: useFormTranslatable(item.translations, servicePlaceholder.projectCategory),
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
      <Form.Fields name='translations'>
        <FormTranslatableTabs className='space-y-4' defaultLanguage={current.id}>
          {({ code }) => (
            <>
              <FormMedia.Image
                label={_("image-label")}
                name='image'
                ratio='aspect-[4/3]'
                contextKey={`category`}
                labelAside={<FormLocalized title={_("image-label")} content={_("image-info")} />}
              />
              <Form.Input
                label={_("title-label")}
                name='title'
                placeholder={_("title-placeholder")}
                lang={code}
                maxLength={255}
                labelAside={<FormLocalized title={_("title-label")} content={_("title-info")} />}
              />
              <Form.Textarea
                label={_("description-label")}
                name='description'
                placeholder={_("description-placeholder")}
                lang={code}
                maxLength={500}
                labelAside={<FormLocalized title={_("description-label")} content={_("description-info")} />}
              />
            </>
          )}
        </FormTranslatableTabs>
      </Form.Fields>

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
    "image-label": "Image",
    "image-info": "L'image est utilisée pour représenter visuellement la catégorie dans l'interface.",
    "title-label": "Titre",
    "title-placeholder": "Nom de la catégorie",
    "title-info": "Le titre de la catégorie qui sera affiché dans l'interface et utilisé pour organiser les projets.",
    "description-label": "Description",
    "description-placeholder": "Entrez une courte description de la catégorie",
    "description-info": "La description aide à comprendre le type de projets que cette catégorie contient.",
    submit: "Mettre à jour",
    updated: "La catégorie a été modifiée avec succès.",
    "validation-error": "Une erreur est survenue lors de la validation des données.",
  },
  en: {
    title: "Edit category",
    description: "Edit the information for this category. It is necessary to fill in all fields for each language.",
    "image-label": "Image",
    "image-info": "The image is used to visually represent the category in the interface.",
    "title-label": "Title",
    "title-placeholder": "Category name",
    "title-info": "The category title that will be displayed in the interface and used to organize projects.",
    "description-label": "Description",
    "description-placeholder": "Enter a short description of the category",
    "description-info": "The description helps understand the type of projects this category contains.",
    submit: "Update",
    updated: "The category has been edited successfully.",
    "validation-error": "An error occurred during the validation of the data.",
  },
  de: {
    title: "Kategorie bearbeiten",
    description:
      "Bearbeiten Sie die Informationen für diese Kategorie. Alle Felder müssen für jede Sprache ausgefüllt werden.",
    "image-label": "Bild",
    "image-info": "Das Bild wird verwendet, um die Kategorie visuell in der Benutzeroberfläche darzustellen.",
    "title-label": "Titel",
    "title-placeholder": "Name der Kategorie",
    "title-info":
      "Der Kategorietitel, der in der Benutzeroberfläche angezeigt und zur Organisation von Projekten verwendet wird.",
    "description-label": "Beschreibung",
    "description-placeholder": "Geben Sie eine kurze Beschreibung der Kategorie ein",
    "description-info": "Die Beschreibung hilft zu verstehen, welche Art von Projekten diese Kategorie enthält.",
    submit: "Aktualisieren",
    updated: "Die Kategorie wurde erfolgreich bearbeitet.",
    "validation-error": "Bei der Validierung der Daten ist ein Fehler aufgetreten.",
  },
}
