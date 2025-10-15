import { service } from "@/service"
import { A, G, isUrlValid, match, S } from "@compo/utils"
import { Api } from "@services/site"

/**
 * Types
 */

/**
 * Information about a video from a streaming service
 */
export type VideoInfo = {
  service: "youtube" | "vimeo" | "dailymotion"
  id: string
}

/**
 * Embedded video details with service information
 */
export type VideoEmbed = {
  url: string
  service: "youtube" | "vimeo" | "dailymotion" | null
  id: string
}

/**
 * Available video source types
 */
export type VideoType = "local" | "embed" | "external"

/**
 * Complete video configuration with all possible sources
 */
export type Video = {
  type: VideoType
  video: string | null // Local file ID
  embed: VideoEmbed // Embedded video details
  external: string | null // External URL
}

/**
 * Utilities
 */

/**
 * Creates a video URL based on the video type and configuration
 * @param files - Array of media files to search for local videos
 * @param values - Video configuration object
 * @returns The video URL or null if not available
 */
export const makeVideoUrl = (files: Api.MediaFile[], values: Video) =>
  match(values)
    // Handle embedded videos from streaming services
    .with({ type: "embed" }, ({ embed }) => {
      if (G.isNotNullable(embed.service)) return generateVideoUrl({ service: embed.service, id: embed.id })
      return null
    })
    // Handle local video files stored in the media library
    .with({ type: "local" }, ({ video }) => {
      const url = A.find(files, ({ id }) => id === video)?.url
      return url ? service.makePath(url, true) : null
    })
    // Handle external video URLs
    .with({ type: "external" }, ({ external }) => {
      if (G.isNotNullable(external)) {
        // Handle blob URLs for preview purposes
        if (S.startsWith(external, "blob:")) return isUrlValid(S.replace(external, "blob:", "")) ? external : null
        // Validate regular URLs
        return isUrlValid(external) ? external : null
      }
      return null
    })
    .otherwise(() => null)

/**
 * Generates a standard video URL from a streaming service and video ID
 * @param service - The video streaming service
 * @param id - The video ID on that service
 * @returns The full URL to the video
 * @throws Error if the service is not supported
 */
export const generateVideoUrl = ({ service, id }: VideoInfo): string => {
  return match(service)
    .with("youtube", () => `https://www.youtube.com/watch?v=${id}`)
    .with("vimeo", () => `https://vimeo.com/${id}`)
    .with("dailymotion", () => `https://www.dailymotion.com/video/${id}`)
    .otherwise(() => {
      throw new Error(`Unsupported video service: ${service}`)
    })
}