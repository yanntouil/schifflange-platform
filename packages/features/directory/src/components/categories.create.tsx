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
import { Api, placeholder as servicePlaceholder } from "@services/dashboard"
import React from "react"
import { useTypeOptions } from "../hooks/use-type-options"
import { useDirectoryService } from "../service.context"

/**
 * CategoriesCreateDialog
 */
export const CategoriesCreateDialog: React.FC<Ui.QuickDialogProps<void, Api.OrganisationCategory>> = (props) => {
  const { _ } = useTranslation(dictionary)
  return (
    <Ui.QuickDialog
      title={_("title")}
      description={_("description")}
      {...props}
      classNames={{ content: "sm:max-w-3xl", header: "z-10", close: "z-10" }}
      sticky
    >
      <DialogForm {...props} />
    </Ui.QuickDialog>
  )
}

/**
 * DialogForm
 */
const DialogForm: React.FC<Ui.QuickDialogSafeProps<void, Api.OrganisationCategory>> = ({ close, mutate }) => {
  const { _ } = useTranslation(dictionary)
  const { service } = useDirectoryService()
  const { current } = useContextualLanguage()
  const typeOptions = useTypeOptions()
  const initialValues = {
    type: "municipality" as const,
    order: 0,
    image: makeFormFileValue(null),
    translations: useFormTranslatable<
      Api.OrganisationCategoryTranslation,
      Partial<Api.OrganisationCategoryTranslation>
    >([], servicePlaceholder.organisationCategory),
  }
  const form = useForm({
    allowSubmitAttempt: true,
    values: initialValues,
    onSubmit: async ({ values }) => {
      const payload = {
        ...values,
        image: extractFormFilePayload(values.image),
      }
      return match(await service.organisations.categories.create(payload))
        .with({ failed: true }, async ({ except }) =>
          match(except?.name)
            .with("E_VALIDATION_FAILURE", () => Ui.toast.error(_("validation")))
            .otherwise(() => Ui.toast.error(_("failed")))
        )
        .otherwise(async ({ data: { category } }) => {
          Ui.toast.success(_("created"))
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
          <Form.Input
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
    title: "Create category",
    description: "Add a new organisation category.",
    submit: "Create category",
    created: "Category created successfully",
    failed: "Failed to create category",
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
    title: "Créer une catégorie",
    description: "Ajouter une nouvelle catégorie d'organisation.",
    submit: "Créer la catégorie",
    created: "Catégorie créée avec succès",
    failed: "Échec de la création de la catégorie",
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
    title: "Kategorie erstellen",
    description: "Eine neue Organisationskategorie hinzufügen.",
    submit: "Kategorie erstellen",
    created: "Kategorie erfolgreich erstellt",
    failed: "Kategorie konnte nicht erstellt werden",
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
