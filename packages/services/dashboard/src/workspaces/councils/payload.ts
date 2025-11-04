import { MakeRequestOptions } from "../../types"
import { Video } from "../../videos/types"

/**
 * queries
 */
export type All = MakeRequestOptions<
  "date" | "createdAt" | "updatedAt",
  {
    dateFrom?: string
    dateTo?: string
  }
>

/**
 * payloads
 */
export type Create = {
  date: string // isoDate
  video?: Partial<Video>
  translations?: Record<string, { agenda?: string; reportId?: string | null }>
}
export type Update = {
  date?: string // isoDate
  video?: Partial<Video>
  translations?: Record<string, { agenda?: string; reportId?: string | null }>
}
