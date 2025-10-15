import { Dashboard } from "@compo/dashboard"
import routeTo from "."
import useParentBreadcrumbs from "../breadcrumbs"
import { useSwrUser } from "./swr"

const useBreadcrumbs = (id: string) => {
  const parent = useParentBreadcrumbs()
  const { user, swr } = useSwrUser(id)
  React.useEffect(() => Dashboard.setIsLoading(swr.isLoading), [swr.isLoading])
  return Dashboard.useBreadcrumbs(dictionary, ({ _ }, placeholder) => [
    ...parent,
    [placeholder(`${user?.profile.firstname} ${user?.profile.lastname}`, _("placeholder")), routeTo(id)],
  ])
}
const dictionary = {
  en: { placeholder: "Unnamed user" },
  fr: { placeholder: "Utilisateur sans nom" },
  de: { placeholder: "Unbenannter Benutzer" },
}
export default useBreadcrumbs
