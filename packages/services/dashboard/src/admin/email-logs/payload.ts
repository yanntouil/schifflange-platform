import { MakeRequestOptions } from "../../types"
import { EmailStatus } from "./types"

/**
 * email logs query
 */
export type List = MakeRequestOptions<
  string,
  {
    status: EmailStatus | null
    email: string | null
    template: string | null
  }
>
