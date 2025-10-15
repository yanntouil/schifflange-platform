import { Form, FormInfo, useForm } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { FormTranslatableTabs, useContextualLanguage, useFormTranslatable } from "@compo/translations"
import { Ui } from "@compo/ui"
import { match } from "@compo/utils"
import { type Api } from "@services/dashboard"
import React from "react"
import { useLocation } from "wouter"
import { useTemplatesService, useTypeOptions } from "../.."

/**
 * CreateTemplateDialog
 */
export const CreateTemplateDialog: React.FC<Ui.QuickDialogProps<void, Api.TemplateWithRelations>> = ({
  item,
  ...props
}) => {
  const { _ } = useTranslation(dictionary)
  return (
    <Ui.QuickDialog
      title={_("title")}
      description={_("description")}
      {...props}
      classNames={{ content: "sm:max-w-lg" }}
      sticky
    >
      {item !== false && <DialogForm {...props} />}
    </Ui.QuickDialog>
  )
}

/**
 * DialogForm
 */
const DialogForm: React.FC<Ui.QuickDialogSafeProps<void, Api.TemplateWithRelations>> = ({ close, mutate }) => {
  const { _ } = useTranslation(dictionary)
  const { current } = useContextualLanguage()
  const [, navigate] = useLocation()
  const { service, routeToTemplate, type } = useTemplatesService()
  const initialValues = {
    type,
    translations: useFormTranslatable([] as Api.TemplateTranslation[], defaultTranslation),
  }
  const form = useForm({
    allowSubmitAttempt: true,
    values: initialValues,
    onSubmit: async ({ values }) =>
      match(await service.create(values))
        .with({ failed: true }, async ({ except }) =>
          match(except?.name)
            .with("E_VALIDATION_FAILURE", () => Ui.toast.error(_("validation")))
            .otherwise(() => Ui.toast.error(_("failed")))
        )
        .otherwise(async ({ data: { template } }) => {
          Ui.toast.success(_("created"))
          await mutate?.(template)
          navigate(routeToTemplate(template.id))
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
    title: "Create template",
    description: "Create a new template.",
    "title-label": "Title",
    "title-placeholder": "e.g., Landing Page Hero",
    "title-info": "The title of the template.",
    "description-label": "Description",
    "description-placeholder": "e.g., Hero section with CTA buttons",
    "description-info": "The description of the template.",
    "tags-label": "Tags",
    "tags-placeholder": "Add a tag",
    "tags-info": "Tags help organize and find templates.",
    "type-label": "Template type",
    "type-info": "Control in which collection this template will be available.",
    submit: "Create template",
    created: "Template created successfully",
    failed: "Failed to create template",
    validation: "Some of your input is invalid. Please check your entries and try again.",
  },
  fr: {
    title: "Créer un modèle",
    description: "Créer un nouveau modèle.",
    "title-label": "Titre",
    "title-placeholder": "ex. Hero de page d'accueil",
    "title-info": "Le titre du modèle.",
    "description-label": "Description",
    "description-placeholder": "ex. Section hero avec boutons CTA",
    "description-info": "La description du modèle.",
    "tags-label": "Tags",
    "tags-placeholder": "Ajouter un tag",
    "tags-info": "Les tags aident à organiser et trouver les modèles.",
    "type-label": "Type de modèle",
    "type-info": "Contrôle dans quelle collection ce modèle sera disponible.",
    submit: "Créer le modèle",
    created: "Modèle créé avec succès",
    failed: "Échec de la création du modèle",
    validation: "Certaines de vos entrées sont invalides. Veuillez vérifier vos entrées et réessayer.",
  },
  de: {
    title: "Vorlage erstellen",
    description: "Eine neue Vorlage erstellen.",
    "title-label": "Titel",
    "title-placeholder": "z.B. Landingpage Hero",
    "title-info": "Der Titel der Vorlage.",
    "description-label": "Beschreibung",
    "description-placeholder": "z.B. Hero-Bereich mit CTA-Buttons",
    "description-info": "Die Beschreibung der Vorlage.",
    "tags-label": "Tags",
    "tags-placeholder": "Tag hinzufügen",
    "tags-info": "Tags helfen beim Organisieren und Finden von Vorlagen.",
    "type-label": "Vorlagentyp",
    "type-info": "Steuern Sie, in welcher Sammlung diese Vorlage verfügbar sein wird.",
    submit: "Vorlage erstellen",
    created: "Vorlage erfolgreich erstellt",
    failed: "Vorlage konnte nicht erstellt werden",
    validation: "Einige Ihrer Eingaben sind ungültig. Bitte überprüfen Sie Ihre Eingaben und versuchen Sie es erneut.",
  },
}
const defaultTranslation = {
  title: "",
  description: "",
  tags: [],
}
