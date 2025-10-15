import React from "react"
import { extensionIconMap } from "./extensions"
import { IconType, typeIconMap } from "./types"

export type FileIconProps = {
  extension: string
  fallbackIcon?: React.FC
} & React.SVGProps<SVGSVGElement>
export const FileIcon: React.FC<FileIconProps> = ({ extension, fallbackIcon = () => <></>, ...props }) => {
  const extensionData = extensionIconMap[extension]
  const Icon = extensionData?.component || typeIconMap[extensionData?.type as IconType]?.component || fallbackIcon
  return <Icon {...props} />
}
