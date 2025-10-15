import { Form, FormInfo, useForm } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { FormTranslatableTabs, useContextualLanguage, useFormTranslatable } from "@compo/translations"
import { Ui } from "@compo/ui"
import { match } from "@compo/utils"
import { type Api } from "@services/dashboard"
import React from "react"
import { useTemplatesService, useTypeOptions } from "../.."

/**
 * EditTemplateDialog
 */
export const EditTemplateDialog: React.FC<Ui.QuickDialogProps<Api.TemplateWithRelations>> = ({ item, ...props }) => {
  const { _ } = useTranslation(dictionary)
  return (
    <Ui.QuickDialog
      title={_("title")}
      description={_("description")}
      {...props}
      classNames={{ content: "sm:max-w-lg" }}
      sticky
    >
      {item !== false && <DialogForm {...props} item={item} />}
    </Ui.QuickDialog>
  )
}

/**
 * DialogForm
 */
const DialogForm: React.FC<Ui.QuickDialogSafeProps<Api.TemplateWithRelations>> = ({ close, mutate, item }) => {
  const { _ } = useTranslation(dictionary)
  const { current } = useContextualLanguage()
  const { service } = useTemplatesService()
  const serviceTemplate = service.id(item.id)

  const initialValues = {
    type: item.type,
    translations: useFormTranslatable(item.translations, defaultTranslation),
  }
  const form = useForm({
    allowSubmitAttempt: true,
    values: initialValues,
    onSubmit: async ({ values }) =>
      match(await serviceTemplate.update(values))
        .with({ failed: true }, async ({ except }) =>
          match(except?.name)
            .with("E_VALIDATION_FAILURE", () => Ui.toast.error(_("validation")))
            .otherwise(() => Ui.toast.error(_("failed")))
        )
        .otherwise(async ({ data: { template } }) => {
          Ui.toast.success(_("updated"))
          await mutate?.(template)
          close()
        }),
  })

  const typeOptions = useTypeOptions()

  return (
    <Form.Root form={form} className='space-y-4'>
      <Form.Assertive />
      <Form.Fields name='translations'>
        <FormTranslatableTabs className='space-y-4' defaultLanguage={current.id}>
          {({ code }) => (
            <>
              <Form.Input
                label={_("title-label")}
                name='title'
                placeholder={_("title-placeholder")}
                lang={code}
                maxLength={255}
                labelAside={<Form.Localized title={_("title-label")} content={_("title-info")} />}
              />
              <Form.Textarea
                label={_("description-label")}
                name='description'
                placeholder={_("description-placeholder")}
                lang={code}
                maxLength={255}
                labelAside={<Form.Localized title={_("description-label")} content={_("description-info")} />}
              />
              <Form.Keywords
                label={_("tags-label")}
                name='tags'
                placeholder={_("tags-placeholder")}
                lang={code}
                labelAside={<Form.Localized title={_("tags-label")} content={_("tags-info")} />}
              />
            </>
          )}
        </FormTranslatableTabs>
      </Form.Fields>
      <Form.Select
        label={_("type-label")}
        name='type'
        options={typeOptions}
        labelAside={<FormInfo title={_("type-label")} content={_("type-info")} />}
      />
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
    title: "Edit template",
    description: "Update the template type and settings.",
    "title-label": "Title",
    "title-placeholder": "e.g., Product Photos 2024",
    "title-info": "The title of the template.",
    "description-label": "Description",
    "description-placeholder": "e.g., Product Photos 2024",
    "description-info": "The description of the template.",
    "tags-label": "Tags",
    "tags-placeholder": "Add a tag",
    "tags-info": "The tags of the template.",
    "type-label": "Template type",
    "type-info": "Control in which collection this template will be available.",
    submit: "Save changes",
    updated: "Template updated successfully",
    failed: "Failed to update template",
    validation: "Some of your input is invalid. Please check your entries and try again.",
  },
  fr: {
    title: "Modifier la template",
    description: "Mettre à jour le type et les paramètres de la template.",
    "title-label": "Titre",
    "title-placeholder": "ex. Photos Produits 2024",
    "title-info": "Le titre de la template.",
    "description-label": "Description",
    "description-placeholder": "ex. Photos Produits 2024",
    "description-info": "La description de la template.",
    "tags-label": "Tags",
    "tags-placeholder": "Ajouter un tag",
    "tags-info": "Les tags de la template.",
    "type-label": "Type de la template",
    "type-info": "Control dans quelle collection cette template sera disponible.",
    submit: "Enregistrer les modifications",
    updated: "Template mise à jour avec succès",
    failed: "Échec de la mise à jour de la template",
    validation: "Certaines de vos entrées sont invalides. Veuillez vérifier vos entrées et réessayer.",
  },
  de: {
    title: "Template bearbeiten",
    description: "Template-Typ und Einstellungen der Template aktualisieren.",
    "title-label": "Titel",
    "title-placeholder": "z.B. Produktfotos 2024",
    "title-info": "Der Titel der Template.",
    "description-label": "Beschreibung",
    "description-placeholder": "z.B. Produktfotos 2024",
    "description-info": "Die Beschreibung der Template.",
    "tags-label": "Tags",
    "tags-placeholder": "Tag hinzufügen",
    "tags-info": "Die Tags der Template.",
    "type-label": "Template-Typ",
    "type-info": "Steuern Sie, in welcher Sammlung dieses Template verfügbar sein wird.",
    submit: "Änderungen speichern",
    updated: "Template erfolgreich aktualisiert",
    failed: "Template konnte nicht aktualisiert werden",
    validation: "Einige Ihrer Eingaben sind ungültig. Bitte überprüfen Sie Ihre Eingaben und versuchen Sie es erneut.",
  },
}
const defaultTranslation = {
  title: "",
  description: "",
  tags: [],
}
