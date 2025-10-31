import { Form } from "@compo/form"
import { Translation, useTranslation } from "@compo/localize"
import { FormMedia } from "@compo/medias"
import { FormTranslatableTabs, useContextualLanguage } from "@compo/translations"
import React from "react"
import { useSeo } from "../seo.context"

/**
 * SeoDialog
 */
export const SeoForm: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { persistedId } = useSeo()
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
                ratio='aspect-[4/3]'
                contextKey={`image-${persistedId}`}
                labelAside={<Form.Localized title={_("image-label")} content={_("image-info")} />}
                classNames={{ input: "max-w-lg" }}
              />
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
                label={_("keywords-label")}
                name='keywords'
                placeholder={_("keywords-placeholder")}
                lang={code}
                labelAside={<Form.Localized title={_("title-label")} content={_("title-info")} />}
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
    "image-info":
      "L'image est utilisée dans les moteurs de recherche pour indexer la page et par les réseaux sociaux afin de donner une mignature de la page.",
    "title-label": "Titre",
    "title-placeholder": "Titre de la page",
    "title-info":
      "Le titre est utilisé dans les moteurs de recherche pour indexer la page, il sera également utilisé dans les onglets des navigateurs.",
    "description-label": "Description",
    "description-placeholder": "Entrez une courte description du contenu de la page",
    "description-info": "La description est utilisée dans les moteurs de recherche pour indexer la page.",
    "keywords-label": "Mots-clés",
    "keywords-placeholder": "Ajouter un mot-clé",
    "keywords-info": "Les mots-clés sont utilisés dans les moteurs de recherche pour indexer la page.",
  },
  en: {
    "image-label": "Image",
    "image-info":
      "The image is used in search engines to index the page and in social networks to give a thumbnail of the page.",
    "title-label": "Title",
    "title-placeholder": "Page title",
    "title-info": "The title is used in search engines to index the page, it will also be used in the browser tabs.",
    "description-label": "Description",
    "description-placeholder": "Enter a short description of the page content",
    "description-info": "The description is used in search engines to index the page.",
    "keywords-label": "Keywords",
    "keywords-placeholder": "Add a keyword",
    "keywords-info": "The keywords are used in search engines to index the page.",
  },
  de: {
    "image-label": "Bild",
    "image-info":
      "Das Bild wird von Suchmaschinen zur Indexierung der Seite und von sozialen Netzwerken als Vorschaubild der Seite verwendet.",
    "title-label": "Titel",
    "title-placeholder": "Seitentitel",
    "title-info":
      "Der Titel wird von Suchmaschinen zur Indexierung der Seite verwendet und erscheint auch in den Browser-Tabs.",
    "description-label": "Beschreibung",
    "description-placeholder": "Geben Sie eine kurze Beschreibung des Seiteninhalts ein",
    "description-info": "Die Beschreibung wird von Suchmaschinen zur Indexierung der Seite verwendet.",
    "keywords-label": "Schlüsselwörter",
    "keywords-placeholder": "Schlüsselwort hinzufügen",
    "keywords-info": "Die Schlüsselwörter werden von Suchmaschinen zur Indexierung der Seite verwendet.",
  },
} satisfies Translation
