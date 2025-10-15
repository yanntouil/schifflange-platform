import { type CreateApi } from "../../api"
import { Secure } from "../../store"
import { AdminErrors, NoContent, PaginationMeta, ValidationErrors } from "../../types"
import { appendQS } from "../../utils"
import { Logs } from "../../workspaces/payload"
import {
  AttachMember,
  Create,
  CreateInvitation,
  CreateTheme,
  List,
  ThemesList,
  Update,
  UpdateMember,
  UpdateProfile,
  UpdateTheme,
} from "./payload"
import { Workspace, WorkspaceInvitation, WorkspaceLog, WorkspaceMember, WorkspaceTheme } from "./types"

export const workspaces = (api: CreateApi, secure: Secure) => ({
  list: secure((query: List = {}) =>
    api.get<{ metadata: PaginationMeta; workspaces: Workspace[]; total: number }, AdminErrors>(
      appendQS("admin/workspaces", query)
    )
  ),

  create: secure((payload: Create) =>
    api.transaction<{ workspace: Workspace }, AdminErrors | ValidationErrors>("admin/workspaces", {
      data: payload,
      method: "POST",
    })
  ),
  id: (id: string) => ({
    read: secure(() => api.get<{ workspace: Workspace }, AdminErrors>(`admin/workspaces/${id}`)),
    update: secure((payload: Update) =>
      api.transaction<{ workspace: Workspace }, AdminErrors | ValidationErrors>(`admin/workspaces/${id}`, {
        data: payload,
        method: "PUT",
      })
    ),
    updateProfile: secure((payload: UpdateProfile) =>
      api.transaction<{ workspace: Workspace }, AdminErrors | ValidationErrors>(`admin/workspaces/${id}/profile`, {
        data: payload,
        method: "PUT",
      })
    ),
    delete: secure(() => api.delete<{ workspace: Workspace } | NoContent, AdminErrors>(`admin/workspaces/${id}`)),
    members: {
      id: (memberId: string) => ({
        update: secure((payload: UpdateMember) =>
          api.put<{ member: WorkspaceMember }, AdminErrors | ValidationErrors>(
            `admin/workspaces/${id}/members/${memberId}`,
            {
              data: payload,
            }
          )
        ),
        attach: secure((payload: AttachMember) =>
          api.post<{ member: WorkspaceMember }, AdminErrors | ValidationErrors>(
            `admin/workspaces/${id}/members/${memberId}`,
            {
              data: payload,
            }
          )
        ),
        detach: secure(() =>
          api.delete<{ member: WorkspaceMember } | NoContent, AdminErrors>(`admin/workspaces/${id}/members/${memberId}`)
        ),
      }),
    },
    invitations: {
      create: secure((payload: CreateInvitation) =>
        api.post<{ invitation: WorkspaceInvitation }, AdminErrors | ValidationErrors>(
          `admin/workspaces/${id}/invitations`,
          {
            data: payload,
          }
        )
      ),
      delete: secure((invitationId: string) =>
        api.delete<{ invitation: WorkspaceInvitation }, AdminErrors>(
          `admin/workspaces/${id}/invitations/${invitationId}`
        )
      ),
    },
    logs: secure((query: Logs = {}) =>
      api.get<{ metadata: PaginationMeta; logs: WorkspaceLog[] }, AdminErrors>(
        appendQS(`admin/workspaces/${id}/logs`, query)
      )
    ),
  }),
  logs: secure((query: Logs = {}) =>
    api.get<{ metadata: PaginationMeta; logs: WorkspaceLog[] }, AdminErrors>(appendQS("admin/workspaces/logs", query))
  ),

  themes: {
    list: secure((query: ThemesList = {}) =>
      api.get<{ metadata: PaginationMeta; themes: WorkspaceTheme[] }, AdminErrors>(
        appendQS("admin/workspaces/themes", query)
      )
    ),
    create: secure((payload: CreateTheme) =>
      api.transaction<{ theme: WorkspaceTheme }, AdminErrors | ValidationErrors>("admin/workspaces/themes", {
        data: payload,
        method: "POST",
      })
    ),
    id: (id: string) => ({
      read: secure(() => api.get<{ theme: WorkspaceTheme }, AdminErrors>(`admin/workspaces/themes/${id}`)),
      update: secure((payload: UpdateTheme) =>
        api.transaction<{ theme: WorkspaceTheme }, AdminErrors | ValidationErrors>(`admin/workspaces/themes/${id}`, {
          data: payload,
          method: "PUT",
        })
      ),
      delete: secure(() => api.delete<NoContent, AdminErrors>(`admin/workspaces/themes/${id}`)),
    }),
  },
})
