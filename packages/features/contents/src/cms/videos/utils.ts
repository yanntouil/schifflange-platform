import { makeVideoService } from "@compo/form"
import { A, match } from "@compo/utils"
import { type Api } from "@services/dashboard"
import type { FormVideoValues, Video, VideoType } from "./types"

/**
 * prepare and secure a video values from a list of files and a video values
 */
export const makeValues = (files: Api.MediaFile[] = [], values: Option<Partial<Video>> = {}): FormVideoValues => ({
  type: match(values?.type)
    .with("embed", () => "embed" as VideoType)
    .with("external", () => "external" as VideoType)
    .otherwise(() => "local" as VideoType),
  file: A.find(files, ({ id }) => id === values?.video) || null,
  embed: {
    url: values?.embed?.url || "",
    service: makeVideoService(values?.embed?.service),
    id: values?.embed?.id || "",
  },
  external: values?.external || null,
})

/**
 * extract a video payload from a video values
 */
export const extractPayload = (values: FormVideoValues): Video => ({
  type: values.type,
  video: values.file?.id || null,
  embed: {
    url: values.embed.url,
    service: makeVideoService(values.embed.service),
    id: values.embed.id,
  },
  external: values.external,
})

/**
 * make a video object
 */
export const makeVideo = (values: Option<Partial<Video>> = {}): Video => ({
  type: values?.type || ("local" as VideoType),
  video: values?.video || (null as string | null),
  external: values?.external || (null as string | null),
  embed: {
    service: values?.embed?.service || null,
    id: values?.embed?.id || "",
    url: values?.embed?.url || "",
  },
})
