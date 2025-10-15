import { E_UNAUTHORIZED_ACCESS } from '#exceptions/auth'
import { E_RESOURCE_NOT_ALLOWED, E_RESOURCE_NOT_FOUND } from '#exceptions/resources'
import Language from '#models/language'
import User from '#models/user'
import {
  canIAssign,
  canIRemove,
  withWorkspaceInvitations,
  withWorkspaceMembers,
  withWorkspaceProfile,
  workspaceDefaultRole,
  WorkspaceRoles,
} from '#models/workspace'
import { mergeWorkspaceConfig } from '#models/workspace-config'
import WorkspaceLog from '#models/workspace-log'
import WorkspaceProfile from '#models/workspace-profile'
import { compareTranslations } from '#models/workspace-profile-translation'
import WorkspaceTheme from '#models/workspace-theme'
import WorkspaceInvitation from '#models/workspaces-invitation'
import MailService from '#services/mail'
import NotificationService from '#services/notification'
import WorkspaceLogService from '#services/workspace-log'
import { Infer } from '#start/vine'
import { filterSecurityLogsValidator } from '#validators/admin/security-logs'
import {
  createInvitationValidator,
  updateConfigValidator,
  updateLanguagesValidator,
  updateMemberValidator,
  updateValidator,
} from '#validators/workspaces'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { A, D, G, O, S } from '@mobily/ts-belt'
import { DateTime } from 'luxon'

/**
 * Controller: Workspace/WorkspacesController
 * private controller use to manage all features related to workspaces as a workspace member
 */
export default class WorkspacesController {
  /**
   * list
   * get list of workspaces for the authenticated user
   * @get workspaces
   * @middleware auth
   * @success 200 { workspaces: Workspace[] }
   * @error 401 E_UNAUTHORIZED_ACCESS (authActive)
   */
  public async list({ auth, response }: HttpContext) {
    const user = auth.user!

    const workspaces = await user
      .related('workspaces')
      .query()
      .where('status', 'active')
      .preload('theme')
      .preload(...withWorkspaceProfile)
      .preload(...withWorkspaceMembers)
      .preload(...withWorkspaceInvitations)
      .orderBy('name', 'asc')

    // TODO: non permanent fix to add profile in not created on each workspaces (to remove)
    await Promise.all(
      A.map(workspaces, async (workspace) => {
        if (G.isNullable(workspace.profile)) {
          await workspace.related('profile').create({})
        } else {
          const languages = await Language.all()
          const translations = await workspace.profile.getOrLoadRelation('translations')
          await Promise.all(
            A.map(languages, async (language) => {
              // controle if translation is not already created
              const translation = A.find(
                translations,
                (translation) => translation.languageId === language.id
              )
              if (G.isNullable(translation)) {
                await workspace.profile
                  .related('translations')
                  .create({ languageId: language.id, welcomeMessage: '' })
              }
            })
          )
        }
      })
    )

    response.ok({
      workspaces: A.map(workspaces, (workspace) => workspace.serializeInWorkspaceFor(user)),
    })
  }

  /**
   * read
   * get a workspace details
   * @get workspaces/:workspaceId
   * @middleware auth, workspace({as 'member'})
   * @success 200 { workspace: Workspace }
   * @error 401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   */
  public async read({ auth, workspace, response }: HttpContext) {
    const user = auth.user!

    response.ok({
      workspace: workspace.serializeInWorkspaceFor(user),
    })
  }

