import { forwards } from "."
import { Slug, WithModel } from "../slugs/types"

export type Forward = {
  id: string
  path: string
  slug: Slug & WithModel
  updatedAt: string
}

export type ForwardsService = ReturnType<typeof forwards>
