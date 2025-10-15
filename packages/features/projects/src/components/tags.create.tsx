import { Form, useForm } from "@compo/form"
import { useTranslation } from "@compo/localize"
import {
  FormTranslatableContent,
  FormTranslatableTabs,
  useContextualLanguage,
  useFormTranslatable,
} from "@compo/translations"
import { Ui } from "@compo/ui"
import { D, match } from "@compo/utils"
import { type Api, placeholder as servicePlaceholder } from "@services/dashboard"
import React from "react"
import { useProjectsService } from "../service.context"

/**
 * TagsCreateDialog
 */
export const TagsCreateDialog: React.FC<Ui.QuickDialogProps<void, Api.ProjectTag>> = ({ item, ...props }) => {
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

const DialogForm: React.FC<Ui.QuickDialogSafeProps<void, Api.ProjectTag>> = ({ close, mutate }) => {
  const { _ } = useTranslation(dictionary)
  const { current } = useContextualLanguage()
  const { service } = useProjectsService()
  const initialValues = {
    type: "non-formal-education",
    translations: useFormTranslatable([] as Api.ProjectTagTranslation[], servicePlaceholder.projectTag),
    order: 0,
  }
  const form = useForm({
    values: initialValues,
    onSubmit: async ({ values }) => {
      const payload = {
        type: values.type as Api.ProjectTagType,
        order: values.order,
        translations: D.map(values.translations, ({ ...translation }) => ({
          ...translation,
        })),
      }
      match(await service.tags.create(payload))
        .with({ ok: true }, ({ data }) => {
          Ui.toast.success(_("created"))
          mutate?.(data.tag)
          close()
        })
        .otherwise(({ except }) => {
          Ui.toast.error(_("validation-error"))
        })
    },
  })
  const typeOptions = React.useMemo(
    () => [
      { label: _("type-non-formal-education"), value: "non-formal-education" },
      { label: _("type-child-family-services"), value: "child-family-services" },
    ],
    [_]
  )
  return (
    <Form.Root form={form} className='space-y-4'>
      <Form.Assertive />
      <FormTranslatableTabs className='space-y-4' defaultLanguage={current.id}>
        <Form.Select
          label={_("type-label")}
          name='type'
          options={typeOptions}
          labelAside={<Form.Info title={_("image-label")} content={_("image-info")} />}
          classNames={{ item: "pt-4" }}
        />
        <Form.Fields name='translations'>
          <FormTranslatableContent className='space-y-4 pt-4'>
            {({ code }) => (
              <>
                <Form.Input
                  label={_("name-label")}
                  name='name'
                  placeholder={_("name-placeholder")}
                  lang={code}
                  maxLength={255}
                  labelAside={<Form.Localized title={_("name-label")} content={_("name-info")} />}
                />
              </>
            )}
          </FormTranslatableContent>
        </Form.Fields>
      </FormTranslatableTabs>
      <Form.Number
        label={_("order-label")}
        name='order'
        labelAside={<Form.Info title={_("order-label")} content={_("order-info")} />}
      />

      <Ui.QuickDialogStickyFooter>
        <Form.Submit className='w-full'>{_("submit")}</Form.Submit>
      </Ui.QuickDialogStickyFooter>
    </Form.Root>
  )
}

const dictionary = {
  fr: {
    title: "Créer un tag",
    description:
      "Créez un nouveau tag pour organiser vos projets. Il est nécessaire de remplir tous les champs pour chacune des langues.",
    "type-label": "Type",
    "type-info": "Le type de tag qui sera affiché dans l'interface et utilisé pour organiser les projets.",
    "type-non-formal-education": "Éducation non formelle",
    "type-child-family-services": "Aide à l’enfance et à la famille",
    "name-label": "Nom",
    "name-placeholder": "Nom du tag",
    "name-info": "Le nom du tag qui sera affiché dans l'interface et utilisé pour organiser les projets.",
    "order-label": "Priorité",
    "order-info":
      "La priorité du tag sera utilisée pour trier les tags dans l'interface et utilisé pour organiser les projets.",
    submit: "Créer le tag",
    created: "Le tag a été créé avec succès.",
    "validation-error": "Une erreur est survenue lors de la validation des données.",
  },
  en: {
    title: "Create tag",
    description: "Create a new tag to organize your projects. It is necessary to fill in all fields for each language.",
    "type-label": "Type",
    "type-info": "The type of tag that will be displayed in the interface and used to organize projects.",
    "type-non-formal-education": "Non-formal education",
    "type-child-family-services": "Child and family services",
    "name-label": "Name",
    "name-placeholder": "Tag name",
    "name-info": "The name of the tag that will be displayed in the interface and used to organize projects.",
    "order-label": "Priority",
    "order-info":
      "The priority of the tag will be used to sort the tags in the interface and used to organize projects.",
    submit: "Create tag",
    created: "The tag has been created successfully.",
    "validation-error": "An error occurred during the validation of the data.",
  },
  de: {
    title: "Tag erstellen",
    description:
      "Erstellen Sie einen neuen Tag, um Ihre Projekte zu organisieren. Alle Felder müssen für jede Sprache ausgefüllt werden.",
    "type-label": "Typ",
    "type-info":
      "Der Typ des Tags, der in der Benutzeroberfläche angezeigt und zur Organisation von Projekten verwendet wird.",
    "type-non-formal-education": "Nicht-formale Bildung",
    "type-child-family-services": "Kinder- und Familienhilfe",
    "name-label": "Name",
    "name-placeholder": "Tag-Name",
    "name-info":
      "Der Name des Tags, der in der Benutzeroberfläche angezeigt und zur Organisation von Projekten verwendet wird.",
    "order-label": "Priorität",
    "order-info":
      "Die Priorität des Tags wird verwendet, um die Tags in der Benutzeroberfläche zu sortieren und um Projekte zu organisieren.",
    submit: "Tag erstellen",
    created: "Der Tag wurde erfolgreich erstellt.",
    "validation-error": "Bei der Validierung der Daten ist ein Fehler aufgetreten.",
  },
}
