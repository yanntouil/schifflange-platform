import { Api } from "@/services"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import React from "react"

/**
 * DispatchRolesStats
 * Display the dispatch of the users beetwwen the different roles
 */
export const DispatchRolesStats: React.FC<React.ComponentProps<"div"> & { stats: Api.Admin.UserStats }> = ({ stats, ...props }) => {
  const { _ } = useTranslation(dictionary)
  const usersByRole = [
    { label: _("superadmin"), count: stats.usersByRole?.superadmin ?? 0 },
    { label: _("admin"), count: stats.usersByRole?.admin ?? 0 },
    { label: _("member"), count: stats.usersByRole?.member ?? 0 },
  ]
  return (
    <Ui.Card.Root {...props}>
      <Ui.Card.Header>
        <Ui.Card.Title level={2}>{_("title")}</Ui.Card.Title>
        <Ui.Card.Description>{_("description")}</Ui.Card.Description>
      </Ui.Card.Header>
      <Ui.Card.Content className="flex min-h-16 items-center justify-around gap-8">
        {usersByRole.map(({ label, count }) => (
          <p className="flex flex-col items-center gap-2" key={label}>
            <span className="text-xl/none font-bold">{count}</span>
            <span className="text-muted-foreground text-xs/none">{label}</span>
          </p>
        ))}
      </Ui.Card.Content>
    </Ui.Card.Root>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    title: "User roles distribution",
    description: "Display the distribution of users accounts beetween the different roles",
    superadmin: "Super Admin",
    admin: "Admin",
    member: "Member",
  },
  fr: {
    title: "Répartition des rôles",
    description: "Affiche la répartition des comptes utilisateurs entre les différents rôles",
    superadmin: "Super Admin",
    admin: "Admin",
    member: "Membre",
  },
  de: {
    title: "Benutzerrollenverteilung",
    description: "Zeigt die Verteilung der Benutzerkonten zwischen den verschiedenen Rollen an",
    superadmin: "Super Admin",
    admin: "Administrator",
    member: "Mitglied",
  },
}
