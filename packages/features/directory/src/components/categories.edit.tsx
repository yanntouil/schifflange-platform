import { extractFormFilePayload, Form, makeFormFileValue, useForm } from "@compo/form"
import { useTranslation } from "@compo/localize"
import {
  FormTranslatableContent,
  FormTranslatableTabs,
  useContextualLanguage,
  useFormTranslatable,
} from "@compo/translations"
import { Ui } from "@compo/ui"
import { match } from "@compo/utils"
import { placeholder as servicePlaceholder, type Api } from "@services/dashboard"
import React from "react"
import { useTypeOptions } from "../hooks/use-type-options"
import { useDirectoryService } from "../service.context"

/**
 * CategoriesEditDialog
 */
export const CategoriesEditDialog: React.FC<Ui.QuickDialogProps<Api.OrganisationCategory>> = ({ item, ...props }) => {
  const { _ } = useTranslation(dictionary)
  return (
    <Ui.QuickDialog
      title={_("title")}
      description={_("description")}
      {...props}
      classNames={{ content: "sm:max-w-3xl", header: "z-10", close: "z-10" }}
      sticky
    >
      {item !== false && <DialogForm {...props} item={item} />}
    </Ui.QuickDialog>
  )
}

/**
 * DialogForm
 */
const DialogForm: React.FC<Ui.QuickDialogSafeProps<Api.OrganisationCategory>> = ({ close, mutate, item }) => {
  const { _ } = useTranslation(dictionary)
  const { service, getImageUrl } = useDirectoryService()
  const { current } = useContextualLanguage()
  const typeOptions = useTypeOptions()
  const initialValues = {
    type: item.type,
    order: item.order,
    image: makeFormFileValue(getImageUrl(item.image, "preview")),
    translations: useFormTranslatable(item.translations, servicePlaceholder.organisationCategory),
  }
  const form = useForm({
    allowSubmitAttempt: true,
    values: initialValues,
    onSubmit: async ({ values }) => {
      const payload = {
        ...values,
        image: extractFormFilePayload(values.image),
      }
      return match(await service.organisations.categories.id(item.id).update(payload))
        .with({ failed: true }, async ({ except }) =>
          match(except?.name)
            .with("E_VALIDATION_FAILURE", () => Ui.toast.error(_("validation")))
            .otherwise(() => Ui.toast.error(_("failed")))
        )
        .otherwise(async ({ data: { category } }) => {
          Ui.toast.success(_("updated"))
          await mutate?.(category)
          close()
        })
    },
  })

  return (
    <Form.Root form={form} className='space-y-4'>
      <Form.Assertive />
      <FormTranslatableTabs>
        <div className='space-y-6 pt-6'>
          {/* Translatable content */}
          <Form.Fields name='translations'>
            <FormTranslatableContent>
              {({ code }) => (
                <div className='space-y-6'>
                  <Form.Input
                    name='title'
                    label={_("title-label")}
                    placeholder={_("title-placeholder")}
                    lang={code}
                    labelAside={<Form.Localized title={_("title-label")} content={_("title-info")} />}
                  />
                  <Form.Textarea
                    name='description'
                    label={_("description-label")}
                    placeholder={_("description-placeholder")}
                    lang={code}
                    rows={4}
                    labelAside={<Form.Localized title={_("description-label")} content={_("description-info")} />}
                  />
                </div>
              )}
            </FormTranslatableContent>
          </Form.Fields>

          {/* Metadata */}
          <Form.Header title={_("metadata-title")} description={_("metadata-description")} />
          <Form.Select
            label={_("type-label")}
            name='type'
            options={typeOptions}
            labelAside={<Form.Info title={_("type-label")} content={_("type-info")} />}
          />
          <Form.Number
            name='order'
            label={_("order-label")}
            type='number'
            placeholder={_("order-placeholder")}
            labelAside={<Form.Info title={_("order-label")} content={_("order-info")} />}
          />
          <Form.Image
            name='image'
            label={_("image-label")}
            aspect='aspect-video'
            classNames={{ input: "max-w-lg" }}
            labelAside={<Form.Info title={_("image-label")} content={_("image-info")} />}
          />
        </div>
      </FormTranslatableTabs>
      <Ui.QuickDialogStickyFooter>
        <Form.Submit className='w-full'>{_("submit")}</Form.Submit>
      </Ui.QuickDialogStickyFooter>
    </Form.Root>
  )
}

