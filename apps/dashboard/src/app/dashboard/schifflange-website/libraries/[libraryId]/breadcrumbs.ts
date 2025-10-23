import { Dashboard } from "@compo/dashboard"
import { usePathToLibrary } from "@compo/libraries"
import { useTranslation } from "@compo/localize"
import { useLanguage } from "@compo/translations"
import { Ui } from "@compo/ui"
import { A, placeholder, truncateText } from "@compo/utils"
import { placeholder as servicePlaceholder } from "@services/dashboard"
import React from "react"
import routeTo from "."
import useParentBreadcrumbs from "../breadcrumbs"

const useBreadcrumbs = (libraryId: string) => {
  const { _ } = useTranslation(dictionary)
  const parent = useParentBreadcrumbs()
  const { translate } = useLanguage()
  const path = usePathToLibrary(libraryId)
  const breadcrumbs: Ui.BreadcrumbType[] = React.useMemo(
    () =>
      A.map(path, (library) => {
        const translated = translate(library, servicePlaceholder.library)
        const name = placeholder(translated.title, _("placeholder"))
        const truncatedName = truncateText(name, 18)
        const route = routeTo(library.id)
        return [truncatedName, route] as const
      }),
    [path, translate, _]
  )

  return Dashboard.useBreadcrumbs(dictionary, ({ _ }, p) => [...parent, ...breadcrumbs])
}
const dictionary = {
  en: { placeholder: "Unnamed library" },
  fr: { placeholder: "Bibliothèque sans nom" },
  de: { placeholder: "Bibliothek ohne Name" },
}
export default useBreadcrumbs
