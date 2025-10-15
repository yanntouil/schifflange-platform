import { pages } from "."
import { WithContent } from "../../contents/types"
import { WithSeo } from "../../seos/types"
import { WithTracking } from "../../trackings/types"
import { User } from "../../types"
import { WithSlug } from "../slugs/types"

export type PageState = "draft" | "published"

export type Page = {
  id: string
  state: PageState
  lock: boolean
  workspaceId: string
  seoId: string
  contentId: string
  trackingId: string
  slugId: string
  createdAt: string
  createdById: string
  createdBy: User
  updatedAt: string
  updatedById: string
  updatedBy: User
}

export type PageWithRelations = Page & WithSeo & WithContent & WithSlug & WithTracking
export type PagesService = ReturnType<typeof pages>
