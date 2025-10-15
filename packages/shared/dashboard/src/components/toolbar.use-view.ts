import { usePersistedState } from "@compo/hooks"
import { z } from "@compo/utils"
import { CollectionViewType } from "./collection"

/**
 * useView hook for collections
 */
export const useView = (storageKey: string, defaultValue: CollectionViewType = "card") => {
  const [view, setView] = usePersistedState<NonNullable<CollectionViewType>>(
    defaultValue,
    storageKey,
    z.enum(["row", "card"]),
    localStorage
  )
  return [view, { view, setView }] as const
}
