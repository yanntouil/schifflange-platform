import { type CreateApi } from "../api"
import { Secure } from "../store"
import { ValidationErrors, WorkspaceErrors } from "../types"
import { ReorderPins, Update } from "./payload"
import { Pinable } from "./types"

/**
 * service contents
 */
export const pins = (api: CreateApi, secure: Secure, basePath: string) => ({
  id: (pid: string) => ({
    update: secure((payload: Update) =>
      api.put<{ pin: Pinable }, WorkspaceErrors | ValidationErrors>(`${basePath}/${pid}`, {
        data: payload,
      })
    ),
    unpin: secure(() =>
      api.put<{ pin: Pinable }, WorkspaceErrors | ValidationErrors>(`${basePath}/${pid}`, {
        data: {
          pin: false,
        },
      })
    ),
    pin: secure(() =>
      api.put<{ pin: Pinable }, WorkspaceErrors | ValidationErrors>(`${basePath}/${pid}`, {
        data: {
          pin: true,
        },
      })
    ),
  }),
  reorder: secure((payload: ReorderPins) =>
    api.put<{ sortedIds: string[] }, WorkspaceErrors | ValidationErrors>(`${basePath}`, {
      data: payload,
    })
  ),
})
