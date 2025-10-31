import { ContentMutationsHelpers } from "@compo/contents"
import { useMemoCacheKey, useMemoKey, useSWR } from "@compo/hooks"
import { A } from "@compo/utils"
import { type Api } from "@services/dashboard"
import React from "react"
import { useSWRConfig } from "swr"
import { useTemplatesService } from "./service.context"

/**
 * useSwrTemplates
 */
export const useSwrTemplates = () => {
  const { service, serviceKey, type } = useTemplatesService()
  const key = useMemoKey(baseKey, { serviceKey })
  const { data, mutate, ...props } = useSWR(
    { fetch: () => service.all({ filterBy: { types: [type] } }), key },
    { fallbackData: { templates: [] }, keepPreviousData: true }
  )
  const templates = React.useMemo(() => A.filter(data.templates, (f) => f.type === type), [data, type])
  return {
    ...props,
    ...createTemplateMutations((fn: (items: Api.TemplateWithRelations[]) => Api.TemplateWithRelations[]) =>
      mutate((data) => data && { ...data, templates: fn(data.templates) }, { revalidate: true })
    ),
    mutate,
    templates,
  }
}

/**
 * useMutateTemplates
 */
export const useMutateTemplates = () => {
  const { serviceKey } = useTemplatesService()
  const { mutate } = useSWRConfig()
  const key = useMemoCacheKey(baseKey, { serviceKey })
  return createTemplateMutations((fn: (items: Api.TemplateWithRelations[]) => Api.TemplateWithRelations[]) =>
    mutate(
      key,
      (data: { templates: Api.TemplateWithRelations[] } | undefined) =>
        data && { ...data, templates: fn(data.templates) },
      { revalidate: true }
    )
  )
}

/**
 * SWRTemplates type
 */
export type SWRTemplates = ReturnType<typeof useSwrTemplates>

/* *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** */

/**
 * useSwrTemplates
 */
export const useSwrTemplate = (templateId: string) => {
  const { service, serviceKey } = useTemplatesService()

  const { data, mutate, ...props } = useSWR({
    fetch: service.id(templateId).read,
    key: useMemoKey("dashboard-template", { serviceKey, templateId }),
  })
  // mutation helper
  const mutateTemplate = (template: Partial<Api.TemplateWithRelations>) =>
    mutate((data) => data && { ...data, template: { ...data.template, ...template } }, { revalidate: false })
  const mutateItems = (fn: (items: Api.ContentItem[]) => Api.ContentItem[]) =>
    mutate(
      (data) =>
        data && {
          ...data,
          template: { ...data.template, content: { ...data.template.content, items: fn(data.template.content.items) } },
        },
      {
        revalidate: false,
      }
    )

  // memo data
  const template: Api.TemplateWithRelations | undefined = React.useMemo(() => data?.template, [data])

  const contentMutations: ContentMutationsHelpers = {
    reorderItems: (sortedIds: string[]) =>
      mutateItems((items) => {
        const reordered = reorder(sortedIds)(items)
        return (Array.isArray(reordered) ? reordered : items) as Api.ContentItem[]
      }),
    updateItem: (item: Api.ContentItem) =>
      mutateItems((items) => A.map(items, (f) => (f.id === item.id ? item : f)) as Api.ContentItem[]),
    appendItem: (item: Api.ContentItem, sortedIds?: string[]) =>
      mutateItems((items) => {
        const appended = A.append(items, item) as Api.ContentItem[]
        const reordered = sortedIds ? reorder(sortedIds)(appended) : appended
        return (Array.isArray(reordered) ? reordered : appended) as Api.ContentItem[]
      }),
    rejectItem: (item: Api.ContentItem, sortedIds?: string[]) =>
      mutateItems((items) => {
        const filtered = A.filter(items, (f) => f.id !== item.id) as Api.ContentItem[]
        const reordered = sortedIds ? reorder(sortedIds)(filtered) : filtered
        return (Array.isArray(reordered) ? reordered : filtered) as Api.ContentItem[]
      }),
  }

  const swr = {
    ...props,
    templateId,
    isError: !props.isLoading && !data,
    mutate,
    mutateTemplate,
    ...contentMutations,
  }

  return { template, ...swr }
}

/**
 * SWRTemplate type
 */
export type SWRTemplate = ReturnType<typeof useSwrTemplate>
export type SWRSafeTemplate = Omit<SWRTemplate, "template" | "isLoading" | "isError"> & {
  template: Api.TemplateWithRelations
}

/* *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** */

/**
 * reorder
 */
export const reorder =
  (sortedIds: string[] | undefined) =>
  <I extends { id: string }>(items: I[]) =>
    sortedIds
      ? A.map(items, (item) => ({ ...item, order: A.getIndexBy(sortedIds, (id) => id === item.id) ?? 0 }))
      : items

/**
 * constants
 */
const baseKey = "dashboard-templates"

/**
 * utils
 */
const createTemplateMutations = (
  mutateFn: (fn: (items: Api.TemplateWithRelations[]) => Api.TemplateWithRelations[]) => void
) => {
  return {
    append: (template: Api.TemplateWithRelations) => void mutateFn(A.append(template)),
    update: (template: Partial<Api.TemplateWithRelations>) =>
      void mutateFn(A.map((f) => (f.id === template.id ? { ...f, ...template } : f))),
    reject: (template: Api.TemplateWithRelations) => void mutateFn(A.filter((f) => f.id !== template.id)),
    rejectById: (id: string) => void mutateFn(A.filter((f) => f.id !== id)),
  }
}
