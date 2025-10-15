import { ContentMutationsHelpers } from "@compo/contents"
import { useMemoKey, useSWR } from "@compo/hooks"
import { A } from "@compo/utils"
import { type Api } from "@services/dashboard"
import React from "react"
import { useProjectsService } from "./service.context"

/**
 * useSwrCategories
 */
export const useSwrCategories = () => {
  const { service, serviceKey } = useProjectsService()

  const { data, mutate, ...props } = useSWR(
    {
      fetch: () => service.categories.all({}),
      key: useMemoKey("dashboard-projects-categories", { serviceKey }),
    },
    {
      fallbackData: {
        categories: [],
      },
      keepPreviousData: true,
    }
  )

  const { categories } = data

  // mutation helper
  const mutateCategories = (fn: (items: Api.ProjectCategory[]) => Api.ProjectCategory[]) =>
    mutate((data) => data && { ...data, categories: fn(data.categories) }, { revalidate: true })
  const swr = {
    ...props,
    mutate,
    update: (category: Api.ProjectCategory) =>
      void mutateCategories(
        (categories) => A.map(categories, (f) => (f.id === category.id ? category : f)) as Api.ProjectCategory[]
      ),
    reject: (category: Api.ProjectCategory) =>
      void mutateCategories((categories) => A.filter(categories, (f) => f.id !== category.id) as Api.ProjectCategory[]),
    rejectById: (id: string) =>
      void mutateCategories((categories) => A.filter(categories, (f) => f.id !== id) as Api.ProjectCategory[]),
    append: (category: Api.ProjectCategory) =>
      void mutateCategories((categories) => A.append(categories, category) as Api.ProjectCategory[]),
  }

  return { categories, ...swr }
}

/**
 * SWRCategories type
 */
export type SWRCategories = ReturnType<typeof useSwrCategories>

/* *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** */

/**
 * useSwrTags
 */
export const useSwrTags = () => {
  const { service, serviceKey } = useProjectsService()

  const { data, mutate, ...props } = useSWR(
    {
      fetch: () => service.tags.all(),
      key: useMemoKey("dashboard-projects-tags", { serviceKey }),
    },
    {
      fallbackData: {
        tags: [],
      },
      keepPreviousData: true,
    }
  )

  const { tags } = data

  // mutation helper
  const mutateTags = (fn: (items: Api.ProjectTag[]) => Api.ProjectTag[]) =>
    mutate((data) => data && { ...data, tags: fn(data.tags) }, { revalidate: true })
  const swr = {
    ...props,
    mutate,
    update: (tag: Api.ProjectTag) =>
      void mutateTags((tags) => A.map(tags, (f) => (f.id === tag.id ? tag : f)) as Api.ProjectTag[]),
    reject: (tag: Api.ProjectTag) =>
      void mutateTags((tags) => A.filter(tags, (f) => f.id !== tag.id) as Api.ProjectTag[]),
    rejectById: (id: string) => void mutateTags((tags) => A.filter(tags, (f) => f.id !== id) as Api.ProjectTag[]),
    append: (tag: Api.ProjectTag) => void mutateTags((tags) => A.append(tags, tag) as Api.ProjectTag[]),
  }

  return { tags, ...swr }
}

/**
 * SWRTags type
 */
export type SWRTags = ReturnType<typeof useSwrTags>

/* *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** */

/**
 * useSwrProjects
 */
export const useSwrProjects = () => {
  const { service, serviceKey } = useProjectsService()

  const { data, mutate, ...props } = useSWR(
    {
      fetch: () => service.all({}),
      key: useMemoKey("dashboard-projects", { serviceKey }),
    },
    {
      fallbackData: {
        projects: [],
      },
      keepPreviousData: true,
    }
  )

  const { projects } = data

  // mutation helper
  const mutateProjects = (fn: (items: Api.ProjectWithRelations[]) => Api.ProjectWithRelations[]) =>
    mutate((data) => data && { ...data, projects: fn(data.projects) }, { revalidate: true })
  const swr = {
    ...props,
    mutate,
    update: (project: Partial<Api.ProjectWithRelations>) =>
      void mutateProjects(
        (projects) =>
          A.map(projects, (f) => (f.id === project.id ? { ...f, ...project } : f)) as Api.ProjectWithRelations[]
      ),
    reject: (project: Api.ProjectWithRelations) =>
      void mutateProjects((projects) => A.filter(projects, (f) => f.id !== project.id) as Api.ProjectWithRelations[]),
    rejectById: (id: string) =>
      void mutateProjects((projects) => A.filter(projects, (f) => f.id !== id) as Api.ProjectWithRelations[]),
    append: (project: Api.ProjectWithRelations) =>
      void mutateProjects((projects) => A.append(projects, project) as Api.ProjectWithRelations[]),
  }

  return { projects, ...swr }
}

