import { type CreateApi } from "../../api"
import { Secure } from "../../store"
import { NoContent, NotFoundErrors, ValidationErrors, WorkspaceErrors } from "../../types"
import { Create, Update } from "./payload"
import { Forward } from "./types"

export const forwards = (api: CreateApi, secure: Secure, wid: string) => ({
  all: secure(() => api.get<{ forwards: Forward[] }, WorkspaceErrors>(`workspaces/${wid}/forwards`)),
  create: secure((payload: Create) =>
    api.post<{ forward: Forward }, WorkspaceErrors | ValidationErrors>(`workspaces/${wid}/forwards`, {
      data: payload,
    })
  ),
  id: (fid: string) => ({
    read: secure(() =>
      api.get<{ forward: Forward }, WorkspaceErrors | NotFoundErrors>(`workspaces/${wid}/forwards/${fid}`)
    ),
    update: secure((payload: Update) =>
      api.put<{ forward: Forward }, WorkspaceErrors | NotFoundErrors | ValidationErrors>(
        `workspaces/${wid}/forwards/${fid}`,
        { data: payload }
      )
    ),
    delete: secure(() => api.delete<NoContent, WorkspaceErrors | NotFoundErrors>(`workspaces/${wid}/forwards/${fid}`)),
  }),
})
