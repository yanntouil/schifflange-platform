import { ById, byId, D, G } from "@compo/utils"
import { type Api } from "@services/dashboard"
import React from "react"
import { useSwrAllLibraries } from "../swr.libraries"

export const usePathToLibrary = (libraryId: string, to?: string): Api.Library[] => {
  const { libraries } = useSwrAllLibraries()
  const libraryByIds = byId(libraries)
  const path = React.useMemo(() => getPath(libraryId ?? null, libraryByIds, to).reverse(), [libraryId, libraryByIds])
  return path
}

const getPath = (id: string | null, byIds: ById<Api.Library>, to: string | undefined): Api.Library[] => {
  if (G.isNull(id)) return []
  const current = D.get(byIds, id)
  if (G.isNullable(current)) return []
  if (G.isNullable(to) ? G.isNullable(current.parentLibraryId) : to === current.id) return [current]
  return [current, ...getPath(current.parentLibraryId, byIds, to)]
}
