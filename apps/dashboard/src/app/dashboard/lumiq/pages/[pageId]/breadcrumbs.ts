import { service } from "@/services"
import { Dashboard } from "@compo/dashboard"
import { useSwrPage } from "@compo/pages"
import { useLanguage } from "@compo/translations"
import routeTo from "."
import useParentBreadcrumbs from "../breadcrumbs"

const useBreadcrumbs = (pageId: string) => {
  const { page, isLoading } = useSwrPage(pageId)
  const parent = useParentBreadcrumbs()
  const { translate } = useLanguage()
  React.useEffect(() => Dashboard.setIsLoading(isLoading), [isLoading])
  return Dashboard.useBreadcrumbs(dictionary, ({ _ }, p) => [
    ...parent,
    [page ? p(translate(page.seo, service.placeholder.seo).title, _("placeholder")) : undefined, routeTo(pageId)],
  ])
}
const dictionary = {
  en: {
    placeholder: "Untitled page",
  },
  fr: {
    placeholder: "Page sans titre",
  },
  de: {
    placeholder: "Unbenannte Seite",
  },
}
export default useBreadcrumbs
