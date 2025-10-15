import { PageState } from "./types"

/**
 * Query
 */

/**
 * Payloads
 */
export type Create = {
  state?: PageState
  lock?: boolean // only for workspace admins
  slug?: string
}

export type Update = {
  state?: PageState
  lock?: boolean // only for workspace admins
  slug?: string
}
