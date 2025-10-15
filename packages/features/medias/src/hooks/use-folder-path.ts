import { type Option } from "@compo/utils"
import { type Api } from "@services/dashboard"
import React from "react"
import { useMedias } from "../medias.context"
import { getFoldersPath } from "../utils"

export const useFolderPath = (folderId: Option<string>): Api.MediaFolder[] => {
  const { swr } = useMedias()
  const { folderByIds } = swr
  const path = React.useMemo(() => getFoldersPath(folderId ?? null, folderByIds).reverse(), [folderId, folderByIds])
  return path
}
