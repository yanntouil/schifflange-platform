import { service } from "@/services"
import { useMemoKey, useSWR } from "@compo/hooks"
import { A, D } from "@compo/utils"
import { useWorkspacesStore } from "./store"

// Types temporaires en attendant les services
type Workspace = {
  id: string
  name: string
  status: string
  type: string
  createdAt: string
  updatedAt: string
  members: any[]
  invitations: any[]
}

/**
 * useSwrWorkspaces
 */
export const useSwrWorkspaces = () => {
  const query = useWorkspacesStore(D.prop("query"))
  const { data, mutate, ...props } = useSWR(
    {
      fetch: () => service.admin.workspaces.list(query),
      key: useMemoKey("admin-workspaces", { ...query }),
    },
    {
      fallbackData: {
        metadata: service.fallbackMetadata,
        workspaces: [],
        total: 0,
      },
    }
  )

  const { workspaces, total, metadata } = data as any

  // mutation helper
  const mutateWorkspaces = (fn: (items: Workspace[]) => Workspace[]) =>
    mutate((data: any) => data && { ...data, workspaces: fn(data.workspaces) }, { revalidate: true })

  const swr = {
    ...props,
    mutate,
    update: (workspace: Workspace) => void mutateWorkspaces(A.map((f) => (f.id === workspace.id ? workspace : f))),
    reject: (workspace: Workspace) => void mutateWorkspaces(A.filter((f) => f.id !== workspace.id)),
    rejectById: (id: string) => void mutateWorkspaces(A.filter((f) => f.id !== id)),
    append: (workspace: Workspace) => void mutateWorkspaces(A.append(workspace)),
  }

  return { workspaces, metadata, total, swr }
}
