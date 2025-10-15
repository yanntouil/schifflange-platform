import { publication } from "."
import { User } from "../types"

export type Publication = {
  id: string
  publishedById: string | null
  publishedBy: User | null
  publishedAt: string | null
  publishedFrom: string | null
  publishedTo: string | null
  createdAt: string
  updatedAt: string
}

export type WithPublication = {
  publication: Publication
}

export type PublicationService = ReturnType<typeof publication>
