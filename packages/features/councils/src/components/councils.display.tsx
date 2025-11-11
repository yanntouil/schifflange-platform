import { useTranslation } from "@compo/localize"
import { PdfPreview, VideoPreview } from "@compo/medias"
import { useLanguage } from "@compo/translations"
import { Ui } from "@compo/ui"
import { G, isNotEmptyHtml, T } from "@compo/utils"
import { type Api, placeholder as servicePlaceholder } from "@services/dashboard"
import React from "react"

/**
 * CouncilsDisplayDialog
 */
export const CouncilsDisplayDialog: React.FC<Ui.QuickDialogProps<Api.Council>> = ({ item, ...props }) => {
  const { _, format } = useTranslation(dictionary)
  return (
    <Ui.QuickDialog
      title={_("title")}
      description={item ? _("description", { date: format(T.parseISO(item.date), "PPPPp") }) : ""}
      {...props}
      classNames={{ content: "sm:max-w-3xl", header: "z-10", close: "z-10" }}
      sticky
    >
      {item && <Content {...props} item={item} />}
    </Ui.QuickDialog>
  )
}

const Content: React.FC<Ui.QuickDialogSafeProps<Api.Council>> = ({ item, close, mutate }) => {
  const { _ } = useTranslation(dictionary)
  const { translate } = useLanguage()
  const translated = translate(item, servicePlaceholder.council)
  return (
    <div className='space-y-8 pb-6'>
      <div className='space-y-4'>
        <h3 className='text-base font-medium'>{_("agenda")}</h3>
        {isNotEmptyHtml(translated.agenda) ? (
          <div
            className='prose prose-sm dark:prose-invert -my-2'
            dangerouslySetInnerHTML={{ __html: translated.agenda }}
          />
        ) : (
          <p className='text-sm text-muted-foreground'>{_("agenda-empty")}</p>
        )}
      </div>
      {G.isNotNullable(translated.report) && (
        <div className='space-y-4'>
          <h3 className='text-base font-medium'>{_("report")}</h3>
          <PdfPreview file={translated.report} />
        </div>
      )}
      <div className='space-y-4'>
        <h3 className='text-base font-medium'>{_("video")}</h3>
        <VideoPreview video={item.video} files={item.files} />
      </div>
    </div>
  )
}

const dictionary = {
  fr: {
    title: "Réunion du conseil communal",
    description: "Du {{date}}",
    agenda: "Ordre du jour",
    "agenda-empty": "Aucun ordre du jour disponible.",
    report: "Rapport",
    video: "Vidéo",
  },
  en: {
    title: "Edit council meeting",
    description:
      "Edit the information for this council meeting. It is necessary to fill in all fields for each language.",
    submit: "Update",
    updated: "The council meeting has been edited successfully.",
    "validation-error": "An error occurred during the validation of the data.",
  },
  de: {
    title: "Gemeinderatssitzung bearbeiten",
    description:
      "Bearbeiten Sie die Informationen für diese Gemeinderatssitzung. Es ist notwendig, alle Felder für jede Sprache auszufüllen.",
    submit: "Aktualisieren",
    updated: "Die Gemeinderatssitzung wurde erfolgreich bearbeitet.",
    "validation-error": "Ein Fehler ist bei der Validierung der Daten aufgetreten.",
  },
}
