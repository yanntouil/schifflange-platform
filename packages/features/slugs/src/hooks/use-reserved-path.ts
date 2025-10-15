import { A, O } from "@compo/utils"
import React from "react"
import { useSWRSlugs } from "../swr"

/**
 * useReservedSlugs
 * return a list of paths excluded from related slug id
 */
export const useReservedPath = (id: string) => {
  const { slugs } = useSWRSlugs()
  const reservedPaths = React.useMemo(
    () => A.filterMap(slugs, (slug) => (slug.id !== id ? O.Some(slug.path) : O.None)),
    [slugs, id]
  )
  return reservedPaths
}
