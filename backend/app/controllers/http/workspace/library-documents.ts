import { E_RESOURCE_NOT_FOUND } from '#exceptions/resources'
import LibraryDocument, { preloadVisits } from '#models/library-document'
import { preloadFiles } from '#models/media-file'
import { withPublicationRelation } from '#models/publication'
import { withProfile } from '#models/user'
import { validationFailure } from '#start/vine'
import {
  createLibraryDocumentValidator,
  filterLibraryDocumentsByValidator,
  sortLibraryDocumentsByValidator,
  updateLibraryDocumentValidator,
} from '#validators/library-documents'
import type { HttpContext } from '@adonisjs/core/http'
import { A, D, G } from '@mobily/ts-belt'
import type { Infer } from '@vinejs/vine/types'
import { DateTime } from 'luxon'

/**
 * LibraryDocumentsController
 */
export default class LibraryDocumentsController {
  /**
   * all
   * @get workspaces/:workspaceId/libraries/:libraryId/documents
   * @middleware authActive workspace({as 'member'})
   * @success 200 { libraryDocuments: LibraryDocument[] }
   * @error 401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async all({ request, workspace, response }: HttpContext) {
    const filterBy = await request.filterBy(filterLibraryDocumentsByValidator)
    const sortBy = await request.sortBy(sortLibraryDocumentsByValidator)
    const limit = await request.limit()

    const libraryDocuments = await workspace
      .related('libraryDocuments')
      .query()
      .where('libraryId', request.param('libraryId'))
      .withScopes((scope) => scope.filterBy(filterBy))
      .withScopes((scope) => scope.sortBy(sortBy))
      .withScopes((scope) => scope.limit(limit))
      .preload('translations')
      .preload('files', preloadFiles)
      .preload('publication', withPublicationRelation)
      .preload('tracking', preloadVisits)
      .preload('createdBy', withProfile)
      .preload('updatedBy', withProfile)
    return response.ok({
      libraryDocuments: A.map(libraryDocuments, (doc) => doc.serializeWithFiles()),
    })
  }

  /**
   * create
   * @post workspaces/:workspaceId/libraries/:libraryId/documents
   * @middleware authActive workspace({as 'member'})
   * @success 201 { libraryDocument: LibraryDocument }
   * @error 400 E_VALIDATION_ERROR
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async create({ workspace, auth, request, response }: HttpContext) {
    const user = auth.user!

    // Verify library exists and belongs to workspace
    const library = await workspace
      .related('libraries')
      .query()
      .where('id', request.param('libraryId'))
      .first()
    if (G.isNullable(library)) throw E_RESOURCE_NOT_FOUND

    const { translations, files, ...payload } = await request.validateUsing(
      createLibraryDocumentValidator
    )
    const now = DateTime.now()

    // Verify files exist in workspace if provided
    if (G.isNotNullable(files) && files.length > 0) {
      const MediaFile = (await import('#models/media-file')).default
      const fileIds = A.map(files, (f) => f.fileId)
      const mediaFiles = await MediaFile.query()
        .whereIn('id', fileIds)
        .andWhere('workspaceId', workspace.id)
      if (mediaFiles.length !== fileIds.length) {
        return response.badRequest(validationFailure([{ field: 'files', rule: 'exist' }]))
      }
    }

    const libraryDocument = await workspace.related('libraryDocuments').create({
      libraryId: library.id,
      ...payload,
      createdAt: now,
      createdById: user.id,
      updatedAt: now,
      updatedById: user.id,
    })

    await libraryDocument.refresh()

    // Attach files
    if (G.isNotNullable(files)) {
      const syncFiles = A.reduce(files, {} as Record<string, { code: string }>, (acc, file) =>
        D.set(acc, file.fileId, { code: file.code ?? '' })
      )
      await libraryDocument.related('files').sync(syncFiles)
    }

    // Create translations
    await updateLibraryDocumentTranslations(libraryDocument, translations)

    await libraryDocument.load((query) =>
      query
        .preload('translations')
        .preload('files', preloadFiles)
        .preload('publication', withPublicationRelation)
        .preload('tracking', preloadVisits)
        .preload('createdBy', withProfile)
        .preload('updatedBy', withProfile)
    )
    return response.ok({ libraryDocument: libraryDocument.serializeWithFiles() })
  }

  /**
   * read
   * @get workspaces/:workspaceId/libraries/:libraryId/documents/:documentId
   * @middleware authActive workspace({as 'member'})
   * @success 200 { libraryDocument: LibraryDocument }
   * @error 401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async read({ workspace, request, response }: HttpContext) {
    const libraryDocument = await workspace
      .related('libraryDocuments')
      .query()
      .where('id', request.param('documentId'))
      .andWhere('libraryId', request.param('libraryId'))
      .preload('translations')
      .preload('files', preloadFiles)
      .preload('publication', withPublicationRelation)
      .preload('tracking', preloadVisits)
      .preload('createdBy', withProfile)
      .preload('updatedBy', withProfile)
      .first()
    if (G.isNullable(libraryDocument)) throw E_RESOURCE_NOT_FOUND
    return response.ok({ libraryDocument: libraryDocument.serializeWithFiles() })
  }

  /**
   * update
   * @put workspaces/:workspaceId/libraries/:libraryId/documents/:documentId
   * @middleware authActive workspace({as 'member'})
   * @success 200 { libraryDocument: LibraryDocument }
   * @error 400 E_VALIDATION_ERROR
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async update({ workspace, auth, request, response }: HttpContext) {
    const user = auth.user!

    const libraryDocument = await workspace
      .related('libraryDocuments')
      .query()
      .where('id', request.param('documentId'))
      .andWhere('libraryId', request.param('libraryId'))
      .preload('translations')
      .first()
    if (G.isNullable(libraryDocument)) throw E_RESOURCE_NOT_FOUND

    const { translations, files, ...payload } = await request.validateUsing(
      updateLibraryDocumentValidator
    )
    const now = DateTime.now()

    // Verify files exist in workspace if provided
    // sync files
    if (G.isNotNullable(files)) {
      const syncFiles = A.reduce(files, {} as Record<string, { code: string }>, (acc, file) =>
        D.set(acc, file.fileId, { code: file.code ?? '' })
      )
      await libraryDocument.related('files').sync(syncFiles)
    }

    await updateLibraryDocumentTranslations(libraryDocument, translations)

    await libraryDocument
      .merge({
        ...payload,
        updatedById: user.id,
        updatedAt: now,
      })
      .save()

    await libraryDocument.load((query) =>
      query
        .preload('translations')
        .preload('files', preloadFiles)
        .preload('publication', withPublicationRelation)
        .preload('tracking', preloadVisits)
        .preload('updatedBy', withProfile)
    )

    return response.ok({ libraryDocument: libraryDocument.serializeWithFiles() })
  }

  /**
   * delete
   * @delete workspaces/:workspaceId/libraries/:libraryId/documents/:documentId
   * @middleware authActive workspace({as 'member'})
   * @success 204
   * @error 401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  async delete({ workspace, request, response }: HttpContext) {
    const libraryDocument = await workspace
      .related('libraryDocuments')
      .query()
      .where('id', request.param('documentId'))
      .andWhere('libraryId', request.param('libraryId'))
      .first()
    if (G.isNullable(libraryDocument)) throw E_RESOURCE_NOT_FOUND

    await libraryDocument.delete()

    return response.noContent()
  }
}

/**
 * Update library document translations
 */
async function updateLibraryDocumentTranslations(
  item: LibraryDocument,
  payloadTranslations?: Infer<typeof createLibraryDocumentValidator>['translations']
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
