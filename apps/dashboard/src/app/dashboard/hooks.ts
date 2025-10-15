import { isWorkspaceAdmin, useWorkspace } from "@/features/workspaces"
import { Api, service as rootService } from "@/services"
import { MenusServiceContextType } from "@compo/menus"

export const usePageServiceProps = (routeToPages: () => string, routeToPage: (pageId: string) => string) => {
  const { workspace, service, makeUrlFromSlug } = useWorkspace()
  return {
    service: service.pages,
    serviceKey: workspace.id,
    isAdmin: isWorkspaceAdmin(workspace),
    routeToPages,
    routeToPage,
    makeUrl: (page: Api.PageWithRelations, code?: string) => makeUrlFromSlug(page.slug, code),
  }
}
export const useArticleServiceProps = (
  routeToArticles: () => string,
  routeToArticle: (articleId: string) => string,
  routeToCategories: () => string
) => {
  const { workspace, service, makeUrlFromSlug } = useWorkspace()
  return {
    service: service.articles,
    serviceKey: workspace.id,
    isAdmin: isWorkspaceAdmin(workspace),
    routeToCategories,
    routeToArticles,
    routeToArticle,
    makeUrl: (article: Api.ArticleWithRelations, code?: string) => makeUrlFromSlug(article.slug, code),
  }
}
export const useProjectServiceProps = (
  routeToProjects: () => string,
  routeToProject: (projectId: string) => string,
  routeToStep: (projectId: string, stepId: string) => string,
  routeToCategories: () => string
) => {
  const { workspace, service, makeUrlFromSlug } = useWorkspace()
  return {
    service: service.projects,
    serviceKey: workspace.id,
    isAdmin: isWorkspaceAdmin(workspace),
    routeToCategories,
    routeToProjects,
    routeToProject,
    routeToStep,
    makeUrl: (project: Api.ProjectWithRelations, code?: string) => makeUrlFromSlug(project.slug, code),
    makeStepUrl: (step: Api.ProjectStepWithRelations, code?: string) => makeUrlFromSlug(step.slug, code),
  }
}

export const useSlugServiceProps = (
  routeToPage: (pageId: string) => string,
  routeToArticle: (articleId: string) => string,
  routeToProject: (projectId: string) => string,
  routeToProjectStep: (projectId: string, projectStepId: string) => string
) => {
  const { workspace, service, makeUrlFromSlug } = useWorkspace()
  return {
    service: service.slugs,
    serviceKey: workspace.id,
    isAdmin: isWorkspaceAdmin(workspace),
    routeToPage,
    routeToArticle,
    routeToProject,
    routeToProjectStep,
    makeUrl: makeUrlFromSlug,
    makePath: rootService.makePath,
    getImageUrl: rootService.getImageUrl,
  }
}
export const useForwardServiceProps = (routeToPage: (pageId: string) => string, routeToArticle: (articleId: string) => string) => {
  const { workspace, service, makeUrlFromSlug } = useWorkspace()
  return {
    service: service.forwards,
    serviceKey: workspace.id,
    isAdmin: isWorkspaceAdmin(workspace),
    routeToPage,
    routeToArticle,
    makeUrl: makeUrlFromSlug,
    makePath: rootService.makePath,
    getImageUrl: rootService.getImageUrl,
  }
}
export const useMenusServiceProps = (
  routeToPage: (pageId: string) => string,
  routeToArticle: (articleId: string) => string,
  routeToMenus: () => string,
  routeToMenusId: (articleId: string) => string
) => {
  const { workspace, service, makeUrlFromPath } = useWorkspace()
  return {
    service: service.menus,
    serviceKey: workspace.id,
    isAdmin: isWorkspaceAdmin(workspace),
    routeToPage,
    routeToArticle,
    routeToMenus,
    routeToMenusId,
    makeUrl: makeUrlFromPath,
    makePath: rootService.makePath,
    getImageUrl: rootService.getImageUrl,
  } satisfies MenusServiceContextType
}
export const useMediaServiceProps = () => {
  const { workspace, service } = useWorkspace()
  return {
    service: service.medias,
    serviceKey: workspace.id,
    isAdmin: isWorkspaceAdmin(workspace),
    makePath: rootService.makePath,
  }
}
