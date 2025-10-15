import { E_RESOURCE_NOT_FOUND } from '#exceptions/resources'
import Language from '#models/language'
import User from '#models/user'
import Workspace, {
  withWorkspaceInvitations,
  withWorkspaceMembersForAdmin,
  workspaceDefaultRole,
} from '#models/workspace'
import { makeWorkspaceConfig, mergeWorkspaceConfig } from '#models/workspace-config'
import WorkspaceLog from '#models/workspace-log'
import WorkspaceTheme from '#models/workspace-theme'
import LanguagesProvider from '#providers/languages_provider'
import MailService from '#services/mail'
import NotificationService from '#services/notification'
import WorkspaceLogService from '#services/workspace-log'
import { filterSecurityLogsValidator } from '#validators/admin/security-logs'
import {
  attachMemberValidator,
  createInvitationValidator,
  createThemeValidator,
  createWorkspaceValidator,
  filterThemesValidator,
  filterWorkspacesValidator,
  sortThemesByValidator,
  sortWorkspacesByValidator,
  updateMemberValidator,
  updateThemeValidator,
  updateWorkspaceValidator,
} from '#validators/admin/workspaces'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import db from '@adonisjs/lucid/services/db'
import { A, D, G, S } from '@mobily/ts-belt'
import { DateTime } from 'luxon'

export default class WorkspacesController {
  /**
   * index
   * Returns all workspaces for the admin
   * @get admin/workspaces
   * @middleware auth, admin
   * @success 200 { workspaces: Workspace[] }
   */
  public async index({ request, response }: HttpContext) {
    const pagination = await request.pagination()
    const filterBy = await request.filterBy(filterWorkspacesValidator)
    const sortBy = await request.sortBy(sortWorkspacesByValidator)
    const search = await request.search()
    const workspaces = await Workspace.query()
      .withScopes((scope) => scope.filterBy(filterBy))
      .withScopes((scope) => scope.search(search))
      .withScopes((scope) => scope.sortBy(sortBy))
      .preload('theme')
      .preload('profile')
      .preload(...withWorkspaceInvitations)
      .preload(...withWorkspaceMembersForAdmin)
      .paginate(...pagination)

    response.ok({
      workspaces: A.map(workspaces.all(), (workspace) => workspace.serializeInAdmin()),
      metadata: workspaces.getMeta(),
      total: await getTotalWorkspaces(),
    })
  }

  /**
   * store
   * Create a new workspace (ATM workspace will not have an owner)
   * @post admin/workspaces
   * @middleware auth, admin
   * @body { name: string, status?: WorkspaceStatus, config?: Record<string, Record<string, unknown>>, image?: File }
   * @success 200 { workspace: Workspace }
   * @error 400 E_VALIDATION_FAILURE
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (authAdmin)
   */
  public async store(ctx: HttpContext) {
    const { request, response } = ctx
    const user = ctx.auth.user!
    const { image, config, ...payload } = await request.validateUsing(createWorkspaceValidator)

    // get the theme id from payload or set the default theme or set null if no theme is provided
    const themeId = payload.themeId
      ? payload.themeId
      : (await WorkspaceTheme.query().where('isDefault', true).first())?.id || null

    // create the workspace
    const workspace = await Workspace.create({
      ...payload,
      themeId,
      config: makeWorkspaceConfig(config),
    })

    // append the image to the workspace if it is provided
    if (G.isNotNullable(image)) {
      await workspace.createImage(image)
      await workspace.save()
    }

    // add the each language to the workspace
    const languages = LanguagesProvider.all()
    await workspace.related('languages').attach(A.map(languages, D.prop('id')))

    await workspace.refresh()

    // preload related relations for serializer
    await workspace.load((query) =>
      query
        .preload('theme')
        .preload('profile')
        .preload(...withWorkspaceInvitations)
        .preload(...withWorkspaceMembersForAdmin)
    )

    // @log the workspace creation
    await WorkspaceLogService.logInAdmin('created', workspace.id, ctx, user, {
      status: workspace.status,
      byAdmin: true,
    })

    response.created({
      workspace: workspace.serializeInAdmin(),
    })
  }

