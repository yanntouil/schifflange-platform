import { useWorkspace } from "@/features/workspaces"
import { Api } from "@/services"
import { Content, ContentItems } from "@compo/contents"
import { Dashboard } from "@compo/dashboard"
import { SWRTemplate, TemplateHeader, useTemplatesService } from "@compo/templates"
import { client } from "@contents/schifflange-website"
import React from "react"

/**
 * template details page
 */
type Props = {
  template: Api.TemplateWithRelations
} & Omit<SWRTemplate, "template" | "isLoading" | "isError">
const Page: React.FC<Props> = ({ template, updateItem, appendItem, rejectItem, reorderItems }) => {
  const { service } = useTemplatesService()

  // prepare content props
  const { makePreviewItemUrl } = useWorkspace()
  const contentService = service.id(template.id).content
  const swrContent = { updateItem, appendItem, rejectItem, reorderItems }
  const contentProps = {
    persistedId: template.id,
    makePreviewItemUrl,
    service: contentService,
    content: template.content,
    swr: swrContent,
    type: "template" as const,
  }

  return (
    <Dashboard.Container>
      <TemplateHeader template={template} />
      <Content {...contentProps} items={client.items as unknown as ContentItems} disabledTemplates />
    </Dashboard.Container>
  )
}

export default Page
