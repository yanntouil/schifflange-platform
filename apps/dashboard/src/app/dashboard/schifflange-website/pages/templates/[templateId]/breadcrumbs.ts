import { service } from "@/services"
import { Dashboard } from "@compo/dashboard"
import { useSwrTemplate } from "@compo/templates"
import { useLanguage } from "@compo/translations"
import routeTo from "."
import useParentBreadcrumbs from "../breadcrumbs"

const useBreadcrumbs = (templateId: string) => {
  const { template, isLoading } = useSwrTemplate(templateId)
  const parent = useParentBreadcrumbs()
  const { translate } = useLanguage()
  React.useEffect(() => Dashboard.setIsLoading(isLoading), [isLoading])
  return Dashboard.useBreadcrumbs(dictionary, ({ _ }, p) => [
    ...parent,
    [template ? p(translate(template, service.placeholder.template).title, _("placeholder")) : undefined, routeTo(templateId)],
  ])
}
const dictionary = {
  en: {
    placeholder: "Untitled template",
  },
  fr: {
    placeholder: "Modèle sans titre",
  },
  de: {
    placeholder: "Unbenanntes Template",
  },
}
export default useBreadcrumbs
