import { service } from "@/services"
import { Dashboard } from "@compo/dashboard"
import { useSwrProject } from "@compo/projects"
import { useLanguage } from "@compo/translations"
import routeTo from "."
import useParentBreadcrumbs from "../breadcrumbs"

const useBreadcrumbs = (projectId: string) => {
  const { project, isLoading } = useSwrProject(projectId)
  const parent = useParentBreadcrumbs()
  const { translate } = useLanguage()
  React.useEffect(() => Dashboard.setIsLoading(isLoading), [isLoading])
  return Dashboard.useBreadcrumbs(dictionary, ({ _ }, p) => [
    ...parent,
    [project ? p(translate(project.seo, service.placeholder.seo).title, _("placeholder")) : undefined, routeTo(projectId)],
  ])
}
const dictionary = {
  en: {
    placeholder: "Untitled project",
  },
  fr: {
    placeholder: "Projet sans titre",
  },
  de: {
    placeholder: "Unbenanntes Projekt",
  },
}
export default useBreadcrumbs
