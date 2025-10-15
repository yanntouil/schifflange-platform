import { MakeRequestOptions } from "src/types"
import { TemplateType } from "./types"

/**
 * Query
 */
export type Templates = MakeRequestOptions<
  "createdAt" | "updatedAt",
  {
    types?: TemplateType[]
  }
>
/**
 * Payloads
 */
export type Create = {
  type: TemplateType
  translations?: Record<
    string,
    {
      title?: string
      description?: string
      tags?: string[]
    }
  >
}

export type Update = {
  type?: TemplateType
  translations?: Record<
    string,
    {
      title?: string
      description?: string
      tags?: string[]
    }
  >
}
