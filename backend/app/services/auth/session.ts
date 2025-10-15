import User from '#models/user'
import UserSession from '#models/user-session'
import { parseUserAgent } from '#utils/device-parser'
import { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

/**
 * Service: SessionService
 * @description this service contains the methods to manage the user sessions
 */
export default class SessionService {
  /**
   * Create a new user session
   */
  public static async createSession(ctx: HttpContext, user: User) {
    const { request, session } = ctx
    const userAgentString = request.header('user-agent') ?? ''
    const deviceInfo = parseUserAgent(userAgentString)

    // Create a new session record
    const userSession = await UserSession.create({
      userId: user.id,
      ipAddress: request.ip(),
      deviceInfo,
      token: session.sessionId,
      lastActivity: DateTime.now(),
      isActive: true,
    })

    userSession.refresh()

    return userSession
  }

  /**
   * Update the last activity of a session
   */
  public static async updateSessionActivity(ctx: HttpContext) {
    const { session, auth } = ctx

    if (auth.isAuthenticated && session.sessionId) {
      await UserSession.query()
        .where('token', session.sessionId)
        .update({ lastActivity: DateTime.now() })
    }
  }

  /**
   * Deactivate a specific session
   */
  public static async deactivateSession(sessionId: string) {
    const session = await UserSession.findOrFail(sessionId)
    session.isActive = false
    await session.save()

    return session
  }

  /**
   * Get a specific session for a user
   */
  public static async getUserSession(userId: string, sessionId: string) {
    const session = await UserSession.query()
      .where('userId', userId)
      .where('token', sessionId)
      .first()

    return session
  }

  /**
   * Get a specific session for a user
   */
  public static async getOrCreateUserSession(ctx: HttpContext) {
    const { auth } = ctx
    const user = auth.user!
    const session = await UserSession.query()
      .where('userId', user!.id)
      .where('token', ctx.session.sessionId)
      .first()

    if (session) {
      return session
    }

    return await this.createSession(ctx, auth.user!)
  }

  /**
   * Get all sessions for a user
   */
  public static async getUserSessions(userId: string) {
    const sessions = await UserSession.query()
      .where('userId', userId)
      .orderBy('lastActivity', 'desc')

    // Parse the userAgent JSON string back to an object for each session
    return sessions.map((session) => {
      session.$extras.deviceInfo = session.deviceInfo
      return session
    })
  }

  /**
   * Get a friendly name for a session
   */
  public static getSessionName(session: UserSession): string {
    return session.deviceName
  }
}
