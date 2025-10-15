import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { A, truncateText } from "@compo/utils"
import { useFolderPath } from "./use-folder-path"

/**
 * useBreadcrumbs
 */
export const useBreadcrumbs = (current: string | null, setCurrent: (id: string | null) => void) => {
  const { _ } = useTranslation(dictionary)
  const folderPath = useFolderPath(current)
  const breadcrumbs = A.map(
    folderPath,
    ({ name, id }) => [truncateText(name, 30), () => setCurrent(id)] as Ui.BreadcrumbType
  )
  const root: Ui.BreadcrumbType = [_("root-title"), () => setCurrent(null)]
  return { breadcrumbs: [root, ...breadcrumbs] }
}

const dictionary = {
  en: {
    "root-title": "Medias manager",
  },
  fr: {
    "root-title": "Gestionnaire de médias",
  },
  de: {
    "root-title": "Medien-Manager",
  },
}
