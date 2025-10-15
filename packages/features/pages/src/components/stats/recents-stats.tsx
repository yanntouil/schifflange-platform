import { useCount, useMemoKey, useSWR } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { useTrackingService } from "@compo/trackings"
import { Ui } from "@compo/ui"
import { A } from "@compo/utils"
import React from "react"
import { usePages } from "../../pages.context"
import { refreshInterval } from "./constants"

const fallbackData = { stats: { today: 0, last7Days: 0, lastMonth: 0, ever: 0 } }

/**
 * RecentsStats
 */
export const RecentsStats: React.FC<React.ComponentProps<"div">> = ({ ...props }) => {
  const { _ } = useTranslation(dictionary)
  const { swr } = usePages()
  const { pages } = swr
  const traces = useTrackingService()
  const trackingIds = React.useMemo(() => A.map(pages, (page) => page.tracking.id) as string[], [pages])
  const { data } = useSWR(
    { fetch: () => traces.stats({ trackingIds }), key: useMemoKey("pages-stats", { trackingIds }) },
    { fallbackData, refreshInterval }
  )

  const today = useCount(data.stats.today)
  const last7Days = useCount(data.stats.last7Days)
  const lastMonth = useCount(data.stats.lastMonth)

  return (
    <Ui.Card.Root {...props}>
      <Ui.Card.Header>
        <Ui.Card.Title>{_("title")}</Ui.Card.Title>
      </Ui.Card.Header>
      <Ui.Card.Content className='flex justify-around gap-8'>
        <p className='flex flex-col items-center gap-2'>
          <span className='text-2xl/none font-bold'>{today}</span>
          <span className='text-muted-foreground text-sm/none'>{_("today")}</span>
        </p>
        <p className='flex flex-col items-center gap-2'>
          <span className='text-2xl/none font-bold'>{last7Days}</span>
          <span className='text-muted-foreground text-sm/none'>{_("last7Days")}</span>
        </p>
        <p className='flex flex-col items-center gap-2'>
          <span className='text-2xl/none font-bold'>{lastMonth}</span>
          <span className='text-muted-foreground text-sm/none'>{_("lastMonth")}</span>
        </p>
      </Ui.Card.Content>
    </Ui.Card.Root>
  )
}

/**
 * translations
 */
const dictionary = {
  fr: {
    title: "Statistiques récentes",
    visits: "Visites",
    today: "Aujourd'hui",
    last7Days: "Derniers 7 jours",
    lastMonth: "Dernier mois",
  },
  en: {
    title: "Recent stats",
    visits: "Visits",
    today: "Today",
    last7Days: "Last 7 days",
    lastMonth: "Last month",
  },
  de: {
    title: "Aktuelle Statistiken",
    visits: "Aufrufe",
    today: "Heute",
    last7Days: "Letzte 7 Tage",
    lastMonth: "Letzter Monat",
  },
}