  /**
   * signIn
   * sign in to a workspace (set as current workspace)
   * @post workspaces/:workspaceId/sign-in
   * @middleware auth, workspace({as 'member'})
   * @success 200 { workspace: Workspace }
   * @error 401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   */
  public async signIn(ctx: HttpContext) {
    const { auth, workspace, response } = ctx
    const user = auth.user!

    // const workspace = await user
    //   .related('workspaces')
    //   .query()
    //   .where('workspaces.id', ctx.request.param('workspaceId'))
    //   .andWhere('status', 'active')
    //   .preload('theme')
    //   .preload(...withWorkspaceProfile)
    //   .preload(...withWorkspaceMembers)
    //   .preload(...withWorkspaceInvitations)
    //   .first()

    // if (G.isNullable(workspace)) throw new E_RESOURCE_NOT_FOUND({ message: 'Workspace not found' })

    // update user's current workspace
    await user.merge({ workspaceId: workspace.id }).save()

    response.ok({
      workspace: workspace.serializeInWorkspaceFor(user),
    })
  }
  /**
   * update
   * update the workspace
   * @put workspaces/:workspaceId
   * @middleware auth, workspace({as 'admin'})
   * @body {image: File | null, config: Record<string, Record<string, unknown>>, name: string}
   * @success 200 { workspace: Workspace }
   * @error 400 E_VALIDATION_ERROR
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   */
  public async update(ctx: HttpContext) {
    const { auth, workspace, request, response } = ctx
    const user = auth.user!
    const { image, config, themeId, name, profile, profileLogo } =
      await request.validateUsing(updateValidator)
    const changes: Record<string, any> = {}

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

    // change theme
    if (G.isNotNullable(themeId) && workspace.themeId !== themeId) {
      workspace.themeId = themeId
      changes.themeId = 'updated'
    } else if (G.isNull(themeId)) {
      workspace.themeId = null
      changes.themeId = 'removed'
    }

    // update the profile
    if (G.isNotNullable(profile) && profileHasChanges(profile, workspace.profile)) {
      changes.profile = 'updated'
      if (G.isNull(profile.logo) || G.isNotNullable(profile.logo)) {
        await workspace.profile.deleteLogo()
      }
      if (G.isNotNullable(profile.logo)) {
        await workspace.profile.createLogo(profile.logo)
      }
      if (G.isNotNullable(profile.translations)) {
        await workspace.profile.mergeTranslations(profile.translations)
      }
      await workspace.profile.save()
    }
    // flat update of the profile logo
    if (G.isNull(profileLogo) || G.isNotNullable(profileLogo)) {
      await workspace.profile.deleteLogo()
      if (G.isNotNullable(profileLogo)) {
        await workspace.profile.createLogo(profileLogo)
      }
      await workspace.profile.save()
    }

    // merge the config
    if (G.isNotNullable(config)) {
      workspace.config = D.merge(workspace.config, config)
      changes.config = 'updated'
    }

    // change name
    if (G.isNotNullable(name) && workspace.name !== name) {
      workspace.name = name
      changes.name = 'updated'
    }

    if (workspace.$isDirty) {
      await workspace.save()
      // @log the workspace update
      await WorkspaceLogService.log('updated', ctx, user, changes)
    }

    // @notify the workspace members except the user who made the changes
    await NotificationService.notify({
      type: 'workspace-updated',
      relatedType: 'workspace',
      relatedId: workspace.id,
      target: {
        users: A.filterMap(workspace.members, (member) =>
          user.id === member.id ? O.None : O.Some(member.id)
        ),
      },
      metadata: {
        changes,
        updatedById: user.id,
        updatedByProfile: D.selectKeys(user.profile.serialize(), ['firstname', 'lastname']),
      },
    })

    response.ok({
      workspace: workspace.serializeInWorkspaceFor(user),
    })
  }

  /**
   * destroy
   * delete the workspace
   * @delete workspaces/:workspaceId
   * @middleware auth, workspace({as 'owner'})
   * @success 204
   * @error 401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   */
  public async destroy(ctx: HttpContext) {
    const { auth, workspace, response } = ctx
    const user = auth.user!

    // soft delete the workspace
    await workspace.merge({ status: 'deleted', deletedAt: DateTime.now() }).save()

    // @log the workspace deletion
    await WorkspaceLogService.log('deleted', ctx, user, { status: 'deleted' })

    // @notify the workspace members
    await NotificationService.notify({
      type: 'workspace-deleted',
      relatedType: 'workspace',
      relatedId: workspace.id,
      target: { workspace: workspace.id },
      metadata: {
        deletedById: user.id,
        deletedByProfile: D.selectKeys(user.profile.serialize(), ['firstname', 'lastname']),
      },
    })

    response.noContent()
  }

