import { useWorkspace } from "@/features/workspaces"
import { Api } from "@/services"
import { Content, ContentItems } from "@compo/contents"
import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { MenuButton, Meta, Steps, SWRProject, useProjectsService } from "@compo/projects"
import { Publication, PublicationProps } from "@compo/publications"
import { Seo, SeoProps } from "@compo/seos"
import { useContextualLanguage } from "@compo/translations"
import { client } from "@contents/lumiq"
import React from "react"

/**
 * Lumiq project details page
 */
type Props = {
  project: Api.ProjectWithRelations
} & Omit<SWRProject, "project" | "isLoading" | "isError">
const Page: React.FC<Props> = ({ project, mutateSeo, mutatePublication, updateItem, appendItem, rejectItem, reorderItems }) => {
  const { _ } = useTranslation(dictionary)
  const { workspace } = useWorkspace()
  const { t, current } = useContextualLanguage()

  const { service, makePath, getImageUrl, makeUrl } = useProjectsService()

  // prepare content props
  const { makePreviewItemUrl } = useWorkspace()
  const contentService = service.id(project.id).content
  const swrContent = { updateItem, appendItem, rejectItem, reorderItems }
  const contentProps = {
    persistedId: project.id,
    makePreviewItemUrl,
    service: contentService,
    content: project.content,
    swr: swrContent,
    type: "project" as const,
  }

  // prepare SEO props
  const seoService = service.id(project.id).seo
  const seoProps: SeoProps = {
    persistedId: project.id,
    service: seoService,
    seo: project.seo,
    mutate: mutateSeo,
    placeholder: _("placeholder", { language: t(current.code).toLowerCase() }),
    slug: { url: makeUrl(project), path: project.slug.path },
    makePath,
    getImageUrl,
  }

  // prepare publication props
  const publicationService = service.id(project.id).publication
  const publicationProps: PublicationProps = {
    persistedId: project.id,
    service: publicationService,
    publication: project.publication,
    mutate: mutatePublication,
    getImageUrl,
    publishedUsers: workspace.members,
  }

  return (
    <Dashboard.Container>
      <Seo {...seoProps} aside={<MenuButton />} beforeSlug={<Steps />} />
      <Meta />
      <Publication {...publicationProps} />
      <Content {...contentProps} items={client.items as unknown as ContentItems} />
    </Dashboard.Container>
  )
}
export default Page

/**
 * translations
 */
const dictionary = {
  en: {
    "step-add": "Add step",
    "step-title": "{{type}} step",
    "step-consultation": "consultation ",
    "step-incubation": "incubation ",
    "step-scaling": "scaling ",
    "step-delete": "Delete step",
    "step-state-draft": "Draft (click to publish)",
    "step-state-published": "Published (click to draft)",
    "category-label": "Category",
    "tag-label": "Tag",
  },
  fr: {
    "step-add": "Ajouter une étape",
    "step-title": "Étape {{type}}",
    "step-consultation": "de consultation ",
    "step-incubation": "d'incubation ",
    "step-scaling": "de multiplication ",
    "step-delete": "Supprimer l'étape",
    "step-state-draft": "Brouillon (cliquer pour publier)",
    "step-state-published": "Publié (cliquer pour mettre en brouillon)",
    "category-label": "Catégorie",
    "tag-label": "Tag",
  },
  de: {
    "step-add": "Schritt hinzufügen",
    "step-title": "{{type}} Schritt",
    "step-consultation": "Beratungs",
    "step-incubation": "Inkubations",
    "step-scaling": "Skalierungs",
    "step-delete": "Schritt löschen",
    "step-state-draft": "Entwurf (zum Veröffentlichen klicken)",
    "step-state-published": "Veröffentlicht (zum Entwurf klicken)",
    "category-label": "Kategorie",
    "tag-label": "Tag",
  },
}
