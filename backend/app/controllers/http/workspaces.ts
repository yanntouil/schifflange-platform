import { E_INVALID_TOKEN, E_TOKEN_EXPIRED } from '#exceptions/tokens'
import Language from '#models/language'
import User from '#models/user'
import UserToken from '#models/user-token'
import { withWorkspaceMembers } from '#models/workspace'
import WorkspacesInvitation, { workspaceInvitationStatuses } from '#models/workspaces-invitation'
import MailService from '#services/mail'
import NotificationService from '#services/notification'
import SecurityLogService from '#services/security-log'
import SessionService from '#services/session'
import WorkspaceLogService from '#services/workspace-log'
import { delay } from '#utils/delay'
import { invitationSignUpValidator, invitationTokenValidator } from '#validators/workspaces'
import type { HttpContext } from '@adonisjs/core/http'
import { D, G } from '@mobily/ts-belt'
import { DateTime } from 'luxon'

/**
 * Controller: WorkspacesController
 * public controller use to manage all features related to workspaces
 */
export default class WorkspacesController {
  /**
   * invitationSignUp
   * accept a workspace invitation and sign up the user
   * @post workspaces/invitation/sign-up
   * @body {token: string; password: string}
   * @success 200 { user: User, token: AccessToken }
   * @error 400 E_VALIDATION_FAILURE | E_INVALID_TOKEN | E_TOKEN_EXPIRED | E_WORKSPACE_DELETED | E_USER_ALREADY_EXISTS
   */
  public async invitationSignUp(ctx: HttpContext) {
    await delay(4000)
    const { request, auth, response } = ctx
    const { token: encodedToken, password } = await request.validateUsing(invitationSignUpValidator)
    const invitation = await invitationFromToken(encodedToken)

    // check if the workspace exists and still active
    if (G.isNullable(invitation.workspace) || invitation.workspace.isNotActive())
      return response.badRequest({
        name: 'E_WORKSPACE_DELETED',
        status: 400,
        message: 'Workspace deleted',
      })

    // check if the invitation is for an existant user
    const maybeUser = await User.query().where('email', invitation.email).first()
    if (G.isNotNullable(maybeUser))
      return response.badRequest({
        name: 'E_USER_ALREADY_EXISTS',
        status: 400,
        message: 'User already exists',
      })

    // clear old session before creating new user and login
    await auth.use('web').logout()

    // create an account for the user
    const user = await User.create({ password, email: invitation.email, status: 'active' })
    await user.refresh()
    await user.preloadMe()

    await SecurityLogService.log('register', ctx, null, {
      email: invitation.email,
      status: 'success',
      reason: 'workspace_invitation_sign_up',
    })

    // accept the invitation and append the user to the workspace members
    await invitation.merge({ status: 'accepted' }).save()
    await invitation.workspace
      .related('members')
      .sync({ [user.id]: { role: invitation.role, created_at: DateTime.now().toSQL() } }, false)

    // send a welcome email to the user
    const userToken = await UserToken.create({
      tokenableId: user.id,
      type: 'invitation-sign-in',
      expiresAt: DateTime.now().plus({ weeks: 1 }),
    })

    await MailService.sendWorkspaceInvitationSignUp(
      invitation.email,
      Language.fromRequest().code,
      {
        workspace: invitation.workspace,
        token: userToken.value,
      },
      { userId: user.id }
    )

    // Sign in the user
    await auth.use('web').login(user)
    const session = await SessionService.createSession(ctx, user)
    await SecurityLogService.log('login_success', ctx, user, {
      sessionId: session.id,
      reason: 'workspace_invitation_sign_up',
    })

    return response.ok({
      session: session.serialize(),
      user: user.serializeMe(),
    })
  }

