import { Form } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { FormTranslatableContent, FormTranslatableTabs, useContextualLanguage } from "@compo/translations"
import { type Api } from "@services/dashboard"
import React from "react"

/**
 * LibrariesForm
 */
export const LibrariesForm: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { current } = useContextualLanguage()

  return (
    <FormTranslatableTabs defaultLanguage={current.id}>
      <div className='space-y-6 pt-6'>
        <Form.Fields name='translations'>
          <FormTranslatableContent>
            {({ code }) => (
              <div className='space-y-6'>
                <Form.Input
                  name='title'
                  label={_("title-label")}
                  placeholder={_("title-placeholder")}
                  lang={code}
                  labelAside={<Form.Localized title={_("title-label")} content={_("title-info")} />}
                />
                <Form.Textarea
                  name='description'
                  label={_("description-label")}
                  placeholder={_("description-placeholder")}
                  lang={code}
                  rows={4}
                  labelAside={<Form.Localized title={_("description-label")} content={_("description-info")} />}
                />
              </div>
            )}
          </FormTranslatableContent>
        </Form.Fields>
      </div>
    </FormTranslatableTabs>
  )
}

/**
 * LibrariesFormValues
 */
export type LibrariesFormValues = {
  translations: Record<string, Api.LibraryTranslation>
}

/**
 * dictionaries
 */
const dictionary = {
  en: {
    "title-label": "Library title",
    "title-placeholder": "Enter the library title",
    "title-info": "The name of the library",
    "description-label": "Description",
    "description-placeholder": "Enter a description",
    "description-info": "A description of the library's content and purpose",
  },
  fr: {
    "title-label": "Titre de la bibliothèque",
    "title-placeholder": "Saisissez le titre de la bibliothèque",
    "title-info": "Le nom de la bibliothèque",
    "description-label": "Description",
    "description-placeholder": "Saisissez une description",
    "description-info": "Une description du contenu et de l'objectif de la bibliothèque",
  },
  de: {
    "title-label": "Bibliothekstitel",
    "title-placeholder": "Geben Sie den Bibliothekstitel ein",
    "title-info": "Der Name der Bibliothek",
    "description-label": "Beschreibung",
    "description-placeholder": "Geben Sie eine Beschreibung ein",
    "description-info": "Eine Beschreibung des Inhalts und Zwecks der Bibliothek",
  },
}
