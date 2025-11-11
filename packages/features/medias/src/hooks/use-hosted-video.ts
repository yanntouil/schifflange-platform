import { A, G, O } from "@compo/utils"
import { type Api } from "@services/dashboard"
import React from "react"
import { extractFile } from "../utils"

/**
 * useHostedVideo
 * @description Hook to populate the sources and tracks with the files
 * @param video
 * @param files
 * @returns { sources: Api.VideoSource[], tracks: Api.VideoTrack[] }
 */
export const useHostedVideo = (video: Api.Video, files: Api.MediaFileWithRelations[]) => {
  // populate the sources and tracks with the files
  const sources = React.useMemo(
    () =>
      A.filterMap(video.hosted.sources, (source) => {
        const file = extractFile(source.file, files)
        if (G.isNullable(file)) return O.None
        return O.Some({ ...source, file: file })
      }),
    [video.hosted.sources, files]
  )

  // populate the tracks with the files
  const tracks = React.useMemo(
    () =>
      A.filterMap(video.hosted.tracks, (track) => {
        const file = extractFile(track.file, files)
        if (G.isNullable(file)) return O.None
        return O.Some({ ...track, file: file })
      }),
    [video.hosted.tracks, files]
  )
  const hasVideo = video.type === "hosted" && sources.length > 0
  return {
    sources,
    tracks,
    hasVideo,
  }
}
