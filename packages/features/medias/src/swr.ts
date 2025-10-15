import { useMemoKey, useSWR } from "@compo/hooks"
import { A, ById, byId, match, P } from "@compo/utils"
import { type Api } from "@services/dashboard"
import React from "react"
import { KeyedMutator } from "swr"
import { useMediasService } from "./service.context"

/**
 * useSWRMedias
 */
export const useSWRMedias = (folderId: string | null): SWRMedias => {
  const { service, serviceKey } = useMediasService()

  // fetcher root
  const rootKey = useMemoKey("medias", { serviceKey })
  const rootFetcher = !folderId ? { key: rootKey, fetch: service.root } : null
  const root = useSWR(rootFetcher, { fallbackData, keepPreviousData: false })

  // fetcher folder by id
  const folderKey = useMemoKey("medias", { serviceKey, folderId })
  const folderFetcher = folderId ? { key: folderKey, fetch: service.folders.id(folderId).read } : null
  const folder = useSWR(folderFetcher, { keepPreviousData: false })

  // fetch all folder
  const allKey = useMemoKey("medias-all", { serviceKey })
  const allFetcher = { key: allKey, fetch: service.folders.all }
  const { data, mutate: mutateAll } = useSWR(allFetcher, { fallbackData: fallbackDataAll })
  const folderByIds: ById<Api.MediaFolderWithRelations> = React.useMemo(() => byId(data.folders), [data])
  const appendInAll = (folder: Api.MediaFolderWithRelations) =>
    void mutateAll(
      (data) => data && { ...data, folders: A.append(data.folders, folder) as Api.MediaFolderWithRelations[] }
    )
  const rejectInAll = (folder: Api.MediaFolderWithRelations) =>
    void mutateAll(
      (data) =>
        data && {
          ...data,
          folders: A.filter(data.folders, (f) => f.id !== folder.id) as Api.MediaFolderWithRelations[],
        }
    )
  const updateInAll = (folder: Api.MediaFolderWithRelations) =>
    void mutateAll(
      (data) =>
        data && {
          ...data,
          folders: A.map(data.folders, (f) => (f.id === folder.id ? folder : f)) as Api.MediaFolderWithRelations[],
        }
    )

  const { mutateFolders, mutateFiles, ...currentFolder } = match(folderId)
    .with(P.nullish, () => ({
      isLoading: root.isLoading,
      isError: !root.isLoading && !root.data,
      folders: root.data?.folders ?? [],
      files: root.data?.files ?? [],
      mutate: root.mutate,
      mutateFolders: (fn: (folders: Api.MediaFolderWithRelations[]) => Api.MediaFolderWithRelations[]) =>
        root.mutate((data) => data && { ...data, folders: fn(data.folders) }, {
          revalidate: false,
        }),
      mutateFiles: (fn: (files: Api.MediaFileWithRelations[]) => Api.MediaFileWithRelations[]) =>
        root.mutate((data) => data && { ...data, files: fn(data.files) }, { revalidate: false }),
    }))
    .otherwise(() => ({
      isLoading: folder.isLoading,
      isError: !folder.isLoading && !folder.data,
      folders: folder.data?.folder.folders ?? [],
      files: folder.data?.folder.files ?? [],
      mutate: folder.mutate,
      mutateFolders: (fn: (folders: Api.MediaFolderWithRelations[]) => Api.MediaFolderWithRelations[]) =>
        folder.mutate((data) => data && { ...data, folder: { ...data.folder, folders: fn(data.folder.folders) } }, {
          revalidate: false,
        }),
      mutateFiles: (fn: (files: Api.MediaFileWithRelations[]) => Api.MediaFileWithRelations[]) =>
        folder.mutate((data) => data && { ...data, folder: { ...data.folder, files: fn(data.folder.files) } }, {
          revalidate: false,
        }),
    }))

  return {
    ...currentFolder,
    mutateAll,
    service,
    folderId,
    folderByIds,
    updateFolder: (folder: Api.MediaFolderWithRelations) => {
      // not anymore in the folder
      if (folder.parentId !== folderId)
        mutateFolders((folders) => A.filter(folders, (f) => f.id !== folder.id) as Api.MediaFolderWithRelations[])
      // still in the folder
      else
        mutateFolders(
          (folders) => A.map(folders, (f) => (f.id === folder.id ? folder : f)) as Api.MediaFolderWithRelations[]
        )
      // update in all
      updateInAll(folder)
    },
    appendFolder: (folder: Api.MediaFolderWithRelations) => {
      mutateFolders((folders) => A.append(folders, folder) as Api.MediaFolderWithRelations[])
      appendInAll(folder)
    },
    rejectFolder: (folder: Api.MediaFolderWithRelations) => {
      mutateFolders((folders) => A.filter(folders, (f) => f.id !== folder.id) as Api.MediaFolderWithRelations[])
      rejectInAll(folder)
    },
    updateFile: (file: Api.MediaFileWithRelations) => {
      // not anymore in the folder
      if (file.folderId !== folderId)
        mutateFiles((files) => A.filter(files, (f) => f.id !== file.id) as Api.MediaFileWithRelations[])
      // still in the folder
      else mutateFiles((files) => A.map(files, (f) => (f.id === file.id ? file : f)) as Api.MediaFileWithRelations[])
    },
    appendFile: (file: Api.MediaFileWithRelations) =>
      mutateFiles((files) => A.append(files, file) as Api.MediaFileWithRelations[]),
    rejectFile: (file: Api.MediaFileWithRelations) =>
      mutateFiles((files) => A.filter(files, (f) => f.id !== file.id) as Api.MediaFileWithRelations[]),
  }
}

/**
 * types
 */
export type SWRMedias = {
  folderId: string | null
  folderByIds: ById<Api.MediaFolderWithRelations>
  mutateAll: KeyedMutator<{ folders: Api.MediaFolderWithRelations[] }>
  service: Api.MediaService
  // swr state
  isLoading: boolean
  isError: boolean
  // collections
  folders: Api.MediaFolderWithRelations[]
  files: Api.MediaFileWithRelations[]
  // mutation helpers
  mutate: () => void
  updateFolder: (folder: Api.MediaFolderWithRelations) => void
  appendFolder: (folder: Api.MediaFolderWithRelations) => void
  rejectFolder: (folder: Api.MediaFolderWithRelations) => void
  updateFile: (file: Api.MediaFileWithRelations) => void
  appendFile: (file: Api.MediaFileWithRelations) => void
  rejectFile: (file: Api.MediaFileWithRelations) => void
}

const fallbackData = { folders: [], files: [] }
const fallbackDataAll = { folders: [] }