  /**
   * show
   * read information about a specific workspace
   * @get admin/workspaces/:workspaceId
   * @middleware auth, admin
   * @success 200 { workspace: Workspace }
   * @error 400 E_VALIDATION_ERROR
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (authAdmin)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  public async show({ response, params }: HttpContext) {
    const workspace = await Workspace.query()
      .where('id', params.workspaceId)
      .preload('theme')
      .preload('profile')
      .preload(...withWorkspaceInvitations)
      .preload(...withWorkspaceMembersForAdmin)
      .first()

    if (G.isNullable(workspace)) throw new E_RESOURCE_NOT_FOUND()

    response.ok({
      workspace: workspace.serializeInAdmin(),
    })
  }

  /**
   * update
   * update information about a specific workspace
   * @put admin/workspaces/:workspaceId
   * @middleware auth, admin
   * @params { workspaceId: string }
   * @body { ... }
   * @success 200 { workspace: Workspace }
   * @error 400 E_VALIDATION_ERROR
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (authAdmin)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  public async update(ctx: HttpContext) {
    const { request, response, params } = ctx
    const user = ctx.auth.user!
    const workspace = await Workspace.query()
      .where('id', params.workspaceId)
      .preload('theme')
      .preload('profile')
      .preload(...withWorkspaceInvitations)
      .preload(...withWorkspaceMembersForAdmin)
      .first()

    if (G.isNullable(workspace)) throw new E_RESOURCE_NOT_FOUND()
    const {
      noEmit = false,
      image,
      themeId,
      config,
      status,
      name,
      type,
    } = await request.validateUsing(updateWorkspaceValidator)
    const changes: Record<string, any> = {
      byAdmin: true,
    }

    // manage status for soft delete
    if (G.isNotNullable(status) && workspace.status !== status) {
      workspace.status = status
      changes.status = 'updated'
      if (status === 'deleted') {
        workspace.deletedAt = DateTime.now()
        changes.status = 'deleted'
      }
    }

    // manage type
    if (G.isNotNullable(type) && workspace.type !== type) {
      console.log('type', type)
      workspace.type = type
      changes.type = 'updated'
    }

    // delete the image if it is null or a new image is provided
    if (G.isNull(image) || G.isNotNullable(image)) {
      await workspace.deleteImage()
      changes.image = 'deleted'
    }
    // create the image
    if (G.isNotNullable(image)) {
      await workspace.createImage(image)
      changes.image = 'created'
    }

    // merge the config
    if (G.isNotNullable(config)) {
      workspace.config = mergeWorkspaceConfig(config, workspace.config)
      changes.config = 'updated'
    }

    // change name
    if (G.isNotNullable(name) && workspace.name !== name) {
      workspace.name = name
      changes.name = 'updated'
    }

    // change theme
    if (G.isNotNullable(themeId) && workspace.themeId !== themeId) {
      workspace.themeId = themeId
      changes.themeId = 'updated'
    } else if (G.isNull(themeId)) {
      workspace.themeId = null
      changes.themeId = 'removed'
    }

    if (workspace.$isDirty) {
      await workspace.save()
      if (!noEmit) {
        // @log the workspace update
        await WorkspaceLogService.logInAdmin('updated', workspace.id, ctx, user, changes)
        if (changes.status === 'deleted') {
          // @notify the workspace members
          await NotificationService.notify({
            type: 'workspace-deleted',
            relatedType: 'workspace',
            relatedId: workspace.id,
            target: { users: A.map(workspace.members, D.prop('id')) },
            metadata: {
              deletedById: user.id,
              deletedByProfile: D.selectKeys(user.profile.serialize(), ['firstname', 'lastname']),
              byAdmin: true,
            },
          })
        } else {
          // @notify the workspace members
          await NotificationService.notify({
            type: 'workspace-updated',
            relatedType: 'workspace',
            relatedId: workspace.id,
            target: { users: A.map(workspace.members, D.prop('id')) },
            metadata: {
              changes,
              updatedById: user.id,
              updatedByProfile: D.selectKeys(user.profile.serialize(), ['firstname', 'lastname']),
              byAdmin: true,
            },
          })
        }
      }
    }

    response.ok({
      workspace: workspace.serializeInAdmin(),
    })
  }

  /**
   * destroy
   * delete a specific workspace
   * @delete admin/workspaces/:workspaceId
   * @middleware auth, admin
   * @success 200 { workspace: Workspace }
   * **       204
   * @error 401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (authAdmin)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  public async destroy(ctx: HttpContext) {
    const { request, response } = ctx
    const user = ctx.auth.user!
    const workspace = await Workspace.query()
      .where('id', request.param('workspaceId'))
      .preload(...withWorkspaceInvitations)
      .preload(...withWorkspaceMembersForAdmin)
      .first()

    if (G.isNullable(workspace)) throw new E_RESOURCE_NOT_FOUND()

    // permanently delete the workspace (don't log this event > cascade)
    if (workspace.status === 'deleted') {
      await workspace.delete()
      return response.noContent()
    }

    // soft delete the workspace
    await workspace.merge({ status: 'deleted', deletedAt: DateTime.now() }).save()
    // @log the workspace deletion
    await WorkspaceLogService.logInAdmin('deleted', workspace.id, ctx, user, {
      status: workspace.status,
      byAdmin: true,
    })
    // @notify the workspace members
    await NotificationService.notify({
      type: 'workspace-deleted',
      relatedType: 'workspace',
      relatedId: workspace.id,
      target: { users: A.map(workspace.members, D.prop('id')) },
      metadata: {
        deletedById: user.id,
        deletedByProfile: D.selectKeys(user.profile.serialize(), ['firstname', 'lastname']),
        byAdmin: true,
      },
    })

    response.ok({
      workspace: workspace.serializeInAdmin(),
    })
  }

  /**
   * logs
   * get logs of workspaces
   * @get admin/workspaces/logs
   * @middleware auth, admin
   * @success 200 { logs: WorkspaceLog[] }
   * @error 401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (authAdmin)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  public async logs({ request, response }: HttpContext) {
    const [page, limit] = await request.pagination()
    const search = await request.search()
    const filterBy = await request.filterBy(filterSecurityLogsValidator)
    const logs = await WorkspaceLog.query()
      .withScopes((scope) => scope.filterBy(filterBy))
      .withScopes((scope) => scope.search(search))
      .orderBy('createdAt', 'desc')
      .preload('user', (query) => query.preload('profile'))
      .paginate(page, limit)

    return response.ok({
      logs: A.map(logs.all(), (log) => log.serialize()),
      metadata: logs.getMeta(),
    })
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * MEMBERS
   */

