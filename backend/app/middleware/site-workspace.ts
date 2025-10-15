import {
  E_WORKSPACE_NOT_ACTIVE,
  E_WORKSPACE_NOT_ALLOWED,
  E_WORKSPACE_NOT_FOUND,
} from '#exceptions/workspaces'
import Language from '#models/language'
import Workspace from '#models/workspace'
import { HttpContext } from '@adonisjs/core/http'
import { NextFn } from '@adonisjs/core/types/http'
import { A, G, S } from '@mobily/ts-belt'

/**
 * SiteWorkspaceMiddleware
 * Middleware for public site routes that need workspace validation
 * Validates workspace existence, status, and optionally locale
 * Simpler than WorkspaceMiddleware as it doesn't require authentication
 */
export default class SiteWorkspaceMiddleware {
  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: {
      active?: boolean
      validateLocale?: boolean
    } = {}
  ) {
    // Extract workspaceId from route parameters
    const workspaceId = ctx.request.param('workspaceId')

    // Validate workspaceId parameter
    if (!(G.isString(workspaceId) && S.isNotEmpty(workspaceId))) {
      throw new E_WORKSPACE_NOT_ALLOWED()
    }

    // Load workspace from database
    const workspace = await Workspace.query().where('id', workspaceId).preload('languages').first()

    // Check workspace exists
    if (G.isNullable(workspace)) {
      throw new E_WORKSPACE_NOT_FOUND()
    }

    // Check workspace is active (if required)
    if (options.active !== false && workspace.status !== 'active') {
      throw new E_WORKSPACE_NOT_ACTIVE()
    }

    // Validate locale parameter if requested
    if (options.validateLocale) {
      const locale = ctx.request.param('locale')
      if (G.isString(locale) && S.isNotEmpty(locale)) {
        const language = A.find(workspace.languages, (lang) => lang.code === locale)
        if (G.isNullable(language)) {
          const defaultLanguage =
            A.find(workspace.languages, (lang) => lang.isDefault) ?? workspace.languages[0]
          return ctx.response.notFound({
            locale: defaultLanguage?.code ?? 'en',
            name: 'E_UNSUPPORTED_LOCALE',
            message: `Locale '${locale}' is not supported by this workspace`,
          })
        }
        // Attach language to context for controller access
        ctx.siteLanguage = language
      }
    }

    // Attach workspace and language to context for controller access
    ctx.siteWorkspace = workspace

    return next()
  }
}

// Extend HttpContext interface to include siteWorkspace and siteLanguage
declare module '@adonisjs/core/http' {
  interface HttpContext {
    siteWorkspace: Workspace
    siteLanguage: Language
  }
}
