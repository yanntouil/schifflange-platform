import { A, D, G, O } from '@mobily/ts-belt'
import vine from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'

/**
 * types
 */
export type Video = {
  type: 'hosted' | 'embed'
  title: string
  cover: string | null // related file id
  embed: VideoEmbed
  hosted: VideoHosted
}
export type VideoEmbed = {
  id: string
  url: string
  service: VideoEmbedService
}
export type VideoHosted = {
  width: number
  height: number
  sources: VideoSource[]
  tracks: VideoTrack[]
  transcript: string
}
export type VideoSource = {
  file: string | null // related file id
  url: string
  type: VideoMime
}
export type VideoTrack = {
  file: string | null // related file id
  url: string
  type: VideoTrackType
  srclang: string // e.g. 'fr', 'en'
}

/**
 * constants
 */
export const videoTypes = ['embed', 'hosted'] as const
export type VideoType = (typeof videoTypes)[number]
export const videoTypesDefault = videoTypes[0]

export const videoEmbedServices = ['vimeo', 'dailymotion', 'youtube'] as const
export type VideoEmbedService = (typeof videoEmbedServices)[number]
export const videoEmbedServicesDefault = videoEmbedServices[0]

export const videoTrackTypes = ['subtitles'] as const
export type VideoTrackType = (typeof videoTrackTypes)[number]
export const videoTrackTypesDefault = videoTrackTypes[0]

export const videoMimes = [
  { mime: 'video/mp4', extension: 'mp4' },
  { mime: 'video/webm', extension: 'webm' },
  { mime: 'video/ogg', extension: 'ogg' },
  { mime: 'video/quicktime', extension: 'mov' },
  { mime: 'video/x-matroska', extension: 'mkv' },
  { mime: 'application/vnd.apple.mpegurl', extension: 'm3u8' },
  { mime: 'application/x-mpegURL', extension: 'm3u8' },
  { mime: 'application/dash+xml', extension: 'mpd' },
  { mime: 'video/mp2t', extension: 'ts' },
] as const
export const videoMimesEnums = A.map([...videoMimes], D.prop('mime'))
export type VideoMime = (typeof videoMimes)[number]['mime']
export const videoMimesDefault = videoMimes[0]['mime']

/**
 * utils
 */
export const makeVideo = (values: Option<Partial<Video>> = {}) => ({
  type: videoTypes.includes(values?.type) ? values?.type : videoTypesDefault,
  title: makeStringOrEmpty(values?.title),
  cover: makeStringOrNull(values?.cover),
  embed: makeVideoEmbed(values?.embed),
  hosted: makeVideoHosted(values?.hosted),
})
export const makeVideoType = (type: unknown): VideoType =>
  videoTypes.includes(type as VideoType) ? (type as VideoType) : videoTypesDefault
export const makeVideoEmbed = (values: Option<Partial<VideoEmbed>> = {}): VideoEmbed => ({
  id: makeStringOrEmpty(values?.id),
  url: makeStringOrEmpty(values?.url),
  service: makeVideoEmbedService(values?.service),
})
export const makeVideoEmbedService = (service: unknown): VideoEmbedService =>
  videoEmbedServices.includes(service as VideoEmbedService)
    ? (service as VideoEmbedService)
    : videoEmbedServicesDefault
export const makeVideoHosted = (values: Option<Partial<VideoHosted>> = {}): VideoHosted => ({
  width: makeNumberOrZero(values?.width),
  height: makeNumberOrZero(values?.height),
  sources: A.map(values?.sources || [], makeVideoSource),
  tracks: A.map(values?.tracks || [], makeVideoTrack),
  transcript: makeStringOrEmpty(values?.transcript),
})
export const makeVideoSource = (values: Option<Partial<VideoSource>> = {}): VideoSource => ({
  file: makeStringOrNull(values?.file),
  url: makeStringOrEmpty(values?.url),
  type: makeVideoMime(values?.type),
})
export const makeVideoTrack = (values: Option<Partial<VideoTrack>> = {}): VideoTrack => ({
  file: makeStringOrNull(values?.file),
  url: makeStringOrEmpty(values?.url),
  type: makeVideoTrackType(values?.type),
  srclang: makeStringOrEmpty(values?.srclang) || 'en',
})
export const makeVideoTrackType = (type: unknown): VideoTrackType =>
  videoTrackTypes.includes(type as VideoTrackType)
    ? (type as VideoTrackType)
    : videoTrackTypesDefault
export const makeVideoMime = (mime: unknown): VideoMime =>
  videoMimes.find((m) => m.mime === String(mime).trim().toLowerCase())?.mime ?? videoMimesDefault

export const guessMimeFromUrl = (url: string): VideoMime => {
  const u = url.toLowerCase().split('?')[0]
  const mime = videoMimes.find((mime) => u.endsWith(`.${mime.extension}`))?.mime
  return mime ?? videoMimesDefault
}
export const guessMimeFromExtension = (extension: string): VideoMime => {
  const e = extension.toLowerCase()
  const mime = videoMimes.find((mime) => e === mime.extension)?.mime
  return mime ?? videoMimesDefault
}

/**
 * local helpers
 */
const makeStringOrNull = (value: unknown): string | null => (G.isString(value) ? value : null)
const makeStringOrEmpty = (value: unknown): string => (G.isString(value) ? value : '')
const makeNumberOrZero = (value: unknown): number => (G.isNumber(value) ? value : 0)

/**
 * validators
 */

export const vineVideoType = vine
  .object({
    type: vine.enum(videoTypes).optional(),
    title: vine.string().optional(),
    embed: vine
      .object({
        id: vine.string().optional(),
        url: vine.string().optional(),
        service: vine.enum(videoEmbedServices).optional(),
      })
      .optional(),
    hosted: vine
      .object({
        width: vine.number().optional(),
        height: vine.number().optional(),
        sources: vine
          .array(
            vine.object({
              file: vine.string().uuid().optional(),
              url: vine.string().optional(),
              type: vine.enum(videoMimesEnums).optional(),
            })
          )
          .optional(),
        tracks: vine
          .array(
            vine.object({
              file: vine.string().uuid().optional(),
              url: vine.string().optional(),
              type: vine.enum(videoTrackTypes).optional(),
              srclang: vine.string().optional(),
            })
          )
          .optional(),
        transcript: vine.string().optional(),
      })
      .optional(),
  })
  .optional()

const videoValidator = vine.compile(vineVideoType)
export type VideoValidator = Infer<typeof videoValidator>

/**
 * extract file ids
 */
export const extractFilesFromVideo = (video: NonNullable<VideoValidator>) => {
  const sourceFileIds = A.filterMap(video.hosted?.sources ?? [], ({ file }) =>
    G.isNotNullable(file) ? O.Some(file) : O.None
  )
  const trackFileIds = A.filterMap(video.hosted?.tracks ?? [], ({ file }) =>
    G.isNotNullable(file) ? O.Some(file) : O.None
  )
  return A.uniq(A.concat(sourceFileIds, trackFileIds))
}
