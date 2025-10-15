import React from "react"
import { SlideVideo } from "./types"

/**
 * VideoSlide
 */
export const VideoSlide: React.FC<{ data: SlideVideo }> = (props) => {
  return (
    <div className="flex size-full p-28">
      <video width="auto" height="auto" controls className="mx-auto my-auto h-auto max-h-full w-full">
        {props.data.sources.map((source) => (
          <source key={source.src} src={source.src} type={source.type} />
        ))}
      </video>
    </div>
  )
}
