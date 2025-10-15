import { service } from "@/services"
import { useMemoKey, useSWR } from "@compo/hooks"
import { D } from "@compo/utils"
import { useEmailsStore } from "./store"

/**
 * useSwrEmails
 */
export const useSwrEmails = () => {
  const query = useEmailsStore(D.prop("query"))
  const { data, ...swr } = useSWR(
    {
      fetch: () => service.admin.emailLogs.list(query),
      key: useMemoKey("admin-email-logs", { ...query }),
    },
    {
      fallbackData: {
        metadata: service.fallbackMetadata,
        emails: [],
      },
    }
  )

  const { emails, metadata } = data

  return { emails, metadata, swr }
}
