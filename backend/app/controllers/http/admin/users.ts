import { E_FORBIDDEN_ACCESS, E_RESOURCE_NOT_FOUND } from '#exceptions/errors'
import User, { userDefaultRole, UserRole, userRoles } from '#models/user'
import UserProfile, { ExtraField } from '#models/user-profile'
import UserSession from '#models/user-session'
import UserToken from '#models/user-token'
import LanguagesProvider from '#providers/languages_provider'
import MailService from '#services/mail'
import NotificationService from '#services/notification'
import SecurityLogService from '#services/security-log'
import SessionService from '#services/session'
import UserStatsService from '#services/workspace/user-stats'
import { validationFailure } from '#start/vine'
import { compareExtraFieldChanges } from '#utils/fields'
import {
  createUserValidator,
  emailExistsValidator,
  filterUsersValidator,
  sortUsersByValidator,
  updateProfileValidator,
  updateUserValidator,
} from '#validators/admin/users'
import { HttpContext } from '@adonisjs/core/http'
import { A, D, G, O, pipe } from '@mobily/ts-belt'
import { Option } from '@mobily/ts-belt/Option'
import { DateTime } from 'luxon'
import { match } from 'ts-pattern'

/**
 * Controller: Admin/UsersController
 * @description this controller contains methods to manage users (admin only)
 */
export default class UsersController {
  /**
   * index
   * Returns a paginated list of users
   * @get admin/users
   * @middleware auth, admin
   * @query { page?: number, limit?: number, search?: string, filterBy?: { status?: string, role?: string }, sortBy?: { field?: string, direction?: string } }
   * @success 200 { data: User[], meta: PaginationMeta }
   * @error 401 E_UNAUTHORIZED_ACCESS
   * @error 403 E_FORBIDDEN_ACCESS
   */
  public async index({ request, response }: HttpContext) {
    const pagination = await request.pagination()
    const filterBy = await request.filterBy(filterUsersValidator)
    const sortBy = await request.sortBy(sortUsersByValidator)
    const search = await request.search()
    const paginated = await User.query()
      .withScopes((scope) => scope.filterBy(filterBy))
      .withScopes((scope) => scope.search(search))
      .withScopes((scope) => scope.sortBy(sortBy))
      .preload('profile')
      .preload('language')
      .preload('config')
      .preload('sessions', (query) => query.orderBy('lastActivity', 'desc'))
      .paginate(...pagination)

    return response.ok({
      users: A.map(paginated.all(), (user) => user.serializeInAdmin()),
      metadata: paginated.getMeta(),
      total: await UserStatsService.totalUsers(),
    })
  }

  /**
   * store
   * Creates a new user
   * @post admin/users
   * @middleware auth, admin
   * @body { email: string, password?: string, role: string, status: string, languageId?: string }
   * @success 201 { user: User }
   * @error 400 E_VALIDATION_FAILURE
   * @error 401 E_UNAUTHORIZED_ACCESS
   * @error 403 E_FORBIDDEN_ACCESS
   */
  public async store(ctx: HttpContext) {
    const { request, response, auth } = ctx
    const payload = await request.validateUsing(createUserValidator)

    // check if user email is already used
    const alreadyUsedEmail = await User.query().where('email', payload.email).first()
    if (G.isNotNullable(alreadyUsedEmail)) {
      return response.badRequest(validationFailure([{ email: 'unique' }]))
    }

    const role = maxRoleAssignable(auth.user!, payload.role, userDefaultRole)
    const language = LanguagesProvider.getOrDefault(payload.languageId)
    // Create the user
    const user = await User.create({ ...payload, role, languageId: language.id })

    // @log the user creation
    await SecurityLogService.log('user_created', ctx, auth.user, {
      userId: user.id,
      email: user.email,
      role,
      status: user.status,
    })

    await user.refresh()
    await user.load((query) =>
      query
        .preload('profile')
        .preload('language')
        .preload('config')
        .preload('sessions', (query) => query.orderBy('lastActivity', 'desc'))
    )

    return response.created({
      user: user.serializeInAdmin(),
    })
  }

