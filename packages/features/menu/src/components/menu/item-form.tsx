import { Form, useFormContext } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { FormSlug } from "@compo/slugs"
import { FormTranslatableContent, FormTranslatableTabs } from "@compo/translations"
import { match } from "@compo/utils"
import React from "react"
import { makeItemValues } from "./utils"

/**
 * ItemForm
 */
export const ItemForm: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const form = useFormContext<ReturnType<typeof makeItemValues>>()
  const selectedType = form.values.type

  const typeOptions = React.useMemo(
    () => [
      { label: _("type-url"), value: "url" },
      { label: _("type-link"), value: "link" },
      { label: _("type-resource"), value: "resource" },
      { label: _("type-group"), value: "group" },
    ],
    [_]
  )

  return (
    <FormTranslatableTabs classNames={{ root: "space-y-6" }}>
      <Form.Select
        name='type'
        label={_("type-label")}
        options={typeOptions}
        labelAside={<Form.Info title={_("type-label")} content={_("type-info")} />}
      />
      {match(selectedType)
        .with("url", () => <UrlForm />)
        .with("resource", () => <ResourceForm />)
        .with("link", () => <LinkForm />)
        .otherwise(() => null)}
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
    </FormTranslatableTabs>
  )
}

/**
 * UrlForm
 */
const UrlForm: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  return (
    <>
      <Form.Fields name={"translations"}>
        <FormTranslatableContent className='space-y-6'>
          {({ code }) => (
            <Form.Fields name={"props"}>
              <Form.Input
                name='url'
                label={_("url-label")}
                placeholder={_("url-placeholder")}
                lang={code}
                labelAside={<Form.Localized title={_("url-label")} content={_("url-info")} />}
              />
            </Form.Fields>
          )}
        </FormTranslatableContent>
      </Form.Fields>
    </>
  )
}

/**
 * ResourceForm
 */
const ResourceForm: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  return (
    <>
      <FormSlug
        name='slugId'
        label={_("slug-label")}
        placeholder={_("slug-placeholder")}
        labelAside={<Form.Info title={_("slug-label")} content={_("slug-info")} />}
      />
    </>
  )
}

/**
 * LinkForm
 */
const LinkForm: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  return (
    <>
      <Form.Fields name={"props"}>
        <Form.Input
          name='link'
          label={_("link-label")}
          placeholder={_("link-placeholder")}
          labelAside={<Form.Info title={_("link-label")} content={_("link-info")} />}
        />
      </Form.Fields>
    </>
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

    "url-label": "URL du lien",
    "url-info": "L'URL complète de la page",
    "url-placeholder": "https://www.website.lu/page",

    "link-label": "Chemin du lien",
    "link-info": "Le chemin de la page",
    "link-placeholder": "lien-vers/une-page",

    "slug-label": "Ressource du lien",
    "slug-info": "La ressource associée à l'élément du menu",
    "slug-placeholder": "Sélectionnez la ressource associée",

    "template-label": "Template",
    "template-info": "Le template de l'élément du menu",
    "template-placeholder": "Sélectionnez le template de l'élément du menu",
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
    "description-info": "Die Menübeschreibung",
    "description-placeholder": "Geben Sie die Menübeschreibung ein",

    "url-label": "Link-URL",
    "url-info": "Die vollständige URL der Seite",
    "url-placeholder": "https://www.website.de/seite",

    "link-label": "Link-Pfad",
    "link-info": "Der Pfad der Seite",
    "link-placeholder": "link-zu/einer-seite",

    "slug-label": "Link-Ressource",
    "slug-info": "Die mit dem Menüelement verknüpfte Ressource",
    "slug-placeholder": "Wählen Sie die verknüpfte Ressource",

    "template-label": "Vorlage",
    "template-info": "Die Vorlage für das Menüelement",
    "template-placeholder": "Wählen Sie die Vorlage für das Menüelement",
    "template-1": "Standard",
    "template-2": "Hervorhebung",
  },
  en: {
    "type-label": "Select the type of item you want to add",
    "type-info": "The type of menu item",
    "type-link": "Link to an internal page",
    "type-url": "Link to an external page",
    "type-resource": "Link to a resource",
    "type-group": "Group of links",

    "name-label": "Name",
    "name-info": "The name of the item",
    "name-placeholder": "Enter a name for the item",
    "description-label": "Description",
    "description-info": "The menu description",
    "description-placeholder": "Enter the menu description",

    "url-label": "Link URL",
    "url-info": "The complete URL of the page",
    "url-placeholder": "https://www.website.com/page",

    "link-label": "Link path",
    "link-info": "The path of the page",
    "link-placeholder": "link-to/a-page",

    "slug-label": "Link resource",
    "slug-info": "The resource associated with the menu item",
    "slug-placeholder": "Select the associated resource",

    "template-label": "Template",
    "template-info": "The template of the menu item",
    "template-placeholder": "Select the menu item template",
    "template-1": "Default",
    "template-2": "Highlight",
  },
}
