import {
  E_ACCOUNT_DELETED,
  E_ACCOUNT_NOT_ACTIVE,
  E_ACCOUNT_SUSPENDED,
  E_EMAIL_ALREADY_EXISTS,
  E_INVALID_TOKEN,
  E_RESOURCE_NOT_FOUND,
  E_TOKEN_EXPIRED,
} from '#exceptions/errors'
import RegistrationAttempt from '#models/registration-attempt'
import User from '#models/user'
import { ExtraField } from '#models/user-profile'
import UserSession from '#models/user-session'
import UserToken from '#models/user-token'
import LanguagesProvider from '#providers/languages_provider'
import MailService from '#services/mail'
import SecurityLogService from '#services/security-log'
import SessionService from '#services/session'
import { validationFailure } from '#start/vine'
import { delay } from '#utils/delay'
import { compareExtraFieldChanges } from '#utils/fields'
import {
  forgotPasswordValidator,
  loginValidator,
  registerValidator,
  tokenValidator,
  updateProfileValidator,
  updateValidator,
} from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'
import { A, D, G, O, pipe, S } from '@mobily/ts-belt'
import { DateTime } from 'luxon'
import { match } from 'ts-pattern'

/**
 * Controller: AuthController
 * @description this controller contains the methods to manage the user authentication
 */
export default class AuthController {
  /**
   * login
   * Authenticates the user with their email and password
   * @post auth/login
   * @middleware guest
   * @body { email: string, password: string, remember?: boolean }
   * @success 200 { user: User }
   * @error 400 E_VALIDATION_FAILURE | E_INVALID_CREDENTIALS | E_ACCOUNT_NOT_ACTIVE | E_ACCOUNT_DELETED | E_ACCOUNT_SUSPENDED
   */
  public async login(ctx: HttpContext) {
    const { request, response, auth } = ctx

    const { email, password, remember } = await request.validateUsing(loginValidator) // E_VALIDATION_FAILURE

    // Log login attempt (before verification to capture failed attempts)
    await SecurityLogService.log('login_failed', ctx, null, { email })

    const user = await User.verifyCredentials(email, password) // E_INVALID_CREDENTIALS

    if (user.isSuspended()) throw new E_ACCOUNT_SUSPENDED()
    if (user.isDeleted()) throw new E_ACCOUNT_DELETED()
    if (user.isNotActive()) throw new E_ACCOUNT_NOT_ACTIVE()

    await auth.use('web').login(user, !!remember)
    const session = await SessionService.createSession(ctx, user)

    // Log successful login
    await SecurityLogService.log('login_success', ctx, user, {
      sessionId: session.id,
      remember: !!remember,
    })

    await user.preloadMe()
    response.ok({
      session: session.serialize(),
      user: user.serializeMe(),
    })
  }

  /**
   * register
   * Registers a new user account
   * @post auth/register
   * @middleware guest
   * @body { email: string, password: string }
   * @success 201
   * @error 400 E_VALIDATION_FAILURE
   */
  public async register(ctx: HttpContext) {
    const { request, response } = ctx
    const { email, password } = await request.validateUsing(registerValidator) // E_VALIDATION_FAILURE

    // Record the registration attempt
    const registrationAttempt = new RegistrationAttempt()
    registrationAttempt.email = email
    registrationAttempt.ipAddress = request.ip()
    registrationAttempt.userAgent = request.header('user-agent') || ''

    // Check if email already exists
    const existingUser = await User.query().where('email', email).preload('language').first()

    if (existingUser) {
      // Email exists, but we don't tell the user for security reasons
      registrationAttempt.success = false
      await registrationAttempt.save()

      // Log failed registration attempt
      await SecurityLogService.log('register', ctx, null, {
        email,
        status: 'failed',
        reason: 'email_exists',
      })

      // For security, we return the same response as if the registration was successful
      // but with a slight delay to prevent timing attacks
      await delay(500 + Math.random() * 500)

      // Check if we need to send a notification to the real owner of this email
      // We look for previous failed attempts with this email in the last 24 hours
      const previousAttempts = await RegistrationAttempt.query()
        .where('email', email)
        .where('success', false)
        .where('notification_sent', false)
        .where('created_at', '>=', DateTime.now().minus({ hours: 24 }).toSQL())
        .count('* as total')

      const totalPreviousAttempts = Number((previousAttempts[0] as any).total)

      // If this is the first attempt in 24 hours, send a notification
      if (totalPreviousAttempts === 0) {
        const userToken = await UserToken.create({
          tokenableId: existingUser.id,
          type: 'authentication',
          expiresAt: DateTime.now().plus({ weeks: 1 }),
        })
        // Send mail: Someone tried to register with your email
        await MailService.sendTriedToRegister(
          email,
          existingUser.language.code,
          { token: userToken.value },
          { userId: existingUser.id }
        )

        // Mark all previous attempts as notified
        await RegistrationAttempt.query()
          .where('email', email)
          .where('notification_sent', false)
          .update({ notification_sent: true })
      }
      await SecurityLogService.log('register', ctx, null, {
        email,
        status: 'success',
      })

      return response.created()
    }

    // Create user with default status and role
    const user = await User.create({
      password,
    })
    await user.refresh()
    await user.load('language')

    // Update the registration attempt with success
    registrationAttempt.success = true
    registrationAttempt.userId = user.id
    await registrationAttempt.save()

    const userToken = await UserToken.create({
      tokenableId: user.id,
      protectedValue: S.toLowerCase(email),
      type: 'register',
      expiresAt: DateTime.now().plus({ weeks: 1 }),
    })

    // Log successful registration
    await SecurityLogService.log('register', ctx, user, {
      status: 'success',
      requiresEmailVerification: true,
    })

    // Send mail: New user registration email address must be verified
    await MailService.sendRegistration(
      email,
      user.language.code,
      { token: userToken.value },
      { userId: user.id }
    )

    return response.created()
  }

