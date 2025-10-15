import { Form, FormFields, FormInfo, FormInput, FormLocalized, resolvePath, useFormContext } from "@compo/form"
import { Translation, useTranslation } from "@compo/localize"
import { FormSlug } from "@compo/slugs"
import { FormTranslatableContent } from "@compo/translations"
import { Ui, variants } from "@compo/ui"
import { match } from "@compo/utils"
import React from "react"
import { FormSingleValues } from "./types"

/**
 * FormSingle
 */
export const FormSingle: React.FC<{
  pathNames?: string[]
  asLink?: boolean
  variants?: typeof defaultVariants
  noText?: boolean
}> = ({ pathNames = ["props", "link"], variants = defaultVariants, asLink = false, noText = false }) => {
  const asButton = !asLink
  const _ = useTranslation(dictionary)._.prefixed(asButton ? "button" : "link")
  const { values } = useFormContext<FormSingleValues>()
  const type = resolvePath([...pathNames, "type"], values, "resource")

  const typeOptions = React.useMemo(
    () => [
      { label: _("type-url"), value: "url" },
      { label: _("type-link"), value: "link" },
      { label: _("type-resource"), value: "resource" },
    ],
    [_]
  )

  const templateOptions = React.useMemo(
    () => [
      { label: _("template-link"), content: <Template className={variants.link} />, value: "link" },
      { label: _("template-primary"), content: <Template className={variants.primary} />, value: "primary" },
      { label: _("template-secondary"), content: <Template className={variants.secondary} />, value: "secondary" },
      { label: _("template-highlight"), content: <Template className={variants.highlight} />, value: "highlight" },
    ],
    [_]
  )
  return (
    <div className='space-y-6'>
      {!noText && (
        <Form.Fields name='translations'>
          <FormTranslatableContent className='space-y-6'>
            {({ code }) => (
              <Form.Fields names={pathNames}>
                <Form.Input
                  name='text'
                  label={asButton ? _("text-label-as-button") : _("text-label-as-link")}
                  placeholder={_("text-placeholder")}
                  lang={code}
                  labelAside={<FormLocalized title={_("text-label")} content={_("text-info")} />}
                />
              </Form.Fields>
            )}
          </FormTranslatableContent>
        </Form.Fields>
      )}
      <Form.Fields names={pathNames}>
        <Form.Select
          name='type'
          label={_("type-label")}
          options={typeOptions}
          labelAside={<FormInfo title={_("type-label")} content={_("type-info")} />}
        />
      </Form.Fields>
      {match(type)
        .with("resource", () => (
          <FormFields names={pathNames}>
            <FormSlug
              name='slugId'
              label={_("slug-label")}
              placeholder={_("slug-placeholder")}
              labelAside={<FormInfo title={_("slug-label")} content={_("slug-info")} />}
            />
          </FormFields>
        ))
        .with("link", () => (
          <FormFields names={pathNames}>
            <FormInput
              name='link'
              label={_("link-label")}
              placeholder={_("link-placeholder")}
              labelAside={<FormInfo title={_("link-label")} content={_("link-info")} />}
            />
          </FormFields>
        ))
        .with("url", () => (
          <FormFields name={"translations"}>
            <FormTranslatableContent className='space-y-6'>
              {({ code }) => (
                <FormFields names={pathNames}>
                  <FormInput
                    name='url'
                    label={_("url-label")}
                    placeholder={_("url-placeholder")}
                    lang={code}
                    labelAside={<FormLocalized title={_("url-label")} content={_("url-info")} />}
                  />
                </FormFields>
              )}
            </FormTranslatableContent>
          </FormFields>
        ))
        .otherwise(() => null)}
      {asButton && (
        <FormFields names={pathNames}>
          <Form.Template
            name='template'
            label={_("template-label")}
            labelAside={<FormInfo title={_("template-label")} content={_("template-info")} />}
            options={templateOptions}
          />
        </FormFields>
      )}
    </div>
  )
}

/**
 * default variants
 */
