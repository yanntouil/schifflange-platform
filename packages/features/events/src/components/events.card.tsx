import { Dashboard } from "@compo/dashboard"
import { smartClick } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { useLanguage } from "@compo/translations"
import { Ui } from "@compo/ui"
import { match, placeholder, T } from "@compo/utils"
import { type Api, placeholder as servicePlaceholder } from "@services/dashboard"
import { CalendarSync, FileTextIcon, FolderIcon, GlobeIcon, LayoutPanelTop } from "lucide-react"
import React from "react"
import { useEvents } from "../events.context"
import { useEventsService } from "../service.context"
import { EventsMenu } from "./events.menu"

/**
 * EventsCard
 */
export const EventsCard: React.FC<{ event: Api.EventWithRelations }> = ({ event }) => {
  const { _, format, formatDistance } = useTranslation(dictionary)
  const { getImageUrl } = useEventsService()
  const { translate } = useLanguage()
  const translatedSeo = translate(event.seo, servicePlaceholder.seo)
  const { selectable, displayEvent } = useEvents()
  const title = placeholder(translatedSeo.title, _("untitled"))
  const description = placeholder(translatedSeo.description, _("no-description"))
  const imageUrl = getImageUrl(translatedSeo.image)

  // Categories information
  const categoriesTitle =
    event.categories.length > 0
      ? event.categories.map((cat) => translate(cat, servicePlaceholder.eventCategory).title).join(", ")
      : _("uncategorized")

  return (
    <Dashboard.Card.Root
      key={event.id}
      menu={<EventsMenu event={event} />}
      item={event}
      selectable={selectable}
      {...smartClick(event, selectable, () => displayEvent(event))}
    >
      <Dashboard.Card.Image src={imageUrl ?? undefined}>
        <LayoutPanelTop className='text-muted-foreground size-12' aria-hidden />
      </Dashboard.Card.Image>
      <Dashboard.Card.Header>
        <Dashboard.Card.Title>{title}</Dashboard.Card.Title>
        <Dashboard.Card.Description>{description}</Dashboard.Card.Description>
      </Dashboard.Card.Header>
      <Dashboard.Card.Content>
        <Dashboard.Card.Field>
          {match(event.state)
            .with("published", () => <GlobeIcon aria-hidden className='text-green-600' />)
            .with("draft", () => <FileTextIcon aria-hidden className='text-orange-600' />)
            .exhaustive()}
          {_(`state-${event.state}`)}
        </Dashboard.Card.Field>
        <Dashboard.Card.Field>
          <FolderIcon aria-hidden className='text-blue-600' />
          {categoriesTitle}
        </Dashboard.Card.Field>
        <Dashboard.Card.Field
          tooltip={_("updated-at-tooltip", { date: format(T.parseISO(event.updatedAt), "PPPp") })}
        >
          <CalendarSync aria-hidden />
          {_("updated-at", { date: formatDistance(T.parseISO(event.updatedAt)) })}
        </Dashboard.Card.Field>
      </Dashboard.Card.Content>
    </Dashboard.Card.Root>
  )
}

/**
 * EventsCardsSkeleton
 */
export const EventsCardSkeleton: React.FC = () => {
  return (
    <Dashboard.Card.Root>
      <Dashboard.Card.Image className='animate-pulse'>
        <LayoutPanelTop className='text-muted-foreground size-12' aria-hidden />
      </Dashboard.Card.Image>
      <Dashboard.Card.Header>
        <Dashboard.Card.Title>
          <Ui.Skeleton variant='text-lg' className='w-./4' />
          <div>
            <Ui.Skeleton variant='text-sm' className='w-full' />
            <Ui.Skeleton variant='text-sm' className='w-3/4' />
          </div>
        </Dashboard.Card.Title>
      </Dashboard.Card.Header>
      <Dashboard.Card.Content>
        <Ui.Skeleton variant='text-sm' className='w-1/2' />
        <Ui.Skeleton variant='text-sm' className='w-3/4' />
      </Dashboard.Card.Content>
    </Dashboard.Card.Root>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    untitled: "Untitled event",
    "no-description": "No description",
    uncategorized: "Uncategorized",
    "state-draft": "Draft",
    "state-published": "Published",
    "updated-at": "Updated {{date}}",
    "updated-at-tooltip": "Last updated: {{date}}",
  },
  fr: {
    untitled: "Événement sans titre",
    "no-description": "Aucune description",
    uncategorized: "Non catégorisé",
    "state-draft": "Brouillon",
    "state-published": "Publié",
    "updated-at": "Mise à jour {{date}}",
    "updated-at-tooltip": "Dernière mise à jour : {{date}}",
  },
  de: {
    untitled: "Veranstaltung ohne Titel",
    "no-description": "Keine Beschreibung",
    uncategorized: "Unkategorisiert",
    "state-draft": "Entwurf",
    "state-published": "Veröffentlicht",
    "updated-at": "Aktualisiert {{date}}",
    "updated-at-tooltip": "Zuletzt aktualisiert: {{date}}",
  },
}
