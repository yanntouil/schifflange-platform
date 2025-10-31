import { useWorkspace } from "@/features/workspaces"
import { Api } from "@/services"
import { Content, ContentItems } from "@compo/contents"
import { Dashboard } from "@compo/dashboard"
import { MenuButton, SWREvent, useEventsService } from "@compo/events"
import { useTranslation } from "@compo/localize"
import { Publication, type PublicationProps } from "@compo/publications"
import { Schedule, type ScheduleProps } from "@compo/schedules"
import { Seo, SeoProps } from "@compo/seos"
import { TemplatesServiceProvider } from "@compo/templates"
import { useContextualLanguage } from "@compo/translations"
import { client } from "@contents/schifflange-website"
import React from "react"
import routeToTemplates from "../templates"
import routeToTemplate from "../templates/[templateId]"

/**
 * event details page
 */
type Props = {
  event: Api.EventWithRelations
} & Omit<SWREvent, "event" | "isLoading" | "isError">
const Page: React.FC<Props> = ({
  event,
  mutateSeo,
  mutatePublication,
  mutateSchedule,
  updateItem,
  appendItem,
  rejectItem,
  reorderItems,
}) => {
  const { _ } = useTranslation(dictionary)
  const { workspace, service: workspaceService } = useWorkspace()
  const { t, current } = useContextualLanguage()

  const { service, makeUrl } = useEventsService()

  // prepare content props
  const { makePreviewItemUrl } = useWorkspace()
  const contentService = service.id(event.id).content
  const swrContent = { updateItem, appendItem, rejectItem, reorderItems }
  const contentProps = {
    persistedId: event.id,
    makePreviewItemUrl,
    service: contentService,
    content: event.content,
    swr: swrContent,
  }

  // prepare SEO props
  const seoService = service.id(event.id).seo
  const seoProps: SeoProps = {
    persistedId: event.id,
    service: seoService,
    seo: event.seo,
    mutate: mutateSeo,
    placeholder: _("placeholder", { language: t(current.code).toLowerCase() }),
    slug: { url: makeUrl(event.slug), path: event.slug.path },
  }

  // prepare publication props
  const publicationService = service.id(event.id).publication
  const publicationProps: PublicationProps = {
    persistedId: event.id,
    service: publicationService,
    publication: event.publication,
    mutate: mutatePublication,
    publishedUsers: workspace.members,
  }

  // prepare schedule props
  const scheduleService = service.id(event.id).schedule
  const scheduleProps: ScheduleProps = {
    persistedId: event.id,
    service: scheduleService,
    schedule: event.schedule,
    mutate: mutateSchedule,
  }

  // prepare templates props
  const templatesProps = {
    type: "event" as const,
    service: workspaceService.templates,
    serviceKey: `${event.id}-templates`,
    items: client.items as unknown as ContentItems,
    routeToTemplates,
    routeToTemplate,
  }

  return (
    <Dashboard.Container>
      <Seo {...seoProps} aside={<MenuButton />} />
      <Publication {...publicationProps} />
      <Schedule {...scheduleProps} />
      <TemplatesServiceProvider {...templatesProps}>
        <Content {...contentProps} items={client.items as unknown as ContentItems} />
      </TemplatesServiceProvider>
    </Dashboard.Container>
  )
}
export default Page

/**
 * translations
 */
const dictionary = {
  en: {
    //
  },
  fr: {
    //
  },
  de: {
    //
  },
}
