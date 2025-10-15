import { service } from "@/service"
import type { InferItemAsync, RenderAsyncProps, TemplateAsyncProps } from "@contents/lumiq/ssr"
import { type Api } from "@services/site"
import { parseAsArrayOf, parseAsString } from "nuqs/server"
import { TemplateDefault } from "./default"

/**
 * Projects Search Renderer - SSR Component
 *
 * This component handles project search and filtering on the server side (SSR).
 * It retrieves search parameters from the URL, validates filters,
 * and makes API calls to fetch filtered projects.
 *
 * Features:
 * - Text search
 * - Filtering by categories, tags and years
 * - Pagination
 * - Filter validation against available data
 * - URL state management with NUQS
 */
export default async function Renderer({ item, ...props }: RenderAsyncProps<"projects-search">) {
  const { locale } = props

  // Fetch all available metadata (categories, tags, years)
  const metadata = await getMetadata(locale)

  // Parse and validate search parameters from URL
  const query = getQuery(props.searchParams, metadata, item.props.limit || 6)

  // API call to fetch projects with applied filters
  const projectsResult = await service.projects.byPage(locale, query)

  // Prepare props for template
  const templateProps: TemplateProps = {
    props: extractProps(item),
    item,
    ...props,
    projectsData: projectsResult.ok ? projectsResult.data : null, // null if API error
    metadata, // Contains categories, tags, years for filter display
  }

  return <TemplateDefault {...templateProps} />
}

/**
 * TemplateProps
 * Type definition for props passed to the render template
 */
export type TemplateProps = TemplateAsyncProps<"projects-search", ReturnType<typeof extractProps>> & {
  projectsData: Api.ProjectsByPageResponse | null // Projects data with pagination (null if error)
  metadata: Awaited<ReturnType<typeof getMetadata>> // Available categories, tags, years for filters
}

/**
 * extractProps
 * Extract and format properties from the CMS item
 */
const extractProps = (item: InferItemAsync<"projects-search">) => {
  const { title, subtitle, description } = item.translations.props

  return {
    ...item.props,
    level: item.props.level, // Title level (h1, h2, etc.)
    displayHeading: item.props.displayHeading, // Whether to display heading or not
    title,
    subtitle,
    description,
    cardLevel: item.props.displayHeading ? item.props.level + 1 : item.props.level,
  }
}

/**
 * getQuery
 * Parse URL search parameters and build validated API query
 *
 * This function:
 * 1. Parses search params from URL using NUQS server-side parsers
 * 2. Validates filter IDs against available metadata (prevents invalid filters)
 * 3. Returns a properly formatted ProjectsQuery for the API
 */
const getQuery = (
  searchParams: Record<string, unknown>,
  metadata: Awaited<ReturnType<typeof getMetadata>>,
  limit: number
): Api.ProjectsQuery => {
  const { categories, tags, years } = metadata
  // Extract valid IDs for validation
  const categoryIds = categories.map((category) => category.id)
  const tagIds = tags.map((tag) => tag.id)

  // Parse search parameters from URL using NUQS server-side parsers
  const search = parseAsString.parseServerSide(searchParams.search as string | undefined)
  const filterByCategories = parseAsArrayOf(parseAsString).parseServerSide(
    searchParams.categories as string | string[] | undefined
  )
  const filterByYears = parseAsArrayOf(parseAsString).parseServerSide(
    searchParams.years as string | string[] | undefined
  )
  const filterByTags = parseAsArrayOf(parseAsString).parseServerSide(searchParams.tags as string | string[] | undefined)
  const page = parseAsString.parseServerSide(searchParams.page as string | undefined)

  // Validate filters against available data to prevent invalid API calls
  const validCategories = filterByCategories?.filter((id) => categoryIds.includes(id))
  const validTags = filterByTags?.filter((id) => tagIds.includes(id))
  const validYears = filterByYears?.filter((year) => years.includes(year))

  // Return formatted query for API
  return {
    search: search || undefined, // Text search query
    page: page ? parseInt(page) : 1, // Current page (default: 1)
    limit, // Items per page
    filterBy: {
      categories: validCategories?.length ? validCategories : undefined, // Category UUIDs
      years: validYears?.length ? validYears : undefined, // Year strings
      tags: validTags?.length ? validTags : undefined, // Tag UUIDs
    },
  }
}

/**
 * getMetadata
 * Fetch all available filter options from the API
 *
 * This function fetches:
 * - categories: Available project categories for filtering
 * - tags: Available project tags for filtering
 * - years: Available publication years for filtering
 *
 * All calls are made in parallel for performance.
 * Returns empty arrays if any API call fails (graceful degradation).
 */
const getMetadata = async (locale: string) => {
  // Fetch all metadata in parallel for better performance
  const [categories, tags, years] = await Promise.all([
    service.projects.categories(locale),
    service.projects.tags(locale),
    service.projects.years(locale),
  ])

  // Return data if all API calls successful
  if (categories.ok && tags.ok && years.ok) {
    return {
      categories: categories.data.categories, // ProjectCategory[]
      tags: tags.data.tags, // ProjectTag[]
      years: years.data.years, // string[]
    }
  }

  // Fallback to empty arrays if any API call fails (graceful degradation)
  return {
    categories: [],
    tags: [],
    years: [],
  }
}
