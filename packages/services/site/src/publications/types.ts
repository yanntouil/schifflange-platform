import { User } from "../users/types"

/**
 * publications
 */
export type Publication = {
  publishedAt: string | null
  publishedBy: User | null
}
export type WithPublication = {
  publication: Publication
}
