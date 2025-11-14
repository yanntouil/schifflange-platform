import { Form, useFormContext } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { FormSlug } from "@compo/slugs"
import { FormTranslatableContent, FormTranslatableTabs } from "@compo/translations"
import React from "react"
import { match } from "ts-pattern"
import { useTemplates } from "../templates.context"
import { makeSubItemValues } from "./utils"

/**
 * FooterForm
 */
export const FooterForm: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const typeOptions = React.useMemo(
    () => [
      { label: _("type-url"), value: "url" },
      { label: _("type-link"), value: "link" },
      { label: _("type-resource"), value: "resource" },
      // { label: _("type-group"), value: "group" },
    ],
    [_]
  )
  const form = useFormContext<ReturnType<typeof makeSubItemValues>>()
  const selectedType = form.values.type

  const { templates } = useTemplates()
  const isGroup = selectedType === "group"
  return (
    <FormTranslatableTabs classNames={{ root: "space-y-6" }}>
      <Form.Select
        name='type'
        label={_("type-label")}
        options={typeOptions}
        labelAside={<Form.Info title={_("type-label")} content={_("type-info")} />}
      />

      {match(form.values.type)
        .with("resource", () => (
          <FormSlug
            name='slugId'
            label={_("slug-label")}
            placeholder={_("slug-placeholder")}
            labelAside={<Form.Info title={_("slug-label")} content={_("slug-info")} />}
          />
        ))
        .with("link", () => (
          <Form.Fields name={"props"}>
            <Form.Input
              name='link'
              label={_("link-label")}
              placeholder={_("link-placeholder")}
              labelAside={<Form.Info title={_("link-label")} content={_("link-info")} />}
            />
          </Form.Fields>
        ))
        .with("url", () => (
          <Form.Fields name={"translations"}>
            <FormTranslatableContent className='space-y-6'>
              {({ code }) => (
                <Form.Fields name={"props"}>
                  <Form.Input
                    name='url'
                    label={_("url-label")}
                    placeholder={_("url-placeholder")}
                    labelAside={<Form.Localized title={_("url-label")} content={_("url-info")} />}
                  />
                </Form.Fields>
              )}
            </FormTranslatableContent>
          </Form.Fields>
        ))
        .with("group", () => (
          <Form.Fields name={"translations"}>
            <FormTranslatableContent className='space-y-6'>
              {({ code }) => (
                <Form.Input
                  name='name'
                  label={_("name-label")}
                  placeholder={_("name-placeholder")}
                  lang={code}
                  labelAside={<Form.Localized title={_("name-label")} content={_("name-info")} />}
                />
              )}
            </FormTranslatableContent>
          </Form.Fields>
        ))
        .otherwise(() => null)}
      {!isGroup && (
        <>
          <Form.Fields name={"translations"}>
            <FormTranslatableContent className='space-y-6'>
              {({ code }) => (
                <>
                  <Form.Input
                    name='name'
                    label={_("name-label")}
                    placeholder={_("name-placeholder")}
                    lang={code}
                    labelAside={<Form.Localized title={_("name-label")} content={_("name-info")} />}
                  />
                </>
              )}
            </FormTranslatableContent>
          </Form.Fields>
          {templates.length > 0 && (
            <Form.Fields name={"props"}>
              <Form.Template
                name='template'
                label={_("template-label")}
                labelAside={<Form.Info title={_("template-label")} content={_("template-info")} />}
                options={templates}
              />
            </Form.Fields>
          )}
        </>
      )}
    </FormTranslatableTabs>
  )
}

/**
 * translations
 */
