import { Api } from "../api"
import { articles } from "../articles"
import { projects } from "../projects"
import { SlugsResponse } from "../slugs/types"
import { CommonErrors, ContentItem, Language, MenuItemWithRelations } from "../types"
import { PageResponse, PageResponseNotFound } from "./types"

/**
 * slugs service
 */
export const sites = (api: Api) => ({
  /**
   * languages
   * get all languages for a workspace
   */
  languages: () => api.get<{ languages: Language[] }, CommonErrors>(`languages`),

  /**
   * tracking
   * track a user's journey
   */
  tracking: async (trackingId: string, traceId?: string) =>
    api.post<{ traceId: string }, CommonErrors>(`trackings/${trackingId}`, { data: { traceId } }),

  /**
   * slugs
   * get all slugs for next ISR
   */
  slugs: () => api.get<SlugsResponse, CommonErrors>(`slugs`),

  /**
   * menu
   * get a menus by locale
   */
  menus: async (locale: string) =>
    api.get<{ header: MenuItemWithRelations[]; footer: MenuItemWithRelations[] }, CommonErrors>(`menus/${locale}`),

  /**
   * preview
   * get a preview for cms item
   */
  preview: {
    item: (id: string, locale: string) =>
      api.get<ContentItem, CommonErrors>(`preview/${locale}/item/${id}`, {
        // @ts-expect-error - next is not a valid option for fetch
        next: { revalidate: 0 }, // Disable cache for preview
        cache: "no-store",
      }),
  },

  /**
   * page
   * get a page by locale and path
   */
  page: (locale: string, ...path: string[]) =>
    api.get<PageResponse, CommonErrors<PageResponseNotFound>>(`pages/${locale}/${path.join("/")}`),
  articles: articles(api),
  projects: projects(api),
})
