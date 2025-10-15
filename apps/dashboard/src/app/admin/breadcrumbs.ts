import { Dashboard } from "@compo/dashboard"
import adminIndexRouteTo from "."

const useBreadcrumbs = () => {
  return Dashboard.useBreadcrumbs(dictionary, ({ _ }) => [[_("breadcrumb"), adminIndexRouteTo()]])
}
const dictionary = {
  en: { breadcrumb: "Dashboard" },
  fr: { breadcrumb: "Tableau de bord" },
  de: { breadcrumb: "Dashboard" },
}
export default useBreadcrumbs
