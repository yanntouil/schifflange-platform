import { Api } from "@/services"
import { useTranslation } from "@compo/localize"
import { variants } from "@compo/ui"
import { cxm, placeholder } from "@compo/utils"
import { Glasses } from "lucide-react"
import React from "react"
import { Link } from "wouter"
import adminUsersIdRouteTo from "./[userId]"
import { UserAvatar } from "./users.avatar"

/**
 * UserDetails
 * display the details of the user or a placeholder
 */
export const UserDetails: React.FC<{
  user: Option<(Api.User & Api.WithEmail) | Api.User>
  classNames?: { wrapper?: string; image?: string; fallback?: string }
  size?: string
}> = ({ user, classNames, size = "size-8" }) => {
  const { _ } = useTranslation(dictionary)
  if (!user)
    return (
      <div className="inline-flex items-center gap-2">
        <span className="bg-muted text-muted-foreground flex size-8 items-center justify-center rounded-full">
          <Glasses className="size-4" aria-hidden />
        </span>
        <span className="truncate font-medium">{_("created-by-unknown")}</span>
      </div>
    )
  const { firstname, lastname } = user.profile
  const fullname = placeholder(`${firstname} ${lastname}`, _("created-by-placeholder"))
  const email = "email" in user ? user.email : null
  return (
    <div className="inline-flex items-center gap-2">
      <UserAvatar user={user} size="size-8" />
      <div className="space-y-.5">
        <Link to={adminUsersIdRouteTo(user.id)} className={cxm("truncate font-medium", variants.link())}>
          {fullname}
        </Link>
        {email && <div className="text-muted-foreground text-xs">{email}</div>}
      </div>
    </div>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    "created-by-unknown": "Unknown user",
    "created-by-placeholder": "Unnamed user",
  },
  fr: {
    "created-by-unknown": "Utilisateur inconnu",
    "created-by-placeholder": "Utilisateur sans nom",
  },
  de: {
    "created-by-unknown": "Unbekannter Benutzer",
    "created-by-placeholder": "Unbenannter Benutzer",
  },
}
