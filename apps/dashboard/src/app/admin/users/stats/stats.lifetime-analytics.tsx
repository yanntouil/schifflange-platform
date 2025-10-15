import { Api } from "@/services"
import { useCount } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import React from "react"

/**
 * LifetimeAnalytics
 * Display the lifetime analytics of the users
 */
export const LifetimeAnalytics: React.FC<React.ComponentProps<"div"> & { stats: Api.Admin.UserStats }> = ({
  stats,
  className,
  ...props
}) => {
  const { _ } = useTranslation(dictionary)
  const totalUsers = useCount(stats.totalUsers)
  return (
    <Ui.Card.Root {...props} className={cxm("bg-primary text-primary-foreground border-chart-1", className)}>
      <Ui.Card.Header>
        <Ui.Card.Title>{_("title")}</Ui.Card.Title>
      </Ui.Card.Header>
      <Ui.Card.Content>
        <div className="flex items-center justify-center gap-8">
          <p className="flex flex-col items-center justify-center gap-2">
            <span className="text-2xl/none font-bold">{totalUsers}</span>
            <span className="text-primary-foreground/90 flex items-center gap-2 text-sm/none font-medium">
              <span className="bg-chart-1 size-2 rounded-full" />
              {_("total-users")}
            </span>
          </p>
        </div>
      </Ui.Card.Content>
    </Ui.Card.Root>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    title: "Lifetime Analytics",
    "total-users": "Total Users",
  },
  fr: {
    title: "Statistiques de vie",
    "total-users": "Total d'utilisateurs",
  },
  de: {
    title: "Lebenszeit-Analytik",
    "total-users": "Benutzer insgesamt",
  },
}
