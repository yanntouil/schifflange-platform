import { useMemoKey, useSWR, useToday } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { earlyBetweenData, prepareIntervalParams, useTrackingService } from "@compo/trackings"
import { useLanguage } from "@compo/translations"
import { Recharts, Ui, variants } from "@compo/ui"
import { A, cx, G, millify, placeholder, T } from "@compo/utils"
import { placeholder as servicePlaceholder } from "@services/dashboard"
import { ChevronsUpDown, Search } from "lucide-react"
import React from "react"
import { useEvents } from "../events.context"
import { refreshInterval } from "./stats.constants"

/**
 * TrendChart
 */
export const TrendChart: React.FC<React.ComponentProps<"div">> = ({ ...props }) => {
  const { _, locale, format } = useTranslation(dictionary)
  const { translate } = useLanguage()
  const traces = useTrackingService()

  const { swr } = useEvents()
  const { events } = swr
  const [open, setOpen] = React.useState(false)
  const [selected, setSelected] = React.useState<{ type: "all" } | { type: "event"; event: (typeof events)[number] }>({
    type: "all",
  })
  const trackingIds = React.useMemo(() => {
    // all events
    if (selected.type === "all") return A.map(events, (event) => event.tracking.id) as string[]
    // selected event
    return [selected.event.tracking.id]
  }, [events, selected])

  // interval (display 6 months from today)
  const today = useToday()
  const interval = React.useMemo(() => ({ from: T.sub(today, { months: 5 }), to: today }), [today])

  // request params
  const params = React.useMemo(
    () => ({ ...prepareIntervalParams(interval, "months", today, locale), trackingIds }),
    [interval, trackingIds, today, locale]
  )

  // requests
  const { data: visits } = useSWR(
    { fetch: () => traces.byMonth({ ...params }), key: useMemoKey("events-trend", { params }) },
    { fallbackData: { stats: {} }, refreshInterval }
  )

  // prepare data
  const chartData = React.useMemo(() => {
    const start = interval.from ?? earlyBetweenData(visits.stats)
    const month = T.eachMonthOfInterval({ start, end: interval.to ?? today })
    return A.map(month, (date) => ({
      month: format(date, "MMMM"),
      visits: visits.stats[T.format(date, "yyyy-MM")] ?? 0,
    })) as { month: string; visits: number }[]
  }, [visits, interval, today, format])

  // generate trend message
  const trendMessage = React.useMemo(() => {
    const noTrendMessage = _("trend.not-enough-data")
    if (chartData.length < 2) return noTrendMessage
    const lastMonth = A.last(chartData)
    const previousMonth = A.get(chartData, chartData.length - 2)
    if (G.isNullable(lastMonth) || G.isNullable(previousMonth)) return noTrendMessage

    // Determine visit trend for the last month
    let visitTrend = ""
    if (lastMonth.visits > previousMonth.visits) visitTrend = _("trend.increase")
    else if (lastMonth.visits < previousMonth.visits) visitTrend = _("trend.decrease")
    else visitTrend = _("trend.stable")

    return _("trend.message", { month: lastMonth.month, trend: visitTrend })
  }, [chartData, _])

  return (
    <Ui.Card.Root {...props}>
      <Ui.Card.Header>
        <Ui.Popover.Root open={open} onOpenChange={setOpen}>
          <Ui.Popover.Trigger
            className={cx(
              "group flex items-center gap-2 text-left",
              Ui.cardTitleVariants(),
              variants.focusVisible(),
              variants.inputRounded()
            )}
            role='combobox'
            aria-expanded={open}
          >
            <span className='line-clamp-1 grow'>
              {_("showing-message", {
                selected:
                  selected.type === "event"
                    ? _("showing-specific-event", {
                        event: placeholder(
                          translate(selected.event.seo, servicePlaceholder.seo).title,
                          _("event-title-placeholder")
                        ),
                      })
                    : _("showing-all-event"),
              })}
            </span>
            <ChevronsUpDown className='size-3.5' aria-hidden />
          </Ui.Popover.Trigger>
          <Ui.Popover.Content className='w-[var(--radix-popover-trigger-width)] p-0'>
            <Ui.Command.Root>
              <Ui.Command.Input placeholder={_("search-placeholder")} />
              <Ui.Command.List>
                <Ui.Command.Empty className='text-muted-foreground flex flex-col items-center justify-center gap-2 px-4 py-4'>
                  <Search className='size-6 stroke-[1]' aria-hidden />
                  <div className='text-sm'>{_("empty-result")}</div>
                </Ui.Command.Empty>
                <Ui.Command.Group>
                  <Ui.Command.Item
                    value='all'
                    keywords={[_("all-events")]}
                    onSelect={() => {
                      setSelected({ type: "all" })
                      setOpen(false)
                    }}
                  >
                    {_("all-events")}
                  </Ui.Command.Item>
                </Ui.Command.Group>
                {A.isNotEmpty(events) && (
                  <Ui.Command.Group heading={_("event-heading")}>
                    {A.map(events, (event) => (
                      <Ui.Command.Item
                        key={event.id}
                        value={event.id}
                        keywords={[
                          placeholder(translate(event.seo, servicePlaceholder.seo).title, _("event-placeholder")),
                        ]}
                        onSelect={() => {
                          setSelected({ type: "event", event })
                          setOpen(false)
                        }}
                      >
                        {placeholder(translate(event.seo, servicePlaceholder.seo).title, _("event-placeholder"))}
                      </Ui.Command.Item>
                    ))}
                  </Ui.Command.Group>
                )}
              </Ui.Command.List>
            </Ui.Command.Root>
          </Ui.Popover.Content>
        </Ui.Popover.Root>
        <Ui.Card.Description>{trendMessage}</Ui.Card.Description>
      </Ui.Card.Header>
      <Ui.Card.Content>
        <Ui.Chart.Container
          config={{
            visits: {
              label: _("visits"),
              color: "var(--chart-2)",
            },
          }}
          className='mx-auto aspect-video w-full max-w-3xl'
        >
          <Recharts.BarChart accessibilityLayer data={chartData}>
            <Recharts.CartesianGrid vertical={false} />
            <Recharts.XAxis
              dataKey='month'
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              minTickGap={32}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <Ui.Chart.Tooltip
              cursor={false}
              content={
                <Ui.Chart.TooltipContent indicator='dashed' valueFormatter={(value) => millify(Number(value))} />
              }
            />
            <Recharts.Bar dataKey='visits' fill='var(--color-visits)' radius={4} />
          </Recharts.BarChart>
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
    trend: {
      "not-enough-data": "Pas assez de données pour calculer la tendance.",
      increase: "a augmenté.",
      decrease: "a diminué.",
      stable: "est resté stable.",
      message: "En {{month}}, le taux de visites {{trend}}",
    },
    "showing-message": "Statistiques des visites sur {{selected}}",
    "showing-all-event": "tous les événements",
    "showing-specific-event": "l'événement {{event}}",
    "all-events": "Toutes les événements publiés",
    "event-heading": "Statistiques par événement",
    "event-placeholder": "Événement sans titre",
    "search-placeholder": "Rechercher un événement",
    "empty-result": "Aucun événement trouvé",
  },
  en: {
    trend: {
      "not-enough-data": "Not enough data to calculate trend.",
      increase: "an increase in clicks.",
      decrease: "a decrease in clicks.",
      stable: "stable clicks.",
      message: "In {{month}}, there was {{trend}}",
    },
    "showing-message": "Statistics of visits on {{selected}}",
    "showing-all-event": "all events",
    "showing-specific-event": "the event {{event}}",
    "all-events": "All published events",
    "event-heading": "Statistics by event",
    "event-placeholder": "Untitled event",
    "search-placeholder": "Search an event",
    "empty-result": "No event found",
  },
  de: {
    trend: {
      "not-enough-data": "Nicht genügend Daten zur Trendberechnung.",
      increase: "ein Anstieg der Klicks.",
      decrease: "ein Rückgang der Klicks.",
      stable: "stabile Klicks.",
      message: "Im {{month}} gab es {{trend}}",
    },
    "showing-message": "Besuchsstatistiken für {{selected}}",
    "showing-all-event": "alle Veranstaltungen",
    "showing-specific-event": "die Veranstaltung {{event}}",
    "all-events": "Alle veröffentlichten Veranstaltungen",
    "event-heading": "Statistiken nach Veranstaltung",
    "event-placeholder": "Veranstaltung ohne Titel",
    "search-placeholder": "Veranstaltung suchen",
    "empty-result": "Kein Veranstaltung gefunden",
  },
}
