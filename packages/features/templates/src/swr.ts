import { ContentMutationsHelpers } from "@compo/contents"
import { useMemoKey, useSWR } from "@compo/hooks"
import { A } from "@compo/utils"
import { type Api } from "@services/dashboard"
import React from "react"
import { useTemplatesService } from "./service.context"

/**
 * useSwrTemplates
 */
export const useSwrTemplates = () => {
  const { service, serviceKey, type } = useTemplatesService()

  const { data, mutate, ...props } = useSWR(
    {
      fetch: () => service.all({ filterBy: { types: [type] } }),
      key: useMemoKey("dashboard-templates", { serviceKey }),
    },
    {
      fallbackData: {
        templates: [],
      },
      keepPreviousData: true,
    }
  )

  const templates = React.useMemo(() => A.filter(data.templates, (f) => f.type === type), [data, type])

  // mutation helper
  const mutateTemplates = (fn: (items: Api.TemplateWithRelations[]) => Api.TemplateWithRelations[]) =>
    mutate((data) => data && { ...data, templates: fn(data.templates) }, { revalidate: true })
  const swr = {
    ...props,
    mutate,
    update: (template: Partial<Api.TemplateWithRelations>) =>
      void mutateTemplates(
        (templates) =>
          A.map(templates, (f) => (f.id === template.id ? { ...f, ...template } : f)) as Api.TemplateWithRelations[]
      ),
    reject: (template: Api.TemplateWithRelations) =>
      void mutateTemplates(
        (templates) => A.filter(templates, (f) => f.id !== template.id) as Api.TemplateWithRelations[]
      ),
    rejectById: (id: string) =>
      void mutateTemplates((templates) => A.filter(templates, (f) => f.id !== id) as Api.TemplateWithRelations[]),
    append: (template: Api.TemplateWithRelations) =>
      void mutateTemplates((templates) => A.append(templates, template) as Api.TemplateWithRelations[]),
  }

  return { templates, ...swr }
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