  /**
   * show
   * Returns a specific user
   * @get admin/users/:id
   * @middleware auth, admin
   * @params { id: string }
   * @success 200 { user: User }
   * @error 401 E_UNAUTHORIZED_ACCESS
   * @error 403 E_FORBIDDEN_ACCESS
   * @error 404 E_RESOURCE_NOT_FOUND
   */
  public async show({ params, response }: HttpContext) {
    const user = await User.query()
      .where('id', params.id)
      .preload('profile')
      .preload('language')
      .preload('config')
      .preload('sessions', (query) => query.orderBy('lastActivity', 'desc'))
      .first()

    if (G.isNullable(user)) {
      throw new E_RESOURCE_NOT_FOUND('User not found')
    }

    return response.ok({
      user: user.serializeInAdmin(),
    })
  }

  /**
   * update
   * Updates a specific user
   * @put admin/users/:id
   * @middleware auth, admin
   * @params { id: string }
   * @body { email?: string, password?: string, role?: string, status?: string, languageId?: string }
   * @success 200 { user: User }
   * @error 400 E_VALIDATION_FAILURE
   * @error 401 E_UNAUTHORIZED_ACCESS
   * @error 403 E_FORBIDDEN_ACCESS
   * @error 404 E_RESOURCE_NOT_FOUND
   */
  public async update(ctx: HttpContext) {
    const { params, request, response, auth } = ctx

    // Find the user
    const user = await User.query()
      .where('id', params.id)
      .preload('profile')
      .preload('language')
      .preload('config')
      .preload('sessions', (query) => query.orderBy('lastActivity', 'desc'))
      .first()
    if (G.isNullable(user)) {
      throw new E_RESOURCE_NOT_FOUND('User not found')
    }

    const { noEmit = false, ...payload } = await request.validateUsing(updateUserValidator)
    const changes: Record<string, unknown> = {
      byAdmin: true,
    }

    // Prevent changing superadmin role if current user is not superadmin
    if (G.isNotNullable(payload.role) && user.role !== payload.role) {
      user.role = maxRoleAssignable(auth.user!, payload.role, user.role)
      changes.role = 'updated'
    }

    // update the password if a different one is provided
    if (G.isNotNullable(payload.password)) {
      const hasNotChanged = await user.passwordCompare(payload.password)
      if (!hasNotChanged) {
        user.password = payload.password
        changes.password = 'updated'
      }
    }

    // prevent changing the status to inactive of a user with a higher role
    if (G.isNotNullable(payload.status) && user.status !== payload.status) {
      if (user.status === 'active' && !isRoleHigherThan(auth.user!.role, user.role)) {
        // user is active and auth user has a higher role (do nothing)
      } else {
        user.status = payload.status
        changes.status = payload.status
      }
    }

    // Prevent changing superadmin role if current user is not superadmin
    if (G.isNotNullable(payload.languageId) && user.languageId !== payload.languageId) {
      user.languageId = payload.languageId
      changes.languageId = payload.languageId
    }

    if (user.$isDirty) {
      // Update the user
      await user.save()

      // @log the user update
      await SecurityLogService.log('account_updated', ctx, auth.user, {
        userId: user.id,
        changes,
      })

      // @notify the user
      // notify the user if the status is changed to active
      if (!noEmit && user.status === 'active') {
        const updatedBy = auth.user!
        // @notify the user
        await NotificationService.notify({
          type: 'account-updated',
          relatedType: 'user',
          relatedId: user.id,
          target: { user: user.id },
          metadata: {
            changes,
            updatedById: updatedBy.id,
            updatedByProfile: D.selectKeys(updatedBy.profile.serialize(), [
              'firstname',
              'lastname',
            ]),
            byAdmin: true,
          },
        })
      }
    }

    return response.ok({
      user: user.serializeInAdmin(),
    })
  }

