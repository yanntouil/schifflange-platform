import { type CreateApi } from "../../api"
import { contents } from "../../contents"
import { seo } from "../../seos"
import { Secure } from "../../store"
import { trackings } from "../../trackings/service"
import { NoContent, NotFoundErrors, ValidationErrors, WorkspaceErrors } from "../../types"
import { Create, Update } from "./payload"
import { PageWithRelations } from "./types"

export const pages = (api: CreateApi, secure: Secure, wid: string) => ({
  // Pages CRUD
  all: secure(() => api.get<{ pages: PageWithRelations[] }, WorkspaceErrors>(`workspaces/${wid}/pages`)),

  create: secure((payload: Create = {}) =>
    api.post<{ page: PageWithRelations }, WorkspaceErrors | ValidationErrors>(`workspaces/${wid}/pages`, {
      data: payload,
    })
  ),

  id: (pid: string) => ({
    read: secure(() =>
      api.get<{ page: PageWithRelations }, WorkspaceErrors | NotFoundErrors>(`workspaces/${wid}/pages/${pid}`)
    ),

    trackings: trackings.workspace(wid)(api, secure),

    update: secure((payload: Update) =>
      api.put<{ page: PageWithRelations }, WorkspaceErrors | NotFoundErrors | ValidationErrors>(
        `workspaces/${wid}/pages/${pid}`,
        {
          data: payload,
        }
      )
    ),

    delete: secure(() => api.delete<NoContent, WorkspaceErrors | NotFoundErrors>(`workspaces/${wid}/pages/${pid}`)),

    seo: seo(api, secure, `workspaces/${wid}/pages/${pid}`),

    content: contents(api, secure, `workspaces/${wid}/pages/${pid}`),
  }),
})
