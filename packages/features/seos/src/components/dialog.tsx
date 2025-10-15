import { Form, useForm } from "@compo/form"
import { Translation, useTranslation } from "@compo/localize"
import { FormMedia } from "@compo/medias"
import { FormTranslatableTabs, useContextualLanguage, useFormTranslatable } from "@compo/translations"
import { Ui } from "@compo/ui"
import { D, match } from "@compo/utils"
import { type Api } from "@services/dashboard"
import React from "react"
import { useSeo } from "../seo.context"

/**
 * SeoDialog
 */
export const SeoDialog: React.FC<Ui.QuickDialogProps<void>> = ({ item, ...props }) => {
  const { _ } = useTranslation(dictionary)
  return (
    <Ui.QuickDialog
      title={_("title")}
      description={_("description")}
      {...props}
      classNames={{ content: "sm:max-w-lg", header: "z-10", close: "z-10" }}
      sticky
    >
      {item !== false && <DialogForm {...props} />}
    </Ui.QuickDialog>
  )
}

const DialogForm: React.FC<Ui.QuickDialogSafeProps<void>> = ({ close }) => {
  const { _ } = useTranslation(dictionary)
  const { current } = useContextualLanguage()
  const { seo, persistedId, service, mutate } = useSeo()
  const form = useForm({
    values: {
      translations: useFormTranslatable(seo.translations, defaultTranslation),
    },
    onSubmit: async ({ values }) => {
      // socials are not implemented yet
      const payload = {
        files: [],
        translations: D.map(values.translations, ({ image, ...translation }) => ({
          ...translation,
          imageId: image?.id || null,
          socials: [],
        })),
      }
      match(await service.update(payload))
        .with({ ok: true }, ({ data }) => {
          Ui.toast.success(_("updated"))
          mutate(data.seo)
          close()
        })
        .otherwise(({ except }) => {
          Ui.toast.error(_("E_VALIDATION_FAILURE"))
        })
    },
  })
  return (
    <Form.Root form={form} className='space-y-4'>
      <Form.Assertive />
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

      <Ui.QuickDialogStickyFooter>
        <Form.Submit className='w-full'>{_("submit")}</Form.Submit>
      </Ui.QuickDialogStickyFooter>
    </Form.Root>
  )
}

const dictionary = {
  fr: {
    title: "Modifier le SEO",
    description:
      "Il est nécessaire de remplir tous les champs pour chacune des langues afin que le référencement soit optimisé.",
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
    submit: "Mettre à jour",
    updated: "Le SEO a été modifié avec succès.",
    E_VALIDATION_FAILURE: "Une erreur est survenue lors de la validation des données.",
  },
  en: {
    title: "Edit SEO",
    description: "It is necessary to fill in all fields for each language in order to optimize the referencing.",
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
    submit: "Update",
    updated: "The SEO has been edited successfully.",
    E_VALIDATION_FAILURE: "An error occurred during the validation of the data.",
  },
  de: {
    title: "SEO bearbeiten",
    description:
      "Es ist notwendig, alle Felder für jede Sprache auszufüllen, um die Suchmaschinenoptimierung zu optimieren.",
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
    submit: "Aktualisieren",
    updated: "Das SEO wurde erfolgreich bearbeitet.",
    E_VALIDATION_FAILURE: "Ein Fehler ist bei der Validierung der Daten aufgetreten.",
  },
} satisfies Translation

const defaultTranslation: Api.SeoTranslation = {
  languageId: "",
  title: "",
  description: "",
  keywords: [],
  socials: [],
  imageId: null,
  image: null,
}
