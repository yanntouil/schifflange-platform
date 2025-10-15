import { E_RESOURCE_NOT_ALLOWED, E_RESOURCE_NOT_FOUND } from '#exceptions/resources'
import MediaFolder from '#models/media-folder'
import FileService from '#services/file'
import MediasService from '#services/files/medias'
import { validationFailure } from '#start/vine'
import {
  createFileValidator,
  createFolderValidator,
  cropFileValidator,
  updateFileValidator,
  updateFolderValidator,
} from '#validators/medias'
import type { HttpContext } from '@adonisjs/core/http'
import { A, D, G } from '@mobily/ts-belt'
import { DateTime } from 'luxon'

/**
 * Controller: Workspace/MediasController
 * private controller use to manage all features related to medias as a workspace member
 */
export default class MediasController {
  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * -- FOLDERS --
   */

  /**
   * foldersAll
   * @get workspaces/:workspaceId/medias/folders
   * @middleware auth workspace({as 'member'})
   * @success 200 { folders: MediaFolder[] }
   * @error 401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   */
  public async foldersAll({ workspace, response }: HttpContext) {
    const folders = await workspace
      .related('folders')
      .query()
      .preload('createdBy', (query) => query.preload('profile'))
      .preload('updatedBy', (query) => query.preload('profile'))
    return response.ok({ folders })
  }

  /**
   * rootIndex
   * @get workspaces/:workspaceId/medias
   * @middleware auth workspace({as 'member'})
   * @success 200 {folders: MediaFolder[], files: MediaFile[]}
   * @error 401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   */
  public async rootIndex({ workspace, response }: HttpContext) {
    const folders = await workspace
      .related('folders')
      .query()
      .whereNull('parentId')
      .preload('createdBy', (query) => query.preload('profile'))
      .preload('updatedBy', (query) => query.preload('profile'))
    const files = await workspace
      .related('files')
      .query()
      .whereNull('folderId')
      .preload('translations')
      .preload('createdBy', (query) => query.preload('profile'))
      .preload('updatedBy', (query) => query.preload('profile'))

    return response.ok({ folders, files })
  }

