import { useWorkspace } from "@/features/workspaces"
import { Api } from "@/services"
import { CategorySelect, MenuButton, SWRArticle, useArticlesService, useCategoryOptions } from "@compo/articles"
import { Content, ContentItems } from "@compo/contents"
import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { Publication, PublicationProps } from "@compo/publications"
import { Seo, SeoProps } from "@compo/seos"
import { TemplatesServiceProvider } from "@compo/templates"
import { useContextualLanguage } from "@compo/translations"
import { client } from "@contents/schifflange-website"
import { Folder } from "lucide-react"
import React from "react"
import routeToTemplates from "../templates"
import routeToTemplate from "../templates/[templateId]"

/**
 * article details page
 */
type Props = {
  article: Api.ArticleWithRelations
} & Omit<SWRArticle, "article" | "isLoading" | "isError">
const Page: React.FC<Props> = ({ article, mutateSeo, mutatePublication, updateItem, appendItem, rejectItem, reorderItems }) => {
  const { _ } = useTranslation(dictionary)
  const { workspace, service: workspaceService } = useWorkspace()
  const { t, current } = useContextualLanguage()

  const { service, makePath, getImageUrl, makeUrl } = useArticlesService()

  // prepare content props
  const { makePreviewItemUrl } = useWorkspace()
  const contentService = service.id(article.id).content
  const swrContent = { updateItem, appendItem, rejectItem, reorderItems }
  const contentProps = {
    persistedId: article.id,
    makePreviewItemUrl,
    service: contentService,
    content: article.content,
    swr: swrContent,
  }

  // prepare SEO props
  const seoService = service.id(article.id).seo
  const seoProps: SeoProps = {
    persistedId: article.id,
    service: seoService,
    seo: article.seo,
    mutate: mutateSeo,
    placeholder: _("placeholder", { language: t(current.code).toLowerCase() }),
    slug: { url: makeUrl(article.slug), path: article.slug.path },
    makePath,
    getImageUrl,
  }

  // prepare publication props
  const publicationService = service.id(article.id).publication
  const publicationProps: PublicationProps = {
    persistedId: article.id,
    service: publicationService,
    publication: article.publication,
    mutate: mutatePublication,
    getImageUrl,
    publishedUsers: workspace.members,
  }

  const [categoryOptions, isLoadingCategoryOptions] = useCategoryOptions(true)

  // prepare templates props
  const templatesProps = {
    type: "article" as const,
    service: workspaceService.templates,
    serviceKey: `${article.id}-templates`,
    items: client.items as unknown as ContentItems,
    routeToTemplates,
    routeToTemplate,
  }

  return (
    <Dashboard.Container>
      <Seo {...seoProps} aside={<MenuButton />} />
      <Publication
        {...publicationProps}
        fieldsBefore={
          <Dashboard.Field.Item icon={<Folder aria-hidden />} name={_("category-label")}>
            <CategorySelect className="-mt-2 -ml-3" />
          </Dashboard.Field.Item>
        }
      />
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
    "category-label": "Category",
  },
  fr: {
    "category-label": "Catégorie",
  },
  de: {
    "category-label": "Kategorie",
  },
}
