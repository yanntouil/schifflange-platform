import { Dashboard } from "@compo/dashboard"
import routeTo from "."
import useParentBreadcrumbs from "../breadcrumbs"

const useBreadcrumbs = () => {
  const parent = useParentBreadcrumbs()
  return Dashboard.useBreadcrumbs(dictionary, ({ _ }) => [...parent, [_("breadcrumb"), routeTo()]])
}
const dictionary = {
  en: { breadcrumb: "Forwards" },
  fr: { breadcrumb: "Redirections" },
  de: { breadcrumb: "Weiterleitungen" },
}
export default useBreadcrumbs
