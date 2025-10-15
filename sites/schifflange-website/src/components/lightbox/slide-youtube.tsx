"use client"

import { useElementSize } from "@compo/hooks"
import React from "react"
import YouTubePlayer from "react-player/youtube"
import { SlideYoutube } from "./types"

/**
 * YoutubeSlide
 */
export const YoutubeSlide: React.FC<{ data: SlideYoutube }> = ({ data }) => {
  const ref = React.useRef<HTMLDivElement>(null)
  const [width, height] = useElementSize(ref)
  const [optimalWidth, optimalHeight] = React.useMemo(() => {
    const containerRatio = width / height
    const videoRatio = 16 / 9
    if (containerRatio > videoRatio) {
      return [Math.round(height * videoRatio), Math.round(height)]
    } else {
      return [Math.round(width), Math.round(width / videoRatio)]
    }
  }, [width, height])
  return (
    <div className='flex size-full px-[88px] pb-8 pt-20' ref={ref}>
      <div className='mx-auto my-auto max-h-full max-w-full' style={{ width: optimalWidth, height: optimalHeight }}>
        <YouTubePlayer
          url={`https://www.youtube.com/watch?v=${data.youtubeId}`}
          title={data.alt}
          width={optimalWidth}
          height={optimalHeight}
        />
      </div>
    </div>
  )
}
