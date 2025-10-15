import { service } from "@/service"
import { makeLinkProps } from "@/utils/links"
import type { InferItemAsync, RenderAsyncProps, TemplateAsyncProps } from "@contents/lumiq/ssr"
import { Api } from "@services/site"
import { TemplateDefault } from "./default"

/**
 * Features Process Item Renderer
 * Renders the process component for preview
 */
export default async function Renderer({ item, ...props }: RenderAsyncProps<"projects-latest">) {
  const query = getQuery(item.props.categories, item.props.tags, item.props.limit)
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
export type TemplateProps = TemplateAsyncProps<"projects-latest", ReturnType<typeof extractProps>> & {
  projectsData: Api.ProjectsResponse | null // Projects data with pagination (null if error)
}
const extractProps = (item: InferItemAsync<"projects-latest">) => {
  const { title, subtitle, description } = item.translations.props
  const link = item.props.displayLink ? makeLinkProps(item.props.link, item.translations.props.link, item.slugs) : null
  return {
    ...item.props,
    level: item.props.level,
    displayHeading: item.props.displayHeading,
    title,
    subtitle,
    description,
    cardLevel: item.props.displayHeading ? item.props.level + 1 : item.props.level,
    link,
  }
}

/**
 * getQuery
 */
const getQuery = (categories: string[], tags: string[], limit: number): Api.ProjectsQuery => {
  // Return formatted query for API
  return {
    limit, // Items per page
    filterBy: {
      categories: categories?.length ? categories : undefined, // Category UUIDs
      tags: tags?.length ? tags : undefined, // Tag UUIDs
    },
  }
}
