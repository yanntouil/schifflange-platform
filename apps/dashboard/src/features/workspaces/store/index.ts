import globalConfig from "@/config/global"
import { authStore } from "@/features/auth"
import { makeAuthDependStore } from "@/features/auth/store/make-auth-depend-store"
import { Api, service } from "@/services"
import { decorateStore } from "@/utils/zustand"
import { useLanguage } from "@compo/translations"
import { create } from "zustand"
import * as actions from "./actions"

/**
 * types
 */
type WorkspaceState = {
  key: string | null // user id for auth dependency
  workspaces: (Api.Workspace & Api.AsMemberOfWorkspace)[]
  invitations: (Api.WorkspaceInvitation & { workspace: Api.Workspace })[]
  currentWorkspace: (Api.Workspace & Api.WithMembers & Api.AsMemberOfWorkspace & Api.WithTheme & Api.WithProfile) | null
  isInitialized: boolean
  isLoading: boolean
}

/**
 * initial state
 */
const initialState: WorkspaceState = {
  key: null,
  workspaces: [],
  invitations: [],
  currentWorkspace: null,
  isInitialized: false,
  isLoading: false,
}

/**
 * reset function for auth dependency
 */
const resetWorkspaceStore = (key: string | null) => {
  const { me } = authStore.current
  if (me?.workspace) {
    workspaceStore.set({ ...initialState, currentWorkspace: me.workspace, key })
  } else {
    workspaceStore.set({ ...initialState, key })
  }
}

/**
 * store
 */
const workspaceStore = decorateStore(
  initialState,
  create,
  {
    persist: {
      name: "workspace-store",
      enabled: false, // Don't persist workspaces
    },
    devtools: {
      name: "workspace-store",
      enabled: globalConfig.inDevelopment,
    },
  },
  actions
)

/**
 * auth-dependent store
 */
export const useWorkspaceStore = makeAuthDependStore(workspaceStore.use, resetWorkspaceStore)
export { workspaceStore }

/**
 * useWorkspaces
 * Hook to use workspaces store with actions
 */
export const useWorkspaces = () => {
  const state = useWorkspaceStore()

  return {
    // State
    workspaces: state.workspaces,
    currentWorkspace: state.currentWorkspace,
    isLoading: state.isLoading,
  }
}
/**
 * useWorkspaces
 * Hook to use workspaces store with actions
 */
export const useWorkspace = () => {
  const { current } = useLanguage()
  const state = useWorkspaceStore()
  if (!state.currentWorkspace) {
    throw new Error("You must be in a workspace to use this hook")
  }

  const baseUrl = globalConfig.inDevelopment ? globalConfig.frontend : state.currentWorkspace.config.site.url
  const makePreviewItemUrl = (item: Api.ContentItem, locale: string) => `${baseUrl}/preview/${locale}/item/${item.id}`
  const makeUrlFromSlug = (slug: Api.Slug, code?: string) => `${baseUrl}/${code ?? current.code}/${slug.path}`
  const makeUrlFromPath = (path: string, code?: string) => `${baseUrl}/${code ?? current.code}/${path}`
  return {
    workspace: state.currentWorkspace,
    service: service.workspaces.id(state.currentWorkspace.id),
    makeUrlFromSlug,
    makeUrlFromPath,
    makePreviewItemUrl,
  }
}