  /**
   * logs
   * get logs of the workspace
   * @get workspaces/:workspaceId/logs
   * @middleware auth, workspace({as 'member'})
   * @success 200 { logs: WorkspaceLog[] }
   * @error 401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (authAdmin)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  public async logs({ request, workspace, response }: HttpContext) {
    const [page, limit] = await request.pagination()
    const search = await request.search()
    const filterBy = await request.filterBy(filterSecurityLogsValidator)
    const logs = await WorkspaceLog.query()
      .where('workspaceId', workspace.id)
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
   * membersAll
   * get list of members of the workspace
   * @get workspaces/:workspaceId/members
   * @middleware auth, workspace({as 'member'})
   * @success 200 { workspace: Workspace }
   * @error 400 E_VALIDATION_ERROR
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   */
  public async listMembers({ workspace, response }: HttpContext) {
    response.ok({
      ...workspace.serializeMembers(),
    })
  }

  /**
   * membersUpdate
   * Update the role of a member in the workspace
   * @middleware authActive workspace({as 'admin'})
   * @put workspaces/:workspaceId/members/:memberId
   * @body {role: WorkspaceRoles}
   * @success 200 { member: WorkspaceMember[] }
   * @error 400 E_VALIDATION_FAILURE
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace & canIAssign)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  public async updateMember(ctx: HttpContext) {
    const { auth, workspace, request, response } = ctx
    const user = auth.user!

    // get the member to update
    const member = A.find(workspace.members, (member) => member.id === request.param('memberId'))
    const memberRole = member?.$extras.pivot_role as Option<WorkspaceRoles>

    // get the role of the authenticated user
    const authRole = A.find(workspace.members, (member) => member.id === user.id)?.$extras
      .pivot_role as Option<WorkspaceRoles>

    // assert the member and the roles exists
    if (G.isNullable(member) || G.isNullable(authRole) || G.isNullable(memberRole))
      throw new E_RESOURCE_NOT_FOUND()

    const { role } = await request.validateUsing(updateMemberValidator)

    // check if the authenticated user can assign this role
    if (!canIAssign(authRole, memberRole, role)) {
      // @log the failed role assignment
      await WorkspaceLogService.log('member-updated', ctx, user, {
        status: 'failed-not-allowed',
        memberId: member.id,
        oldRole: memberRole,
        newRole: role,
      })
      throw new E_RESOURCE_NOT_ALLOWED()
    }

    // update the role of the member
    if (memberRole !== role) {
      await workspace.related('members').sync({ [member.id]: { role } }, false)
      // @log the role assignment
      await WorkspaceLogService.log('member-updated', ctx, user, {
        status: 'success',
        memberId: member.id,
        oldRole: memberRole,
        newRole: role,
      })

      // @notify the workspace members except the user who made the changes
      await NotificationService.notify({
        type: 'workspace-member-updated',
        relatedType: 'workspace',
        relatedId: workspace.id,
        target: {
          user: member.id,
        },
        metadata: {
          changes: { role },
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
   * detachMember
   * Detach a member from the workspace
   * @middleware auth, workspace({as 'admin'})
   * @delete workspaces/:workspaceId/members/:memberId
   * @success 204
   * @error 401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace & canIRemove)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  public async detachMember(ctx: HttpContext) {
    const { auth, workspace, request, response } = ctx
    const user = auth.user!

    // get the member to update
    const member = A.find(workspace.members, (member) => member.id === request.param('memberId'))
    const memberRole = member?.$extras.pivot_role as Option<WorkspaceRoles>

    // get the role of the authenticated user
    const authRole = A.find(workspace.members, (member) => member.id === user.id)?.$extras
      .pivot_role as Option<WorkspaceRoles>

    // assert the member and the roles exists
    if (G.isNullable(member) || G.isNullable(authRole) || G.isNullable(memberRole))
      throw new E_RESOURCE_NOT_FOUND()

    // check if the authenticated user can remove this member
    if (!canIRemove(authRole, memberRole)) {
      // @log the failed role assignment
      await WorkspaceLogService.log('member-removed', ctx, user, {
        status: 'failed-not-allowed',
        memberId: member.id,
        memberRole,
      })
      throw new E_RESOURCE_NOT_ALLOWED()
    }

    // remove the member from the workspace
    await workspace.related('members').detach([member.id])
    // @log the role assignment
    await WorkspaceLogService.log('member-removed', ctx, user, {
      status: 'success',
      memberId: member.id,
      memberRole,
    })

    // @notify the workspace members and the user who has been removed is not notified
    await NotificationService.notify({
      type: 'workspace-member-removed',
      relatedType: 'workspace',
      relatedId: workspace.id,
      target: { users: A.map(workspace.members, D.prop('id')) },
      metadata: {
        removedById: user.id,
        removedByProfile: D.selectKeys(user.profile.serialize(), ['firstname', 'lastname']),
      },
    })

    response.noContent()
  }

  /**
   * detachMe
   * Detach me from the workspace
   * @middleware auth, workspace({as 'member'})
   * @delete workspaces/:workspaceId/members/me
   * @success 204
   * @error 401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace & canIRemove)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  public async detachMe(ctx: HttpContext) {
    const { auth, workspace, response } = ctx
    const user = auth.user!

    // get the member to update
    const member = A.find(workspace.members, (member) => member.id === user.id)

    // assert the member and the roles exists
    if (G.isNullable(member)) throw new E_RESOURCE_NOT_FOUND()
    const memberRole = member.$extras.pivot_role as Option<WorkspaceRoles>

    // remove the member from the workspace
    await workspace.related('members').detach([member.id])

    // @log the role assignment
    await WorkspaceLogService.log('member-removed', ctx, user, {
      status: 'success',
      memberId: member.id,
      memberRole,
    })

    // @notify the workspace members and except the user who has been left
    await NotificationService.notify({
      type: 'workspace-member-left',
      relatedType: 'workspace',
      relatedId: workspace.id,
      target: {
        users: A.filterMap(workspace.members, (member) =>
          member.id === user.id ? O.None : O.Some(member.id)
        ),
      },
      metadata: {
        leftById: user.id,
        leftByProfile: D.selectKeys(user.profile.serialize(), ['firstname', 'lastname']),
      },
    })

    response.noContent()
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * INVITATIONS
   */