  /**
   * logout
   * Logs out the authenticated user (invalidate token and web session)
   * @post auth/logout
   * @middleware auth
   * @success 204
   */
  public async logout(ctx: HttpContext) {
    const { auth, response, session } = ctx
    const user = auth.use('web').user

    // Find and deactivate the current session
    if (session.sessionId) {
      await UserSession.query().where('token', session.sessionId).update({ isActive: false })
    }

    // Log logout
    await SecurityLogService.log('logout', ctx, user)

    await auth.use('web').logout()
    response.noContent()
  }

  /**
   * session
   * Returns auth:false if the user is not active, otherwise returns the authenticated user's session
   * @get auth/session
   * @middleware silentAuth
   * @success 200 { auth: boolean, user: User, session: UserSession }
   */
  public async session(ctx: HttpContext) {
    const { auth, response, session } = ctx
    const user = auth.use('web').user
    const languages = A.map(LanguagesProvider.languages, (language) => language.serialize())

    // Check if user exists and is active
    if (G.isNullable(user) || user.isNotActive()) return response.ok({ auth: false, languages })

    // Additional check: verify the session is still active in database
    if (session.sessionId) {
      const dbSession = await UserSession.query()
        .where('token', session.sessionId)
        .where('isActive', true)
        .first()

      if (G.isNullable(dbSession)) {
        // Session was deactivated, logout and return auth: false
        await auth.use('web').logout()
        return response.ok({ auth: false, languages })
      }
    }

    const userSession = await SessionService.getOrCreateUserSession(ctx)

    response.ok({
      auth: true,
      session: userSession.serialize(),
      user: user.serializeMe(),
      languages,
    })
  }

  /**
   * sessions
   * Returns all active sessions for the authenticated user
   * @get auth/sessions
   * @middleware auth, checkActiveSession
   * @success 200 { sessions: UserSession[] }
   * @error 401 E_UNAUTHORIZED_ACCESS
   */
  public async sessions({ auth, response }: HttpContext) {
    const sessions = await SessionService.getUserSessions(auth.user!.id)

    response.ok({
      sessions,
    })
  }

  /**
   * deactivateSession
   * Deactivates a specific session for the authenticated user
   * @delete auth/sessions/:id
   * @middleware auth, checkActiveSession
   * @params { id: string }
   * @success 204
   * @error 401 E_UNAUTHORIZED_ACCESS
   * @error 404 E_RESOURCE_NOT_FOUND
   */
  public async deactivateSession(ctx: HttpContext) {
    const { params, auth, response, session } = ctx
    const { id } = params
    const user = auth.user!

    // Check if session belongs to user
    const userSession = await UserSession.query().where('id', id).where('userId', user.id).first()

    if (!userSession) {
      throw new E_RESOURCE_NOT_FOUND()
    }

    await SessionService.deactivateSession(id)

    // Log session termination
    await SecurityLogService.log('session_terminated', ctx, user, {
      sessionId: id,
      isCurrent: session.sessionId === userSession.token,
    })

    // If the user is deactivating their current session, log them out
    if (session.sessionId === userSession.token) {
      await auth.use('web').logout()
    }

    response.noContent()
  }

