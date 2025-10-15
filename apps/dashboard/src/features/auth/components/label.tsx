import { useTranslation } from "@compo/localize"
import { Icon } from "@compo/ui"
import { placeholder } from "@compo/utils"
import React from "react"
import { useAuth } from "../hooks/use-auth"
import { UserAvatar } from "./avatar"

/**
 * AuthLabel
 * display user avatar, name and email
 */
type AuthLabelProps = {
  classNames?: {
    avatar?: string
    header?: string
    name?: string
    email?: string
  }
}
export const AuthLabel = React.forwardRef<Icon.UserHandle, AuthLabelProps>(({ classNames }, ref) => {
  const { _ } = useTranslation(dictionary)
  const { me } = useAuth()
  const fullName = placeholder(`${me.profile?.firstname} ${me.profile?.lastname}`, _("user-placeholder"))

  return (
    <>
      <UserAvatar user={me} ref={ref} className={classNames?.avatar} />
      <div className={cxm("grid flex-1 text-left", classNames?.header)}>
        <span className={cxm("truncate text-sm/none font-medium", classNames?.name)}>{fullName}</span>
        <span className={cxm("text-muted-foreground truncate text-xs/none font-normal", classNames?.email)}>{me.email}</span>
      </div>
    </>
  )
})

const dictionary = {
  fr: {
    "user-placeholder": "Utilisateur anonyme",
    tooltip: "Ouvrir le menu utilisateur",
  },
  en: {
    "user-placeholder": "Anonymous user",
    tooltip: "Open user menu",
  },
  de: {
    "user-placeholder": "Anonymer Benutzer",
    tooltip: "Benutzer-Menü öffnen",
  },
}
