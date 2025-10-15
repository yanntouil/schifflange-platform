import { Dashboard } from "@compo/dashboard"
import { smartClick } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { useContextualLanguage } from "@compo/translations"
import { Ui } from "@compo/ui"
import { placeholder, T } from "@compo/utils"
import { type Api, placeholder as servicePlaceholder } from "@services/dashboard"
import { CalendarSync, TagIcon } from "lucide-react"
import React from "react"
import { useProjectsService } from "../service.context"
import { useTags } from "../tags.context"
import { TagsMenu } from "./tags.menu"

/**
 * TagsCard
 */
export const TagsCard: React.FC<{ tag: Api.ProjectTag }> = ({ tag }) => {
  const { _, format, formatDistance } = useTranslation(dictionary)
  const { getImageUrl } = useProjectsService()
  const { translate } = useContextualLanguage()
  const translatedTag = translate(tag, servicePlaceholder.projectTag)
  const { selectable } = useTags()
  const title = placeholder(translatedTag.name, _("untitled"))

  return (
    <Dashboard.Card.Root
      key={tag.id}
      menu={<TagsMenu tag={tag} />}
      item={tag}
      selectable={selectable}
      {...smartClick(tag, selectable, () => {})}
    >
      <Dashboard.Card.Header>
        <Dashboard.Card.Title>{title}</Dashboard.Card.Title>
      </Dashboard.Card.Header>
      <Dashboard.Card.Content>
        <Dashboard.Card.Field>
          <TagIcon aria-hidden className='text-blue-600' />
          {_("projects-count", { count: tag.totalProjects || 0 })}
        </Dashboard.Card.Field>
        <Dashboard.Card.Field tooltip={_("updated-at-tooltip", { date: format(T.parseISO(tag.updatedAt), "PPPp") })}>
          <CalendarSync aria-hidden />
          {_("updated-at", { date: formatDistance(T.parseISO(tag.updatedAt)) })}
        </Dashboard.Card.Field>
      </Dashboard.Card.Content>
    </Dashboard.Card.Root>
  )
}
/**
 * TagsCardSkeleton
 */
export const TagsCardSkeleton: React.FC = () => {
  return (
    <Dashboard.Card.Root>
      <Dashboard.Card.Header>
        <Dashboard.Card.Title>
          <Ui.Skeleton variant='text-lg' className='w-./4' />
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
    untitled: "Untitled tag",
    "projects-count": "{{count}} project",
    "projects-count_other": "{{count}} projects",
    "updated-at": "Updated {{date}}",
    "updated-at-tooltip": "Last updated: {{date}}",
  },
  fr: {
    untitled: "Tag sans titre",
    "projects-count": "{{count}} projet",
    "projects-count_other": "{{count}} projets",
    "updated-at": "Mise à jour {{date}}",
    "updated-at-tooltip": "Dernière mise à jour : {{date}}",
  },
  de: {
    untitled: "Tag ohne Titel",
    "projects-count": "{{count}} Projekt",
    "projects-count_other": "{{count}} Projekte",
    "updated-at": "Aktualisiert {{date}}",
    "updated-at-tooltip": "Zuletzt aktualisiert: {{date}}",
  },
}