  /**
   * foldersCreate
   * @post workspaces/:workspaceId/medias/folders
   * @post workspaces/:workspaceId/medias/folders/:folderId/folders
   * @middleware auth workspace({as 'member'})
   * @success 201 { folder: MediaFolder }
   * @error 400 E_VALIDATION_FAILURE
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_RESOURCE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  public async foldersCreate({ workspace, auth, request, response }: HttpContext) {
    const user = auth.user!
    const userRole = user.getRoleInWorkspace(workspace)
    const {
      parentId: parentIdFromPayload,
      lock,
      ...payload
    } = await request.validateUsing(createFolderValidator)

    const parentId: string | null = G.isUndefined(parentIdFromPayload)
      ? (request.param('folderId') ?? null)
      : parentIdFromPayload

    if (G.isNotNullable(parentId)) {
      const folder = await MediaFolder.query()
        .where('id', parentId)
        .andWhere('workspaceId', workspace.id)
        .first()
      if (G.isNullable(folder)) throw E_RESOURCE_NOT_FOUND
    }

    const folder = await workspace.related('folders').create({
      ...payload,
      lock: userRole.isAdmin ? lock : false,
      parentId,
      createdById: user.id,
      updatedById: user.id,
    })

    await folder.refresh()
    await folder.load((query) =>
      query
        .load('createdBy', (query) => query.preload('profile'))
        .load('updatedBy', (query) => query.preload('profile'))
    )
    response.created({ folder: { ...folder.serialize(), folders: [], files: [] } })
  }

  /**
   * workspacesFoldersRead
   * @get workspaces/:workspaceId/medias/folders/:folderId
   * @middleware authActive workspace
   * @success 200 { folder: MediaFolder }
   * @error 401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_WORKSPACE_NOT_ACTIVE (workspace) | E_WORKSPACE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  public async foldersRead({ workspace, request, response }: HttpContext) {
    const folder = await workspace
      .related('folders')
      .query()
      .where('id', request.param('folderId'))
      .preload('folders')
      .preload('files', (query) => query.preload('translations'))
      .preload('createdBy', (query) => query.preload('profile'))
      .preload('updatedBy', (query) => query.preload('profile'))
      .first()
    if (G.isNullable(folder)) throw E_RESOURCE_NOT_FOUND
    return response.ok({ folder })
  }

  /**
   * workspacesFoldersUpdate
   * @put workspaces/:workspaceId/medias/folders/:folderId
   * @middleware authActive workspace
   * @success 200 { folder: MediaFolder }
   * @error 400 E_VALIDATION_FAILURE
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_WORKSPACE_NOT_ACTIVE (workspace) | E_WORKSPACE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  public async foldersUpdate({ workspace, auth, request, response }: HttpContext) {
    const user = auth.user!
    const userRole = user.getRoleInWorkspace(workspace)
    const folder = await workspace
      .related('folders')
      .query()
      .where('id', request.param('folderId'))
      .preload('folders')
      .preload('files', (query) => query.preload('translations'))
      .preload('createdBy', (query) => query.preload('profile'))
      .preload('updatedBy', (query) => query.preload('profile'))
      .first()
    if (G.isNullable(folder)) throw E_RESOURCE_NOT_FOUND

    const payload = await request.validateUsing(updateFolderValidator)

    // overide lock if not admin
    if (!userRole.isAdmin) {
      payload.lock = folder.lock
      // overide parentId if locked
      if (folder.lock) payload.parentId = folder.parentId
    }

    if (G.isNotNullable(payload.parentId)) {
      const folders = await workspace.related('folders').query()
      const parent = A.find(folders, ({ id }) => id === payload.parentId)
      if (G.isNullable(parent))
        return response.badRequest(validationFailure([{ parentId: 'parentId does not exist' }]))
      if (await parent.isChildOf(folder.id, folders))
        return response.badRequest(validationFailure([{ parentId: 'parentId is child of folder' }]))
    }

    if (D.isNotEmpty(payload) || folder.$isDirty) {
      await folder.merge({ ...payload, updatedById: user.id }).save()
      await folder.refresh()
      await folder.load('updatedBy', (query) => query.preload('profile'))
    }

    response.ok({ folder: folder.serialize() })
  }

  /**
   * workspacesFoldersDelete
   * @delete workspaces/:workspaceId/medias/folders/:folderId
   * @middleware authActive workspace
   * @success 204
   * @error 401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_WORKSPACE_NOT_ACTIVE (workspace) | E_WORKSPACE_NOT_ALLOWED (workspace) | E_RESOURCE_NOT_ALLOWED
   * **     404 E_RESOURCE_NOT_FOUND
   */
  public async foldersDelete({ workspace, auth, request, response }: HttpContext) {
    const user = auth.user!
    const userRole = user.getRoleInWorkspace(workspace)
    const folder = await workspace
      .related('folders')
      .query()
      .where('id', request.param('folderId'))
      .first()
    if (G.isNullable(folder)) throw E_RESOURCE_NOT_FOUND
    if (folder.lock && !userRole.isAdmin) throw E_RESOURCE_NOT_ALLOWED
    await folder.delete()
    return response.noContent()
  }

  /** ****** ****** ****** ****** ****** ****** ****** ****** ****** ******
   * -- FILES --
   */

