import { D } from "@compo/utils"
import { extensionIconMap } from "./extensions"
import { IconType, typeIconMap } from "./types"

/**
 * Get the color of the extension or type
 */
export const getExtensionColors = (
  extension: string
):
  | {
      background: string
      foreground: string
      icon: string
    }
  | undefined => {
  const extensionData = extensionIconMap[extension]
  if (!extensionData) return undefined
  const typeData = typeIconMap[extensionData.type]
  const background = extensionData?.background || typeData.background
  const foreground = extensionData?.foreground || typeData.foreground
  const icon = extensionData?.icon || typeData.icon
  return { background, foreground, icon }
}

/**
 * Get the color of the extension or type
 */
export const isFileExtensionIcon = (extension: string): boolean => {
  return !!extensionIconMap[extension]
}

/**
 * Get the type of the extension
 */
export const getFileExtensionType = (extension: string): IconType => {
  const extensionData = D.get(extensionIconMap, extension)
  return extensionData?.type || "unknown"
}
