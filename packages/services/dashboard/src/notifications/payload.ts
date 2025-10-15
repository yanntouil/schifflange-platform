import { MakeRequestOptions } from "../types"
import { NotificationGroupedType, NotificationPriority, NotificationStatus } from "./types"

/**
 * queries
 */
export type List = MakeRequestOptions<
  "createdAt" | "updatedAt" | "type" | "status" | "priority",
  {
    status?: NotificationStatus
    types?: string[]
    priority?: NotificationPriority
    groupedType?: NotificationGroupedType
  }
>
