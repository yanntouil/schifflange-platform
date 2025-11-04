export type Video = {
  type: VideoType
  title: string
  cover: string | null
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
  file: string | null
  url: string
  type: VideoMime
}
export type VideoTrack = {
  file: string | null
  url: string
  type: VideoTrackType
  srclang: string
}
export type VideoType = "hosted" | "embed"
export type VideoEmbedService = "vimeo" | "dailymotion" | "youtube"
export type VideoTrackType = "subtitles"
export type VideoMime =
  | "video/mp4"
  | "video/webm"
  | "video/ogg"
  | "video/quicktime"
  | "video/x-matroska"
  | "application/vnd.apple.mpegurl"
  | "application/x-mpegURL"
  | "application/dash+xml"
  | "video/mp2t"
