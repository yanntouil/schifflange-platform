import { E_RESOURCE_NOT_FOUND } from '#exceptions/resources'
import Library, { preloadLibrary, withChildLibraries, withParentLibrary } from '#models/library'
import { withLibraryDocuments } from '#models/library-document'
import { withLibraryTranslations } from '#models/library-translation'
import { preloadProfile, withCreatedBy, withUpdatedBy } from '#models/user'
import { validationFailure } from '#start/vine'
import {
  createLibraryValidator,
  filterLibrariesByValidator,
  sortLibrariesByValidator,
  updateLibraryValidator,
} from '#validators/libraries'
import type { HttpContext } from '@adonisjs/core/http'
import { A, G } from '@mobily/ts-belt'
import type { Infer } from '@vinejs/vine/types'
import { DateTime } from 'luxon'

/**
 * LibrariesController
 */
export default class LibrariesController {
  /**
   * all
   * @get workspaces/:workspaceId/libraries
   * @middleware authActive workspace({as 'member'})
   * @success 200 { libraries: Library[] }
   * @error 401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   */
  async all({ request, workspace, response }: HttpContext) {
    const filterBy = await request.filterBy(filterLibrariesByValidator)
    const sortBy = await request.sortBy(sortLibrariesByValidator)
    const limit = await request.limit()

    const libraries = await workspace
      .related('libraries')
      .query()
      .withScopes((scope) => scope.filterBy(filterBy))
      .withScopes((scope) => scope.sortBy(sortBy))
      .withScopes((scope) => scope.limit(limit))
      .withCount('documents', (query) => query.as('documentCount'))
      .withCount('childLibraries', (query) => query.as('childLibraryCount'))
      .preload('translations')
      .preload('createdBy', preloadProfile)
      .preload('updatedBy', preloadProfile)
    return response.ok({
      libraries: A.map(libraries, (library) => library.serializeWithDocuments()),
    })
  }

  /**
   * rootIndex
   * @get workspaces/:workspaceId/libraries/root
   * @middleware authActive workspace({as 'member'})
   * @success 200 { libraries: Library[] }
   * @error 401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   */
  async rootIndex({ request, workspace, response }: HttpContext) {
    const filterBy = await request.filterBy(filterLibrariesByValidator)
    const sortBy = await request.sortBy(sortLibrariesByValidator)
    const limit = await request.limit()

    const libraries = await workspace
      .related('libraries')
      .query()
      .whereNull('parentLibraryId')
      .withScopes((scope) => scope.filterBy(filterBy))
      .withScopes((scope) => scope.sortBy(sortBy))
      .withScopes((scope) => scope.limit(limit))
      .withCount('documents', (query) => query.as('documentCount'))
      .withCount('childLibraries', (query) => query.as('childLibraryCount'))
      .preload('translations')
      .preload('createdBy', preloadProfile)
      .preload('updatedBy', preloadProfile)
    return response.ok({
      libraries: A.map(libraries, (library) => library.serializeWithDocuments()),
    })
  }

