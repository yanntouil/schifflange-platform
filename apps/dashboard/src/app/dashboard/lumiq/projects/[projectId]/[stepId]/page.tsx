import { useWorkspace } from "@/features/workspaces"
import { Api } from "@/services"
import { Content, ContentItems } from "@compo/contents"
import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { StepMenuButton, SWRProjectStep, useProjectsService } from "@compo/projects"
import { Seo, SeoProps } from "@compo/seos"
import { useContextualLanguage } from "@compo/translations"
import { client } from "@contents/lumiq"
import React from "react"

/**
 * Lumiq project details page
 */
type Props = {
  step: Api.ProjectStepWithRelations
} & Omit<SWRProjectStep, "step" | "isLoading" | "isError">
const Page: React.FC<Props> = ({ step, mutateSeo, updateItem, appendItem, rejectItem, reorderItems }) => {
  const { _ } = useTranslation(dictionary)
  const { t, current } = useContextualLanguage()

  const { service, makePath, getImageUrl, makeStepUrl } = useProjectsService()
  const stepService = service.id(step.project.id).steps.id(step.id)

  // prepare content props
  const { makePreviewItemUrl } = useWorkspace()
  const swrContent = { updateItem, appendItem, rejectItem, reorderItems }
  const contentProps = {
    persistedId: step.project.id,
    makePreviewItemUrl,
    service: stepService.content,
    content: step.content,
    swr: swrContent,
    type: "projectStep" as const,
  }

  // prepare SEO props
  const seoProps: SeoProps = {
    persistedId: step.id,
    service: stepService.seo,
    seo: step.seo,
    mutate: mutateSeo,
    placeholder: _("placeholder", { language: t(current.code).toLowerCase() }),
    slug: { url: makeStepUrl(step), path: step.slug.path },
    makePath,
    getImageUrl,
  }

  return (
    <Dashboard.Container>
      <Seo {...seoProps} aside={<StepMenuButton />} />
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
    placeholder: "Untitled step {{type}}",
  },
  fr: {
    placeholder: "Étape sans titre {{type}}",
  },
  de: {
    placeholder: "Schritt ohne Titel {{type}}",
  },
}
