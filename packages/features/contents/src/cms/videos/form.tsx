import { FormFields, FormHeader, FormInfo, FormVideo, FormVideoExternal, useFieldGroupContext } from "@compo/form"
import { Translation, useTranslation } from "@compo/localize"
import { FormMedia } from "@compo/medias"
import { Ui } from "@compo/ui"
import { cx } from "@compo/utils"
import React from "react"
import { FormVideoValues, VideoType } from "./types"

export const FormSingle: React.FC<{ pathNames?: string[] } & FieldProps> = ({
  pathNames = ["props", "video"],
  ...props
}) => {
  const { _ } = useTranslation(dictionary)
  return (
    <FormFields names={pathNames}>
      <Fields {...props} />
    </FormFields>
  )
}

type FieldProps = {
  contextKey: string
  title?: string
  description?: string
  className?: string
  classNames?: {
    wrapper?: string
    header?: React.ComponentProps<typeof FormHeader>["classNames"]
    tabs?: string
    list?: string
    trigger?: string
    content?: string
  }
}

const Fields: React.FC<FieldProps> = ({ contextKey, className, classNames, ...props }) => {
  const { _ } = useTranslation(dictionary)
  const { title = _("video-title"), description = _("video-description") } = props
  const { setValues, values } = useFieldGroupContext<FormVideoValues>()
  return (
    <div className={cx("flex flex-col gap-6", classNames?.wrapper, className)}>
      <FormHeader title={title} description={description} classNames={classNames?.header} />
      <Ui.Tabs.Root
        value={values.type}
        onValueChange={(type) => setValues({ ...values, type: type as VideoType })}
        className={cx("space-y-4 rounded-md border border-input p-4", classNames?.tabs)}
      >
        <Ui.Tabs.List className={cx("grid grid-cols-3", classNames?.list)}>
          <Ui.Tabs.Trigger value='local' className={classNames?.trigger}>
            {_("local")}
          </Ui.Tabs.Trigger>
          <Ui.Tabs.Trigger value='embed' className={classNames?.trigger}>
            {_("embed")}
          </Ui.Tabs.Trigger>
          <Ui.Tabs.Trigger value='external' className={classNames?.trigger}>
            {_("external")}
          </Ui.Tabs.Trigger>
        </Ui.Tabs.List>
        <Ui.AnimateHeight>
          <Ui.Tabs.Content value='local' className={classNames?.content}>
            <FormMedia.Video
              name='file'
              label={_("video-label")}
              contextKey={contextKey}
              labelAside={<FormInfo title={_("video-label")} content={_("video-info")} />}
            />
          </Ui.Tabs.Content>
          <Ui.Tabs.Content value='embed' className={classNames?.content}>
            <FormVideo
              name='embed'
              label={_("embed-label")}
              placeholder={_("embed-placeholder")}
              labelAside={<FormInfo title={_("embed-label")} content={_("embed-info")} />}
            />
          </Ui.Tabs.Content>
          <Ui.Tabs.Content value='external' className={classNames?.content}>
            <FormVideoExternal
              name='external'
              label={_("external-label")}
              placeholder={_("external-placeholder")}
              labelAside={<FormInfo title={_("external-label")} content={_("external-info")} />}
            />
          </Ui.Tabs.Content>
        </Ui.AnimateHeight>
      </Ui.Tabs.Root>
    </div>
  )
}

/**
 * translations
 */
const dictionary = {
  fr: {
    "video-title": "Ajouter une video",
    "video-description":
      "Vous pouvez ajouter au choix ajouter une video locale a partir du gestionnaire de medias ou d'une video youtube",
    local: "Local",
    "video-label": "Selectionner une video",
    "video-info": "Selectionner une video dans le gestionnaire de medias",
    embed: "Embed",
    "embed-label": "Url de la video",
    "embed-placeholder": "https://www.youtube.com/watch?v=...",
    "embed-info":
      "Vous pouvez utiliser les services youtube, vimeo ou dailymotion pour embed une video. Simplement coller l'url de la video dans l'input pour obtenir l'id et le service de la video",
    "embed-service": "Service",
    external: "External",
    "external-label": "Url de la video",
    "external-placeholder": "https://www.my-streaming-service.com/video.mp4",
    "external-info": "Vous pouvez utiliser directement l'url de la video que vous souhaitez afficher",
  },
  en: {
    "video-title": "Add a video",
    "video-description": "You can add a local video from the media manager or a youtube video",
    local: "Local",
    "video-label": "Select a video",
    "video-info": "Select a video from the media manager",
    embed: "Embed",
    "embed-label": "Video url",
    "embed-placeholder": "https://www.youtube.com/watch?v=...",
    "embed-info":
      "You can use the youtube, vimeo or dailymotion services to embed a video. Simply paste the url of the video in the input to get the video id and service",
    external: "External",
    "external-label": "Video url",
    "external-placeholder": "https://www.my-streaming-service.com/video.mp4",
    "external-info": "You can use directly the url of the video you want to display",
  },
  de: {
    "video-title": "Video hinzufügen",
    "video-description": "Sie können eine lokale Video aus dem Medienmanager oder eine Youtube-Video hinzufügen",
    local: "Lokal",
    "video-label": "Video auswählen",
    "video-info": "Video aus dem Medienmanager auswählen",
    embed: "Embed",
    "embed-label": "Video-URL",
    "embed-placeholder": "https://www.youtube.com/watch?v=...",
    "embed-info":
      "Sie können die Dienste youtube, vimeo oder dailymotion verwenden, um eine Video einzubinden. Kopieren Sie einfach die URL der Video in das Eingabefeld, um die Video-ID und den Dienst zu erhalten",
    external: "Extern",
    "external-label": "Video-URL",
    "external-placeholder": "https://www.my-streaming-service.com/video.mp4",
    "external-info": "Sie können die direkte URL der Video verwenden, die Sie anzeigen möchten",
  },
} satisfies Translation
