import { type CreateApi } from "../../api"
import { contents } from "../../contents"
import { Secure } from "../../store"
import { NoContent, NotFoundErrors, ValidationErrors, WorkspaceErrors } from "../../types"
import { appendQS } from "../../utils"
import { Create, Templates, Update } from "./payload"
import { TemplateWithRelations } from "./types"

export const templates = (api: CreateApi, secure: Secure, wid: string) => ({
  // Templates CRUD
  all: secure((query: Templates = {}) =>
    api.get<{ templates: TemplateWithRelations[] }, WorkspaceErrors>(appendQS(`workspaces/${wid}/templates`, query))
  ),

  create: secure((payload: Create) =>
    api.post<{ template: TemplateWithRelations }, WorkspaceErrors | ValidationErrors>(`workspaces/${wid}/templates`, {
      data: payload,
    })
  ),

  id: (tid: string) => ({
    read: secure(() =>
      api.get<{ template: TemplateWithRelations }, WorkspaceErrors | NotFoundErrors>(
        `workspaces/${wid}/templates/${tid}`
      )
    ),

    update: secure((payload: Update) =>
      api.put<{ template: TemplateWithRelations }, WorkspaceErrors | NotFoundErrors | ValidationErrors>(
        `workspaces/${wid}/templates/${tid}`,
        {
          data: payload,
        }
      )
    ),

    delete: secure(() => api.delete<NoContent, WorkspaceErrors | NotFoundErrors>(`workspaces/${wid}/templates/${tid}`)),

    duplicate: secure(() =>
      api.post<{ template: TemplateWithRelations }, WorkspaceErrors | NotFoundErrors>(
        `workspaces/${wid}/templates/${tid}/duplicate`
      )
    ),

    content: contents(api, secure, `workspaces/${wid}/templates/${tid}`),
  }),
})
