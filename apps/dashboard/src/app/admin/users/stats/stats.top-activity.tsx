import { Api } from "@/services"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { placeholder, T } from "@compo/utils"
import millify from "millify"
import React from "react"
import { Link } from "wouter"
import adminUsersIdRouteTo from "../[userId]"
import { UserAvatar } from "../users.avatar"

/**
 * TopActivityStats
 * Display the top activity of the users
 */
export const TopActivityStats: React.FC<React.ComponentProps<"div"> & { stats: Api.Admin.UserStats }> = ({ stats, ...props }) => {
  const { _, formatDistance } = useTranslation(dictionary)
  const { topActiveUsers } = stats
  const usersByRole = [
    { label: _("users-by-role-superadmin"), count: stats.usersByRole?.superadmin ?? 0 },
    { label: _("users-by-role-admin"), count: stats.usersByRole?.admin ?? 0 },
    { label: _("users-by-role-member"), count: stats.usersByRole?.member ?? 0 },
  ]

  const listCx = cxm(
    "flex flex-col gap-3",
    "[&>li]:tracking-relaxed [&>li]:flex [&>li]:items-center [&>li]:justify-between [&>li]:gap-8 [&>li]:text-sm",
    "[&>li>span]:first:line-clamp-1 [&>li>span]:first:flex [&>li>span]:first:items-center [&>li>span]:first:gap-2",
    "[&>li>span]:last:text-base/none [&>li>span]:last:font-medium",
    "[&>li_svg]:size-5 [&>li_svg]:stroke-[1.4]"
  )
  return (
    <Ui.Card.Root {...props}>
      <Ui.Card.Header>
        <Ui.Card.Title level={2}>{_("title")}</Ui.Card.Title>
        <Ui.Card.Description>{_("description")}</Ui.Card.Description>
      </Ui.Card.Header>
      <Ui.Card.Content>
        <p className="flex items-center justify-end">
          <span className="text-chart-1 text-sm font-medium">{_("sessions")}</span>
        </p>
        <ul className={cxm(listCx)}>
          {topActiveUsers.map(({ sessionCount, lastActiveAt, ...user }) => (
            <li key={user.id}>
              <span className="inline-flex items-center gap-4">
                <UserAvatar user={user} />
                <span className="block space-y-0.5">
                  <Link to={adminUsersIdRouteTo(user.id)} className="block truncate font-medium">
                    {placeholder(`${user.profile.firstname} ${user.profile.lastname}`, _("fullname-placeholder"))}
                  </Link>
                  <span className="text-muted-foreground block text-xs/none">
                    {_("last-activity", {
                      date: lastActiveAt ? formatDistance(T.parseISO(lastActiveAt)) : _("last-activity-never"),
                    })}
                  </span>
                </span>
              </span>
              <span className="text-chart-1">{millify(sessionCount, { precision: 1 })}</span>
            </li>
          ))}
        </ul>
      </Ui.Card.Content>
    </Ui.Card.Root>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    title: "Top activity users",
    description: "Display the top 5 activity of the users by number of sessions",
    sessions: "Sessions",
    "fullname-placeholder": "Unnamed user",
    "last-activity": "Last activity {{date}}",
    "last-activity-never": "Never",
  },
  fr: {
    title: "Utilisateurs les plus actifs",
    description: "Affiche le top 5 des utilisateurs les plus actifs par nombre de sessions",
    sessions: "Sessions",
    "fullname-placeholder": "Utilisateur sans nom",
    "last-activity": "Dernière activité {{date}}",
    "last-activity-never": "Jamais",
  },
  de: {
    title: "Benutzer mit höchster Aktivität",
    description: "Zeigt die Top 5 der aktivsten Benutzer nach Anzahl der Sitzungen",
    sessions: "Sitzungen",
    "fullname-placeholder": "Unbenannter Benutzer",
    "last-activity": "Letzte Aktivität {{date}}",
    "last-activity-never": "Nie",
  },
}