  /**
   * myInvitations
   * get list of invitations of the user
   * @get auth/workspaces/invitations
   * @middleware authActive
   * @success 200 { invitations: WorkspaceInvitation[] }
   * @error 400 E_VALIDATION_ERROR
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   */
  public async myInvitations({ auth, response }: HttpContext) {
    const user = auth.user!
    if (G.isNullable(user.email)) response.ok({ invitations: [] })
    const invitations = await WorkspaceInvitation.query()
      .where('email', user.email!)
      .andWhere('status', 'pending')
      .andWhere('expiresAt', '>', DateTime.now().toSQL())
      .preload('workspace')
      .preload('createdBy', (query) => query.preload('profile'))
    response.ok({
      invitations: A.map(invitations, (invitation) => invitation.serialize()),
    })
  }

  /**
   * myInvitationsAccept
   * accept an invitation of the user
   * @post auth/workspaces/invitations/:invitationId
   * @middleware authActive
   * @success 200 { workspace: Workspace }
   * @error 401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace & workspace.isNotActive)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  public async myInvitationsAccept(ctx: HttpContext) {
    const { auth, request, response } = ctx
    const user = auth.user!
    if (G.isNullable(user.email)) throw new E_UNAUTHORIZED_ACCESS()

    const invitation = await WorkspaceInvitation.query()
      .where('email', user.email!)
      .andWhere('id', request.param('invitationId'))
      .andWhere('status', 'pending')
      .andWhere('expiresAt', '>', DateTime.now().toSQL())
      .preload('workspace')
      .preload('createdBy', (query) => query.preload('profile'))
      .first()
    if (G.isNullable(invitation)) throw new E_RESOURCE_NOT_FOUND()
    if (G.isNullable(invitation.workspace) || invitation.workspace.isNotActive())
      throw new E_RESOURCE_NOT_ALLOWED()

    // accept the invitation and append the user to the workspace members
    await invitation.merge({ status: 'accepted' }).save()
    await invitation.workspace
      .related('members')
      .sync({ [user.id]: { role: invitation.role, created_at: DateTime.now().toSQL() } }, false)

    // @log the member join
    await WorkspaceLogService.log('member-joined', ctx, user, {
      invitationId: invitation.id,
      email: user.email,
      role: invitation.role,
      userId: user.id,
      workspaceId: invitation.workspaceId,
      byAdmin: true,
    })

    await invitation.load('workspace', (query) =>
      query
        .preload('theme')
        .preload(...withWorkspaceProfile)
        .preload(...withWorkspaceMembers)
        .preload(...withWorkspaceInvitations)
    )
    response.ok({
      workspace: invitation.workspace.serializeInWorkspaceFor(user),
    })
  }

  /**
   * myInvitationsRefuse
   * refuse an invitation of the user
   * @delete auth/workspaces/invitations/:invitationId
   * @middleware authActive
   * @success 204
   * @error 401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  public async myInvitationsRefuse(ctx: HttpContext) {
    const { auth, request, response } = ctx
    const user = auth.user!
    if (G.isNullable(user.email)) throw new E_UNAUTHORIZED_ACCESS()

    const invitation = await WorkspaceInvitation.query()
      .where('email', user.email!)
      .andWhere('id', request.param('invitationId'))
      .andWhere('status', 'pending')
      .andWhere('expiresAt', '>', DateTime.now().toSQL())
      .first()
    if (G.isNullable(invitation)) throw new E_RESOURCE_NOT_FOUND()

    // refuse the invitation
    await invitation.merge({ status: 'refused' }).save()

    response.noContent()
  }

  /**
   * invitationsAll
   * get list of invitations of the workspace
   * @get workspaces/:workspaceId/invitations
   * @middleware authActive workspace({as 'member'})
   * @success 200 { workspace: Workspace }
   * @error 400 E_VALIDATION_ERROR
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   */
  public async listInvitations({ workspace, response }: HttpContext) {
    response.ok({
      invitations: A.filterMap(workspace.invitations, (invitation) =>
        invitation.status !== 'deleted' ? O.Some(invitation.serialize()) : O.None
      ),
    })
  }

