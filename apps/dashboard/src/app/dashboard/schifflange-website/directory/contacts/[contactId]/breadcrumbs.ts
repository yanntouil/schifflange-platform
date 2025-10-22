import { Dashboard } from "@compo/dashboard"
import { useSwrContact } from "@compo/directory"
import routeTo from "."
import useParentBreadcrumbs from "../breadcrumbs"

const useBreadcrumbs = (contactId: string) => {
  const parent = useParentBreadcrumbs()
  const { contact, isLoading } = useSwrContact(contactId)
  React.useEffect(() => Dashboard.setIsLoading(isLoading), [isLoading])
  return Dashboard.useBreadcrumbs(dictionary, ({ _ }, p) => [
    ...parent,
    [contact ? p(`${contact.firstName} ${contact.lastName}`, _("placeholder")) : undefined, routeTo(contactId)],
  ])
}
const dictionary = {
  en: { placeholder: "Contact without name" },
  fr: { placeholder: "Contact sans nom" },
  de: { placeholder: "Kontakt ohne Name" },
}
export default useBreadcrumbs
