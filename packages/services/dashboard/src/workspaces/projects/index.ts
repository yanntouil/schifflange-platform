import { type CreateApi } from "../../api"
import { contents } from "../../contents"
import { publication } from "../../publications"
import { seo } from "../../seos"
import { Secure } from "../../store"
import { trackings } from "../../trackings/service"
import { NoContent, NotFoundErrors, ValidationErrors, WorkspaceErrors } from "../../types"
import { appendQS } from "../../utils"
import {
  Categories,
  Create,
  CreateCategory,
  CreateStep,
  CreateTag,
  Projects,
  Update,
  UpdateCategory,
  UpdateStep,
  UpdateTag,
} from "./payload"
import { ProjectCategory, ProjectStepWithRelations, ProjectTag, ProjectWithRelations, WithProjects } from "./types"

export const projects = (api: CreateApi, secure: Secure, wid: string) => ({
  // Categories CRUD
  categories: {
    all: secure((query: Categories = {}) =>
      api.get<{ categories: ProjectCategory[] }, WorkspaceErrors>(
        appendQS(`workspaces/${wid}/projects/categories`, query)
      )
    ),

    create: secure((payload: CreateCategory) =>
      api.post<{ category: ProjectCategory }, WorkspaceErrors | ValidationErrors>(
        `workspaces/${wid}/projects/categories`,
        { data: payload }
      )
    ),

    id: (pcid: string) => ({
      read: secure(() =>
        api.get<{ category: ProjectCategory & WithProjects }, WorkspaceErrors | NotFoundErrors>(
          `workspaces/${wid}/projects/categories/${pcid}`
        )
      ),

      update: secure((payload: UpdateCategory) =>
        api.put<{ category: ProjectCategory }, WorkspaceErrors | NotFoundErrors | ValidationErrors>(
          `workspaces/${wid}/projects/categories/${pcid}`,
          { data: payload }
        )
      ),

      delete: secure(() =>
        api.delete<NoContent, WorkspaceErrors | NotFoundErrors>(`workspaces/${wid}/projects/categories/${pcid}`)
      ),
    }),
  },

  // Tags CRUD
  tags: {
    all: secure(() => api.get<{ tags: ProjectTag[] }, WorkspaceErrors>(`workspaces/${wid}/projects/tags`)),

    create: secure((payload: CreateTag) =>
      api.post<{ tag: ProjectTag }, WorkspaceErrors | ValidationErrors>(`workspaces/${wid}/projects/tags`, {
        data: payload,
      })
    ),

    id: (ptid: string) => ({
      read: secure(() =>
        api.get<{ tag: ProjectTag & WithProjects }, WorkspaceErrors | NotFoundErrors>(
          `workspaces/${wid}/projects/tags/${ptid}`
        )
      ),

      update: secure((payload: UpdateTag) =>
        api.put<{ tag: ProjectTag }, WorkspaceErrors | NotFoundErrors | ValidationErrors>(
          `workspaces/${wid}/projects/tags/${ptid}`,
          { data: payload }
        )
      ),

      delete: secure(() =>
        api.delete<NoContent, WorkspaceErrors | NotFoundErrors>(`workspaces/${wid}/projects/tags/${ptid}`)
      ),
    }),
  },

  // Projects CRUD
  all: secure((query: Projects = {}) =>
    api.get<{ projects: ProjectWithRelations[] }, WorkspaceErrors>(appendQS(`workspaces/${wid}/projects`, query))
  ),

  create: secure((payload: Create) =>
    api.post<{ project: ProjectWithRelations }, WorkspaceErrors | ValidationErrors>(`workspaces/${wid}/projects`, {
      data: payload,
    })
  ),

  id: (pid: string) => ({
    read: secure(() =>
      api.get<{ project: ProjectWithRelations }, WorkspaceErrors | NotFoundErrors>(`workspaces/${wid}/projects/${pid}`)
    ),
    update: secure((payload: Update) =>
      api.put<{ project: ProjectWithRelations }, WorkspaceErrors | NotFoundErrors | ValidationErrors>(
        `workspaces/${wid}/projects/${pid}`,
        {
          data: payload,
        }
      )
    ),

    delete: secure(() => api.delete<NoContent, WorkspaceErrors | NotFoundErrors>(`workspaces/${wid}/projects/${pid}`)),

    trackings: trackings.workspace(wid)(api, secure),
    seo: seo(api, secure, `workspaces/${wid}/projects/${pid}`),
    publication: publication(api, secure, `workspaces/${wid}/projects/${pid}`),
    content: contents(api, secure, `workspaces/${wid}/projects/${pid}`),

    // Steps CRUD
    steps: {
      create: secure((payload: CreateStep) =>
        api.post<{ step: ProjectStepWithRelations }, WorkspaceErrors | ValidationErrors>(
          `workspaces/${wid}/projects/${pid}/steps`,
          { data: payload }
        )
      ),

      id: (psid: string) => ({
        read: secure(() =>
          api.get<{ step: ProjectStepWithRelations }, WorkspaceErrors | NotFoundErrors>(
            `workspaces/${wid}/projects/${pid}/steps/${psid}`
          )
        ),
        update: secure((payload: UpdateStep) =>
          api.put<{ step: ProjectStepWithRelations }, WorkspaceErrors | NotFoundErrors | ValidationErrors>(
            `workspaces/${wid}/projects/${pid}/steps/${psid}`,
            { data: payload }
          )
        ),
        delete: secure(() =>
          api.delete<NoContent, WorkspaceErrors | NotFoundErrors>(`workspaces/${wid}/projects/${pid}/steps/${psid}`)
        ),

        trackings: trackings.workspace(wid)(api, secure),
        seo: seo(api, secure, `workspaces/${wid}/projects/${pid}/steps/${psid}`),
        content: contents(api, secure, `workspaces/${wid}/projects/${pid}/steps/${psid}`),
      }),
    },
  }),
})
