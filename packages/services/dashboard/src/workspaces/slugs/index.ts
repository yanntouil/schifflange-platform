import { type CreateApi } from "../../api"
import { Secure } from "../../store"
import { NotFoundErrors, ValidationErrors, WorkspaceErrors } from "../../types"
import { Update } from "./payload"
import { type Slug, type WithModel } from "./types"

export const slugs = (api: CreateApi, secure: Secure, wid: string) => ({
  all: secure(() => api.get<{ slugs: (Slug & WithModel)[] }, WorkspaceErrors>(`workspaces/${wid}/slugs`)),
  slug: (sid: string) => ({
    update: (payload: Update) =>
      api.put<{ slug: Slug & WithModel }, WorkspaceErrors | NotFoundErrors | ValidationErrors>(
        `workspaces/${wid}/slugs/${sid}`,
        { data: payload }
      ),
  }),
})
