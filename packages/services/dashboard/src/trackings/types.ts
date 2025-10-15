import { trackings } from "./service"

export type Tracking = {
  id: string
  model: string
  type: "clicks" | "views" | "visits"
  workspaceId: string | null
  clicks: number
  views: number
  visits: number
}
export type TracesStats = Record<string, number>

export type WithTracking = {
  tracking: Tracking
}
export type TrackingService = ReturnType<ReturnType<typeof trackings.workspace>> | ReturnType<typeof trackings.admin>
