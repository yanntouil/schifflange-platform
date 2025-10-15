import { appendQS } from "@compo/utils"
import { Api } from "../api"
import {
  ProjectsByPageResponse,
  ProjectsCategoriesResponse,
  ProjectsLatestResponse,
  ProjectsQuery,
  ProjectsResponse,
  ProjectsTagsResponse,
  ProjectsYearsResponse,
} from "./types"

/**
 * projects service
 * Get projects with filtering, sorting, and pagination
 */
export const projects = (api: Api) => ({
  /**
   * Get all projects with optional filtering and sorting
   */
  all: (locale: string, query?: ProjectsQuery) => api.get<ProjectsResponse>(appendQS(`projects/${locale}`, query)),

  /**
   * Get paginated projects
   */
  byPage: (locale: string, query?: ProjectsQuery) =>
    api.get<ProjectsByPageResponse>(appendQS(`projects-by-page/${locale}`, query)),

  /**
   * Get the latest published project
   */
  latest: (locale: string, query?: ProjectsQuery) =>
    api.get<ProjectsLatestResponse>(appendQS(`projects-latest/${locale}`, query)),

  /**
   * Get all categories for a workspace
   */
  categories: (locale: string) => api.get<ProjectsCategoriesResponse>(`projects-categories/${locale}`),

  /**
   * Get all tags for a workspace
   */
  tags: (locale: string) => api.get<ProjectsTagsResponse>(`projects-tags/${locale}`),

  /**
   * Get all years for a workspace
   */
  years: (locale: string) => api.get<ProjectsYearsResponse>(`projects-years/${locale}`),
})
