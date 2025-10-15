import { type CreateApi } from "../api"
import { Secure } from "../store"
import { ValidationErrors, WorkspaceErrors } from "../types"
import { Update } from "./payload"
import { Seo } from "./types"

/**
 * service seo
 */
export const seo = (api: CreateApi, secure: Secure, basePath: string) => ({
  update: secure((payload: Update) =>
    api.put<{ seo: Seo }, WorkspaceErrors | ValidationErrors>(`${basePath}/seo`, { data: payload })
  ),
})
