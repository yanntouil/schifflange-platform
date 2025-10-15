import { useAuth } from "@/features/auth"
import { useWorkspaceStore, workspaceStore } from "@/features/workspaces"
import { useMemoKey, useSWR } from "@compo/hooks"

const { initWorkspaces } = workspaceStore.actions

/**
 * useLoadWorkspaces
 * Load user workspaces from API
 */
export const useLoadWorkspaces = () => {
  const { me } = useAuth()
  useSWR(
    {
      key: useMemoKey("workspaces", { me: me?.id }),
      fetch: initWorkspaces,
    },
    {
      fallbackData: { workspaces: [] },
    }
  )
  return useWorkspaceStore()
}
