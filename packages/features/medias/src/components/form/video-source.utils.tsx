import { A } from "@compo/utils"
import { type Api } from "@services/dashboard"

/**
 * Types
 */
export type FormVideoSourceValue = {
  type: Api.VideoType
  title: string
  cover: Api.MediaFile | null
  embed: Api.VideoEmbed
  hosted: VideoHosted
}
type VideoHosted = {
  width: number
  height: number
  sources: VideoSource[]
  tracks: VideoTrack[]
  transcript: string
}
type VideoSource = {
  file: Api.MediaFile | null
  url: string
  type: Api.VideoMime
}
type VideoTrack = {
  file: Api.MediaFile | null
  url: string
  type: Api.VideoTrackType
  srclang: string
}
/**
 * utils
 */
export const makeVideoValue = (value: Partial<Api.Video> = {}, files: Api.MediaFile[] = []): FormVideoSourceValue => {
  const { cover, hosted, ...rest } = value
  const formValue: FormVideoSourceValue = {
    type: value.type ?? "hosted",
    title: value.title ?? "",
    embed: {
      id: value.embed?.id ?? "",
      url: value.embed?.url ?? "",
      service: value.embed?.service ?? "youtube",
    },
    cover: A.find(files, ({ id }) => id === cover) ?? null,
    hosted: {
      width: value.hosted?.width ?? 0,
      height: value.hosted?.height ?? 0,
      sources: A.map(value.hosted?.sources ?? [], ({ file, ...source }) => ({
        ...source,
        file: A.find(files, ({ id }) => id === file) ?? null,
      })) as VideoSource[],
      tracks: A.map(value.hosted?.tracks ?? [], ({ file, ...track }) => ({
        ...track,
        file: A.find(files, ({ id }) => id === file) ?? null,
      })),
      transcript: value.hosted?.transcript ?? "",
    },
  }
  return formValue
}
export const prepareVideoPayload = (value: FormVideoSourceValue): Api.Video => {
  const { cover, hosted, ...rest } = value
  const payload: Api.Video = {
    ...rest,
    cover: cover?.id ?? null,
    hosted: {
      ...hosted,
      sources: A.map(hosted.sources, ({ file, ...source }) => ({
        ...source,
        file: file?.id ?? null,
      })),
      tracks: A.map(hosted.tracks, ({ file, ...track }) => ({
        ...track,
        file: file?.id ?? null,
      })),
    },
  }
  return payload
}
