import { useMemoKey, useSWR } from "@compo/hooks"
import { A, D } from "@mobily/ts-belt"
import { type Api } from "@services/dashboard"
import React from "react"
import { useLibrariesService } from "./service.context"

/**
 * useSwrLibrary
 */
export const useSwrLibrary = (libraryId: string) => {
  const { service, serviceKey } = useLibrariesService()

  const { data, mutate, ...props } = useSWR({
    fetch: service.id(libraryId).read,
    key: useMemoKey("dashboard-library", { serviceKey, libraryId }),
  })

  // mutation helper
  const mutateLibrary = (library: Partial<Api.LibraryWithRelations>) =>
    mutate((data) => data && { ...data, library: { ...data.library, ...library } }, {
      revalidate: false,
    })

  const mutateChildLibraries = (fn: (items: Api.Library[]) => Api.Library[]) =>
    mutate(
      (data) =>
        data && {
          ...data,
          library: D.set(data.library, "childLibraries", fn(data.library.childLibraries)),
        },
      { revalidate: false }
    )

  const mutateDocuments = (fn: (items: Api.LibraryDocument[]) => Api.LibraryDocument[]) =>
    mutate(
      (data) =>
        data && {
          ...data,
          library: D.set(data.library, "documents", fn(data.library.documents)),
        },
      { revalidate: false }
    )

  // memo data
  const library: Api.LibraryWithRelations | undefined = React.useMemo(() => data?.library, [data])

  const swrChildLibraries = {
    ...props,
    libraries: data?.library?.childLibraries ?? [],
    mutate: () => mutate(),
    update: (item: Api.Library) => mutateChildLibraries(A.map((f) => (f.id === item.id ? item : f))),
    append: (item: Api.Library) => mutateChildLibraries(A.append(item)),
    reject: (item: Api.Library) => mutateChildLibraries(A.filter((f) => f.id !== item.id)),
    rejectById: (id: string) => mutateChildLibraries(A.filter((f) => f.id !== id)),
  }

  const swr = {
    ...props,
    libraryId,
    isError: !props.isLoading && !data,
    mutate,
    mutateLibrary,
    updateDocument: (document: Api.LibraryDocument) =>
      mutateDocuments(A.map((d) => (d.id === document.id ? { ...d, ...document } : d))),
    appendDocument: (document: Api.LibraryDocument) => mutateDocuments(A.append(document)),
    rejectDocument: (document: Api.LibraryDocument) => mutateDocuments(A.filter((d) => d.id !== document.id)),
    rejectDocumentById: (id: string) => mutateDocuments(A.filter((d) => d.id !== id)),
    swrChildLibraries,
  }

  return { library, ...swr }
}

/**
 * SWRLibrary type
 */
export type SWRLibrary = ReturnType<typeof useSwrLibrary>
export type SWRSafeLibrary = Omit<SWRLibrary, "library" | "isLoading" | "isError"> & {
  library: Api.LibraryWithRelations
}
export type SWRChildLibraries = ReturnType<typeof useSwrLibrary>["swrChildLibraries"]