  /**
   * create
   * @post workspaces/:workspaceId/libraries
   * @post workspaces/:workspaceId/libraries/:libraryId/libraries
   * @middleware authActive workspace({as 'member'})
   * @success 201 { library: Library }
   * @error 400 E_VALIDATION_ERROR
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async create({ workspace, auth, request, response }: HttpContext) {
    const user = auth.user!
    const {
      parentLibraryId: parentIdFromPayload,
      translations,
      ...payload
    } = await request.validateUsing(createLibraryValidator)
    const now = DateTime.now()

    const parentLibraryId: string | null = G.isUndefined(parentIdFromPayload)
      ? (request.param('libraryId') ?? null)
      : parentIdFromPayload

    if (G.isNotNullable(parentLibraryId)) {
      const parent = await workspace
        .related('libraries')
        .query()
        .where('id', parentLibraryId)
        .first()
      if (G.isNullable(parent)) throw E_RESOURCE_NOT_FOUND
    }

    const library = await workspace.related('libraries').create({
      ...payload,
      parentLibraryId,
      createdAt: now,
      createdById: user.id,
      updatedAt: now,
      updatedById: user.id,
    })

    await library.refresh()
    await updateLibraryTranslations(library, translations)

    await library.load(preloadLibrary)
    return response.ok({ library: library.serializeWithDocuments() })
  }

  /**
   * read
   * @get workspaces/:workspaceId/libraries/:libraryId
   * @middleware authActive workspace({as 'member'})
   * @success 200 { library: Library }
   * @error 401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async read({ workspace, request, response }: HttpContext) {
    const library = await workspace
      .related('libraries')
      .query()
      .where('id', request.param('libraryId'))
      .preload(...withLibraryTranslations())
      .preload(...withParentLibrary())
      .preload(...withChildLibraries())
      .preload(...withLibraryDocuments())
      .preload(...withCreatedBy())
      .preload(...withUpdatedBy())
      .first()

    if (G.isNullable(library)) throw E_RESOURCE_NOT_FOUND
    return response.ok({ library: library.serializeWithDocuments() })
  }

  /**
   * update
   * @put workspaces/:workspaceId/libraries/:libraryId
   * @middleware authActive workspace({as 'member'})
   * @success 200 { library: Library }
   * @error 400 E_VALIDATION_ERROR
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async update({ workspace, auth, request, response }: HttpContext) {
    const user = auth.user!

    const library = await workspace
      .related('libraries')
      .query()
      .where('id', request.param('libraryId'))
      .preload(...withLibraryTranslations())
      .first()
    if (G.isNullable(library)) throw E_RESOURCE_NOT_FOUND

    const { parentLibraryId, translations, ...payload } =
      await request.validateUsing(updateLibraryValidator)
    const now = DateTime.now()

    // validate parent
    if (G.isNotNullable(parentLibraryId)) {
      const libraries = await workspace.related('libraries').query()
      const parent = A.find(libraries, ({ id }) => id === parentLibraryId)
      if (G.isNullable(parent))
        return response.badRequest(validationFailure([{ field: 'parentLibraryId', rule: 'exist' }]))
      if (await library.isParentOf(parentLibraryId, libraries))
        return response.badRequest(
          validationFailure([{ field: 'parentLibraryId', rule: 'circular' }])
        )
    }

    await updateLibraryTranslations(library, translations)

    await library
      .merge({
        ...payload,
        parentLibraryId: parentLibraryId ?? library.parentLibraryId,
        updatedById: user.id,
        updatedAt: now,
      })
      .save()

    await library.load(preloadLibrary)
    return response.ok({ library: library.serializeWithDocuments() })
  }

  /**
   * delete
   * @delete workspaces/:workspaceId/libraries/:libraryId
   * @middleware authActive workspace({as 'member'})
   * @success 204
   * @error 401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async delete({ workspace, request, response }: HttpContext) {
    const library = await workspace
      .related('libraries')
      .query()
      .where('id', request.param('libraryId'))
      .first()
    if (G.isNullable(library)) throw E_RESOURCE_NOT_FOUND

    await library.delete()

    return response.noContent()
  }
}

/**
 * Update library translations
 */
async function updateLibraryTranslations(
  item: Library,
  payloadTranslations?: Infer<typeof createLibraryValidator>['translations']
) {
  if (!payloadTranslations) return
  const Language = (await import('#models/language')).default
  const languages = await Language.query()
  const itemTranslations = await item.getOrLoadRelation('translations')
  await Promise.all(
    A.map(languages, async ({ id }) => {
      const existingTranslation = A.find(itemTranslations, (t) => t.languageId === id)
      const payload = G.isNotNullable(payloadTranslations[id]) ? payloadTranslations[id] : {}
      if (G.isNotNullable(existingTranslation)) return existingTranslation.merge(payload).save()
      return item.related('translations').create({ languageId: id, ...payload })
    })
  )
}
