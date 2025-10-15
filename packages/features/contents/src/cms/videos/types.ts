import { FormVideoValue } from "@compo/form"
import { Api } from "@services/dashboard"

/**
 * available video types
 */
export type VideoType = "local" | "embed" | "external"

/**
 * video object (used in the content to describe the video)
 */
export type Video = {
  type: VideoType
  video: string | null
  embed: FormVideoValue
  external: string | null
}

/**
 * form video values (used in the form to create a video)
 */
export type FormVideoValues = {
  type: VideoType
  file: Api.MediaFile | null
  embed: FormVideoValue
  external: string | null
}
