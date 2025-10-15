import { Api } from "@/services"
import { Dashboard } from "@compo/dashboard"
import { useFolderPath } from "@compo/medias"
import { Ui } from "@compo/ui"
import { A, truncateText } from "@compo/utils"
import React from "react"
import routeTo from "."
import useParentBreadcrumbs from "../breadcrumbs"

const useBreadcrumbs = (folder: Api.MediaFolderWithRelations | null) => {
  const parent = useParentBreadcrumbs()
  const pathToFolder = useFolderPath(folder?.id)
  const breadcrumbs: Ui.BreadcrumbType[] = React.useMemo(
    () => A.map(pathToFolder, (folder) => [truncateText(folder.name, 18), routeTo(folder.id)] as const),
    [pathToFolder]
  )
  return Dashboard.useBreadcrumbs(dictionary, ({ _ }) => [...parent, [_("breadcrumb"), routeTo()], ...breadcrumbs])
}
const dictionary = {
  fr: { breadcrumb: "Gestionnaire de médias" },
  en: { breadcrumb: "Media manager" },
  de: { breadcrumb: "Medien-Manager" },
}
export default useBreadcrumbs
