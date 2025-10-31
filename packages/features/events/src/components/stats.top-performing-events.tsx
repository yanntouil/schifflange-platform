import { useTranslation } from "@compo/localize"
import { useLanguage } from "@compo/translations"
import { Ui, variants } from "@compo/ui"
import { A, millify, placeholder } from "@compo/utils"
import { placeholder as servicePlaceholder } from "@services/dashboard"
import React from "react"
import { Link } from "wouter"
import { useEvents } from "../events.context"
import { useEventsService } from "../service.context"

/**
 * TopPerformingEvents
 */
export const TopPerformingEvents: React.FC<React.ComponentProps<"div">> = ({ ...props }) => {
  const { _ } = useTranslation(dictionary)
  const { routesTo } = useEventsService()
  const { translate } = useLanguage()
  const { swr } = useEvents()
  const { events } = swr
  const sortedEvents = React.useMemo(() => A.sort(events, (a, b) => b.tracking.visits - a.tracking.visits), [events])
  return (
    <Ui.Card.Root {...props}>
      <Ui.Card.Header>
        <Ui.Card.Title>{_("title")}</Ui.Card.Title>
      </Ui.Card.Header>

      <Ui.Card.Content className='flex flex-col gap-2'>
        <p className='flex items-center justify-end'>
          <span className='text-sm font-medium text-[var(--chart-2)]'>{_("visits")}</span>
        </p>
        <ul className='flex flex-col gap-2'>
          {A.map(A.take(sortedEvents, 5), ({ id, seo, tracking }) => (
            <li className='flex items-center justify-between gap-8 text-sm' key={id}>
              <Link to={routesTo.events.byId(id)} className={variants.link()}>
                <span className='line-clamp-1 tracking-tight'>
                  {placeholder(translate(seo, servicePlaceholder.seo).title, _("placeholder"))}
                </span>
              </Link>
              <span className='font-medium text-[var(--chart-2)]'>{millify(tracking.visits, { precision: 1 })}</span>
            </li>
          ))}
        </ul>
      </Ui.Card.Content>
    </Ui.Card.Root>
  )
}

const dictionary = {
  fr: {
    title: "Événements les plus visités",
    placeholder: "Événement sans titre",
    visits: "Visites",
  },
  en: {
    title: "Top performing events",
    placeholder: "Untitled event",
    visits: "Visits",
  },
  de: {
    title: "Am besten performende Veranstaltungen",
    placeholder: "Veranstaltung ohne Titel",
    visits: "Besuche",
  },
}