  /**
   * destroy
   * Deletes a specific user
   * @delete admin/users/:id
   * @middleware auth, admin
   * @params { id: string }
   * @success 204
   * @error 401 E_UNAUTHORIZED_ACCESS
   * @error 403 E_FORBIDDEN_ACCESS
   * @error 404 E_RESOURCE_NOT_FOUND
   */
  public async destroy(ctx: HttpContext) {
    const { params, response, auth } = ctx
    const deletedBy = auth.user!

    // Find the user
    const user = await User.query()
      .where('id', params.id)
      .preload('profile')
      .preload('language')
      .preload('config')
      .preload('sessions', (query) => query.orderBy('lastActivity', 'desc'))
      .first()
    if (G.isNullable(user)) {
      throw new E_RESOURCE_NOT_FOUND('User not found')
    }

    // Prevent deleting superadmin if current user is not superadmin
    if (!isRoleHigherThan(auth.user!.role, user.role)) {
      throw new E_FORBIDDEN_ACCESS('You cannot delete a user with a higher role')
    }

    // Prevent self-deletion
    if (user.id === auth.user!.id) {
      throw new E_FORBIDDEN_ACCESS('You cannot delete your own account')
    }

    // @notify the user
    await NotificationService.notify({
      type: 'account-deleted',
      relatedType: 'user',
      relatedId: user.id,
      target: { user: user.id },
      metadata: {
        deletedById: deletedBy.id,
        deletedByProfile: D.selectKeys(deletedBy.profile.serialize(), ['firstname', 'lastname']),
        byAdmin: true,
      },
    })

    // @log the user deletion
    await SecurityLogService.log('account_deleted', ctx, deletedBy, {
      userId: user.id,
      email: user.email,
    })

    // Soft or permanently delete the user
    if (user.status === 'deleted') {
      await user.delete()
    } else {
      await user.merge({ status: 'deleted', deletedAt: DateTime.now() }).save()
    }

    return response.ok({
      user: user.serializeInAdmin(),
    })
  }

  /**
   * sendInvitation
   * Sends an invitation to a user
   * @post admin/users/:id/send-invitation/:invitationType
   * @middleware auth, admin
   * @params { id: string, invitationType: string }
   * @success 204
   * @error 401 E_UNAUTHORIZED_ACCESS
   * @error 403 E_FORBIDDEN_ACCESS
   * @error 404 E_RESOURCE_NOT_FOUND
   */
  public async sendInvitation(ctx: HttpContext) {
    const { params, response } = ctx

    // Find the user
    const user = await User.query().where('id', params.id).first()
    if (G.isNullable(user)) {
      throw new E_RESOURCE_NOT_FOUND('User not found')
    }

    const invitationType = match(params.invitationType)
      .with('password-reset', () => 'password-reset' as const)
      .with('email-change', () => 'email-change' as const)
      .with('welcome', () => 'welcome' as const)
      .otherwise(() => 'authentication' as const)

    // Send email with new password if user has an email
    if (user.email) {
      const userToken = await UserToken.create({
        tokenableId: user.id,
        protectedValue: user.email,
        type: `invitation-${invitationType}`,
        expiresAt: DateTime.now().plus({ weeks: 1 }),
      })
      await MailService.sendAccountInvitation(
        user.email,
        LanguagesProvider.getOrDefault(user.languageId).code,
        invitationType,
        {
          token: userToken.value,
        },
        { userId: user.id }
      )
    }

    return response.noContent()
  }