  /**
   * invitationSignIn
   * sign in the user with a workspace invitation
   * @post workspaces/invitation/sign-in
   * @body {token: string}
   * @success 200 { user: User, token: AccessToken }
   * @error 400 E_VALIDATION_FAILURE | E_INVALID_TOKEN | E_TOKEN_EXPIRED | E_USER_NOT_FOUND
   */
  public async invitationSignIn(ctx: HttpContext) {
    await delay(4000)
    const { request, auth, response } = ctx
    const { token: encodedToken } = await request.validateUsing(invitationTokenValidator)
    const invitation = await invitationFromToken(encodedToken)

    // check if the invitation is for an existant user
    const user = await User.query().where('email', invitation.email).first()
    if (G.isNullable(user))
      return response.badRequest({
        name: 'E_USER_NOT_FOUND',
        status: 400,
        message: 'User not found',
      })
    await user.preloadMe()

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

    // @notify the workspace
    await NotificationService.notify({
      type: 'workspace-member-attached',
      relatedType: 'workspace',
      relatedId: invitation.workspaceId,
      target: { workspace: invitation.workspaceId },
      metadata: {
        attachedById: user.id,
        attachedByProfile: D.selectKeys(user.profile.serialize(), ['firstname', 'lastname']),
      },
    })

    // if the user is already logged in, and on the same account, return the user
    if (auth.user?.id === user.id) {
      const session = await SessionService.getOrCreateUserSession(ctx)
      return response.ok({
        session: session.serialize(),
        user: auth.user.serializeMe(),
      })
    }

    // if the user is already logged in, and on a different account, logout the user
    if (auth.user) {
      await auth.use('web').logout()
    }

    // Sign in the user
    await auth.use('web').login(user)
    const session = await SessionService.createSession(ctx, user)

    return response.ok({
      session: session.serialize(),
      user: user.serializeMe(),
    })
  }

  /**
   * invitationRefuse
   * reject a workspace invitation
   * @post workspaces/invitation/refuse
   * @body {token: string}
   * @success 204
   * @error 400 E_VALIDATION_FAILURE | E_INVALID_TOKEN | E_TOKEN_EXPIRED
   */
  public async invitationRefuse(ctx: HttpContext) {
    await delay(4000)
    const { request, auth, response } = ctx
    const { token: encodedToken } = await request.validateUsing(invitationTokenValidator)
    const invitation = await invitationFromToken(encodedToken)

    await invitation.merge({ status: 'refused' }).save()

    // check if the invitation is for an existant user
    const user = await User.query().where('email', invitation.email).first()
    if (G.isNullable(user)) return response.noContent()
    await user.preloadMe()

    // if the user is already logged in, and on the same account, return the user
    if (auth.user?.id === user.id) {
      const session = await SessionService.getOrCreateUserSession(ctx)
      return response.ok({
        session: session.serialize(),
        user: auth.user.serializeMe(),
      })
    }

    // if the user is already logged in, and on a different account, logout the user
    if (auth.user) {
      await auth.use('web').logout()
    }

    // Sign in the user
    await auth.use('web').login(user)
    const session = await SessionService.createSession(ctx, user)

    return response.ok({
      session: session.serialize(),
      user: user.serializeMe(),
    })
  }

  /**
   * invitationRead
   * Read a workspace invitation
   * @post workspaces/invitation
   * @param {string} token
   * @success 200 { workspace?: Workspace, user?: User, token?: string }
   * @error 400 E_INVALID_TOKEN | E_TOKEN_EXPIRED | E_WORKSPACE_DELETED
   */
  public async invitationRead({ request, response }: HttpContext) {
    await delay(4000)
    const { token: encodedToken } = await request.validateUsing(invitationTokenValidator)
    const invitation = await invitationFromToken(encodedToken)
    console.log('invitation', invitation?.serialize())
    // check if the workspace exists and still active
    if (G.isNullable(invitation.workspace) || invitation.workspace.isNotActive())
      return response.badRequest({
        name: 'E_WORKSPACE_DELETED',
        status: 400,
        message: 'Workspace deleted',
      })

    const maybeUser = await User.query().where('email', invitation.email).first()

    response.ok({
      invitation: {
        workspace: invitation.workspace.name,
        createdBy: `${invitation.createdBy.profile.firstname} ${invitation.createdBy.profile.lastname}`,
        userExist: G.isNotNullable(maybeUser),
        email: invitation.email,
        role: invitation.role,
        status: invitation.status,
        createdAt: invitation.createdAt,
        expiresAt: invitation.expiresAt,
      },
    })
  }
}

/**
 * invitationFromToken
 * Get an invitation from a token
 * @error E_INVALID_TOKEN | E_TOKEN_EXPIRED
 */
const invitationFromToken = async (token: string) => {
  const decodedToken = WorkspacesInvitation.decode(token)
  // unable to decode token
  if (G.isNull(decodedToken)) throw new E_INVALID_TOKEN()

  // check if the invitation exists and is pending
  const invitation = await WorkspacesInvitation.query()
    .where('id', decodedToken.identifier)
    .andWhere('status', workspaceInvitationStatuses[0])
    .preload('createdBy', (query) => query.preload('profile'))
    .preload('workspace', (query) => query.preload(...withWorkspaceMembers))
    .first()

  // unable to verify token
  if (G.isNullable(invitation) || !invitation.verify(decodedToken.secret))
    throw new E_INVALID_TOKEN()

  // token expired
  if (invitation.isExpired()) throw new E_TOKEN_EXPIRED()
  return invitation
}
