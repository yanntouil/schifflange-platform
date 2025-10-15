import { Dashboard } from "@compo/dashboard"
import routeTo from "."

const useBreadcrumbs = () => {
  return Dashboard.useBreadcrumbs(dictionary, ({ _ }) => [[_("breadcrumb"), routeTo()]])
}
const dictionary = {
  en: { breadcrumb: "Dashboard" },
  fr: { breadcrumb: "Tableau de bord" },
  de: { breadcrumb: "Dashboard" },
}
export default useBreadcrumbs
