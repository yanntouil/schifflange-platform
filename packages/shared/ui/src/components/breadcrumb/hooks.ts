import { Translation, useTranslation } from "@compo/localize"
import { BreadcrumbType } from "./breadcrumbs"

/**
 * useBreadcrumbs
 */
export const useTranslatedBreadcrumbs = (
  dictionary: Translation,
  fn: (t: ReturnType<typeof useTranslation>) => BreadcrumbType[]
) => {
  const t = useTranslation(dictionary)
  return fn(t)
}
