import { Api } from "@/services"
import { useCount } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import React from "react"

/**
 * RecentsStats
 * Display the recents stats of the users
 */
export const RecentsStats: React.FC<React.ComponentProps<"div"> & { stats: Api.Admin.UserStats }> = ({ stats, ...props }) => {
  const { _ } = useTranslation(dictionary)
  const { activeUsersToday, activeUsersThisWeek, activeUsersThisMonth } = stats
  const today = useCount(activeUsersToday)
  const thisWeek = useCount(activeUsersThisWeek)
  const thisMonth = useCount(activeUsersThisMonth)
  return (
    <Ui.Card.Root {...props}>
      <Ui.Card.Header>
        <Ui.Card.Title>{_("title")}</Ui.Card.Title>
      </Ui.Card.Header>
      <Ui.Card.Content className="flex justify-around gap-8">
        <p className="flex flex-col items-center gap-2">
          <span className="text-2xl/none font-bold">{today}</span>
          <span className="text-muted-foreground text-sm/none">{_("active-users-today")}</span>
        </p>
        <p className="flex flex-col items-center gap-2">
          <span className="text-2xl/none font-bold">{thisWeek}</span>
          <span className="text-muted-foreground text-sm/none">{_("active-users-this-week")}</span>
        </p>
        <p className="flex flex-col items-center gap-2">
          <span className="text-2xl/none font-bold">{thisMonth}</span>
          <span className="text-muted-foreground text-sm/none">{_("active-users-this-month")}</span>
        </p>
      </Ui.Card.Content>
    </Ui.Card.Root>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    title: "Recent logins",
    "active-users-today": "Today",
    "active-users-this-week": "This Week",
    "active-users-this-month": "This Month",
  },
  fr: {
    title: "Connexions récentes",
    "active-users-today": "Aujourd'hui",
    "active-users-this-week": "Cette semaine",
    "active-users-this-month": "Ce mois",
  },
  de: {
    title: "Neueste Anmeldungen",
    "active-users-today": "Heute",
    "active-users-this-week": "Diese Woche",
    "active-users-this-month": "Diesen Monat",
  },
}
