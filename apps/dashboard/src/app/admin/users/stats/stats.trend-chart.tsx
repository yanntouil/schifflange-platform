import { Api } from "@/services"
import { useTranslation } from "@compo/localize"
import { Recharts, Ui } from "@compo/ui"
import { A } from "@compo/utils"
import millify from "millify"
import React from "react"

/**
 * TrendChart
 * Display the trend of visits on the last days
 */
export const TrendChartStats: React.FC<React.ComponentProps<"div"> & { stats: Api.Admin.UserStats }> = ({ stats, ...props }) => {
  const { _, format } = useTranslation(dictionary)
  const { activityByDay } = stats
  // prepare data
  const chartData = React.useMemo(() => {
    return A.map(activityByDay, (day) => ({
      day: format(day.date, "d MMM"),
      activeUsers: day.activeUsers,
      newUsers: day.newUsers,
    }))
  }, [activityByDay, format])

  return (
    <Ui.Card.Root {...props}>
      <Ui.Card.Header>
        <Ui.Card.Title level={2}>{_("title")}</Ui.Card.Title>
        <Ui.Card.Description>{_("description")}</Ui.Card.Description>
      </Ui.Card.Header>
      <Ui.Card.Content>
        <Ui.Chart.Container
          config={{
            activeUsers: {
              label: _(`active-users`),
              color: "--color-chart-1",
            },
            newUsers: {
              label: _(`new-users`),
              color: "--color-chart-2",
            },
          }}
          className="mx-auto aspect-video w-full max-w-3xl"
        >
          <Recharts.LineChart accessibilityLayer data={chartData}>
            <Recharts.CartesianGrid vertical={false} />
            <Recharts.XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={10} minTickGap={32} />
            <Recharts.YAxis allowDecimals={false} tickLine={false} axisLine={false} tickMargin={8} />
            <Recharts.Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              content={<Ui.Chart.TooltipContent indicator="dashed" valueFormatter={(value) => millify(Number(value))} />}
            />
            <Recharts.Line type="monotone" dataKey="activeUsers" stroke="var(--color-chart-1)" strokeWidth={2} dot={false} />
            <Recharts.Line type="monotone" dataKey="newUsers" stroke="var(--color-chart-2)" strokeWidth={2} dot={false} />
          </Recharts.LineChart>
        </Ui.Chart.Container>
      </Ui.Card.Content>
    </Ui.Card.Root>
  )
}

/**
 * translation
 */
const dictionary = {
  fr: {
    title: "Tendance des visites",
    description: "Affiche la tendance des visites sur les derniers jours",
    activeUsers: "Utilisateurs actifs",
    newUsers: "Nouveaux utilisateurs",
  },
  en: {
    title: "Activity trend (last 30 days)",
    description: "Display the trend of new accounts and account activity on the last 30 days",
    activeUsers: "Users activity",
    newUsers: "New accounts",
  },
  de: {
    title: "Aktivitäten-Trend (letzte 30 Tage)",
    description: "Zeigt den Trend der neuen Konten und der Kontaktaktivität in den letzten 30 Tagen",
    activeUsers: "Kontaktaktivität",
    newUsers: "Neue Konten",
  },
}
