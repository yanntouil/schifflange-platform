import { service } from "@/service"
import type { InferItemAsync, RenderAsyncProps, TemplateAsyncProps } from "@contents/lumiq/ssr"
import { Api } from "@services/site"
import { TemplateDefault } from "./default"

/**
 * Features Process Item Renderer
 * Renders the process component for preview
 */
export default async function Renderer({ item, ...props }: RenderAsyncProps<"projects-related">) {
  const query = getQuery(item.props.categories, item.props.tags, item.props.projects, item.props.limit)
  // API call to fetch projects with applied filters
  const projectsResult = await service.projects.all(props.locale, query)

  // Prepare props for template
  const templateProps: TemplateProps = {
    props: extractProps(item),
    item,
    ...props,
    projectsData: projectsResult.ok ? projectsResult.data : null, // null if API error
  }
  return <TemplateDefault {...templateProps} />
}

/**
 * TemplateProps
 */
export type TemplateProps = TemplateAsyncProps<"projects-related", ReturnType<typeof extractProps>> & {
  projectsData: Api.ProjectsResponse | null // Projects data with pagination (null if error)
}
const extractProps = (item: InferItemAsync<"projects-related">) => {
  const { title, subtitle, description } = item.translations.props
  return {
    ...item.props,
    level: item.props.level,
    displayHeading: item.props.displayHeading,
    title,
    subtitle,
    description,
    cardLevel: item.props.displayHeading ? item.props.level + 1 : item.props.level,
  }
}

/**
 * getQuery
 */
const getQuery = (categories: string[], tags: string[], projects: string[], limit: number): Api.ProjectsQuery => {
  // Return formatted query for API
  return {
    limit, // Items per page
    filterBy: {
      categories: categories?.length ? categories : undefined, // Category UUIDs
      tags: tags?.length ? tags : undefined, // Tag UUIDs
      in: projects?.length ? projects : undefined, // Article UUIDs
    },
  }
}
