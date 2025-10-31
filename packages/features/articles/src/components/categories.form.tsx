import { Form, FormLocalized } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { FormMedia } from "@compo/medias"
import { FormTranslatableTabs, useContextualLanguage } from "@compo/translations"
import React from "react"

/**
 * CategoryForm
 */
export const CategoryForm: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { current } = useContextualLanguage()
  return (
    <>
      <Form.Fields name='translations'>
        <FormTranslatableTabs className='space-y-4' defaultLanguage={current.id}>
          {({ code }) => (
            <>
              <FormMedia.Image
                label={_("image-label")}
                name='image'
                ratio='aspect-video'
                contextKey={`category`}
                labelAside={<FormLocalized title={_("image-label")} content={_("image-info")} />}
                classNames={{ input: "max-w-lg" }}
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
    </>
  )
}

const dictionary = {
  fr: {
    "image-label": "Image",
    "image-info": "L'image est utilisée pour représenter visuellement la catégorie dans l'interface.",
    "title-label": "Titre",
    "title-placeholder": "Nom de la catégorie",
    "title-info": "Le titre de la catégorie qui sera affiché dans l'interface et utilisé pour organiser les articles.",
    "description-label": "Description",
    "description-placeholder": "Entrez une courte description de la catégorie",
    "description-info": "La description aide à comprendre le type d'articles que cette catégorie contient.",
  },
  en: {
    "image-label": "Image",
    "image-info": "The image is used to visually represent the category in the interface.",
    "title-label": "Title",
    "title-placeholder": "Category name",
    "title-info": "The category title that will be displayed in the interface and used to organize articles.",
    "description-label": "Description",
    "description-placeholder": "Enter a short description of the category",
    "description-info": "The description helps understand the type of articles this category contains.",
  },
  de: {
    "image-label": "Bild",
    "image-info": "Das Bild wird verwendet, um die Kategorie visuell in der Benutzeroberfläche darzustellen.",
    "title-label": "Titel",
    "title-placeholder": "Kategoriename",
    "title-info":
      "Der Kategorietitel, der in der Benutzeroberfläche angezeigt und zur Organisation von Artikeln verwendet wird.",
    "description-label": "Beschreibung",
    "description-placeholder": "Geben Sie eine kurze Beschreibung der Kategorie ein",
    "description-info": "Die Beschreibung hilft zu verstehen, welche Art von Artikeln diese Kategorie enthält.",
  },
}
