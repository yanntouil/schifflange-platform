import { Dashboard } from "@compo/dashboard"
import { smartClick } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { useLanguage } from "@compo/translations"
import { Ui } from "@compo/ui"
import { placeholder, T } from "@compo/utils"
import { type Api, placeholder as servicePlaceholder } from "@services/dashboard"
import { CalendarSync, FolderIcon, Folders } from "lucide-react"
import React from "react"
import { useCategories } from "../categories.context"
import { useEventsService } from "../service.context"
import { CategoriesMenu } from "./categories.menu"

/**
 * CategoriesCard
 */
export const CategoriesCard: React.FC<{ category: Api.EventCategory }> = ({ category }) => {
  const { _, format, formatDistance } = useTranslation(dictionary)
  const { getImageUrl } = useEventsService()
  const { translate } = useLanguage()
  const translatedCategory = translate(category, servicePlaceholder.eventCategory)
  const { selectable } = useCategories()
  const title = placeholder(translatedCategory.title, _("untitled"))
  const description = placeholder(translatedCategory.description, _("no-description"))
  const imageUrl = getImageUrl(translatedCategory.image)

  return (
    <Dashboard.Card.Root
      key={category.id}
      menu={<CategoriesMenu category={category} />}
      item={category}
      selectable={selectable}
      {...smartClick(category, selectable, () => {})}
    >
      <Dashboard.Card.Image src={imageUrl ?? undefined}>
        <FolderIcon className='text-muted-foreground size-12' aria-hidden />
      </Dashboard.Card.Image>
      <Dashboard.Card.Header>
        <Dashboard.Card.Title>{title}</Dashboard.Card.Title>
        <Dashboard.Card.Description>{description}</Dashboard.Card.Description>
      </Dashboard.Card.Header>
      <Dashboard.Card.Content>
        <Dashboard.Card.Field>
          <FolderIcon aria-hidden className='text-blue-600' />
          {_("events-count", { count: category.totalEvents })}
        </Dashboard.Card.Field>
        <Dashboard.Card.Field
          tooltip={_("updated-at-tooltip", { date: format(T.parseISO(category.updatedAt), "PPPp") })}
        >
          <CalendarSync aria-hidden />
          {_("updated-at", { date: formatDistance(T.parseISO(category.updatedAt)) })}
        </Dashboard.Card.Field>
      </Dashboard.Card.Content>
    </Dashboard.Card.Root>
  )
}
/**
 * CategoriesCardSkeleton
 */
export const CategoriesCardSkeleton: React.FC = () => {
  return (
    <Dashboard.Card.Root>
      <Dashboard.Card.Image className='animate-pulse'>
        <Folders className='text-muted-foreground size-12' aria-hidden />
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
    untitled: "Untitled category",
    "no-description": "No description",
    "events-count": "{{count}} event",
    "events-count_other": "{{count}} events",
    "updated-at": "Updated {{date}}",
    "updated-at-tooltip": "Last updated: {{date}}",
  },
  fr: {
    untitled: "Catégorie sans titre",
    "no-description": "Aucune description",
    "events-count": "{{count}} événement",
    "events-count_other": "{{count}} événements",
    "updated-at": "Mise à jour {{date}}",
    "updated-at-tooltip": "Dernière mise à jour : {{date}}",
  },
  de: {
    untitled: "Kategorie ohne Titel",
    "no-description": "Keine Beschreibung",
    "events-count": "{{count}} Veranstaltung",
    "events-count_other": "{{count}} Veranstaltungen",
    "updated-at": "Aktualisiert {{date}}",
    "updated-at-tooltip": "Zuletzt aktualisiert: {{date}}",
  },
}
