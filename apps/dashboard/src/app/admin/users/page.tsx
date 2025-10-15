import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import React from "react"
import useBreadcrumbs from "./breadcrumbs"
import { UsersProvider } from "./context.provider"
import { usersStore } from "./store"
import { Users } from "./users"

const { setPage, setLimit } = usersStore.actions
/**
 * Admin users page
 */
const Page: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const breadcrumbs = useBreadcrumbs()
  Dashboard.usePage(breadcrumbs, _("title"))
  return (
    <UsersProvider>
      <Users />
    </UsersProvider>
  )
}

export default Page

/**
 * translations
 */
const dictionary = {
  en: {
    title: "List of all users",
  },
  fr: {
    title: "Liste de tous les utilisateurs",
  },
  de: {
    title: "Liste aller Benutzer",
  },
}