  /**
   * signInAs
   * Logout current user and sign in as a user
   * @post admin/users/sign-in-as/:id
   * @middleware auth, superadmin
   * @success 200 { session: Session, user: User }
   * @error 400 E_VALIDATION_FAILURE
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (authAdmin)
   */
  public async signInAs(ctx: HttpContext) {
    const { auth, request, response } = ctx
    const takeOverBy = auth.user!

    // Prevent non-superadmin from signing in as another user (must be done in middleware but we need to be sure)
    if (!auth.user!.isSuperAdmin) {
      throw new E_FORBIDDEN_ACCESS('You are not allowed to sign in as a user')
    }

    // Find the user
    const user = await User.query().where('id', request.param('id')).first()
    if (G.isNullable(user)) {
      throw new E_RESOURCE_NOT_FOUND('User not found')
    }

    // Log successful login
    await SecurityLogService.log('account_sign_in_as', ctx, takeOverBy, {
      userId: takeOverBy.id,
      email: takeOverBy.email,
      metadata: {
        asUserId: user.id,
        asUserEmail: user.email,
      },
    })

    // @notify the user
    await NotificationService.notify({
      type: 'account-takeover',
      relatedType: 'user',
      relatedId: user.id,
      target: { user: user.id },
      metadata: {
        signedInById: takeOverBy.id,
        signedInByProfile: D.selectKeys(takeOverBy.profile.serialize(), ['firstname', 'lastname']),
        byAdmin: true,
      },
    })

    // Logout current user
    await auth.use('web').logout()

    // Sign in as the user
    await auth.use('web').login(user)
    const session = await SessionService.createSession(ctx, user)

    await user.load((query) => query.preload('profile').preload('sessions').preload('language'))
    return response.ok({
      session: session.serialize(),
      user: user.serializeMe(),
    })
  }

  /**
   * emailExists
   * Checks if an email exists
   * @post admin/users/email-exists
   * @middleware auth, admin
   * @body { email: string }
   * @success 200 { exists: boolean }
   * @error 401 E_UNAUTHORIZED_ACCESS
   * @error 403 E_FORBIDDEN_ACCESS
   */
  public async emailExists(ctx: HttpContext) {
    const { request, response } = ctx
    const { email } = await request.validateUsing(emailExistsValidator)
    const user = await User.query().where('email', email).first()
    return response.ok({ exists: G.isNotNullable(user) })
  }

  /**
   * updateProfile
   * Updates the authenticated user's profile information
   * @put admin/users/:id/profile
   * @middleware auth, admin
   * @params { id: string }
   * @body { firstname?: string, lastname?: string, dob?: string, image?: File, position?: string, company?: string, emails?: ExtraField[], phones?: ExtraField[], address?: Address, extras?: ExtraField[] }
   * @success 200 { user: User }
   * @error 400 E_VALIDATION_FAILURE
   * @error 401 E_UNAUTHORIZED_ACCESS
   */
  public async updateProfile(ctx: HttpContext) {
    const { request, response, auth, params } = ctx
    const updatedBy = auth.user!
    const user = await User.query()
      .where('id', params.id)
      .preload('profile')
      .preload('language')
      .preload('sessions', (query) => query.orderBy('lastActivity', 'desc'))
      .first()
    if (G.isNullable(user)) {
      throw new E_RESOURCE_NOT_FOUND('User not found')
    }
    const { image, address, dob, ...payload } = await request.validateUsing(updateProfileValidator) // E_VALIDATION_FAILURE

    // Create an object to store the fields to update
    const fieldsToUpdate: Partial<UserProfile> = payload
    const changes: Record<string, unknown> = pipe(
      payload,
      D.keys,
      A.filterMap((key) => {
        // compare each value has changed
        const newValue = payload[key]
        const originalValue = user.profile[key]
        if (G.isArray(newValue)) {
          if (!compareExtraFieldChanges(newValue, originalValue as ExtraField[]))
            return O.Some([`${key}Updated`, true] as const)
          return O.None
        }
        if (G.isNotNullable(newValue) && G.isString(newValue) && newValue !== originalValue) {
          return O.Some([`${key}Updated`, true] as const)
        }
        return O.None
      }),
      D.fromPairs
    )

    if (G.isNull(image) || G.isNotNullable(image)) {
      fieldsToUpdate.image = await user.profile.deleteImage()
      changes.imageDeleted = true
    }

    if (G.isNotNullable(image)) {
      fieldsToUpdate.image = await user.profile.createImage(image)
      changes.imageCreated = true
    }

    if (G.isNotNullable(address)) {
      fieldsToUpdate.address = { ...user.profile.address, ...D.filter(address, G.isNotNullable) }
      changes.addressUpdated = true
    }

    if (G.isDate(dob)) {
      fieldsToUpdate.dob = DateTime.fromJSDate(dob)
      changes.dobUpdated = true
    } else if (G.isNull(dob)) {
      fieldsToUpdate.dob = null
      changes.dobDeleted = true
    }

    // @log the profile update
    await SecurityLogService.log('profile_updated', ctx, updatedBy, {
      userId: user.id,
      changes,
    })

    if (D.isNotEmpty(fieldsToUpdate)) {
      await user.profile.merge(fieldsToUpdate).save()

      // @notify the user
      await NotificationService.notify({
        type: 'account-profile-updated',
        relatedType: 'user',
        relatedId: user.id,
        target: { user: user.id },
        metadata: {
          changes,
          updatedById: updatedBy.id,
          updatedByProfile: D.selectKeys(updatedBy.profile.serialize(), ['firstname', 'lastname']),
          byAdmin: true,
        },
      })
    }

    return response.ok({ user: user.serializeInAdmin() })
  }

