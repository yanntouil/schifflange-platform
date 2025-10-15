import { MakeRequestOptions } from "../../types"

/**
 * security logs query
 */
export type List = MakeRequestOptions<
  string,
  {
    userId?: string
    event?: string
    ipAddress?: string
    dateFrom?: string
    dateTo?: string
  }
>