const defaultVariants = {
  link: variants.link(),
  primary: Ui.buttonVariants({ variant: "default" }),
  secondary: Ui.buttonVariants({ variant: "secondary" }),
  highlight: Ui.buttonVariants({ variant: "outline" }),
}

/**
 * template variants
 */
const Template: React.FC<{ className?: string }> = ({ className }) => (
  <div className='flex size-full items-center justify-center'>
    <span className={className}>Lorem ipsum</span>
  </div>
)

/**
 * translations
 */
const dictionary = {
  fr: {
    button: {
      "text-label-as-button": "Titre du bouton",
      "text-label-as-link": "Titre du lien",
      "text-placeholder": "Entrer un titre pour le bouton",
      "text-info": "Le titre du bouton correspond au texte affiché dans le bouton",

      "type-label": "Sélectionnez le type de lien que vous souhaitez ajouter",
      "type-info":
        "Vous pouvez ajouter un lien vers une ressource interne en la sélectionnant dans la liste, un lien vers une page interne ou une url externe.",
      "type-link": "Lien vers une page interne",
      "type-url": "Lien vers une page externe",
      "type-resource": "Lien vers une ressource",

      "url-label": "URL du lien",
      "url-placeholder": "https://www.website.lu/page",
      "url-info":
        "L'URL du bouton correspond à l'URL du lien associé au bouton, elle permet de rediriger l'utilisateur vers une page du site ou vers une ressource externe. Dans la mesure du possible l'url doit pointer vers une ressource relative a la langue localisée.",

      "link-label": "Chemin du lien",
      "link-placeholder": "lien-vers/une-page",
      "link-info":
        "Le chemin du lien correspond au chemin vers la page ou la ressource. N'ajoutez pas de domaine, de protocol ou de langue dans le chemin. Les langues sont ajoutées automatiquement en fonction de la langue consultée sur le site. N'oubliez pas d'ajouter de mettre le chemin à jour lorsque vous déplacez la page ou la ressource.",

      "slug-label": "Ressource du lien",
      "slug-placeholder": "Sélectionnez la ressource associée",
      "slug-info":
        "La ressource associée au lien, elle permet de rediriger l'utilisateur vers une page ou une ressource interne. C'est le moyen le plus simple de créer un lien vers une page ou une ressource. L'url sera automatiquement générée en fonction de la ressource et de la langue sélectionnées et ne sera pas affectée par un déplacement de la ressource.",

      "template-label": "Sélectionnez un template",
      "template-info": "Le template vous permet de personnaliser le rendu du bouton",
      "template-link": "Lien",
      "template-primary": "Bouton primaire",
      "template-secondary": "Bouton secondaire",
      "template-highlight": "Bouton surligner",
    },
    link: {
      "text-label-as-button": "Titre du bouton",
      "text-label-as-link": "Titre du lien",
      "text-placeholder": "Entrer un titre pour le bouton",
      "text-info": "Le titre du bouton correspond au texte affiché dans le bouton",

      "type-label": "Sélectionnez le type de lien que vous souhaitez ajouter",
      "type-info":
        "Vous pouvez ajouter un lien vers une ressource interne en la sélectionnant dans la liste, un lien vers une page interne ou une url externe.",
      "type-link": "Lien vers une page interne",
      "type-url": "Lien vers une page externe",
      "type-resource": "Lien vers une ressource",

      "url-label": "URL du lien",
      "url-placeholder": "https://www.website.lu/page",
      "url-info":
        "L'URL du bouton correspond à l'URL du lien associé au bouton, elle permet de rediriger l'utilisateur vers une page du site ou vers une ressource externe. Dans la mesure du possible l'url doit pointer vers une ressource relative a la langue localisée.",

      "link-label": "Chemin du lien",
      "link-placeholder": "lien-vers/une-page",
      "link-info":
        "Le chemin du lien correspond au chemin vers la page ou la ressource. N'ajoutez pas de domaine, de protocol ou de langue dans le chemin. Les langues sont ajoutées automatiquement en fonction de la langue consultée sur le site. N'oubliez pas d'ajouter de mettre le chemin à jour lorsque vous déplacez la page ou la ressource.",

      "slug-label": "Ressource du lien",
      "slug-placeholder": "Sélectionnez la ressource associée",
      "slug-info":
        "La ressource associée au lien, elle permet de rediriger l'utilisateur vers une page ou une ressource interne. C'est le moyen le plus simple de créer un lien vers une page ou une ressource. L'url sera automatiquement générée en fonction de la ressource et de la langue sélectionnées et ne sera pas affectée par un déplacement de la ressource.",
    },
  },
  en: {
    button: {
      "text-label": "Button title",
      "text-placeholder": "Enter a title for the button",
      "text-info": "The button title corresponds to the text displayed in the button",
      "type-label": "Select the type of link you want to add",
      "type-info":
        "You can add a link to an internal resource by selecting it from the list, an internal page link or an external url.",
      "type-link": "Internal page link",
      "type-url": "External url",
      "type-resource": "Internal resource link",

      "url-label": "URL du lien",
      "url-placeholder": "https://www.website.lu/page",
      "url-info":
        "The button url corresponds to the url of the link associated with the button, it allows to redirect the user to a page of the site or to an external resource. In the best case the url should point to a resource relative to the localized language.",

      "link-label": "Link path",
      "link-placeholder": "link-to/a-page",
      "link-info":
        "The link path corresponds to the path to the page or resource. Do not add a domain, protocol or language in the path. Languages are automatically added based on the language consulted on the site. Do not forget to update the path when you move the page or the resource.",

      "slug-label": "Associated resource",
      "slug-placeholder": "Select the associated resource",
      "slug-info":
        "The associated resource to the link, it allows to redirect the user to an internal page or resource. This is the easiest way to create a link to a page or resource. The url will be automatically generated based on the selected resource and language and will not be affected by a resource move.",

      "template-label": "Select a template",
      "template-info": "The template allows you to personalize the rendering of the button",
      "template-link": "Link",
      "template-primary": "Primary button",
      "template-secondary": "Secondary button",
      "template-highlight": "Highlight button",
    },
    link: {
      "text-label": "Link title",
      "text-placeholder": "Enter a title for the link",
      "text-info": "The link title corresponds to the text displayed in the link",

      "type-label": "Select the type of link you want to add",
      "type-info":
        "You can add a link to an internal resource by selecting it from the list, an internal page link or an external url.",
      "type-link": "Internal page link",
      "type-url": "External url",
      "type-resource": "Internal resource link",

      "url-label": "URL du lien",
      "url-placeholder": "https://www.website.lu/page",
      "url-info":
        "The link url corresponds to the url of the link associated with the link, it allows to redirect the user to a page of the site or to an external resource. In the best case the url should point to a resource relative to the localized language.",

      "link-label": "Link path",
      "link-placeholder": "link-to/a-page",
      "link-info":
        "The link path corresponds to the path to the page or resource. Do not add a domain, protocol or language in the path. Languages are automatically added based on the language consulted on the site. Do not forget to update the path when you move the page or the resource.",

      "slug-label": "Associated resource",
      "slug-placeholder": "Select the associated resource",
      "slug-info":
        "The associated resource to the link, it allows to redirect the user to an internal page or resource. This is the easiest way to create a link to a page or resource. The url will be automatically generated based on the selected resource and language and will not be affected by a resource move.",
    },
  },
  de: {
    button: {
      "text-label-as-button": "Titel des Buttons",
      "text-label-as-link": "Titel des Links",
      "text-placeholder": "Geben Sie einen Titel für den Button ein",
      "text-info": "Der Titel des Buttons entspricht dem Text, der im Button angezeigt wird",

      "type-label": "Wählen Sie den Typ des Links, den Sie hinzufügen möchten",
      "type-info":
        "Sie können einen Link zu einer internen Ressource hinzufügen, indem Sie sie aus der Liste auswählen, einen internen Seitenlink oder eine externe URL.",
      "type-link": "Interner Seitenlink",
      "type-url": "Externe URL",
      "type-resource": "Interner Ressourcenlink",

      "url-label": "URL des Links",
      "url-placeholder": "https://www.website.lu/seite",
      "url-info":
        "Die URL des Links entspricht der URL des Links, der mit dem Button verknüpft ist. Es ermöglicht es dem Benutzer, auf eine Seite des Sites oder auf eine externe Ressource zu verweisen. In den besten Fällen sollte die URL auf eine Ressource relativ zur lokalisierten Sprache verweisen.",

      "link-label": "Pfad des Links",
      "link-placeholder": "link-zu/einer-seite",
      "link-info":
        "Der Pfad des Links entspricht dem Pfad zur Seite oder Ressource. Fügen Sie kein Domain, Protokoll oder Sprache im Pfad hinzu. Sprachen werden automatisch basierend auf der Sprache hinzugefügt, die auf der Website angezeigt wird. Vergessen Sie nicht, den Pfad zu aktualisieren, wenn Sie die Seite oder Ressource verschieben.",

      "slug-label": "Zugehörige Ressource",
      "slug-placeholder": "Wählen Sie die zugehörige Ressource",
      "slug-info":
        "Die zugehörige Ressource zum Link ermöglicht es dem Benutzer, auf eine interne Seite oder Ressource zu verweisen. Dies ist der einfachste Weg, um einen Link zu einer Seite oder Ressource zu erstellen. Die URL wird automatisch basierend auf der ausgewählten Ressource und Sprache generiert und wird nicht durch einen Ressourcenverschiebung beeinflusst.",

      "template-label": "Wählen Sie ein Template",
      "template-info": "Das Template ermöglicht es Ihnen, das Rendering des Buttons zu personalisieren",
      "template-link": "Link",
      "template-primary": "Primärer Button",
      "template-secondary": "Sekundärer Button",
      "template-highlight": "Hervorhebender Button",
    },
    link: {
      "text-label-as-button": "Titel des Buttons",
      "text-label-as-link": "Titel des Links",
      "text-placeholder": "Geben Sie einen Titel für den Button ein",
      "text-info": "Der Titel des Buttons entspricht dem Text, der im Button angezeigt wird",

      "type-label": "Wählen Sie den Typ des Links, den Sie hinzufügen möchten",
      "type-info":
        "Sie können einen Link zu einer internen Ressource hinzufügen, indem Sie sie aus der Liste auswählen, einen internen Seitenlink oder eine externe URL.",
      "type-link": "Interner Seitenlink",
      "type-url": "Externe URL",
      "type-resource": "Interner Ressourcenlink",

      "url-label": "URL des Links",
      "url-placeholder": "https://www.website.lu/seite",
      "url-info":
        "Die URL des Links entspricht der URL des Links, der mit dem Button verknüpft ist. Es ermöglicht es dem Benutzer, auf eine Seite des Sites oder auf eine externe Ressource zu verweisen. In den besten Fällen sollte die URL auf eine Ressource relativ zur lokalisierten Sprache verweisen.",

      "link-label": "Link path",
      "link-placeholder": "link-zu/einer-seite",
      "link-info":
        "Der Pfad des Links entspricht dem Pfad zur Seite oder Ressource. Fügen Sie kein Domain, Protokoll oder Sprache im Pfad hinzu. Sprachen werden automatisch basierend auf der Sprache hinzugefügt, die auf der Website angezeigt wird. Vergessen Sie nicht, den Pfad zu aktualisieren, wenn Sie die Seite oder Ressource verschieben.",

      "slug-label": "Zugehörige Ressource",
      "slug-placeholder": "Wählen Sie die zugehörige Ressource",
      "slug-info":
        "Die zugehörige Ressource zum Link ermöglicht es dem Benutzer, auf eine interne Seite oder Ressource zu verweisen. Dies ist der einfachste Weg, um einen Link zu einer Seite oder Ressource zu erstellen. Die URL wird automatisch basierend auf der ausgewählten Ressource und Sprache generiert und wird nicht durch einen Ressourcenverschiebung beeinflusst.",
    },
  },
} satisfies Translation