  /**
   * updateMemberRole
   * Update the role of a member
   * @middleware auth, admin
   * @put admin/workspaces/:workspaceId/members/:memberId
   * @params { workspaceId: string, memberId: string }
   * @body { role: WorkspaceRoles }
   * @success 200 { member: WorkspaceMember[] }
   * @error 400 E_VALIDATION_FAILURE
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_WORKSPACE_NOT_ACTIVE | E_WORKSPACE_NOT_ALLOWED | E_WORKSPACE_ADMIN_REQUIRED
   * **     404 E_RESOURCE_NOT_FOUND
   */
  public async updateMember(ctx: HttpContext) {
    const { request, response } = ctx
    const user = ctx.auth.user!
    const workspace = await Workspace.query()
      .where('id', request.param('workspaceId'))
      .preload('invitations')
      .preload('members', (query) =>
        query.where('users.id', request.param('memberId')).preload('profile')
      )
      .first()
    const member = A.head(workspace?.members ?? [])
    if (G.isNullable(workspace) || G.isNullable(member)) throw new E_RESOURCE_NOT_FOUND()

    const { role } = await request.validateUsing(updateMemberValidator)
    if (member.role !== role) {
      await workspace.related('members').sync({ [member.id]: { role } }, false)

      // @log the member update
      await WorkspaceLogService.logInAdmin('member-updated', workspace.id, ctx, user, {
        memberId: member.id,
        oldRole: member.role,
        newRole: role,
        byAdmin: true,
      })

      // @notify the workspace members
      await NotificationService.notify({
        type: 'workspace-member-updated',
        relatedType: 'workspace',
        relatedId: workspace.id,
        target: { user: member.id },
        metadata: {
          changes: {
            role: 'updated',
          },
          updatedById: user.id,
          updatedByProfile: D.selectKeys(user.profile.serialize(), ['firstname', 'lastname']),
        },
      })
    }

    response.ok({
      member: {
        ...member.serialize(),
        workspaceRole: role,
        workspaceCreatedAt: member.$extras.pivot_created_at,
      },
    })
  }

