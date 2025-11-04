import { type CreateApi } from "../../api"
import { Secure } from "../../store"
import { NoContent, NotFoundErrors, ValidationErrors, WorkspaceErrors } from "../../types"
import { appendQS } from "../../utils"
import * as Payload from "./payload"
import * as Query from "./payload"
import { type Council } from "./types"

export const councils = (api: CreateApi, secure: Secure, wid: string) => ({
  all: secure((query: Query.All = {}) =>
    api.get<{ councils: Council[] }, WorkspaceErrors>(appendQS(`workspaces/${wid}/councils`, query))
  ),
  create: secure((payload: Payload.Create) =>
    api.post<{ council: Council }, WorkspaceErrors | ValidationErrors>(`workspaces/${wid}/councils`, { data: payload })
  ),
  id: (cid: string) => ({
    read: secure(() =>
      api.get<{ council: Council }, WorkspaceErrors | NotFoundErrors>(`workspaces/${wid}/councils/${cid}`)
    ),
    update: secure((payload: Payload.Update) =>
      api.put<{ council: Council }, WorkspaceErrors | NotFoundErrors | ValidationErrors>(
        `workspaces/${wid}/councils/${cid}`,
        { data: payload }
      )
    ),
    delete: secure(() => api.delete<NoContent, WorkspaceErrors | NotFoundErrors>(`workspaces/${wid}/councils/${cid}`)),
  }),
})
