import { Form } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { FormMedia } from "@compo/medias"
import { FormTranslatableContent, FormTranslatableTabs, useContextualLanguage } from "@compo/translations"
import { type Api } from "@services/dashboard"
import React from "react"

/**
 * LibraryDocumentsForm
 */
export const LibraryDocumentsForm: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { current } = useContextualLanguage()

  return (
    <FormTranslatableTabs defaultLanguage={current.id}>
      <div className='space-y-6 pt-6'>
        <Form.Fields name='translations'>
          <FormTranslatableContent>
            {({ code }) => (
              <Form.Input
                name='title'
                label={_("title-label")}
                placeholder={_("title-placeholder")}
                lang={code}
                labelAside={<Form.Localized title={_("title-label")} content={_("title-info")} />}
              />
            )}
          </FormTranslatableContent>
        </Form.Fields>
        <Form.Input
          name='reference'
          label={_("reference-label")}
          placeholder={_("reference-placeholder")}
          labelAside={<Form.Info title={_("reference-label")} content={_("reference-info")} />}
        />
        <Form.Fields name='translations'>
          <FormTranslatableContent>
            {({ code }) => (
              <Form.Textarea
                name='description'
                label={_("description-label")}
                placeholder={_("description-placeholder")}
                lang={code}
                rows={4}
                labelAside={<Form.Localized title={_("description-label")} content={_("description-info")} />}
              />
            )}
          </FormTranslatableContent>
        </Form.Fields>
        <FormMedia.PdfsLabel
          name='files'
          label={_("files-label")}
          labelAside={<Form.Localized title={_("files-label")} content={_("files-info")} />}
        />
      </div>
    </FormTranslatableTabs>
  )
}

/**
 * LibraryDocumentsFormValues
 */
export type LibraryDocumentsFormValues = {
  reference: string
  translations: Record<string, Api.LibraryDocumentTranslation>
}

/**
 * dictionaries
 */
const dictionary = {
  en: {
    "reference-label": "Reference",
    "reference-placeholder": "Enter document reference",
    "reference-info": "Unique reference identifier for this document",
    "title-label": "Document title",
    "title-placeholder": "Enter the document title",
    "title-info": "The name of the document",
    "description-label": "Description",
    "description-placeholder": "Enter a description",
    "description-info": "A description of the document's content",
  },
  fr: {
    "reference-label": "Référence",
    "reference-placeholder": "Saisissez la référence du document",
    "reference-info": "Identifiant de référence unique pour ce document",
    "title-label": "Titre du document",
    "title-placeholder": "Saisissez le titre du document",
    "title-info": "Le nom du document",
    "description-label": "Description",
    "description-placeholder": "Saisissez une description",
    "description-info": "Une description du contenu du document",
  },
  de: {
    "reference-label": "Referenz",
    "reference-placeholder": "Geben Sie die Dokumentreferenz ein",
    "reference-info": "Eindeutige Referenzkennung für dieses Dokument",
    "title-label": "Dokumenttitel",
    "title-placeholder": "Geben Sie den Dokumenttitel ein",
    "title-info": "Der Name des Dokuments",
    "description-label": "Beschreibung",
    "description-placeholder": "Geben Sie eine Beschreibung ein",
    "description-info": "Eine Beschreibung des Dokumentinhalts",
  },
}
