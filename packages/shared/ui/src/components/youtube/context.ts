import React from "react"
import { F } from "@compo/utils"

/**
 * types
 */
type YoutubeMultipleContextType = {
  playing: string
  setPlaying: (playing: string) => void
}

/**
 * contexts
 */
export const YoutubeMultipleContext = React.createContext<YoutubeMultipleContextType>({
  playing: "",
  setPlaying: F.ignore,
})

/**
 * hooks
 */
export const useYoutubeMultiple = () => React.useContext(YoutubeMultipleContext)
