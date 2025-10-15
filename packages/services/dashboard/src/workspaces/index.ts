import { DeepPartial } from "@compo/utils"
import { type CreateApi } from "../api"
import { Secure } from "../store"
import { trackings } from "../trackings/service"
import {
  AuthErrors,
  CommonErrors,
  Language,
  Me,
  NoContent,
  NotFoundErrors,
  UserSession,
  ValidationErrors,
  WorkspaceAdminErrors,
  WorkspaceErrors,
  WorkspaceOwnerErrors,
} from "../types"
import { articles } from "./articles"
import { forwards } from "./forwards"
import { medias } from "./medias"
import { menus } from "./menus"
import { pages } from "./pages"
import {
  CreateInvitation,
  InvitationSignUp,
  InvitationToken,
  PublicInvitation,
  UpdateMember,
  UpdateWorkspace,
} from "./payload"
import { projects } from "./projects"
import { slugs } from "./slugs"
import { templates } from "./templates"
import {
  AsMemberOfWorkspace,
  WithMembers,
  WithProfile,
  WithTheme,
  Workspace,
  WorkspaceConfig,
  WorkspaceInvitation,
  WorkspaceMember,
  WorkspaceTheme,
} from "./types"

export const workspaces = (api: CreateApi, secure: Secure) => ({
  list: secure(() =>
    api.get<{ workspaces: (Workspace & AsMemberOfWorkspace & WithTheme)[] }, ValidationErrors>("workspaces")
  ),
  themes: secure(() => api.get<{ themes: WorkspaceTheme[] }, AuthErrors>("workspaces/themes")),
  id: (wid: string) => ({
    // related collections
    templates: templates(api, secure, wid),
    trackings: trackings.workspace(wid)(api, secure),
    medias: medias(api, secure, wid),
    slugs: slugs(api, secure, wid),
    forwards: forwards(api, secure, wid),
    menus: menus(api, secure, wid),
    pages: pages(api, secure, wid),
    articles: articles(api, secure, wid),
    projects: projects(api, secure, wid),

    // workspace routes
    read: secure(() =>
      api.get<
        { workspace: Workspace & WithMembers & AsMemberOfWorkspace & WithTheme & WithProfile },
        WorkspaceErrors | ValidationErrors
      >(`workspaces/${wid}`)
    ),
    signIn: secure(() =>
      api.post<
        { workspace: Workspace & WithMembers & AsMemberOfWorkspace & WithTheme & WithProfile },
        WorkspaceErrors | ValidationErrors
      >(`workspaces/${wid}/sign-in`)
    ),
    // feature: feature(api, secure, wid),
    update: secure((payload: UpdateWorkspace) =>
      api.transaction<
        { workspace: Workspace & WithMembers & AsMemberOfWorkspace & WithTheme & WithProfile },
        WorkspaceAdminErrors | ValidationErrors
      >(`workspaces/${wid}`, {
        method: "put",
        data: payload,
      })
    ),
    destroy: secure(() =>
      api.delete<NoContent, WorkspaceOwnerErrors | ValidationErrors>(`workspaces/${wid}`, {
        method: "delete",
      })
    ),
    listMembers: secure(() =>
      api.get<{ members: WorkspaceMember[] }, WorkspaceErrors | ValidationErrors>(`workspaces/${wid}/members`)
    ),
    updateMember: secure((mid: string, payload: UpdateMember) =>
      api.transaction<{ member: WorkspaceMember }, WorkspaceAdminErrors | ValidationErrors>(
        `workspaces/${wid}/members/${mid}`,
        {
          method: "put",
          data: payload,
        }
      )
    ),
    detachMember: secure((mid: string) =>
      api.delete<NoContent, WorkspaceAdminErrors | ValidationErrors>(`workspaces/${wid}/members/${mid}`)
    ),
    leave: secure(() => api.delete<NoContent, WorkspaceErrors | ValidationErrors>(`workspaces/${wid}/members/me`)),
    listInvitations: secure(() =>
      api.get<{ invitations: WorkspaceInvitation[] }, WorkspaceErrors | ValidationErrors>(
        `workspaces/${wid}/invitations`
      )
    ),
    createInvitation: secure((payload: CreateInvitation) =>
      api.post<
        { invitation: WorkspaceInvitation },
        WorkspaceAdminErrors<"E_ALREADY_MEMBER" | "E_LIMIT_EXCEEDED"> | ValidationErrors
      >(`workspaces/${wid}/invitations`, { data: payload })
    ),
    deleteInvitation: secure((iid: string) =>
      api.delete<NoContent, WorkspaceAdminErrors<"E_RESOURCE_NOT_FOUND"> | ValidationErrors>(
        `workspaces/${wid}/invitations/${iid}`
      )
    ),
    config: {
      updateLanguages: secure((payload: { languages: string[] }) =>
        api.put<{ languages: Language[] }, WorkspaceAdminErrors | ValidationErrors>(
          `workspaces/${wid}/config/languages`,
          { data: payload }
        )
      ),
      update: secure((payload: { config: DeepPartial<WorkspaceConfig> }) =>
        api.put<{ config: WorkspaceConfig }, WorkspaceAdminErrors | ValidationErrors>(`workspaces/${wid}/config`, {
          data: payload,
        })
      ),
    },
  }),
  invitations: {
    my: secure(() =>
      api.get<{ invitations: (WorkspaceInvitation & { workspace: Workspace })[] }, AuthErrors>(
        `auth/workspaces/invitations`
      )
    ),
    myAccept: secure((iid: string) =>
      api.post<
        { workspace: Workspace & AsMemberOfWorkspace & WithTheme & WithProfile & WithMembers },
        WorkspaceErrors | NotFoundErrors
      >(`auth/workspaces/invitations/${iid}`)
    ),
    myRefuse: secure((iid: string) =>
      api.delete<NoContent, AuthErrors | NotFoundErrors>(`auth/workspaces/invitations/${iid}`)
    ),

    signUp: secure((payload: InvitationSignUp) =>
      api.post<
        { user: Me; session: UserSession },
        AuthErrors<"E_INVALID_TOKEN" | "E_TOKEN_EXPIRED"> | ValidationErrors
      >(`workspaces/invitation/sign-up`, { data: payload })
    ),
    signIn: secure((payload: InvitationToken) =>
      api.post<
        { user: Me; session: UserSession },
        AuthErrors<"E_INVALID_TOKEN" | "E_TOKEN_EXPIRED"> | ValidationErrors
      >(`workspaces/invitation/sign-in`, { data: payload })
    ),
    refuse: secure((payload: InvitationToken) =>
      api.post<
        NoContent | { user: Me; session: UserSession },
        AuthErrors<"E_INVALID_TOKEN" | "E_TOKEN_EXPIRED"> | ValidationErrors
      >(`workspaces/invitation/refuse`, { data: payload })
    ),
    //"Cannot POST:/api/workspaces/invitation"

    read: secure((payload: InvitationToken) =>
      api.post<
        { invitation: PublicInvitation },
        CommonErrors<"E_INVALID_TOKEN" | "E_TOKEN_EXPIRED" | "E_WORKSPACE_DELETED">
      >(`workspaces/invitation`, {
        data: payload,
      })
    ),
  },
})
