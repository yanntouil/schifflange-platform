import { Api } from "@/services"

/**
 * status guard
 */
export const statusGuard = (status: string): status is Api.Admin.EmailStatus => {
  return ["queued", "sent", "failed"].includes(status)
}
