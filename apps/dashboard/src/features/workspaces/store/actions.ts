import { authStore } from "@/features/auth"
import { Api, service } from "@/services"
import { A, match } from "@compo/utils"
import { workspaceStore } from "."

/**
 * initWorkspaces
 * Initialize user workspaces and invitations
 */
export const initWorkspaces = async () => {
  workspaceStore.set({ isLoading: true })

  const resultWorkspaces = await service.workspaces.list()
  const workspaces = match(resultWorkspaces)
    .with({ ok: true }, ({ data }) => data.workspaces)
    .otherwise(() => [])

  const resultInvitations = await service.workspaces.invitations.my()
  const invitations = match(resultInvitations)
    .with({ ok: true }, ({ data }) => data.invitations)
    .otherwise(() => [])

  workspaceStore.set({ workspaces, invitations, isLoading: false, isInitialized: true })
  return resultWorkspaces
}

/**
 * loadWorkspaces
 * Load user workspaces from API
 */
export const loadWorkspaces = async () => {
  workspaceStore.set({ isLoading: true })

  const result = await service.workspaces.list()
  const workspaces = match(result)
    .with({ ok: true }, ({ data }) => data.workspaces)
    .otherwise(() => [])
  workspaceStore.set({ workspaces, isLoading: false })
  return result
}

/**
 * loadInvitations
 * Load user invitations from API
 */
export const loadInvitations = async () => {
  console.log("loadInvitations")
  const result = await service.workspaces.invitations.my()
  const invitations = match(result)
    .with({ ok: true }, ({ data }) => data.invitations)
    .otherwise(() => [])

  workspaceStore.set({ invitations })
  return result
}

/**
 * acceptInvitation
 * Accept an invitation
 */
export const acceptInvitation = async (invitationId: string) => {
  const result = await service.workspaces.invitations.myAccept(invitationId)
  return match(result)
    .with({ ok: true }, ({ data }) => {
      // remove the invitation from the list, add the workspace to the list and set the current workspace
      workspaceStore.set({
        invitations: A.filter(workspaceStore.current.invitations, ({ id }) => id !== invitationId),
        workspaces: A.append(
          A.filter(workspaceStore.current.workspaces, ({ id }) => id !== data.workspace.id),
          data.workspace
        ),
        currentWorkspace: data.workspace,
      })
      return true
    })
    .otherwise(({ except }) => false)
}

/**
 * refuseInvitation
 * Refuse an invitation
 */
export const refuseInvitation = async (invitationId: string) => {
  const result = await service.workspaces.invitations.myRefuse(invitationId)
  return match(result)
    .with({ ok: true }, () => {
      workspaceStore.set({ invitations: A.filter(workspaceStore.current.invitations, ({ id }) => id !== invitationId) })
      return true
    })
    .otherwise(({ except }) => false)
}

/**
 * initializeFromAuthStore
 * Initialize current workspace from auth store if user has one
 */
export const initializeFromAuthStore = () => {
  const { me } = authStore.current
  if (me?.workspace) {
    workspaceStore.set({ currentWorkspace: me.workspace })
  }
}

/**
 * setCurrentWorkspace
 * Set the current workspace
 */
export const setCurrentWorkspace = (
  workspace: (Api.Workspace & Api.WithMembers & Api.AsMemberOfWorkspace & Api.WithTheme & Api.WithProfile) | null
) => {
  workspaceStore.set({ currentWorkspace: workspace })
  authStore.actions.updateWorkspace(workspace)
}

/**
 * signInToWorkspace
 * Sign in to a workspace and set it as current
 */
export const signInToWorkspace = async (workspaceId: string) => {
  const result = await service.workspaces.id(workspaceId).signIn()
  if (result.ok) setCurrentWorkspace(result.data.workspace)
  return result
}

/**
 * updateWorkspaceInList
 * Update a workspace in the list
 */
export const updateWorkspaceInList = (workspaceId: string, updates: Partial<Api.Workspace & Api.AsMemberOfWorkspace>) => {
  const state = workspaceStore.current
  const workspaces = A.map(state.workspaces, (workspace) => (workspace.id === workspaceId ? { ...workspace, ...updates } : workspace))
  workspaceStore.set({ workspaces })
}

/**
 * updateWorkspaceInList
 * Update a workspace in the list
 */
export const updateCurrentWorkspace = (updates: Partial<Api.Workspace & Api.AsMemberOfWorkspace & Api.WithTheme & Api.WithProfile>) => {
  const state = workspaceStore.current
  const workspaces = A.map(state.workspaces, (workspace) =>
    workspace.id === state.currentWorkspace?.id ? { ...workspace, ...updates } : workspace
  )
  const currentWorkspace = { ...state.currentWorkspace, ...updates } as Api.Workspace &
    Api.WithMembers &
    Api.AsMemberOfWorkspace &
    Api.WithTheme &
    Api.WithProfile
  workspaceStore.set({ currentWorkspace, workspaces })
}

/**
 * addWorkspace
 * Add a new workspace to the list
 */
export const addWorkspace = (workspace: Api.Workspace & Api.AsMemberOfWorkspace) => {
  const state = workspaceStore.current
  workspaceStore.set({
    workspaces: A.prepend(state.workspaces, workspace),
  })
}

/**
 * removeWorkspace
 * Remove a workspace from the list
 */
export const removeWorkspace = (workspaceId: string) => {
  const state = workspaceStore.current
  const workspaces = A.filter(state.workspaces, (workspace) => workspace.id !== workspaceId)
  workspaceStore.set({ workspaces })

  // Clear current workspace if it was the removed one
  if (state.currentWorkspace?.id === workspaceId) {
    workspaceStore.set({ currentWorkspace: null })
  }
}