/**
 * SWRProjects type
 */
export type SWRProjects = ReturnType<typeof useSwrProjects>

/* *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** */

/**
 * useSwrProject
 */
export const useSwrProject = (projectId: string) => {
  const { service, serviceKey } = useProjectsService()

  const { data, mutate, ...props } = useSWR({
    fetch: service.id(projectId).read,
    key: useMemoKey("dashboard-project", { serviceKey, projectId }),
  })
  // mutation helper
  const mutateProject = (project: Partial<Api.ProjectWithRelations>) =>
    mutate((data) => data && { ...data, project: { ...data.project, ...project } }, { revalidate: false })
  const mutateItems = (fn: (items: Api.ContentItem[]) => Api.ContentItem[]) =>
    mutate(
      (data) =>
        data && {
          ...data,
          project: { ...data.project, content: { ...data.project.content, items: fn(data.project.content.items) } },
        },
      {
        revalidate: false,
      }
    )
  const mutateSeo = (seo: Api.Seo) =>
    mutate((data) => data && { ...data, project: { ...data.project, seo } }, { revalidate: false })
  const mutatePublication = (publication: Api.Publication) =>
    mutate((data) => data && { ...data, project: { ...data.project, publication } }, { revalidate: false })

  // memo data
  const project: Api.ProjectWithRelations | undefined = React.useMemo(() => data?.project, [data])

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
    projectId,
    isError: !props.isLoading && !data,
    mutate,
    mutateProject,
    mutateSeo,
    mutatePublication,
    ...contentMutations,
  }

  return { project, ...swr }
}

/**
 * SWRProject type
 */
export type SWRProject = ReturnType<typeof useSwrProject>
export type SWRSafeProject = Omit<SWRProject, "project" | "isLoading" | "isError"> & {
  project: Api.ProjectWithRelations
}

/**
 * useSwrProjectStep
 */
export const useSwrProjectStep = (projectId: string, stepId: string) => {
  const { service, serviceKey } = useProjectsService()

  const { data, mutate, ...props } = useSWR({
    fetch: service.id(projectId).steps.id(stepId).read,
    key: useMemoKey("dashboard-project-step", { serviceKey, projectId, stepId }),
  })

  const mutateStep = (step: Partial<Api.ProjectStepWithRelations>) =>
    mutate((data) => data && { ...data, step: { ...data.step, ...step } }, { revalidate: false })
  const mutateItems = (fn: (items: Api.ContentItem[]) => Api.ContentItem[]) =>
    mutate(
      (data) =>
        data && {
          ...data,
          step: { ...data.step, content: { ...data.step.content, items: fn(data.step.content.items) } },
        },
      {
        revalidate: false,
      }
    )
  const mutateSeo = (seo: Api.Seo) =>
    mutate((data) => data && { ...data, step: { ...data.step, seo } }, { revalidate: false })

  const step: Api.ProjectStepWithRelations | undefined = React.useMemo(() => data?.step, [data])

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
    projectId,
    isError: !props.isLoading && !data,
    mutate,
    mutateStep,
    mutateSeo,
    ...contentMutations,
  }

  return { step, ...swr }
}

/**
 * SWRProjectStep type
 */
export type SWRProjectStep = ReturnType<typeof useSwrProjectStep>
export type SWRSafeProjectStep = Omit<SWRProjectStep, "step" | "isLoading" | "isError"> & {
  step: Api.ProjectStepWithRelations
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
