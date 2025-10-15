import { service } from "@/services"
import { useMemoKey, useSWR } from "@compo/hooks"
import { D } from "@compo/utils"
import { useLogsStore } from "./store"

/**
 * useSwrLogs
 */
export const useSwrLogs = () => {
  const query = useLogsStore(D.prop("query"))
  const { data, ...swr } = useSWR(
    {
      fetch: () => service.admin.workspaces.logs(query),
      key: useMemoKey("admin-workspace-logs", { ...query }),
    },
    {
      fallbackData: {
        metadata: service.fallbackMetadata,
        logs: [],
      },
    }
  )

  const { logs, metadata } = data

  return { logs, metadata, swr }
}
