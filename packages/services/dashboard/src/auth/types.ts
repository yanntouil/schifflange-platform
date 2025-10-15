import type { User, WithEmail, WithLanguage, WithSessions } from "../types"
import type { AsMemberOfWorkspace, WithMembers, WithProfile, WithTheme, Workspace } from "../workspaces/types"
export * as AuthPayload from "./payload"

/**
 * define the me type use in the api
 */
export type Me = User &
  WithLanguage &
  WithSessions &
  WithEmail & {
    workspace?: (Workspace & WithMembers & AsMemberOfWorkspace & WithTheme & WithProfile) | null
  }
