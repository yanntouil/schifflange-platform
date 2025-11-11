import { Ui } from "@compo/ui"
import { A, G } from "@compo/utils"
import React from "react"
import { FileLightboxMenu } from "./components/files/menu"
import { useMedias } from "./medias.context"

/**
 * MediasLightboxProvider
 */
type MediasLightboxProviderProps = {
  children: React.ReactNode
}
export const MediasLightboxProvider: React.FC<MediasLightboxProviderProps> = ({ children }) => {
  const { swr } = useMedias()
  const menubar = React.useCallback(
    (data: Ui.SlideData) => {
      const file = A.find(swr.files, (f) => f.id === data.id)
      return G.isNotNullable(file) ? <FileLightboxMenu item={file} /> : null
    },
    [swr.files]
  )
  return (
    <Ui.Lightbox.Root>
      {children}
      <Ui.Lightbox.Viewer menubar={menubar} />
    </Ui.Lightbox.Root>
  )
}

/**
 * LightboxProvider
 */
type LightboxProviderProps = {
  children: React.ReactNode
}
export const LightboxProvider: React.FC<LightboxProviderProps> = ({ children }) => {
  // const menubar = React.useCallback(
  //   (data: Ui.SlideData) => {
  //     const file = A.find(fileList, (f) => f.id === data.id)
  //     return G.isNotNullable(file) ? <FileLightboxMenu item={file} /> : null
  //   },
  //   [fileList]
  // )
  return (
    <Ui.Lightbox.Root>
      {children}
      <Ui.Lightbox.Viewer /*menubar={menubar}*/ />
    </Ui.Lightbox.Root>
  )
}
