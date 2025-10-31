import { useCount, useMemoKey, useSWR } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { useTrackingService } from "@compo/trackings"
import { Ui } from "@compo/ui"
import { A, cxm } from "@compo/utils"
import React from "react"
import { useArticles } from "../articles.context"
import { refreshInterval } from "./stats.constants"

const fallbackData = { stats: { today: 0, last7Days: 0, lastMonth: 0, ever: 0 } }

/**
 * LifetimeAnalytics
 */
export const LifetimeAnalytics: React.FC<React.ComponentProps<"div">> = ({ className, ...props }) => {
  const { _ } = useTranslation(dictionary)
  const { swr } = useArticles()
  const { articles } = swr
  const traces = useTrackingService()
  const trackingIds = React.useMemo(() => A.map(articles, (article) => article.tracking.id) as string[], [articles])
  const { data } = useSWR(
    { fetch: () => traces.stats({ trackingIds }), key: useMemoKey("articles-stats", { trackingIds }) },
    { fallbackData, refreshInterval }
  )

  const everClicks = useCount(data.stats.ever)

  return (
    <Ui.Card.Root {...props} className={cxm("bg-primary text-primary-foreground border-chart-2", className)}>
      <Ui.Card.Header>
        <Ui.Card.Title>{_("title")}</Ui.Card.Title>
      </Ui.Card.Header>
      <Ui.Card.Content className='flex items-center justify-center gap-8'>
        <div className='flex items-center justify-center gap-8'>
          <p className='flex flex-col items-center justify-center gap-2'>
            <span className='text-2xl/none font-bold'>{everClicks}</span>
            <span className='text-primary-foreground/90 flex items-center gap-2 text-sm/none font-medium'>
              <span className='bg-chart-2 size-2 rounded-full' />
              {_("visits")}
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
  fr: {
    title: "Analytiques à vie",
    visits: "Visites",
  },
  en: {
    title: "Lifetime analytics",
    visits: "Visits",
  },
  de: {
    title: "Lebenslange Analysen",
    visits: "Besuche",
  },
}
