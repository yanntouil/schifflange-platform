import { Form } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { FormMedia } from "@compo/medias"
import { FormTranslatableContent, FormTranslatableTabs, useContextualLanguage } from "@compo/translations"
import React from "react"

/**
 * CouncilsForm
 * Form for creating/editing councils
 */
export const CouncilsForm: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { current } = useContextualLanguage()
  return (
    <FormTranslatableTabs defaultLanguage={current.id}>
      <div className='space-y-4'>
        <Form.Date name='date' label={_("date-label")} withTime defaultTime='8:00' />
        <Form.Fields name='translations'>
          <FormTranslatableContent>
            {({ code }) => (
              <div className='space-y-4'>
                <Form.TextEditor
                  label={_("agenda-label")}
                  name='agenda'
                  lang={code}
                  // prose='prose dark:prose-invert max-w-full'
                  labelAside={<Form.Localized title={_("agenda-label")} content={_("agenda-info")} />}
                />
                <FormMedia.Pdf
                  label={_("report-label")}
                  name='report'
                  labelAside={<Form.Localized title={_("report-label")} content={_("report-info")} />}
                  classNames={{ input: "max-w-sm" }}
                />
              </div>
            )}
          </FormTranslatableContent>
        </Form.Fields>
        <FormMedia.VideoSource name='video' label={_("video-label")} />
      </div>
    </FormTranslatableTabs>
  )
}

/**
 * translations
 */
const dictionary = {
  fr: {
    "date-label": "Date du conseil",
    "agenda-label": "Ordre du jour",
    "agenda-info": "Contenu de l'ordre du jour du conseil communal",
    "report-label": "Rapport",
    "report-info": "Rapport de la réunion du conseil communal",
    "video-label": "Vidéo",
  },
  en: {
    "date-label": "Council date",
    "agenda-label": "Agenda",
    "agenda-info": "Council agenda content",
    "report-label": "Report",
    "report-info": "Council meeting report",
    "video-label": "Video",
  },
  de: {
    "date-label": "Ratssitzungsdatum",
    "agenda-label": "Tagesordnung",
    "agenda-info": "Inhalt der Tagesordnung der Gemeinderatssitzung",
    "report-label": "Bericht",
    "report-info": "Bericht der Gemeinderatssitzung",
    "video-label": "Video",
  },
}
