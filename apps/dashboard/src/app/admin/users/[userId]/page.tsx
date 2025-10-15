import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { placeholder } from "@compo/utils"
import React from "react"
import useBreadcrumbs from "./breadcrumbs"
import { UserProvider } from "./context.provider"
import { useSwrUser } from "./swr"
import { UserAccount } from "./user.account"
import { UserHeader } from "./user.header"
import { UserLogs } from "./user.logs"
import { UserProfile } from "./user.profile"
import { UserSessions } from "./user.sessions"

/**
 * Admin users id page
 */
const Page: React.FC<{ userId: string }> = ({ userId }) => {
  const { _ } = useTranslation(dictionary)
  const breadcrumbs = useBreadcrumbs(userId)
  const { user, swr } = useSwrUser(userId)
  Dashboard.usePage(
    breadcrumbs,
    _("title", { name: placeholder(`${user?.profile.firstname} ${user?.profile.lastname}`, _("placeholder")) })
  )
  if (swr.isLoading) return <div>Loading...</div>
  if (swr.error || !user) return <div>Error: {swr.error?.message}</div>

  return (
    <UserProvider user={user} swr={swr}>
      <div className="flex flex-col gap-8">
        <UserHeader />
        <UserProfile />
        <UserAccount />
        <UserSessions />
        <UserLogs />
      </div>
    </UserProvider>
  )
}

export default Page

/**
 * translations
 */
const dictionary = {
  en: { title: "User details {{name}}", placeholder: "Unnamed user" },
  fr: { title: "Détails de l'utilisateur {{name}}", placeholder: "Utilisateur sans nom" },
  de: { title: "Benutzerdetails {{name}}", placeholder: "Unbenannter Benutzer" },
}