/**
 * dictionaries
 */
const dictionary = {
  en: {
    title: "Edit category",
    description: "Update the selected category.",
    submit: "Save changes",
    updated: "Category updated successfully",
    failed: "Failed to update category",
    validation: "Some of your input is invalid. Please check your entries and try again.",
    "title-label": "Title",
    "title-placeholder": "Enter the category title",
    "title-info": "The name of the category",
    "description-label": "Description",
    "description-placeholder": "Enter a description",
    "description-info": "A detailed description of the category",
    "metadata-title": "Settings",
    "metadata-description": "Category settings and configuration",
    "type-label": "Organisation type",
    "type-info": "The type of organisation this category applies to",
    "order-label": "Display order",
    "order-placeholder": "0",
    "order-info": "Order in which the category appears (lower numbers appear first)",
    "image-label": "Category image",
    "image-info": "Image representing this category (16:9 format, recommended size: 1280x720px)",
  },
  fr: {
    title: "Modifier la catégorie",
    description: "Mettre à jour la catégorie sélectionnée.",
    submit: "Enregistrer les modifications",
    updated: "Catégorie mise à jour avec succès",
    failed: "Échec de la mise à jour de la catégorie",
    validation: "Certaines de vos entrées sont invalides. Veuillez vérifier vos entrées et réessayer.",
    "title-label": "Titre",
    "title-placeholder": "Saisissez le titre de la catégorie",
    "title-info": "Le nom de la catégorie",
    "description-label": "Description",
    "description-placeholder": "Saisissez une description",
    "description-info": "Une description détaillée de la catégorie",
    "metadata-title": "Paramètres",
    "metadata-description": "Paramètres et configuration de la catégorie",
    "type-label": "Type d'organisation",
    "type-info": "Le type d'organisation auquel cette catégorie s'applique",
    "order-label": "Ordre d'affichage",
    "order-placeholder": "0",
    "order-info": "Ordre dans lequel la catégorie apparaît (les numéros inférieurs apparaissent en premier)",
    "image-label": "Image de la catégorie",
    "image-info": "Image représentant cette catégorie (format 16:9, taille recommandée : 1280x720px)",
  },
  de: {
    title: "Kategorie bearbeiten",
    description: "Die ausgewählte Kategorie aktualisieren.",
    submit: "Änderungen speichern",
    updated: "Kategorie erfolgreich aktualisiert",
    failed: "Kategorie konnte nicht aktualisiert werden",
    validation: "Einige Ihrer Eingaben sind ungültig. Bitte überprüfen Sie Ihre Eingaben und versuchen Sie es erneut.",
    "title-label": "Titel",
    "title-placeholder": "Geben Sie den Kategorietitel ein",
    "title-info": "Der Name der Kategorie",
    "description-label": "Beschreibung",
    "description-placeholder": "Geben Sie eine Beschreibung ein",
    "description-info": "Eine detaillierte Beschreibung der Kategorie",
    "metadata-title": "Einstellungen",
    "metadata-description": "Kategorieeinstellungen und -konfiguration",
    "type-label": "Organisationstyp",
    "type-info": "Der Organisationstyp, auf den diese Kategorie zutrifft",
    "order-label": "Anzeigereihenfolge",
    "order-placeholder": "0",
    "order-info": "Reihenfolge, in der die Kategorie erscheint (niedrigere Zahlen erscheinen zuerst)",
    "image-label": "Kategoriebild",
    "image-info": "Bild für diese Kategorie (Format 16:9, empfohlene Größe: 1280x720px)",
  },
}
