import { isWorkspaceAdmin, useWorkspace } from "@/features/workspaces"
import { service as rootService } from "@/services"

export const usePageServiceProps = () => {
  const { workspace, service, makeUrlFromSlug } = useWorkspace()
  return {
    service: service.pages,
    serviceKey: workspace.id,
    isAdmin: isWorkspaceAdmin(workspace),
    makeUrl: makeUrlFromSlug,
  }
}
export const useArticleServiceProps = () => {
  const { workspace, service, makeUrlFromSlug } = useWorkspace()
  return {
    service: service.articles,
    serviceKey: workspace.id,
    isAdmin: isWorkspaceAdmin(workspace),
    makeUrl: makeUrlFromSlug,
  }
}

export const useDirectoryServiceProps = () => {
  const { workspace, service } = useWorkspace()
  return {
    service: service.directory,
    serviceKey: workspace.id,
    isAdmin: isWorkspaceAdmin(workspace),
  }
}

export const useLibrariesServiceProps = () => {
  const { workspace, service } = useWorkspace()
  return {
    service: service.libraries,
    serviceKey: workspace.id,
    isAdmin: isWorkspaceAdmin(workspace),
  }
}

export const useSlugServiceProps = () => {
  const { workspace, service, makeUrlFromSlug } = useWorkspace()
  return {
    service: service.slugs,
    serviceKey: workspace.id,
    isAdmin: isWorkspaceAdmin(workspace),
    makeUrl: makeUrlFromSlug,
    makePath: rootService.makePath,
    getImageUrl: rootService.getImageUrl,
  }
}
export const useForwardServiceProps = () => {
  const { workspace, service, makeUrlFromSlug } = useWorkspace()
  return {
    service: service.forwards,
    serviceKey: workspace.id,
    isAdmin: isWorkspaceAdmin(workspace),
    makeUrl: makeUrlFromSlug,
    makePath: rootService.makePath,
    getImageUrl: rootService.getImageUrl,
  }
}
export const useMenusServiceProps = () => {
  const { workspace, service, makeUrlFromPath } = useWorkspace()
  return {
    service: service.menus,
    serviceKey: workspace.id,
    isAdmin: isWorkspaceAdmin(workspace),
    makeUrl: makeUrlFromPath,
    makePath: rootService.makePath,
    getImageUrl: rootService.getImageUrl,
  }
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