  /**
   * deactivateSession
   * Deactivates a specific session
   * @delete admin/users/:id/sessions/:sessionId
   * @middleware auth, admin
   * @params { id: string, sessionId: string }
   * @success 204
   * @error 401 E_UNAUTHORIZED_ACCESS
   * @error 403 E_FORBIDDEN_ACCESS
   * @error 404 E_RESOURCE_NOT_FOUND
   */
  public async deactivateSession(ctx: HttpContext) {
    const { params, response, auth, session } = ctx
    const { id, sessionId } = params
    const user = auth.user!

    // Check if session belongs to user
    const userSession = await UserSession.query().where('userId', id).where('id', sessionId).first()

    if (G.isNullable(userSession)) {
      throw new E_RESOURCE_NOT_FOUND()
    }

    await SessionService.deactivateSession(sessionId)

    // Log session termination
    await SecurityLogService.log('session_terminated', ctx, user, {
      sessionId: userSession.id,
      isCurrent: session.sessionId === userSession.token,
    })

    // If the user is deactivating their current session, log them out
    if (session.sessionId === userSession.token) {
      await auth.use('web').logout()
    }

    return response.noContent()
  }

  /**
   * stats
   * Returns the stats for the users
   * @get admin/users/stats
   * @middleware auth, admin
   * @success 200 { stats: ... }
   * @error 401 E_UNAUTHORIZED_ACCESS
   * @error 403 E_FORBIDDEN_ACCESS
   */
  public async stats(ctx: HttpContext) {
    const { response } = ctx
    const stats = await UserStatsService.allStats()
    return response.ok({
      stats,
    })
  }
}

/**
 * maxRoleAssignable
 * Returns the maximum role that can be assigned by a user to another user
 */
const maxRoleAssignable = (authUser: User, role: Option<UserRole>, current: UserRole) => {
  if (authUser.role === 'superadmin') return role ?? current
  if (authUser.role === 'admin') {
    if (current === 'superadmin') return current
    return role ?? current
  }
  return current
}

/**
 * isRoleHigherThan
 * Returns true if the role is higher or equal than the current role
 */
const isRoleHigherThan = (current: UserRole, role: UserRole) => {
  return userRoles.indexOf(current) >= userRoles.indexOf(role)
}