  /**
   * verifyToken
   * Verifies a user's token
   * @post auth/verify-token
   * @body { token: string }
   * @success 200 { message: string }
   * @error 400 E_INVALID_TOKEN | E_TOKEN_EXPIRED | E_VALIDATION_FAILURE
   */
  public async verifyToken(ctx: HttpContext) {
    await delay(1000)
    const { request, response, auth } = ctx
    // Validate the token provided in the request
    const { token: encodedToken } = await request.validateUsing(tokenValidator) // E_VALIDATION_FAILURE

    // Decode the token to extract the identifier and secret
    const decodedToken = UserToken.decode(encodedToken)

    // If the token cannot be decoded (invalid format), throw an exception
    if (G.isNull(decodedToken)) throw new E_INVALID_TOKEN()
    // Find the token in the database and load the associated user
    const userToken = await UserToken.query()
      .preload('user')
      .where('id', decodedToken.identifier)
      .first()

    // Verify that the token exists and that the secret matches the stored hash
    if (G.isNullable(userToken) || !userToken.verify(decodedToken.secret))
      throw new E_INVALID_TOKEN()

    // Check that the token has not expired
    if (userToken.isExpired()) throw new E_TOKEN_EXPIRED()

    // Get the user associated with the token
    const user = userToken.user
    await user.preloadMe()

    // Execute different actions based on the token type
    // using ts-pattern's pattern matching for better readability
    await match(userToken.type)
      .with('register', async () => {
        // Check if email is already taken by another user
        const existingUser = await User.query()
          .where('email', userToken.protectedValue!)
          .whereNot('id', user.id)
          .first()

        if (existingUser) {
          throw new E_EMAIL_ALREADY_EXISTS()
        }

        await user.merge({ status: 'active', email: userToken.protectedValue }).save()

        // Log email verification
        await SecurityLogService.log('email_verified', ctx, user)
      })
      .with('email-change', async () => {
        // Check if email is already taken by another user
        const existingUser = await User.query()
          .where('email', userToken.protectedValue!)
          .whereNot('id', user.id)
          .first()

        if (existingUser) {
          throw new E_EMAIL_ALREADY_EXISTS()
        }

        const oldEmail = user.email
        await user.merge({ email: userToken.protectedValue }).save()

        // Log email change
        await SecurityLogService.log('email_change_completed', ctx, user, {
          oldEmail,
          newEmail: userToken.protectedValue,
        })
      })
      .with('password-reset', async () => {
        // Log password reset completion
        await SecurityLogService.log('password_reset_completed', ctx, user)
      })
      .otherwise(async () => {
        // Extension point for other token types
      })

    // Delete the token after use to prevent reuse
    await userToken.delete()

    // Intelligent management of authentication state
    if (auth.isAuthenticated && auth.user) {
      // If the user is already logged in and it's the same user
      // as the one associated with the token, simply return the updated data
      if (auth.user.id === user.id) {
        const session = await SessionService.getOrCreateUserSession(ctx)
        return response.ok({
          user: user.serializeMe(),
          type: userToken.type,
          session: session.serialize(),
        })
      }
      // If a different user is logged in,
      // log them out before logging in the token user
      await auth.use('web').logout()
    }

    // Log in the user associated with the token
    // (either no user was logged in, or we logged out another user)
    await auth.use('web').login(user)

    // Log session creation
    await SecurityLogService.log('session_created', ctx, user)
    const session = await SessionService.createSession(ctx, user)

    // Return the user information
    return response.ok({
      user: user.serializeMe(),
      type: userToken.type,
      session: session.serialize(),
    })
  }

  /**
   * update
   * Updates the authenticated user's profile information
   * @put auth
   * @middleware auth
   * @body { name?: string, email?: string, currentPassword?: string, newPassword?: string }
   * @success 200 { user: User }
   * @error 400 E_VALIDATION_FAILURE
   * @error 401 E_UNAUTHORIZED_ACCESS
   */
  public async update(ctx: HttpContext) {
    const { request, response, auth } = ctx
    const user = auth.user!
    const { email, password } = await request.validateUsing(updateValidator) // E_VALIDATION_FAILURE

    // Create an object to store the fields to update
    const fieldsToUpdate: Partial<User> = {}
    const changes: Record<string, any> = {}

    // Handle password change if provided
    if (G.isNotNullable(password) && !(await user.passwordCompare(password))) {
      fieldsToUpdate.password = password
      changes.passwordChanged = true
    }

    // Handle email change if provided
    if (G.isNotNullable(email) && !user.emailCompare(email)) {
      // Check if email is already in use by another account
      const existingUser = await User.query().where('email', email).whereNot('id', user.id).first()

      if (existingUser) {
        return response.badRequest(validationFailure([{ field: 'email', rule: 'unique' }]))
      }

      // Create a token for email verification
      const userToken = await UserToken.create({
        tokenableId: user.id,
        protectedValue: S.toLowerCase(email),
        type: 'email-change',
        expiresAt: DateTime.now().plus({ days: 3 }),
      })

      changes.emailChangeRequested = true
      changes.newEmail = email

      // Log email change request
      await SecurityLogService.log('email_change_requested', ctx, user, {
        currentEmail: user.email,
        newEmail: email,
      })

      // Send email: Email change verification
      await MailService.sendEmailChangeVerification(
        email,
        user.language.code,
        {
          token: userToken.value,
        },
        { userId: user.id }
      )

      // Don't update the email directly, it will be updated when the token is verified
    }

    // Apply updates if there are any
    if (D.isNotEmpty(fieldsToUpdate)) {
      await user.merge(fieldsToUpdate).save()

      // Log profile update
      await SecurityLogService.log('profile_updated', ctx, user, changes)
    }

    return response.ok({
      user: user.serializeMe(),
    })
  }

