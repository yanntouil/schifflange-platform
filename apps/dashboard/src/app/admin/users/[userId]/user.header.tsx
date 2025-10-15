import { useAuth } from "@/features/auth/hooks/use-auth"
import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { placeholder } from "@compo/utils"
import { MoreHorizontal } from "lucide-react"
import React from "react"
import { UserAvatar } from "../users.avatar"
import { useUser } from "./context"
import { UserProvider } from "./context.provider"
import { UserMenu } from "./user.menu"

/**
 * UserHeader
 * display the header of the user page
 */
export const UserHeader: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { user, swr } = useUser()
  const { me } = useAuth()
  const isMe = me.id === user.id
  const fullname = placeholder(`${user.profile.firstname} ${user.profile.lastname}`, _("fullname-placeholder"))
  return (
    <div className="flex justify-between gap-2">
      <div className="flex items-center gap-4">
        <UserAvatar user={user} />
        <Dashboard.Title>
          {placeholder(fullname, _("fullname-placeholder"))}
          {isMe && <span className="text-muted-foreground ml-2 text-sm font-medium">({_("is-me")})</span>}
        </Dashboard.Title>
        <Ui.Badge
          tooltip={_(`status-tooltip-${user.status}`)}
          side="right"
          variant={match(user.status)
            .with("active", () => "default" as const)
            .with("pending", () => "outline" as const)
            .with("deleted", () => "destructive" as const)
            .with("suspended", () => "outline" as const)
            .exhaustive()}
        >
          {_(`status-${user.status}`)}
        </Ui.Badge>
      </div>
      <UserProvider user={user} swr={swr}>
        <Ui.DropdownMenu.Quick menu={<UserMenu />} className="min-w-[16rem]">
          <Ui.Tooltip.Quick tooltip={_("menu-tooltip")} side="left" asChild>
            <Ui.Button variant="ghost" icon size="sm">
              <MoreHorizontal aria-hidden />
              <Ui.SrOnly>{_("menu-tooltip")}</Ui.SrOnly>
            </Ui.Button>
          </Ui.Tooltip.Quick>
        </Ui.DropdownMenu.Quick>
      </UserProvider>

      {/* doesn't work : actions used to open the dialog crashes the browser
      <Ui.DropdownMenu.Quick menu={<UserMenu />} className="min-w-[16rem]">
        <Ui.Tooltip.Quick tooltip={_("menu-tooltip")} side="left" asChild>
          <Ui.Button variant="ghost" icon size="sm">
            <MoreHorizontal aria-hidden />
            <Ui.SrOnly>{_("menu-tooltip")}</Ui.SrOnly>
          </Ui.Button>
        </Ui.Tooltip.Quick>
      </Ui.DropdownMenu.Quick> */}
    </div>
  )
}

/**
 * translations
 */
const dictionary = {
  fr: {
    "fullname-placeholder": "Utilisateur anonyme",
    "is-me": "Vous",
    "menu-tooltip": "Gérer l'utilisateur",
    "status-active": "Actif",
    "status-pending": "En attente",
    "status-deleted": "Supprimé",
    "status-suspended": "Suspendu",
  },
  en: {
    "fullname-placeholder": "Anonymous user",
    "is-me": "You",
    "menu-tooltip": "Manage the user",
    "status-active": "Active",
    "status-pending": "Pending",
    "status-deleted": "Deleted",
    "status-suspended": "Suspended",
  },
  de: {
    "fullname-placeholder": "Anonymer Benutzer",
    "is-me": "Sie",
    "menu-tooltip": "Benutzer verwalten",
    "status-active": "Aktiv",
    "status-pending": "Ausstehend",
    "status-deleted": "Gelöscht",
    "status-suspended": "Gesperrt",
  },
}
