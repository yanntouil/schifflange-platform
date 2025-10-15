import { useWorkspace } from "@/features/workspaces"
import { Api } from "@/services"
import { Content, ContentItems } from "@compo/contents"
import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { MenuButton, SWRPage, usePagesService } from "@compo/pages"
import { Seo, SeoProps } from "@compo/seos"
import { TemplatesServiceProvider } from "@compo/templates"
import { useContextualLanguage } from "@compo/translations"
import { client } from "@contents/lumiq"
import React from "react"
import routeToTemplates from "../"
import routeToTemplate from "../templates/[templateId]"

/**
 * Lumiq page details page
 */
type Props = {
  page: Api.PageWithRelations
} & Omit<SWRPage, "page" | "isLoading" | "isError">
const Page: React.FC<Props> = ({ page, mutateSeo, updateItem, appendItem, rejectItem, reorderItems }) => {
  const { _ } = useTranslation(dictionary)
  const { workspace, service: workspaceService } = useWorkspace()
  const { t, current } = useContextualLanguage()
  const { service, makePath, getImageUrl, makeUrl } = usePagesService()

  // prepare content props
  const { makePreviewItemUrl } = useWorkspace()
  const contentService = service.id(page.id).content
  const swrContent = { updateItem, appendItem, rejectItem, reorderItems }
  const contentProps = {
    persistedId: page.id,
    makePreviewItemUrl,
    service: contentService,
    content: page.content,
    swr: swrContent,
  }

  // prepare SEO props
  const seoService = service.id(page.id).seo
  const seoProps: SeoProps = {
    persistedId: page.id,
    service: seoService,
    seo: page.seo,
    mutate: mutateSeo,
    placeholder: _("placeholder", { language: t(current.code).toLowerCase() }),
    slug: { url: makeUrl(page), path: page.slug.path },
    makePath,
    getImageUrl,
  }

  // prepare templates service props (use in content component)
  const templatesProps = {
    type: "page" as const,
    service: workspaceService.templates,
    serviceKey: `${page.id}-templates`,
    items: client.items as unknown as ContentItems,
    routeToTemplates,
    routeToTemplate,
  }

  return (
    <Dashboard.Container>
      <Seo {...seoProps} aside={<MenuButton />} />
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
    description: "Manage page content, SEO, and settings",
    placeholder: "Untitled page in {{language}}",
  },
  fr: {
    description: "Gérer le contenu, SEO et paramètres de la page",
    placeholder: "Page sans titre en {{language}}",
  },
  de: {
    description: "Seiteninhalte, SEO und Einstellungen verwalten",
    placeholder: "Unbenannte Seite auf {{language}}",
  },
}