const dictionary = {
  fr: {
    "type-label": "Sélectionnez le type d'élément que vous souhaitez ajouter",
    "type-info": "Le type d'élément du menu",
    "type-link": "Lien vers une page interne",
    "type-url": "Lien vers une page externe",
    "type-resource": "Lien vers une ressource",
    "type-group": "Groupe de liens",

    "name-label": "Nom",
    "name-info": "Le nom de l'élément",
    "name-placeholder": "Saisissez un nom pour l'élément",
    "description-label": "Description",
    "description-info": "La description du menu",
    "description-placeholder": "Saisissez la description du menu",
    "image-label": "Image",
    "image-info": "L'image associée à l'élément du menu",

    "url-label": "URL du lien",
    "url-info": "L'URL complète de la page",
    "url-placeholder": "https://www.website.lu/page",

    "link-label": "Chemin du lien",
    "link-info": "Le chemin de la page",
    "link-placeholder": "lien-vers/une-page",

    "slug-label": "Ressource du lien",
    "slug-info": "La ressource associée à l'élément du menu",
    "slug-placeholder": "Sélectionnez la ressource associée",

    "render-title": "Rendu de l'élément dans le menu",
    "render-description": "Configurez les options de rendu de cette élément dans le menu",

    "template-label": "Sélectionnez un template",
    "template-info": "Le template vous permet de personnaliser le rendu de l'élément dans le menu",
    "template-1": "Par défaut",
    "template-2": "Highlight",
  },
  de: {
    "type-label": "Wählen Sie den Typ des Elements aus, das Sie hinzufügen möchten",
    "type-info": "Der Typ des Menüelements",
    "type-link": "Link zu einer internen Seite",
    "type-url": "Link zu einer externen Seite",
    "type-resource": "Link zu einer Ressource",
    "type-group": "Link-Gruppe",

    "name-label": "Name",
    "name-info": "Der Name des Elements",
    "name-placeholder": "Geben Sie einen Namen für das Element ein",
    "description-label": "Beschreibung",
    "description-info": "Die Beschreibung des Menüs",
    "description-placeholder": "Geben Sie die Menübeschreibung ein",
    "image-label": "Bild",
    "image-info": "Das mit dem Menüelement verknüpfte Bild",

    "url-label": "Link-URL",
    "url-info": "Die vollständige URL der Seite",
    "url-placeholder": "https://www.website.de/seite",

    "link-label": "Link-Pfad",
    "link-info": "Der Pfad der Seite",
    "link-placeholder": "link-zu/einer-seite",

    "slug-label": "Link-Ressource",
    "slug-info": "Die mit dem Menüelement verknüpfte Ressource",
    "slug-placeholder": "Wählen Sie die verknüpfte Ressource",

    "render-title": "Darstellung des Elements im Menü",
    "render-description": "Konfigurieren Sie die Darstellungsoptionen für dieses Element im Menü",

    "template-label": "Wählen Sie eine Vorlage",
    "template-info": "Die Vorlage ermöglicht es Ihnen, die Darstellung des Elements im Menü anzupassen",
    "template-1": "Standard",
    "template-2": "Hervorhebung",
  },
  en: {
    "type-label": "Select the type of element you want to add",
    "type-info": "The type of menu element",
    "type-link": "Link to an internal page",
    "type-url": "Link to an external page",
    "type-resource": "Link to a resource",
    "type-group": "Link group",

    "name-label": "Name",
    "name-info": "The name of the element",
    "name-placeholder": "Enter a name for the element",
    "description-label": "Description",
    "description-info": "The description of the menu",
    "description-placeholder": "Enter the menu description",
    "image-label": "Image",
    "image-info": "The image associated with the menu element",

    "url-label": "Link URL",
    "url-info": "The complete URL of the page",
    "url-placeholder": "https://www.website.com/page",

    "link-label": "Link path",
    "link-info": "The path of the page",
    "link-placeholder": "link-to/a-page",

    "slug-label": "Link resource",
    "slug-info": "The resource associated with the menu element",
    "slug-placeholder": "Select the associated resource",

    "render-title": "Rendering of the element in the menu",
    "render-description": "Configure the rendering options for this element in the menu",

    "template-label": "Select a template",
    "template-info": "The template allows you to customize the rendering of the element in the menu",
    "template-1": "Default",
    "template-2": "Highlight",
  },
}
