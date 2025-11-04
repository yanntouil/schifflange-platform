import { Dashboard } from "@compo/dashboard"
import routeTo from "."
import useParentBreadcrumbs from "../breadcrumbs"

const useBreadcrumbs = () => {
  const parent = useParentBreadcrumbs()
  return Dashboard.useBreadcrumbs(dictionary, ({ _ }) => [...parent, [_("breadcrumb"), routeTo()]])
}
const dictionary = {
  en: { breadcrumb: "Council Meetings" },
  fr: { breadcrumb: "Réunions du conseil communal" },
  de: { breadcrumb: "Gemeinderatssitzungen" },
}
export default useBreadcrumbs
