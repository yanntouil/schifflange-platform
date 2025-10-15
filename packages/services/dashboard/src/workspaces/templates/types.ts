import { templates } from "."
import { WithContent } from "../../contents/types"
import { Translatable, User } from "../../types"

export type Template = {
  id: string
  workspaceId: string
  contentId: string
  type: TemplateType
  createdAt: string
  createdById: string
  createdBy: User
  updatedAt: string
  updatedById: string
  updatedBy: User
} & Translatable<TemplateTranslation>

export type TemplateType = "page" | "article" | "project"

export type TemplateTranslation = {
  id: string
  languageId: string
  title: string
  description: string
  tags: string[]
}

export type TemplateWithRelations = Template & WithContent
export type TemplatesService = ReturnType<typeof templates>
