import { AuthDialogTab } from "@/features/auth/components/dialog/context"
import { workspaceStore } from "@/features/workspaces/store"
import { Api, service } from "@/services"
import { languagesStore } from "@compo/translations"
import { A } from "@compo/utils"
import { authStore } from "."

/**
 * initStore
 */
export const initStore = async () => {
  // set the store to the initial state
  const res = await service.auth.session()
  if (res.ok) {
    languagesStore.set({ languages: res.data.languages })
    if (res.data.auth) {
      authStore.set({ me: res.data.user, session: res.data.session, isInit: true, isAuthenticated: true })
      // Sync workspace store with user's current workspace
      if (res.data.user.workspace) {
        workspaceStore.set({ currentWorkspace: res.data.user.workspace })
      }
      return
    }
  }
  authStore.set({ isInit: true, isAuthenticated: false, me: null, session: null })
  // Clear workspace store when not authenticated
  workspaceStore.set({ currentWorkspace: null, workspaces: [] })
}

/**
 * revalidateSession
 */
export const revalidateSession = async () => {
  const res = await service.auth.session()
  if (res.ok) {
    languagesStore.set({ languages: res.data.languages })
    if (res.data.auth) {
      authStore.set({ me: res.data.user, session: res.data.session, isInit: true, isAuthenticated: true })
      // Sync workspace store with user's current workspace
      if (res.data.user.workspace) {
        // Add default profile if missing
        const workspaceWithProfile = {
          ...res.data.user.workspace,
          profile: res.data.user.workspace.profile || {
            id: "",
            logo: null,
            translations: [],
          },
        }
        workspaceStore.set({ currentWorkspace: workspaceWithProfile })
      }
    }
  } else {
    authStore.set({ isInit: true, isAuthenticated: false, me: null, session: null })
    // Clear workspace store when not authenticated
    workspaceStore.set({ currentWorkspace: null, workspaces: [] })
  }
  return res
}

/**
 * login
 */
export const login = (data: Api.InferValue<typeof service.auth.login>) => {
  authStore.set({ me: data.user, session: data.session, isAuthenticated: true })
  // Sync workspace store with user's current workspace
  if (data.user.workspace) {
    workspaceStore.set({ currentWorkspace: data.user.workspace })
  }
}

/**
 * logout
 */
export const logout = async () => {
  const res = await service.auth.logout()
  if (res.ok) {
    authStore.set({ isInit: true, isAuthenticated: false, me: null, session: null })
    // Clear workspace store on logout
    workspaceStore.set({ currentWorkspace: null, workspaces: [] })
  }
}

/**
 * deactivateSession
 */
export const deactivateSession = async (sessionId: string) => {
  const res = await service.auth.deactivateSession(sessionId)
  const me = authStore.current.me
  // in case of not found or ok, we remove the session from the user sessions
  if (me && (res.except?.name === "E_RESOURCE_NOT_FOUND" || res.ok)) {
    const sessions = A.filter(me.sessions, (session) => session.id !== sessionId)
    authStore.set({ me: { ...me, sessions } })
    return undefined
  } else {
    return res.except?.name
  }
}

/**
 * updateProfile
 */
export const updateProfile = async (data: Api.AuthPayload.UpdateProfile) => {
  const res = await service.auth.updateProfile(data)
  const me = authStore.current.me
  if (me && res.ok) {
    const profile = res.data.user.profile
    authStore.set({ me: { ...me, profile } })
  }
  return res
}

/**
 * mutateMe
 */
export const mutateMe = async (user: Partial<Api.User | Api.Admin.User>) => {
  const me = authStore.current.me
  if (!me) return

  const isMe = user.id === me.id
  if (!isMe) return

  const updatedMe = { ...me, ...user }
  authStore.set({ me: updatedMe })

  // Sync workspace if it changed
  if ("workspace" in user) {
    const workspace = (user as any).workspace
    workspaceStore.set({ currentWorkspace: workspace })
  }
}

/**
 * signInToWorkspace
 */
export const updateWorkspace = async (workspace: Api.Me["workspace"]) => {
  authStore.set((state) => ({ ...state, me: { ...state.me, workspace } as Api.Me }))
}

/**
 * Dialog management
 */
let setDialogTab: ((tab: AuthDialogTab | null) => void) | null = null

export const registerDialogController = (setTab: (tab: AuthDialogTab | null) => void) => {
  setDialogTab = setTab
}

export const unregisterDialogController = () => {
  setDialogTab = null
}

export const openNotifications = () => {
  if (setDialogTab) {
    setDialogTab({ type: "notifications", params: {} })
  } else {
    console.warn("AuthDialog not available")
  }
}

export const openProfile = () => {
  if (setDialogTab) {
    setDialogTab({ type: "profile", params: {} })
  } else {
    console.warn("AuthDialog not available")
  }
}

export const closeDialog = () => {
  if (setDialogTab) {
    setDialogTab(null)
  }
}
