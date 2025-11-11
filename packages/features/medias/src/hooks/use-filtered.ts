import { matchSorter, normString, usePersistedState, useSortable } from "@compo/hooks"
import { mediaFileToLightbox, useLightbox } from "@compo/lightbox"
import { useTranslation } from "@compo/localize"
import { useLanguage } from "@compo/translations"
import { A, S, T, pipe } from "@compo/utils"
import { type Api, placeholder as servicePlaceholder, useDashboardService } from "@services/dashboard"
import * as React from "react"
import { useMediasService } from "../service.context"
import { extensionToType, isMediaFolder } from "../utils"

export const useFiltered = (params: {
  folders: Api.MediaFolderWithRelations[]
  files: Api.MediaFileWithRelations[]
  hiddenIds?: string[]
  persistedKey: string
}) => {
  const { _ } = useTranslation(dictionary)
  const { serviceKey } = useMediasService()
  const {
    service: { makePath },
  } = useDashboardService()
  const { translate } = useLanguage()
  const { folders, files, hiddenIds = [], persistedKey } = params
  const prefixedKey = `medias-${serviceKey}-${persistedKey}`

  // search
  const [search, setSearch] = usePersistedState("", `${prefixedKey}-search`)
  const matchable = { search, setSearch }
  const matchInFile = React.useCallback(
    (items: Api.MediaFileWithRelations[]) =>
      matchSorter(items, normString(search), {
        keys: [
          (file) => translate(file, servicePlaceholder.mediaFile).name,
          "extension",
          ({ extension }) => {
            const type = extensionToType(extension)
            return _(`type-${type ?? "unknown"}`)
          },
        ],
      }),
    [search, translate, _]
  )
  const matchInFolder = React.useCallback(
    (items: Api.MediaFolderWithRelations[]) => matchSorter(items, normString(search), { keys: ["name"] }),
    [search]
  )

  // sort
  const [sortable, sortBy] = useSortable<Api.MediaFolderWithRelations | Api.MediaFileWithRelations>(
    `${prefixedKey}-sort`,
    {
      name: [
        (media) => (isMediaFolder(media) ? media.name : translate(media, servicePlaceholder.mediaFile).name),
        "asc",
        "alphabet",
      ],
      createdAt: [({ createdAt }) => T.parseISO(createdAt), "desc", "number"],
      updatedAt: [({ updatedAt }) => T.parseISO(updatedAt), "desc", "number"],
    },
    "updatedAt"
  )

  // reset
  const reset = () => {
    setSearch("")
    sortable.setSort({ field: "updatedAt", direction: "desc" })
  }

  // apply filters
  const filteredFiles = React.useMemo(
    () =>
      pipe(
        files,
        (files) => A.filter(files, ({ id }) => !hiddenIds.includes(id)) as Api.MediaFileWithRelations[],
        S.isEmpty(S.trim(matchable.search)) ? sortBy : matchInFile
      ) as Api.MediaFileWithRelations[],
    [files, matchable.search, matchInFile, hiddenIds, sortBy]
  )

  // prepare slides for the lightbox
  const { registerFile, unregisterFile } = useLightbox()
  React.useEffect(() => {
    filteredFiles.forEach((file) => {
      const lightboxFile = mediaFileToLightbox(file, translate(file, servicePlaceholder.mediaFile).name)
      if (lightboxFile) registerFile(lightboxFile)
    })
    return () => {
      filteredFiles.forEach((file) => unregisterFile(file.id))
    }
  }, [filteredFiles, registerFile, translate, makePath])

  const filteredFolders = React.useMemo(
    () =>
      pipe(
        folders,
        (folders) => A.filter(folders, ({ id }) => !hiddenIds.includes(id)) as Api.MediaFolderWithRelations[],
        S.isEmpty(S.trim(matchable.search)) ? sortBy : matchInFolder
      ) as Api.MediaFolderWithRelations[],
    [folders, matchInFolder, matchable.search, hiddenIds, sortBy]
  )
  return { reset, matchable, filteredFiles, filteredFolders, sortable }
}

/**
 * translations
 */
const dictionary = {
  en: {
    "type-image": "Image",
    "type-video": "Video",
    "type-audio": "Audio",
    "type-document": "Document",
    "type-pdf": "PDF",
    "type-archive": "Archive",
    "type-unknown": "",
  },
  fr: {
    "type-image": "Image",
    "type-video": "Vidéo",
    "type-audio": "Audio",
    "type-document": "Document",
    "type-pdf": "PDF",
    "type-archive": "Archive",
    "type-unknown": "",
  },
  de: {
    "type-image": "Bild",
    "type-video": "Video",
    "type-audio": "Audio",
    "type-document": "Dokument",
    "type-pdf": "PDF",
    "type-archive": "Archiv",
    "type-unknown": "",
  },
}
