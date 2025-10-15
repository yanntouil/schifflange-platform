import { CreateApi } from "../api"
import { Secure } from "../store"
import { ValidationErrors, WorkspaceErrors } from "../types"
import { Update } from "./payload"
import { Publication } from "./types"

/**
 * service publication
 */
export const publication = (api: CreateApi, secure: Secure, basePath: string) => ({
  update: secure((payload: Update) =>
    api.put<{ publication: Publication }, WorkspaceErrors | ValidationErrors>(`${basePath}/publication`, {
      data: payload,
    })
  ),
})
