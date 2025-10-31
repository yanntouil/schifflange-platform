import { E_RESOURCE_NOT_ALLOWED, E_RESOURCE_NOT_FOUND } from '#exceptions/resources'
import { preloadContent } from '#models/content'
import Page, { preloadVisits } from '#models/page'
import { preloadSeo } from '#models/seo'
import { preloadProfile } from '#models/user'
import { createPageValidator, updatePageValidator } from '#validators/pages'
import type { HttpContext } from '@adonisjs/core/http'
import { A, G } from '@mobily/ts-belt'
import { DateTime } from 'luxon'

/**
 * PagesController
 */
export default class PagesController {
  /**
   * all
   * @get workspaces/:workspaceId/pages
   * @middleware authActive workspace({as 'member'})
   * @success 200 { pages: Page[] }
   * @error 401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   */
  async all({ workspace, response }: HttpContext) {
    const pages = await workspace
      .related('pages')
      .query()
      .preload('seo', preloadSeo)
      .preload('content', preloadContent)
      .preload('tracking', preloadVisits)
      .preload('slug')
      .preload('createdBy', preloadProfile)
      .preload('updatedBy', preloadProfile)
    return response.ok({ pages: A.map(pages, (page) => page.serialize()) })
  }

  /**
   * create
   * @post workspaces/:workspaceId/pages
   * @middleware authActive workspace({as 'member'})
   * @success 201 { page: Page }
   * @error 400 E_VALIDATION_ERROR
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   */
  async create({ workspace, auth, request, response }: HttpContext) {
    const user = auth.user!
    const userRole = user.getRoleInWorkspace(workspace)
    const { lock, ...payload } = await request.validateUsing(createPageValidator)

    const now = DateTime.now()

    const page = await Page.create({
      workspaceId: workspace.id,
      ...payload,
      lock: userRole.isAdmin ? lock : false,
      createdAt: now,
      createdById: user.id,
      updatedAt: now,
      updatedById: user.id,
    })
    await page.refresh()
    await page.load((query) =>
      query
        .preload('seo', preloadSeo)
        .preload('content', preloadContent)
        .preload('tracking', preloadVisits)
        .preload('slug')
        .preload('createdBy', preloadProfile)
        .preload('updatedBy', preloadProfile)
    )
    return response.ok({ page: page.serialize() })
  }

  /**
   * read
   * @get workspaces/:workspaceId/pages/:pageId
   * @middleware authActive workspace({as 'member'})
   * @success 200 { page: Page }
   * @error 401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async read({ workspace, request, response }: HttpContext) {
    const page = await Page.query()
      .where('id', request.param('pageId'))
      .andWhere('workspaceId', workspace.id)
      .preload('seo', preloadSeo)
      .preload('content', preloadContent)
      .preload('tracking', preloadVisits)
      .preload('slug')
      .preload('createdBy', preloadProfile)
      .preload('updatedBy', preloadProfile)
      .first()
    if (G.isNullable(page)) throw E_RESOURCE_NOT_FOUND
    return response.ok({ page: page.serialize() })
  }

  /**
   * update
   * @put workspaces/:workspaceId/pages/:pageId
   * @middleware authActive workspace({as 'member'})
   * @success 200 { page: Page }
   * @error 400 E_VALIDATION_ERROR
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace) | E_RESOURCE_LOCKED
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async update({ workspace, auth, request, response }: HttpContext) {
    const user = auth.user!
    const userRole = user.getRoleInWorkspace(workspace)

    const page = await workspace
      .related('pages')
      .query()
      .where('id', request.param('pageId'))
      .preload('seo', preloadSeo)
      .preload('content', preloadContent)
      .preload('tracking', preloadVisits)
      .preload('slug')
      .preload('createdBy', preloadProfile)
      .preload('updatedBy', preloadProfile)
      .first()
    if (G.isNullable(page)) throw E_RESOURCE_NOT_FOUND

    const { ...payload } = await request.validateUsing(updatePageValidator)

    // overide lock if not admin
    if (!userRole.isAdmin) {
      payload.lock = page.lock
    }

    page.merge({ ...payload })
    if (page.isDirty()) {
      page.updatedById = user.id
      page.updatedAt = DateTime.now()
      await page.save()
      await page.load('updatedBy', preloadProfile)
    }

    return response.ok({ page: page.serialize() })
  }

  /**
   * delete
   * @delete workspaces/:workspaceId/pages/:pageId
   * @middleware authActive workspace({as 'member'})
   * @success 204
   * @error 400 E_VALIDATION_ERROR
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace & page.lock)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async delete({ workspace, auth, request, response }: HttpContext) {
    const user = auth.user!
    const userRole = user.getRoleInWorkspace(workspace)

    const page = await workspace
      .related('pages')
      .query()
      .where('id', request.param('pageId'))
      .first()
    if (G.isNullable(page)) throw E_RESOURCE_NOT_FOUND
    if (page.lock && !userRole.isAdmin) throw E_RESOURCE_NOT_ALLOWED

    await page.delete()

    return response.noContent()
  }
}
