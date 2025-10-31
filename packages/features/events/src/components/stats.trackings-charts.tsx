import { useTranslation } from "@compo/localize"
import { TrackingCharts } from "@compo/trackings"
import { useLanguage } from "@compo/translations"
import { Ui, variants } from "@compo/ui"
import { A, cx, placeholder } from "@compo/utils"
import { placeholder as servicePlaceholder } from "@services/dashboard"
import { ChevronsUpDown, Search } from "lucide-react"
import React from "react"
import { useEvents } from "../events.context"

/**
 * TrackingsCharts
 */
export const TrackingsCharts: React.FC<React.ComponentProps<"div">> = ({ ...props }) => {
  const { _ } = useTranslation(dictionary)
  const { translate } = useLanguage()

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

  return (
    <Ui.Card.Root {...props}>
      <Ui.Card.Content className='pt-6'>
        <TrackingCharts
          trackings={trackingIds}
          display='views'
          defaultStats='visit'
          defaultDisplayBy='months'
          classNames={{ header: "pb-6" }}
        >
          <Ui.Popover.Root open={open} onOpenChange={setOpen}>
            <Ui.Popover.Trigger
              className={cx(
                "group flex grow items-center gap-2 text-left",
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
              <ChevronsUpDown className='ml-auto size-3.5 @2xl/analytics:ml-2' aria-hidden />
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
                </Ui.Command.List>
              </Ui.Command.Root>
            </Ui.Popover.Content>
          </Ui.Popover.Root>
        </TrackingCharts>
      </Ui.Card.Content>
    </Ui.Card.Root>
  )
}

/**
 * translation
 */
const dictionary = {
  fr: {
    title: "Statistiques des visites",
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
    title: "Visits statistics",
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
    title: "Besuchsstatistiken",
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
