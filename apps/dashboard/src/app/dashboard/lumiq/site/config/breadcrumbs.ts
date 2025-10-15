import { Dashboard } from "@compo/dashboard"
import routeTo from "."
import useParentBreadcrumbs from "../breadcrumbs"

const useBreadcrumbs = () => {
  const parent = useParentBreadcrumbs()
  return Dashboard.useBreadcrumbs(dictionary, ({ _ }) => [...parent, [_("breadcrumb"), routeTo()]])
}
const dictionary = {
  en: { breadcrumb: "Configuration" },
  fr: { breadcrumb: "Configuration" },
  de: { breadcrumb: "Konfiguration" },
}
export default useBreadcrumbs
