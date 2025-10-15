import { E_UNAUTHENTICATED_ACCESS } from '#exceptions/auth'
import {
  E_WORKSPACE_ADMIN_REQUIRED,
  E_WORKSPACE_NOT_ACTIVE,
  E_WORKSPACE_NOT_ALLOWED,
  E_WORKSPACE_OWNER_REQUIRED,
} from '#exceptions/workspaces'
import Workspace, {
  withWorkspaceInvitations,
  withWorkspaceMembers,
  withWorkspaceProfile,
  WorkspaceRoles,
} from '#models/workspace'
import type { Authenticators } from '@adonisjs/auth/types'
import { HttpContext } from '@adonisjs/core/http'
import { NextFn } from '@adonisjs/core/types/http'
import { A, G, S } from '@mobily/ts-belt'
import assert from 'assert'

export default class WorkspaceMiddleware {
  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: {
      guards?: (keyof Authenticators)[]
      as?: 'member' | 'admin' | 'owner'
      active?: true
    } = {}
  ) {
    const workspaceId = ctx.request.param('workspaceId')
    if (!(G.isString(workspaceId) && S.isNotEmpty(workspaceId))) throw new E_WORKSPACE_NOT_ALLOWED()
    const workspace = await Workspace.query()
      .where('id', workspaceId)
      .preload(...withWorkspaceMembers)
      .preload(...withWorkspaceInvitations)
      .preload(...withWorkspaceProfile)
      .preload('theme')
      .preload('languages')
      .first()
    if (G.isNullable(workspace)) throw new E_WORKSPACE_NOT_ALLOWED()
    if (options.as) {
      // must be authenticated
      const user = ctx.auth.user
      assert(user, new E_UNAUTHENTICATED_ACCESS())

      // must be member of workspace
      const member = A.find(workspace.members, (member) => member.id === user.id)
      if (G.isNullable(member)) throw new E_WORKSPACE_NOT_ALLOWED()
      const memberRole: WorkspaceRoles = member.$extras.pivot_role

      // must be admin of workspace
      if (options.as === 'admin' && !A.includes(['admin', 'owner'], memberRole))
        throw new E_WORKSPACE_ADMIN_REQUIRED()

      // must be owner of workspace
      if (options.as === 'owner' && !A.includes(['owner'], memberRole))
        throw new E_WORKSPACE_OWNER_REQUIRED()
    }

    if (options.active && workspace.status !== 'active') throw new E_WORKSPACE_NOT_ACTIVE()

    ctx.workspace = workspace
    return next()
  }
}

declare module '@adonisjs/core/http' {
  interface HttpContext {
    workspace: Workspace
  }
}
