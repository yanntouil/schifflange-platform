import { Dashboard } from "@compo/dashboard"
import { smartClick } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { useContextualLanguage } from "@compo/translations"
import { Ui } from "@compo/ui"
import { match, placeholder, T } from "@compo/utils"
import { type Api, placeholder as servicePlaceholder } from "@services/dashboard"
import { CalendarSync, FileTextIcon, FolderIcon, GlobeIcon, LayoutPanelTop } from "lucide-react"
import React from "react"
import { useProjects } from "../projects.context"
import { useProjectsService } from "../service.context"
import { ProjectsMenu } from "./projects.menu"

/**
 * ProjectsCard
 */
export const ProjectsCard: React.FC<{ project: Api.ProjectWithRelations }> = ({ project }) => {
  const { _, format, formatDistance } = useTranslation(dictionary)
  const { getImageUrl } = useProjectsService()
  const { translate } = useContextualLanguage()
  const translatedSeo = translate(project.seo, servicePlaceholder.seo)
  const { selectable, displayProject } = useProjects()
  const title = placeholder(translatedSeo.title, _("untitled"))
  const description = placeholder(translatedSeo.description, _("no-description"))
  const imageUrl = getImageUrl(translatedSeo.image)

  // Category information
  const categoryTitle = project.category
    ? placeholder(translate(project.category, servicePlaceholder.projectCategory).title, _("uncategorized"))
    : _("uncategorized")

  return (
    <Dashboard.Card.Root
      key={project.id}
      menu={<ProjectsMenu project={project} />}
      item={project}
      selectable={selectable}
      {...smartClick(project, selectable, () => displayProject(project))}
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
          {match(project.state)
            .with("published", () => <GlobeIcon aria-hidden className='text-green-600' />)
            .with("draft", () => <FileTextIcon aria-hidden className='text-orange-600' />)
            .exhaustive()}
          {_(`state-${project.state}`)}
        </Dashboard.Card.Field>
        <Dashboard.Card.Field>
          <FolderIcon aria-hidden className='text-blue-600' />
          {categoryTitle}
        </Dashboard.Card.Field>
        <Dashboard.Card.Field
          tooltip={_("updated-at-tooltip", { date: format(T.parseISO(project.updatedAt), "PPPp") })}
        >
          <CalendarSync aria-hidden />
          {_("updated-at", { date: formatDistance(T.parseISO(project.updatedAt)) })}
        </Dashboard.Card.Field>
      </Dashboard.Card.Content>
    </Dashboard.Card.Root>
  )
}

/**
 * ProjectsCardsSkeleton
 */
export const ProjectsCardSkeleton: React.FC = () => {
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
    untitled: "Untitled project",
    "no-description": "No description",
    uncategorized: "Uncategorized",
    "state-draft": "Draft",
    "state-published": "Published",
    "updated-at": "Updated {{date}}",
    "updated-at-tooltip": "Last updated: {{date}}",
  },
  fr: {
    untitled: "Projet sans titre",
    "no-description": "Aucune description",
    uncategorized: "Non catégorisé",
    "state-draft": "Brouillon",
    "state-published": "Publié",
    "updated-at": "Mise à jour {{date}}",
    "updated-at-tooltip": "Dernière mise à jour : {{date}}",
  },
  de: {
    untitled: "Projekt ohne Titel",
    "no-description": "Keine Beschreibung",
    uncategorized: "Nicht kategorisiert",
    "state-draft": "Entwurf",
    "state-published": "Veröffentlicht",
    "updated-at": "Aktualisiert {{date}}",
    "updated-at-tooltip": "Zuletzt aktualisiert: {{date}}",
  },
}