  /**
   * invitationsCreate
   * create a new invitation for the workspace
   * @post workspaces/:workspaceId/invitations
   * @middleware authActive workspace({as 'admin'})
   * @body {email: string, role: WorkspaceRoles, language: string}
   * @success 200 { invitation: WorkspacesInvitation }
   * @error 400 E_VALIDATION_ERROR | E_ALREADY_MEMBER | E_LIMIT_EXCEEDED
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace & canIAssign)
   */
  public async createInvitation(ctx: HttpContext) {
    const { auth, workspace, request, response } = ctx
    const sender = auth.user!
    const {
      email,
      role = workspaceDefaultRole,
      language,
    } = await request.validateUsing(createInvitationValidator)

    // check if the authenticated user can assign this role
    const authRole = A.find(workspace.members, (member) => member.id === sender.id)?.$extras
      .pivot_role as Option<WorkspaceRoles>

    if (G.isNullable(authRole) || !canIAssign(authRole, role, role))
      throw new E_RESOURCE_NOT_ALLOWED()

    // check if the email is already an existant user
    const maybeUser = await User.query().where('email', email).preload('profile').first()

    if (G.isNotNullable(maybeUser)) {
      const isMember = A.some(workspace.members, (member) => member.id === maybeUser.id)
      if (isMember) {
        // @log the failed invitation
        await WorkspaceLogService.log('invitation-created', ctx, sender, {
          status: 'failed-already-member',
          email,
          userId: maybeUser.id,
          role,
        })

        // return an error
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
      // @log the failed invitation
      await WorkspaceLogService.log('invitation-created', ctx, sender, {
        status: 'failed-limit-exceeded',
        email,
        role,
      })

      // return an error
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

    // @mail send the invitation by email
    await MailService.sendWorkspaceInvitation(
      email,
      Language.getOrDefault(language).code,
      { workspace, sender, maybeUser, token: invitation.value },
      { userId: sender.id }
    )

    // @log the invitation creation
    await WorkspaceLogService.log('invitation-created', ctx, sender, {
      status: 'success',
      email,
      userId: maybeUser?.id ?? null,
      role,
    })

    if (maybeUser) {
      // @notify the user that he has been invited to join the workspace
      await NotificationService.notify({
        type: 'invitation-to-join-workspace',
        relatedType: 'workspace',
        relatedId: workspace.id,
        target: { user: maybeUser.id },
        metadata: {
          invitationId: invitation.id,
          senderId: sender.id,
          senderProfile: D.selectKeys(sender.profile.serialize(), ['firstname', 'lastname']),
        },
      })
    }

    response.ok({ invitation: invitation.serialize() })
  }

  /**
   * invitationsDelete
   * delete an invitation in the workspace
   * @middleware: authActive workspace(admin)
   * @delete workspaces/:workspaceId/invitations/:invitationId
   * @success 204
   * @error 401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  public async deleteInvitation(ctx: HttpContext) {
    const { auth, workspace, request, response } = ctx
    const user = auth.user!
    const invitation = await workspace
      .related('invitations')
      .query()
      .where('id', request.param('invitationId'))
      .andWhereNot('status', 'deleted')
      .first()

    if (G.isNullable(invitation)) throw new E_RESOURCE_NOT_FOUND('Invitation not found')

    await invitation.merge({ status: 'deleted', deletedAt: DateTime.now() }).save()

    // @log the invitation deletion
    await WorkspaceLogService.log('invitation-deleted', ctx, user, {
      status: 'success',
      invitationId: invitation.id,
    })
    response.noContent()
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * CONFIGURATIONS
   */

  /**
   * languagesUpdate
   * update languages associated to workspace
   * @put workspaces/:workspaceId/config/languages
   * @middleware auth, workspace({as 'admin'})
   * @body { languages: string[] }
   * @success 200 { workspaceLanguages: Language[] }
   * @error 400 E_VALIDATION_ERROR
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   */
  public async languagesUpdate(ctx: HttpContext) {
    const { auth, workspace, request, response } = ctx
    const user = auth.user!

    const { languages } = await request.validateUsing(updateLanguagesValidator)

    // set default language with default language or first language in case languages is empty
    const allLanguages = await Language.query()
    const defaultLanguage = allLanguages.find((lang) => lang.isDefault) || A.head(allLanguages)
    const defaultLanguages = G.isNotNullable(defaultLanguage) ? [defaultLanguage.id] : []
    const validLanguageIds = A.isEmpty(languages) ? defaultLanguages : languages

    // Sync workspace languages
    await workspace.related('languages').sync(validLanguageIds, true)
    await workspace.load('languages')

    // @log the languages update
    await WorkspaceLogService.log('updated', ctx, user, {
      status: 'success',
      changes: { languages: validLanguageIds },
      languageCount: validLanguageIds.length,
    })

    response.ok({
      languages: A.map(workspace.languages, (language) => language.serialize()),
    })
  }

  /**
   * configurationUpdate
   * update workspace configuration
   * @put workspaces/:workspaceId/config
   * @middleware auth, workspace({as 'admin'})
   * @body { configuration: Record<string, any> }
   * @success 200 { configuration: Record<string, any> }
   * @error 400 E_VALIDATION_ERROR
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   */
  public async configurationUpdate(ctx: HttpContext) {
    const { auth, workspace, request, response } = ctx
    const user = auth.user!

    const { config } = await request.validateUsing(updateConfigValidator)
    console.log('config', config)
    // Merge the new configuration with existing one
    workspace.config = mergeWorkspaceConfig(config, workspace.config)

    await workspace.save()

    // @log the configuration update
    await WorkspaceLogService.log('updated', ctx, user, {
      status: 'success',
      changes: { config },
    })

    response.ok({
      config: workspace.config,
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
   */
  public async themesIndex({ response }: HttpContext) {
    const themes = await WorkspaceTheme.query()

    response.ok({
      themes: A.map(themes, (theme) => theme.serialize()),
    })
  }
}

/**
 * check if the profile has changes
 * @param profile - the profile to check
 * @param workspaceProfile - the workspace profile to check
 * @returns true if the profile has changes, false otherwise
 */
const profileHasChanges = (
  profile: NonNullable<Infer<typeof updateValidator>['profile']>,
  workspaceProfile: WorkspaceProfile
) => {
  // delete the logo
  if (G.isNull(profile.logo) && workspaceProfile.logo) {
    return true
  }
  // update the logo
  if (G.isNotNullable(profile.logo)) {
    return true
  }
  // is translations changed
  if (
    G.isNotNullable(profile.translations) &&
    !compareTranslations(profile.translations, workspaceProfile.translations)
  ) {
    return true
  }
  return false
}