  /**
   * attachMember
   * attach a member to the workspace
   * @middleware auth, admin
   * @post admin/workspaces/:workspaceId/members/:memberId
   * @params { workspaceId: string, memberId: string }
   * @body { role: WorkspaceRoles }
   * @success 204
   * @error 400 E_VALIDATION_FAILURE
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_WORKSPACE_NOT_ACTIVE | E_WORKSPACE_NOT_ALLOWED | E_WORKSPACE_ADMIN_REQUIRED
   * **     404 E_RESOURCE_NOT_FOUND
   */
  public async attachMember(ctx: HttpContext) {
    const { request, response } = ctx
    const user = ctx.auth.user!
    const member = await User.query()
      .where('id', request.param('memberId'))
      .preload('profile')
      .first()
    const workspace = await Workspace.query()
      .where('id', request.param('workspaceId'))
      .preload('invitations')
      .preload('members', (query) =>
        query.where('users.id', request.param('memberId')).preload('profile')
      )
      .first()

    if (G.isNullable(workspace) || G.isNullable(member)) throw new E_RESOURCE_NOT_FOUND()
    const payload = await request.validateUsing(attachMemberValidator)

    const allReadyExist = A.head(workspace?.members ?? [])
    const createdAt = allReadyExist?.$extras.pivot_created_at ?? DateTime.now()
    const role = payload.role ?? allReadyExist?.$extras.pivot_role ?? workspaceDefaultRole
    await workspace
      .related('members')
      .sync({ [member.id]: { role, created_at: createdAt.toSQL() } }, false)

    if (G.isNullable(allReadyExist)) {
      // @log the member attachment
      await WorkspaceLogService.logInAdmin('member-attached', workspace.id, ctx, user, {
        memberId: member.id,
        memberRole: role,
        byAdmin: true,
      })

      // @notify the member
      await NotificationService.notify({
        type: 'workspace-member-attached',
        relatedType: 'workspace',
        relatedId: workspace.id,
        target: { user: member.id },
        metadata: {
          attachedById: user.id,
          attachedByProfile: D.selectKeys(user.profile.serialize(), ['firstname', 'lastname']),
          byAdmin: true,
        },
      })
    } else if (allReadyExist.role !== role) {
      // @log the member update
      await WorkspaceLogService.logInAdmin('member-updated', workspace.id, ctx, user, {
        memberId: member.id,
        oldRole: allReadyExist.role,
        newRole: role,
        byAdmin: true,
      })

      // @notify the workspace members
      await NotificationService.notify({
        type: 'workspace-member-updated',
        relatedType: 'workspace',
        relatedId: workspace.id,
        target: { user: member.id },
        metadata: {
          changes: {
            role: 'updated',
          },
          updatedById: user.id,
          updatedByProfile: D.selectKeys(user.profile.serialize(), ['firstname', 'lastname']),
          byAdmin: true,
        },
      })
    }

    response.ok({
      member: {
        ...member.serialize(),
        workspaceRole: role,
        workspaceCreatedAt: createdAt,
      },
    })
  }

