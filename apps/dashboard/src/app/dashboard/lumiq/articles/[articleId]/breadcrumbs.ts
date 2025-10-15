import { service } from "@/services"
import { useSwrArticle } from "@compo/articles"
import { Dashboard } from "@compo/dashboard"
import { useLanguage } from "@compo/translations"
import routeTo from "."
import useParentBreadcrumbs from "../breadcrumbs"

const useBreadcrumbs = (articleId: string) => {
  const { article, isLoading } = useSwrArticle(articleId)
  const parent = useParentBreadcrumbs()
  const { translate } = useLanguage()
  React.useEffect(() => Dashboard.setIsLoading(isLoading), [isLoading])
  return Dashboard.useBreadcrumbs(dictionary, ({ _ }, p) => [
    ...parent,
    [article ? p(translate(article.seo, service.placeholder.seo).title, _("placeholder")) : undefined, routeTo(articleId)],
  ])
}
const dictionary = {
  en: {
    placeholder: "Untitled article",
  },
  fr: {
    placeholder: "Article sans titre",
  },
  de: {
    placeholder: "Unbenannter Artikel",
  },
}
export default useBreadcrumbs
