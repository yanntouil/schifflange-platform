import { useLanguage } from "@compo/translations"
import { A, G } from "@compo/utils"
import { placeholder as servicePlaceholder, useDashboardService, type Api } from "@services/dashboard"
import React from "react"
import {} from "zustand"
import { extractItemFile } from "./utils"

type SyncHelpers = {
  translate: ReturnType<typeof useLanguage>["translate"]
  service: ReturnType<typeof useDashboardService>["service"]
  placeholder: ReturnType<typeof useDashboardService>["placeholder"]
  makePath: ReturnType<typeof useDashboardService>["service"]["makePath"]
  getImageUrl: ReturnType<typeof useDashboardService>["service"]["getImageUrl"]
  extractFile: (item: { files: Api.MediaFile[] }, id: Option<string>) => ExtractMediaFile | null
  extractFiles: (item: { files: Api.MediaFile[] }, ids: Option<string>[]) => ExtractMediaFile[]
}
type ExtractMediaFile = Omit<Api.MediaFile, "translations" | "url" | "previewUrl" | "thumbnailUrl"> & {
  url: string
  previewUrl: string
  thumbnailUrl: string | null
  translations: Api.MediaFileTranslation
}

/**
 * sync helpers
 */
export const useSyncHelpers = (): SyncHelpers => {
  const { translate } = useLanguage()
  const { service } = useDashboardService()
  const makePath = service.makePath
  const getImageUrl = service.getImageUrl
  const extractFile = React.useCallback(
    (item: { files: Api.MediaFile[] }, id: Option<string>): ExtractMediaFile | null => {
      const file = extractItemFile(item, id)
      if (!file) return null
      const translations = translate(file, servicePlaceholder.mediaFile) as Api.MediaFileTranslation
      return {
        ...file,
        url: makePath(file.url) ?? "",
        previewUrl: makePath(file.previewUrl) ?? "",
        thumbnailUrl: makePath(file.thumbnailUrl) ?? "",
        translations,
      }
    },
    [translate]
  )
  const extractFiles = React.useCallback(
    (item: { files: Api.MediaFile[] }, ids: Option<string>[]) => {
      return A.filterMap(ids, (id) => (G.isNotNullable(id) ? extractFile(item, id) : null))
    },
    [extractFile]
  )
  return {
    translate,
    service,
    placeholder: servicePlaceholder,
    makePath,
    getImageUrl,
    extractFile,
    extractFiles,
  }
}

export type { Api, SyncHelpers }