  /**
   * detachMember
   * detach a member from the workspace
   * @middleware auth, admin
   * @delete admin/workspaces/:workspaceId/members/:memberId
   * @success 204
   * @error 401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_WORKSPACE_NOT_ACTIVE | E_WORKSPACE_NOT_ALLOWED | E_WORKSPACE_ADMIN_REQUIRED
   * **     404 E_RESOURCE_NOT_FOUND
   */
  public async detachMember(ctx: HttpContext) {
    const { request, response } = ctx
    const user = ctx.auth.user!
    const workspace = await Workspace.query()
      .where('id', request.param('workspaceId'))
      .preload('invitations')
      .preload('members', (query) =>
        query.where('users.id', request.param('memberId')).preload('profile')
      )
      .first()
    const member = A.head(workspace?.members ?? [])
    if (G.isNullable(workspace) || G.isNullable(member)) throw new E_RESOURCE_NOT_FOUND()

    await workspace.related('members').detach([member.id])

    // @log the member removal
    await WorkspaceLogService.logInAdmin('member-removed', workspace.id, ctx, user, {
      memberId: member.id,
      memberRole: member.role,
      byAdmin: true,
    })

    // @notify the workspace members
    await NotificationService.notify({
      type: 'workspace-member-removed',
      relatedType: 'workspace',
      relatedId: workspace.id,
      target: { user: member.id },
      metadata: {
        removedById: user.id,
        removedByProfile: D.selectKeys(user.profile.serialize(), ['firstname', 'lastname']),
        byAdmin: true,
      },
    })

    response.noContent()
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * INVITATIONS
   */

  /**
   * createInvitation
   * Create a new workspace invitation
   * @middleware: auth, admin
   * @post admin/workspaces/:workspaceId/invitations
   * @success 200 { invitations: WorkspacesInvitation[] }
   * @error 400 E_VALIDATION_FAILURE | E_LIMIT_EXCEEDED | E_ALREADY_MEMBER
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_WORKSPACE_NOT_ACTIVE | E_WORKSPACE_NOT_ALLOWED | E_WORKSPACE_ADMIN_REQUIRED
   * **     404 E_RESOURCE_NOT_FOUND
   */
  public async createInvitation(ctx: HttpContext) {
    const { auth, request, response } = ctx
    const sender = auth.user!
    const workspace = await Workspace.query()
      .where('id', request.param('workspaceId'))
      .preload(...withWorkspaceInvitations)
      .preload(...withWorkspaceMembersForAdmin)
      .first()

    if (G.isNullable(workspace)) throw new E_RESOURCE_NOT_FOUND()

    const { email, role, language } = await request.validateUsing(createInvitationValidator)

    // check if the email is already an existant user
    const maybeUser = await User.query().where('email', email).preload('profile').first()

    if (G.isNotNullable(maybeUser)) {
      const isMember = A.some(workspace.members, (member) => member.id === maybeUser.id)
      if (isMember) {
        // @log the member update
        await WorkspaceLogService.logInAdmin('member-updated', workspace.id, ctx, sender, {
          status: 'failed-already-member',
          memberId: maybeUser.id,
          oldRole: maybeUser.role,
          newRole: role,
          byAdmin: true,
        })
        return response.badRequest({
          name: 'E_ALREADY_MEMBER',
          status: 400,
          message: 'This user is already a member of the workspace',
        })
      }
    }

    // check if the email has already been invited in the workspace the last 16 hours
    const inOneDay = DateTime.now().plus({ hours: 16 })
    const allReadySend = A.find(
      workspace.invitations,
      (invitation) =>
        S.toLowerCase(invitation.email) === S.toLowerCase(email) && invitation.createdAt < inOneDay
    )

    if (app.inDev && G.isNotNullable(allReadySend)) {
      if (allReadySend.status === 'deleted') {
        await allReadySend.merge({ status: 'pending', deletedAt: null, role }).save()
        return response.ok({ invitation: allReadySend.serialize() })
      }
      // @log the invitation creation
      await WorkspaceLogService.logInAdmin('invitation-created', workspace.id, ctx, sender, {
        status: 'failed-limit-exceeded',
        email,
        role,
        language,
        byAdmin: true,
      })
      return response.badRequest({
        name: 'E_LIMIT_EXCEEDED',
        status: 400,
        message: 'You have already invited this email in the last 24 hours',
      })
    }

    // create the invitation on db
    const invitation = await workspace.related('invitations').create({
      email: S.toLowerCase(email),
      createdById: sender.id,
      role,
    })
    await invitation.load('createdBy', (query) => query.preload('profile'))

    // send the invitation by email
    await MailService.sendWorkspaceInvitation(
      email,
      Language.getOrDefault(language).code,
      { workspace, sender, maybeUser, token: invitation.value },
      { userId: sender.id }
    )
    // @log the invitation creation
    await WorkspaceLogService.logInAdmin('invitation-created', workspace.id, ctx, sender, {
      email,
      role,
      language,
      byAdmin: true,
    })
    // @notify the user if it has an account
    if (G.isNotNullable(maybeUser)) {
      await NotificationService.notify({
        type: 'invitation-to-join-workspace',
        relatedType: 'workspace',
        relatedId: workspace.id,
        target: { user: maybeUser.id },
        metadata: {
          senderId: sender.id,
          senderProfile: D.selectKeys(sender.profile.serialize(), ['firstname', 'lastname']),
          byAdmin: true,
        },
      })
    }

    response.ok({ invitation: invitation.serialize() })
  }

  /**
   * deleteInvitation
   * delete a workspace invitation
   * @middleware: auth, admin
   * @delete admin/workspaces/:workspaceId/invitations/:invitationId
   * @success 204
   * @error 401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_WORKSPACE_NOT_ACTIVE | E_WORKSPACE_NOT_ALLOWED | E_WORKSPACE_ADMIN_REQUIRED
   * **     404 E_RESOURCE_NOT_FOUND
   */
  public async deleteInvitation(ctx: HttpContext) {
    const { request, response } = ctx
    const user = ctx.auth.user!
    const workspace = await Workspace.query()
      .where('id', request.param('workspaceId'))
      .preload(...withWorkspaceInvitations)
      .first()

    if (G.isNullable(workspace)) throw new E_RESOURCE_NOT_FOUND()

    const invitation = await workspace
      .related('invitations')
      .query()
      .where('id', request.param('invitationId'))
      .andWhereNot('status', 'deleted')
      .first()

    if (G.isNullable(invitation)) throw new E_RESOURCE_NOT_FOUND('Invitation not found')

    await invitation.merge({ status: 'deleted', deletedAt: DateTime.now() }).save()
    // @log the invitation deletion
    await WorkspaceLogService.logInAdmin('invitation-deleted', workspace.id, ctx, user, {
      invitationId: invitation.id,
      byAdmin: true,
    })
    response.noContent()
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * LOGS & STATS
   */

  /**
   * logsIndex
   * get workspaces logs
   * @get admin/workspaces/logs
   * @middleware auth, admin
   * @success 200 { logs: WorkspaceLog[] }
   * @error 401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (authAdmin)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  public async logsIndex({ request, response }: HttpContext) {
    const [page, limit] = await request.pagination()
    const search = await request.search()
    const filterBy = await request.filterBy(filterSecurityLogsValidator)

    const logs = await WorkspaceLog.query()
      .withScopes((scope) => scope.filterBy(filterBy))
      .withScopes((scope) => scope.search(search))
      .orderBy('createdAt', 'desc')
      .preload('user', (query) => query.preload('profile'))
      .preload('workspace')
      .paginate(page, limit)

    return response.ok({
      logs: A.map(logs.all(), (log) => log.serialize()),
      metadata: logs.getMeta(),
    })
  }

  /**
   * logsShow
   * get a specific workspace log
   * @get admin/workspaces/logs/:logId
   * @middleware auth, admin
   * @success 200 { logs: WorkspaceLog[] }
   * @error 401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (authAdmin)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  public async logsByWorkspace({ params, request, response }: HttpContext) {
    const [page, limit] = await request.pagination()
    const search = await request.search()
    const filterBy = await request.filterBy(filterSecurityLogsValidator)
    const logs = await WorkspaceLog.query()
      .where('workspaceId', params.workspaceId)
      .withScopes((scope) => scope.filterBy(filterBy))
      .withScopes((scope) => scope.search(search))
      .orderBy('createdAt', 'desc')
      .preload('user', (query) => query.preload('profile'))
      .preload('workspace')
      .paginate(page, limit)

    return response.ok({
      logs: A.map(logs.all(), (log) => log.serialize()),
      metadata: logs.getMeta(),
    })
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * THEMES
   */

  /**
   * themesIndex
   * Returns all workspace themes for admin
   * @get admin/workspaces/themes
   * @middleware auth, admin
   * @success 200 { themes: WorkspaceTheme[] }
   * @error 401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (authAdmin)
   */
  public async themesIndex({ request, response }: HttpContext) {
    const pagination = await request.pagination()
    const filterBy = await request.filterBy(filterThemesValidator)
    const sortBy = await request.sortBy(sortThemesByValidator)
    const search = await request.search()

    const themes = await WorkspaceTheme.query()
      .withScopes((scope) => scope.filterBy(filterBy))
      .withScopes((scope) => scope.search(search))
      .withScopes((scope) => scope.sortBy(sortBy))
      .paginate(...pagination)

    response.ok({
      themes: A.map(themes.all(), (theme) => theme.serialize()),
      metadata: themes.getMeta(),
    })
  }

  /**
   * themeStore
   * Create a new workspace theme
   * @post admin/workspaces/themes
   * @middleware auth, admin
   * @body { name: string, description?: string, isDefault?: boolean, config?: Record<string, any>, image?: File }
   * @success 201 { theme: WorkspaceTheme }
   * @error 400 E_VALIDATION_FAILURE
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (authAdmin)
   */
  public async themeStore(ctx: HttpContext) {
    const { request, response } = ctx
    const { image, ...payload } = await request.validateUsing(createThemeValidator)

    // If setting as default, remove default from others
    if (payload.isDefault) {
      await WorkspaceTheme.query().where('isDefault', true).update({ isDefault: false })
    }

    // Create the theme
    const theme = await WorkspaceTheme.create(payload)

    // Append the image if provided
    if (G.isNotNullable(image)) {
      await theme.createImage(image)
      await theme.save()
    }

    await theme.refresh()

    response.created({
      theme: theme.serialize(),
    })
  }

  /**
   * themeShow
   * Show a specific workspace theme
   * @get admin/workspaces/themes/:themeId
   * @middleware auth, admin
   * @success 200 { theme: WorkspaceTheme }
   * @error 401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (authAdmin)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  public async themeShow({ response, params }: HttpContext) {
    const theme = await WorkspaceTheme.query().where('id', params.themeId).first()

    if (G.isNullable(theme)) throw new E_RESOURCE_NOT_FOUND()

    response.ok({
      theme: theme.serialize(),
    })
  }

  /**
   * themeUpdate
   * Update a workspace theme
   * @put admin/workspaces/themes/:themeId
   * @middleware auth, admin
   * @body { name?: string, description?: string, isDefault?: boolean, config?: Record<string, any>, image?: File }
   * @success 200 { theme: WorkspaceTheme }
   * @error 400 E_VALIDATION_FAILURE
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (authAdmin)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  public async themeUpdate(ctx: HttpContext) {
    const { request, response, params } = ctx
    const theme = await WorkspaceTheme.query().where('id', params.themeId).first()

    if (G.isNullable(theme)) throw new E_RESOURCE_NOT_FOUND()

    const { image, ...payload } = await request.validateUsing(updateThemeValidator)

    // If setting as default, remove default from others
    if (payload.isDefault && !theme.isDefault) {
      await WorkspaceTheme.query().where('isDefault', true).update({ isDefault: false })
    }

    // Update basic fields
    theme.merge(payload)

    // Handle image update
    if (G.isNull(image) || G.isNotNullable(image)) {
      await theme.deleteImage()
    }
    if (G.isNotNullable(image)) {
      await theme.createImage(image)
    }

    if (theme.$isDirty) {
      await theme.save()
    }

    response.ok({
      theme: theme.serialize(),
    })
  }

  /**
   * themeDestroy
   * Delete a workspace theme
   * @delete admin/workspaces/themes/:themeId
   * @middleware auth, admin
   * @success 204
   * @error 401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (authAdmin)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  public async themeDestroy(ctx: HttpContext) {
    const { request, response } = ctx
    const theme = await WorkspaceTheme.query().where('id', request.param('themeId')).first()

    if (G.isNullable(theme)) throw new E_RESOURCE_NOT_FOUND()

    await theme.delete()
    response.noContent()
  }
}

/**
 * getTotalWorkspaces
 * Returns the total number of workspaces
 */
const getTotalWorkspaces = async (): Promise<number> => {
  const result = A.head(await db.from('workspaces').count('*', 'total'))
  const total = G.isNumber(result?.total) ? result.total : 0
  return total
}
