import { E_RESOURCE_NOT_FOUND } from '#exceptions/resources'
import { copyContentItems, preloadContent } from '#models/content'
import Template from '#models/template'
import { withProfile } from '#models/user'
import {
  createTemplateValidator,
  filterTemplatesByValidator,
  sortTemplatesByValidator,
  updateTemplateValidator,
} from '#validators/templates'
import type { HttpContext } from '@adonisjs/core/http'
import { A, D, G } from '@mobily/ts-belt'
import { DateTime } from 'luxon'

/**
 * TempaltesController
 */
export default class TemplatesController {
  /**
   * all
   * @get workspaces/:workspaceId/templates
   * @middleware authActive workspace({as 'member'})
   * @success 200 { templates: Template[] }
   * @error 401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   */
  async all({ request, workspace, response }: HttpContext) {
    const filterBy = await request.filterBy(filterTemplatesByValidator)
    const sortBy = await request.sortBy(sortTemplatesByValidator)
    const limit = await request.limit()

    const templates = await workspace
      .related('templates')
      .query()
      .withScopes((scope) => scope.filterBy(filterBy))
      .withScopes((scope) => scope.sortBy(sortBy))
      .withScopes((scope) => scope.limit(limit))
      .preload('content', preloadContent)
      .preload('translations')
      .preload('createdBy', withProfile)
      .preload('updatedBy', withProfile)
    return response.ok({ templates: A.map(templates, (template) => template.serialize()) })
  }

  /**
   * create
   * @post workspaces/:workspaceId/templates
   * @middleware authActive workspace({as 'member'})
   * @success 201 { template: Template }
   * @error 400 E_VALIDATION_ERROR
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   */
  async create({ workspace, auth, request, response }: HttpContext) {
    const user = auth.user!
    const { translations, ...payload } = await request.validateUsing(createTemplateValidator)

    const now = DateTime.now()
    const template = await Template.create({
      workspaceId: workspace.id,
      ...payload,
      createdAt: now,
      createdById: user.id,
      updatedAt: now,
      updatedById: user.id,
    })
    await template.refresh()
    await template.updateTranslation(translations)
    await template.load((query) =>
      query
        .preload('content', preloadContent)
        .preload('translations')
        .preload('createdBy', withProfile)
        .preload('updatedBy', withProfile)
    )
    return response.ok({ template: template.serialize() })
  }

  /**
   * read
   * @get workspaces/:workspaceId/templates/:templateId
   * @middleware authActive workspace({as 'member'})
   * @success 200 { template: Template }
   * @error 401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async read({ workspace, request, response }: HttpContext) {
    const template = await Template.query()
      .where('id', request.param('templateId'))
      .andWhere('workspaceId', workspace.id)
      .preload('content', preloadContent)
      .preload('translations')
      .preload('createdBy', withProfile)
      .preload('updatedBy', withProfile)
      .first()
    if (G.isNullable(template)) throw E_RESOURCE_NOT_FOUND
    return response.ok({ template: template.serialize() })
  }

  /**
   * update
   * @put workspaces/:workspaceId/templates/:templateId
   * @middleware authActive workspace({as 'member'})
   * @success 200 { template: Template }
   * @error 400 E_VALIDATION_ERROR
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace) | E_RESOURCE_LOCKED
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async update({ workspace, auth, request, response }: HttpContext) {
    const user = auth.user!

    const template = await workspace
      .related('templates')
      .query()
      .where('id', request.param('templateId'))
      .preload('content', preloadContent)
      .preload('translations')
      .preload('createdBy', withProfile)
      .preload('updatedBy', withProfile)
      .first()
    if (G.isNullable(template)) throw E_RESOURCE_NOT_FOUND

    const { translations, ...payload } = await request.validateUsing(updateTemplateValidator)

    template.merge({ ...payload })
    if (template.isDirty() || G.isNotNullable(translations)) {
      await template.updateTranslation(translations)
      template.updatedById = user.id
      template.updatedAt = DateTime.now()
      await template.save()
      await template.load((query) =>
        query.preload('updatedBy', withProfile).preload('translations')
      )
    }

    return response.ok({ template: template.serialize() })
  }

  /**
   * duplicate
   * @post workspaces/:workspaceId/templates/:templateId/duplicate
   * @middleware authActive workspace({as 'member'})
   * @success 201 { template: Template }
   * @error 401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async duplicate({ workspace, auth, request, response }: HttpContext) {
    const user = auth.user!

    // Load the original template with all relations
    const original = await workspace
      .related('templates')
      .query()
      .where('id', request.param('templateId'))
      .preload('content', preloadContent)
      .preload('translations')
      .first()
    if (G.isNullable(original)) throw E_RESOURCE_NOT_FOUND

    // Create new template
    const now = DateTime.now()

    const template = await Template.create({
      workspaceId: workspace.id,
      type: original.type,
      createdAt: now,
      createdById: user.id,
      updatedAt: now,
      updatedById: user.id,
    })
    await template.refresh()

    // Duplicate translations
    const translations = A.reduce(original.translations, {}, (acc, translation) =>
      D.set(acc, translation.languageId, {
        title: translation.title ? `${translation.title} (copy)` : '',
        description: translation.description ? `${translation.description} (copy)` : '',
        tags: translation.tags,
      })
    )
    await template.updateTranslation(translations)

    // Duplicate content items
    await template.load('content')
    await copyContentItems(original.content, template.content, 0, user.id)

    // Load and return the new template
    await template.load((query) =>
      query
        .preload('content', preloadContent)
        .preload('translations')
        .preload('createdBy', withProfile)
        .preload('updatedBy', withProfile)
    )
    return response.ok({ template: template.serialize() })
  }

  /**
   * delete
   * @delete workspaces/:workspaceId/templates/:templateId
   * @middleware authActive workspace({as 'member'})
   * @success 204
   * @error 400 E_VALIDATION_ERROR
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace & template.lock)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async delete({ workspace, request, response }: HttpContext) {
    const template = await workspace
      .related('templates')
      .query()
      .where('id', request.param('templateId'))
      .first()
    if (G.isNullable(template)) throw E_RESOURCE_NOT_FOUND

    await template.delete()

    return response.noContent()
  }
}