  /**
   * filesCreate
   * @post workspaces/:workspaceId/medias/files
   * @post workspaces/:workspaceId/medias/folders/:folderId/files
   * @middleware authActive workspace
   * @success 201 { file: MediaFile }
   * @error 400 E_VALIDATION_FAILURE
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_WORKSPACE_NOT_ACTIVE (workspace) | E_WORKSPACE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  public async filesCreate({ workspace, auth, request, response }: HttpContext) {
    const user = auth.user!
    const { folderId: folderIdFromPayload, ...payload } =
      await request.validateUsing(createFileValidator)
    const folderId: string | null = G.isUndefined(folderIdFromPayload)
      ? (request.param('folderId') ?? null)
      : folderIdFromPayload

    if (G.isNotNullable(folderId)) {
      const folder = await workspace.related('folders').query().where('id', folderId).first()
      if (G.isNullable(folder)) throw E_RESOURCE_NOT_FOUND
    }
    const { ...fileProps } = await MediasService.createFile(
      payload.file,
      workspace.makePath('files')
    )
    const file = await workspace
      .related('files')
      .create({ ...fileProps, folderId, createdById: user.id, updatedById: user.id })

    await file.refresh()
    await file.load((query) =>
      query
        .load('createdBy', (query) => query.preload('profile'))
        .load('updatedBy', (query) => query.preload('profile'))
        .load('translations')
    )
    return response.created({ file: file.serialize() })
  }

  /**
   * filesRead
   * @get workspaces/:workspaceId/medias/files/:fileId
   * @middleware authActive workspace
   * @success 200 { file: MediaFile }
   * @error 401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_WORKSPACE_NOT_ACTIVE (workspace) | E_WORKSPACE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  public async filesRead({ workspace, request, response }: HttpContext) {
    const file = await workspace
      .related('files')
      .query()
      .where('id', request.param('fileId'))
      .preload('createdBy', (query) => query.preload('profile'))
      .preload('updatedBy', (query) => query.preload('profile'))
      .preload('translations')
      .first()
    if (G.isNullable(file)) throw E_RESOURCE_NOT_FOUND
    return response.ok({ file: file.serialize() })
  }

  /**
   * filesUpdate
   * @put workspaces/:workspaceId/medias/files/:fileId
   * @middleware authActive workspace
   * @success 200 { file: MediaFile }
   * @error 400 E_VALIDATION_FAILURE
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_WORKSPACE_NOT_ACTIVE (workspace) | E_WORKSPACE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  public async filesUpdate({ workspace, auth, request, response }: HttpContext) {
    const user = auth.user!
    const file = await workspace
      .related('files')
      .query()
      .where('id', request.param('fileId'))
      .preload('createdBy', (query) => query.preload('profile'))
      .preload('updatedBy', (query) => query.preload('profile'))
      .preload('translations')
      .first()
    if (G.isNullable(file)) throw E_RESOURCE_NOT_FOUND

    const { translations, ...payload } = await request.validateUsing(updateFileValidator)

    // replace by new file
    if (payload.file) {
      await file.deleteFiles()
      const fileProps = await MediasService.createFile(payload.file, workspace.makePath('files'))
      file.merge(
        D.selectKeys(fileProps, [
          'path',
          'url',
          'thumbnailPath',
          'thumbnailUrl',
          'previewPath',
          'previewUrl',
          'originalName',
          'originalPath',
          'originalUrl',
          'size',
          'extension',
          'exif',
        ])
      )
    }
    if (!G.isUndefined(payload.folderId)) file.folderId = payload.folderId
    if (!G.isUndefined(payload.copyright)) file.copyright = payload.copyright
    if (!G.isUndefined(payload.copyrightLink)) file.copyrightLink = payload.copyrightLink

    if (G.isNotNullable(translations)) {
      await file.mergeTranslations(translations)
      // propagate updatedAt to updatedBy
      if (!file.$isDirty) {
        await file.merge({ updatedAt: DateTime.now(), updatedById: user.id }).save()
      }
    }

    if (file.$isDirty) {
      await file.merge({ updatedAt: DateTime.now(), updatedById: user.id }).save()
    }
    await file.load((query) =>
      query.preload('updatedBy', (query) => query.preload('profile')).preload('translations')
    )
    return response.ok({ file: file.serialize() })
  }

  /**
   * filesDelete
   * @delete workspaces/:workspaceId/medias/files/:fileId
   * @middleware authActive workspace
   * @success 204
   * @error 401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_WORKSPACE_NOT_ACTIVE (workspace) | E_WORKSPACE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  public async filesDelete({ workspace, request, response }: HttpContext) {
    const file = await workspace
      .related('files')
      .query()
      .where('id', request.param('fileId'))
      .first()
    if (G.isNullable(file)) throw E_RESOURCE_NOT_FOUND
    await file.delete()
    return response.noContent()
  }

  /**
   * filesCopy
   * @post workspaces/:workspaceId/medias/files/:filesId
   * @middleware authActive workspace
   * @success 200 { file: MediaFile }
   * @error 401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_WORKSPACE_NOT_ACTIVE (workspace) | E_WORKSPACE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  public async filesCopy({ workspace, auth, request, response }: HttpContext) {
    const user = auth.user!
    const originalFile = await workspace
      .related('files')
      .query()
      .where('id', request.param('fileId'))
      .preload('translations')
      .first()
    if (G.isNullable(originalFile)) throw E_RESOURCE_NOT_FOUND

    // create copy of file
    const fileProps = await MediasService.copyFile(originalFile, workspace.makePath('files'))
    const file = await workspace.related('files').create({
      ...fileProps,
      createdById: user.id,
      updatedById: user.id,
    })

    // copy translations
    const translation = D.fromPairs(
      A.map(originalFile.translations, ({ languageId, name, caption, alt }) => [
        languageId,
        { name: FileService.copyName(name, 'copy'), caption, alt },
      ])
    )
    await file.mergeTranslations(translation)

    await file.refresh()
    await file.load((query) =>
      query
        .load('createdBy', (query) => query.preload('profile'))
        .load('updatedBy', (query) => query.preload('profile'))
        .load('translations')
    )
    return response.ok({ file: file.serialize() })
  }

  /**
   * filesCrop
   * @put workspaces/:workspaceId/medias/files/:filesId/crop
   * @middleware authActive workspace
   * @success 200 { file: MediaFile }
   * @error 400 E_VALIDATION_FAILURE | E_MEDIA_CROP_FAILED
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_WORKSPACE_NOT_ACTIVE (workspace) | E_WORKSPACE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  public async filesCrop({ workspace, auth, request, response }: HttpContext) {
    const user = auth.user!
    const file = await workspace
      .related('files')
      .query()
      .where('id', request.param('fileId'))
      .preload('createdBy', (query) => query.preload('profile'))
      .preload('updatedBy', (query) => query.preload('profile'))
      .preload('translations')
      .first()
    if (G.isNullable(file)) throw E_RESOURCE_NOT_FOUND

    const { transform } = await request.validateUsing(cropFileValidator)
    const fileProps = await MediasService.cropImage(file, transform, `workspaces/${workspace.id}`)
    await file.merge({ ...fileProps, updatedById: user.id }).save()
    await file.load('updatedBy', (query) => query.preload('profile'))
    return response.ok({ file: file.serialize() })
  }

  /**
   * filesUncrop
   * @delete workspaces/:workspaceId/medias/files/:fileId/crop
   * @middleware authActive workspace
   * @success 200 { file: MediaFile }
   * @error 400 E_MEDIA_UNCROP_FAILED
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_WORKSPACE_NOT_ACTIVE (workspace) | E_WORKSPACE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  public async filesUncrop({ workspace, auth, request, response }: HttpContext) {
    const user = auth.user!
    const file = await workspace
      .related('files')
      .query()
      .where('id', request.param('fileId'))
      .preload('createdBy', (query) => query.preload('profile'))
      .preload('updatedBy', (query) => query.preload('profile'))
      .preload('translations')
      .first()
    if (G.isNullable(file)) throw E_RESOURCE_NOT_FOUND

    const fileProps = await MediasService.uncropImage(file)
    await file.merge({ ...fileProps, updatedById: user.id }).save()
    await file.load('updatedBy', (query) => query.preload('profile'))

    return response.ok({ file: file.serialize() })
  }

  /**
   * workspacesFilesCropAs
   * @post workspaces/:workspaceId/medias/files/:filesId/crop
   * @middleware authActive workspace
   * @success 200 { file: MediaFile }
   * @error 400 E_VALIDATION_FAILURE | E_MEDIA_CROP_FAILED | E_MEDIA_COPY_FAILED
   * **     401 E_UNAUTHORIZED_ACCESS (authActive)
   * **     403 E_WORKSPACE_NOT_ACTIVE (workspace) | E_WORKSPACE_NOT_ALLOWED (workspace)
   * **     404 E_RESOURCE_NOT_FOUND
   */
  public async filesCropAs({ workspace, auth, request, response }: HttpContext) {
    const user = auth.user!
    const originalFile = await workspace
      .related('files')
      .query()
      .where('id', request.param('fileId'))
      .preload('createdBy', (query) => query.preload('profile'))
      .preload('updatedBy', (query) => query.preload('profile'))
      .preload('translations')
      .first()
    if (G.isNullable(originalFile)) throw E_RESOURCE_NOT_FOUND

    const { transform } = await request.validateUsing(cropFileValidator)

    // create copy cropped of file
    const fileProps = await MediasService.cropImageAsCopy(
      originalFile,
      transform,
      `workspaces/${workspace.id}`
    )
    const file = await workspace
      .related('files')
      .create({ ...fileProps, createdById: user.id, updatedById: user.id })

    // copy translations
    const translation = D.fromPairs(
      A.map(originalFile.translations, ({ languageId, name, caption, alt }) => [
        languageId,
        { name: FileService.copyName(name, 'cropped copy'), caption, alt },
      ])
    )
    await file.mergeTranslations(translation)

    await file.refresh()
    await file.load((query) =>
      query
        .preload('createdBy', (query) => query.preload('profile'))
        .preload('updatedBy', (query) => query.preload('profile'))
        .preload('translations')
    )

    return response.ok({ file: file.serialize() })
  }
}
