import { Api } from "@/services"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { BaggageClaim, Calendar1, CalendarDays, CalendarMinus2, DoorOpen } from "lucide-react"
import millify from "millify"
import React from "react"

/**
 * BalanceStats
 * Display the balance of the users
 */
export const BalanceStats: React.FC<React.ComponentProps<"div"> & { stats: Api.Admin.UserStats }> = ({ stats, ...props }) => {
  const { _ } = useTranslation(dictionary)
  const { newUsersToday, newUsersThisWeek, newUsersThisMonth, deletedUsersThisMonth, inactiveUsersOver30Days } = stats
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
        <ul className={cxm(listCx, "[&>li>span]:last:text-chart-1")}>
          <li>
            <span>
              <Calendar1 aria-hidden />
              {_("new-users-today")}
            </span>
            <span>{millify(newUsersToday, { precision: 1 })}</span>
          </li>
          <li>
            <span>
              <CalendarMinus2 aria-hidden />
              {_("new-users-this-week")}
            </span>
            <span>{millify(newUsersThisWeek, { precision: 1 })}</span>
          </li>
          <li>
            <span>
              <CalendarDays aria-hidden />
              {_("new-users-this-month")}
            </span>
            <span>{millify(newUsersThisMonth, { precision: 1 })}</span>
          </li>
        </ul>
        <Ui.Separator className="mx-auto my-4 w-3/4" orientation="horizontal" />
        <ul className={cxm(listCx, "[&>li>span]:last:text-chart-2")}>
          <li>
            <span>
              <DoorOpen aria-hidden />
              {_("deleted-users-this-month")}
            </span>
            <span>{millify(deletedUsersThisMonth, { precision: 1 })}</span>
          </li>
          <li>
            <span>
              <BaggageClaim aria-hidden />
              {_("inactive-users-over-30-days")}
            </span>
            <span>{millify(inactiveUsersOver30Days, { precision: 1 })}</span>
          </li>
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
    title: "Account flow",
    description: "Display the flow of the accounts in the last 30 days",
    "new-users-today": "New accounts today",
    "new-users-this-week": "New accounts this week",
    "new-users-this-month": "New accounts this month",
    "deleted-users-this-month": "Accounts deleted this month",
    "inactive-users-over-30-days": "Inactive accounts for 30+ days",
  },
  fr: {
    title: "Flux des comptes",
    description: "Affiche le flux des comptes sur les 30 derniers jours",
    "new-users-today": "Nouvelles inscriptions aujourd'hui",
    "new-users-this-week": "Nouvelles inscriptions cette semaine",
    "new-users-this-month": "Nouvelles inscriptions ce mois",
    "deleted-users-this-month": "Comptes supprimés ce mois",
    "inactive-users-over-30-days": "Comptes inactifs depuis 30+ jours",
  },
  de: {
    title: "Konten-Fluss",
    description: "Zeigt den Fluss der Konten in den letzten 30 Tagen",
    "new-users-today": "Neue Konten heute",
    "new-users-this-week": "Neue Konten diese Woche",
    "new-users-this-month": "Neue Konten diesen Monat",
    "deleted-users-this-month": "Gelöschte Konten diesen Monat",
    "inactive-users-over-30-days": "Inaktive Konten über 30 Tage",
  },
}
