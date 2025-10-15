import { useFilterable, useMatchable, useSortable } from "@compo/hooks"
import { useLanguage } from "@compo/translations"
import { Ui } from "@compo/ui"
import { A, pipe, S } from "@compo/utils"
import { type Api, placeholder as servicePlaceholder } from "@services/dashboard"
import React from "react"
import { useSlugsService } from "../service.context"
import { SWRSlug } from "../swr"
import { getSlugResource, getSlugSeo } from "../utils"

/**
 * Sitemap filters hook
 */
export const useSitemapFilters = (ctxPrefix: string) =>
  useFilterable<Api.Slug & Api.WithModel>(
    `${ctxPrefix}-filters`,
    {
      draft: (slug) => getSlugResource(slug).state === "draft",
      published: (slug) => getSlugResource(slug).state === "published",
      all: () => true,
      page: (slug) => slug.model === "page",
      article: (slug) => slug.model === "article",
      project: (slug) => slug.model === "project",
      "project-step": (slug) => slug.model === "project-step",
    },
    {
      all: true,
    }
  )

/**
 * useEditSlug
 */
export const useEditSlug = (swr: SWRSlug) => {
  const [editSlug, editSlugProps] = Ui.useQuickDialog<Api.Slug, Api.Slug & Api.WithModel>({
    mutate: async (slug) => {
      swr.mutateSlug(slug)
    },
  })
  return [editSlug, editSlugProps] as const
}

export const useSitemapFiltered = (swr: SWRSlug) => {
  const { translate, languages } = useLanguage()
  const { serviceKey } = useSlugsService()
  const ctxPrefix = `${serviceKey}-sitemap`

  // sort, filters and search
  const [filterable, filters] = useSitemapFilters(ctxPrefix)

  const searchByLanguage = A.map(languages, (l) => (item: Api.Slug & Api.WithModel) => {
    const seo = getSlugSeo(item)
    const seoTranslated = translate.language(l.id)(seo, servicePlaceholder.seo)
    return seoTranslated?.title ?? item.path
  })
  const [matchable, matchIn] = useMatchable<Api.Slug & Api.WithModel>(`${ctxPrefix}-search`, [
    "path",
    ...searchByLanguage,
  ])

  const [sortable, sortBy] = useSortable<Api.Slug & Api.WithModel>(
    `${ctxPrefix}-sort`,
    {
      path: [(item) => item.path, "asc", "alphabet"],
      title: [(item) => translate(getSlugSeo(item), servicePlaceholder.seo).title, "asc", "alphabet"],
      createdAt: [(item) => getSlugResource(item).createdAt, "desc", "number"],
      updatedAt: [(item) => getSlugResource(item).updatedAt, "desc", "number"],
    },
    "path"
  )

  const filtered = React.useMemo(
    () => pipe(swr.slugs, filters, S.isEmpty(S.trim(matchable.search)) ? sortBy : matchIn),
    [swr.slugs, filters, matchIn, matchable.search, sortBy]
  )

  const reset = () => {
    sortable.reset()
    matchable.setSearch("")
  }

  const groupedSlugs = React.useMemo(() => {
    return groupItemsByPath(filtered)
  }, [filtered])

  return {
    filtered,
    filterable,
    matchable,
    sortable,
    groupedSlugs,
    reset,
  }
}

/**
 * Grouped slugs
 */
export type GroupedSlugs = {
  [key: string]: GroupedSlugs | (Api.Slug & Api.WithModel)[]
}
const groupItemsByPath = (items: (Api.Slug & Api.WithModel)[]): GroupedSlugs => {
  return A.reduce(items, {} as GroupedSlugs, (acc, item) => {
    let segments = item.path.split("/").filter(Boolean)
    if (segments.length === 1) segments = A.prepend(segments, "")
    segments = A.map(segments, (segment) => `/${segment}`)
    let current = acc

    segments.forEach((segment, idx) => {
      if (idx === segments.length - 1) {
        // Final segment - should be an array of items
        if (!current[segment]) {
          current[segment] = []
        } else if (!Array.isArray(current[segment])) {
          // Conflict: there's already a group with this name
          // Convert to mixed structure: keep existing group and add items
          const existingGroup = current[segment] as GroupedSlugs
          current[segment] = {
            ...existingGroup,
            __items__: [],
          }
        }

        const target = Array.isArray(current[segment])
          ? (current[segment] as (Api.Slug & Api.WithModel)[])
          : ((current[segment] as GroupedSlugs).__items__ as (Api.Slug & Api.WithModel)[])

        target.push(item)
      } else {
        // Intermediate segment - should be a group
        if (!current[segment]) {
          current[segment] = {}
        } else if (Array.isArray(current[segment])) {
          // Conflict: there are already items with this segment name
          // Convert to mixed structure: keep items and add group capabilities
          const existingItems = current[segment] as (Api.Slug & Api.WithModel)[]
          current[segment] = {
            __items__: existingItems,
          }
        }

        current = current[segment] as GroupedSlugs
      }
    })

    return acc
  })
}
