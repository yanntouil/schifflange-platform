import { Dashboard } from "@compo/dashboard"
import { type Api } from "@services/dashboard"
import routeTo from "."
import useParentBreadcrumbs from "../breadcrumbs"

const useBreadcrumbs = (menu: Api.Menu) => {
  const parent = useParentBreadcrumbs()
  return Dashboard.useBreadcrumbs(dictionary, ({ _ }, p) => [...parent, [p(menu.name, _("placeholder")), routeTo(menu.id)]])
}
const dictionary = {
  en: {
    placeholder: "Untitled menu",
  },
  fr: {
    placeholder: "Menu sans titre",
  },
  de: {
    placeholder: "Unbenanntes Menü",
  },
}
export default useBreadcrumbs