  /**
   * forgotPassword
   * Initiates the password recovery process
   * @post auth/forgot-password
   * @body { email: string }
   * @success 204
   * @error 400 E_VALIDATION_FAILURE
   */
  public async forgotPassword(ctx: HttpContext) {
    const { request, response } = ctx
    const { email } = await request.validateUsing(forgotPasswordValidator) // E_VALIDATION_FAILURE

    // Find the user by email
    const user = await User.query()
      .where('email', email)
      // Check if user account is active
      .andWhere('status', 'active')
      .preload('language')
      .preload('tokens', (query) =>
        query
          .where('type', 'reset-password')
          .andWhere('createdAt', '>=', DateTime.now().minus({ minutes: 60 }).toSQLDate())
      )
      .first()

    // Log password reset request (regardless of whether user exists)
    await SecurityLogService.log('password_reset_requested', ctx, user, { email })

    // If user does not exist, return a success response
    if (G.isNullable(user)) {
      await delay(500 + Math.random() * 500)
      return response.noContent()
    }

    // If user has already requested a password reset in the last hour
    if (A.isNotEmpty(user.tokens)) {
      // throw new E_FORGOT_PASSWORD_LIMIT_EXCEEDED()
      await delay(500 + Math.random() * 500)
      return response.noContent()
    }

    // Create a token for password reset
    const userToken = await UserToken.create({
      tokenableId: user.id,
      type: 'password-reset',
      expiresAt: DateTime.now().plus({ hours: 1 }),
    })

    // Send password reset email
    await MailService.sendPasswordReset(
      email,
      user.language.code,
      { token: userToken.value },
      { userId: user.id }
    )

    // For security reasons, we always return a success response
    // even if the email doesn't exist in our database
    return response.noContent()
  }

  /**
   * delete
   * Deletes the authenticated user's account
   * @delete auth
   * @middleware auth
   * @success 204
   * @error 401 E_UNAUTHORIZED_ACCESS
   */
  public async delete(ctx: HttpContext) {
    const { auth, response } = ctx
    const user = auth.user!
    await user.merge({ status: 'deleted', deletedAt: DateTime.now() }).save()
    await SecurityLogService.log('account_deleted', ctx, user)
    response.noContent()
  }

  /**
   * updateProfile
   * Updates the authenticated user's profile information
   * @put auth/profile
   * @middleware auth
   * @body { name?: string, email?: string, currentPassword?: string, newPassword?: string }
   * @success 200 { user: User }
   * @error 400 E_VALIDATION_FAILURE
   * @error 401 E_UNAUTHORIZED_ACCESS
   */
  public async updateProfile(ctx: HttpContext) {
    const { request, response, auth } = ctx
    const user = auth.user!
    const { image, address, dob, ...payload } = await request.validateUsing(updateProfileValidator) // E_VALIDATION_FAILURE

    const changes: Record<string, any> = pipe(
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
      await user.profile.deleteImage()
      changes.imageDeleted = true
    }
    if (G.isNotNullable(image)) {
      await user.profile.createImage(image)
      changes.imageCreated = true
    }

    if (G.isNotNullable(address)) {
      user.profile.address = { ...user.profile.address, ...D.filter(address, G.isNotNullable) }
      changes.addressUpdated = true
    }

    if (G.isDate(dob)) {
      user.profile.dob = DateTime.fromJSDate(dob)
      changes.dobUpdated = true
    } else if (G.isNull(dob)) {
      user.profile.dob = null
      changes.dobDeleted = true
    }

    if (D.isNotEmpty(payload)) {
      user.profile.merge(payload)
    }

    if (user.profile.isDirty()) {
      await user.profile.save()
    }

    await SecurityLogService.log('profile_updated', ctx, user, changes)

    return response.ok({ user: user.serializeMe() })
  }
}
