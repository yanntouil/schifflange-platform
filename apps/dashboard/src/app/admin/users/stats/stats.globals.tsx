import { Api } from "@/services"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import millify from "millify"
import React from "react"

/**
 * GlobalsStats
 * Display the globals stats of the users
 */
export const GlobalsStats: React.FC<React.ComponentProps<"div"> & { stats: Api.Admin.UserStats }> = ({ stats, className, ...props }) => {
  const { _ } = useTranslation(dictionary)
  const { newUsersToday, newUsersThisWeek, newUsersThisMonth, inactiveUsersOver30Days } = stats
  const usersByRole = [
    { label: _("users-by-role-superadmin"), count: stats.usersByRole?.superadmin ?? 0 },
    { label: _("users-by-role-admin"), count: stats.usersByRole?.admin ?? 0 },
    { label: _("users-by-role-member"), count: stats.usersByRole?.member ?? 0 },
  ]
  return (
    <div {...props} className={cxm("grid grid-cols-2 gap-8", className)}>
      <Ui.Card.Root>
        <Ui.Card.Header>
          <Ui.Card.Title level={2}>{_("new-users-title")}</Ui.Card.Title>
          <Ui.Card.Description>{_("new-users-description")}</Ui.Card.Description>
        </Ui.Card.Header>
        <Ui.Card.Content>
          <ul className="flex max-w-sm flex-col gap-2">
            <li className="flex items-center justify-between gap-8 text-sm">
              <span className="line-clamp-1 tracking-tight">{_("new-users-today")}</span>
              <span className="text-chart-1 font-medium">{millify(newUsersToday, { precision: 1 })}</span>
            </li>
            <li className="flex items-center justify-between gap-8 text-sm">
              <span className="line-clamp-1 tracking-tight">{_("new-users-this-week")}</span>
              <span className="text-chart-1 font-medium">{millify(newUsersThisWeek, { precision: 1 })}</span>
            </li>
            <li className="flex items-center justify-between gap-8 text-sm">
              <span className="line-clamp-1 tracking-tight">{_("new-users-this-month")}</span>
              <span className="text-chart-1 font-medium">{millify(newUsersThisMonth, { precision: 1 })}</span>
            </li>
            <li className="flex items-center justify-between gap-8 text-sm">
              <span className="line-clamp-1 tracking-tight">{_("inactive-users-over-30-days")}</span>
              <span className="text-chart-2 font-medium">{millify(inactiveUsersOver30Days, { precision: 1 })}</span>
            </li>
          </ul>
        </Ui.Card.Content>
      </Ui.Card.Root>
      <Ui.Card.Root>
        <Ui.Card.Header>
          <Ui.Card.Title level={2}>{_("users-by-role-title")}</Ui.Card.Title>
          <Ui.Card.Description>{_("users-by-role-description")}</Ui.Card.Description>
        </Ui.Card.Header>
        <Ui.Card.Content className="flex min-h-36 items-center justify-around gap-8">
          {usersByRole.map(({ label, count }) => (
            <p className="flex flex-col items-center gap-2">
              <span className="text-2xl/none font-bold">{count}</span>
              <span className="text-muted-foreground text-sm/none">{label}</span>
            </p>
          ))}
        </Ui.Card.Content>
      </Ui.Card.Root>
    </div>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    "new-users-title": "New users",
    "new-users-description": "Display the number of new users",
    "new-users-today": "New users today",
    "new-users-this-week": "New users this week",
    "new-users-this-month": "New users this month",
    "inactive-users-over-30-days": "Inactive users over 30 days",
    "users-by-role-title": "Users by role",
    "users-by-role-description": "Display the number of users by role",
    "users-by-role-superadmin": "Super Admin",
    "users-by-role-admin": "Admin",
    "users-by-role-member": "Member",
  },
  fr: {
    title: "Activités récentes",
    "new-users-today": "Nouveaux utilisateurs aujourd'hui",
    "new-users-this-week": "Nouveaux utilisateurs cette semaine",
    "new-users-this-month": "Nouveaux utilisateurs ce mois",
    "inactive-users-over-30-days": "Utilisateurs inactifs depuis plus de 30 jours",
    "users-by-role-title": "Activités récentes",
    "users-by-role-description": "Affiche le nombre d'utilisateurs par rôle",
    "users-by-role-superadmin": "Super Admin",
    "users-by-role-admin": "Admin",
    "users-by-role-member": "Membre",
  },
  de: {
    "new-users-title": "Neue Benutzer",
    "new-users-description": "Anzeigen der Anzahl der neuen Benutzer",
    "new-users-today": "Neue Benutzer heute",
    "new-users-this-week": "Neue Benutzer diese Woche",
    "new-users-this-month": "Neue Benutzer diesen Monat",
    "inactive-users-over-30-days": "Inaktive Benutzer über 30 Tage",
    "users-by-role-title": "Benutzer nach Rolle",
    "users-by-role-description": "Anzeigen der Anzahl der Benutzer nach Rolle",
    "users-by-role-superadmin": "Super Admin",
    "users-by-role-admin": "Admin",
    "users-by-role-member": "Mitglied",
  },
}
