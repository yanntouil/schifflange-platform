import {
  E_MEDIA_COPY_FAILED,
  E_MEDIA_CROP_FAILED,
  E_MEDIA_UNCROP_FAILED,
  E_MEDIA_UPLOAD_FAILED,
} from '#exceptions/medias'
import MediaFile from '#models/media-file'
import ExifService from '#services/files/exif'
import FileService, { type SingleImage } from '#services/files/file'
import SharpService, { Transform } from '#services/files/sharp'
import { tryThrow } from '#utils/try-catch'
import { MultipartFile } from '@adonisjs/core/bodyparser'
import { D } from '@mobily/ts-belt'

/**
 * MediasService
 * service to manage medias
 */
export default class MediasService {
  /**
   * createFile
   * create a file and return a new file
   */
  public static async createFile(file: MultipartFile, folder: string) {
    const singleImage = await tryThrow(
      () => FileService.makeImage(file, { folder }),
      E_MEDIA_UPLOAD_FAILED
    )

    const size = await SharpService.getMetadata(singleImage.path)
    const exif = await ExifService.generateExif(singleImage.path)
    return {
      ...D.deleteKeys(singleImage, ['name']),
      ...D.selectKeys(size, ['width', 'height']),
      exif,
    }
  }

  /**
   * copyFile
   * copy a file and return a new file
   */
  public static async copyFile(file: MediaFile, folder: string) {
    const singleImage = await tryThrow(
      () => FileService.copyImage(MediasService.fileToSingleImage(file), folder),
      E_MEDIA_COPY_FAILED
    )
    return {
      ...D.deleteKeys(singleImage, ['name']),
      ...D.selectKeys(file.toJSON(), [
        'exif',
        'transform',
        'folderId',
        'workspaceId',
        'width',
        'height',
        'copyright',
        'copyrightLink',
      ]),
    }
  }

  /**
   * cropImage
   * crop an image and return a new image
   */
  public static async cropImage(file: MediaFile, transform: Transform, folder: string) {
    const singleImage = await tryThrow(
      () => FileService.cropImage(MediasService.fileToSingleImage(file), transform, { folder }),
      E_MEDIA_CROP_FAILED
    )
    const size = await SharpService.getMetadata(singleImage.path)
    return {
      transform,
      ...D.selectKeys(singleImage, [
        'path',
        'url',
        'thumbnailPath',
        'thumbnailUrl',
        'previewPath',
        'previewUrl',
      ]),
      ...D.selectKeys(size, ['width', 'height']),
    }
  }

  /**
   * cropImageAsCopy
   * crop an image and return a new image
   */
  public static async cropImageAsCopy(file: MediaFile, transform: Transform, folder: string) {
    const copy = await tryThrow(
      () => FileService.copyImage(MediasService.fileToSingleImage(file), folder),
      E_MEDIA_COPY_FAILED
    )
    try {
      const singleImage = await FileService.cropImage(copy, transform, { folder })
      const size = await SharpService.getMetadata(singleImage.path)
      return {
        transform,
        ...D.selectKeys(file.toJSON(), ['exif', 'folderId', 'workspaceId']),
        ...D.deleteKeys(singleImage, ['name']),
        ...D.selectKeys(size, ['width', 'height']),
      }
    } catch (error) {
      await FileService.deleteImage(copy)
      throw new E_MEDIA_CROP_FAILED()
    }
  }

  /**
   * uncropImage
   * uncrop an image and return a new image
   */
  public static async uncropImage(file: MediaFile) {
    const singleImage = await tryThrow(
      () => FileService.uncropImage(MediasService.fileToSingleImage(file)),
      E_MEDIA_UNCROP_FAILED
    )
    const size = await SharpService.getMetadata(singleImage.path)
    return {
      transform: {},
      ...D.selectKeys(singleImage, [
        'path',
        'url',
        'thumbnailPath',
        'thumbnailUrl',
        'previewPath',
        'previewUrl',
      ]),
      ...D.selectKeys(size, ['width', 'height']),
    }
  }

  /**
   * fileToSingleImage
   * transform a file to a single image
   */
  public static fileToSingleImage(file: MediaFile) {
    const singleImage: SingleImage = {
      name: file.originalName,
      size: file.size,
      extension: file.extension,
      path: file.path,
      url: file.url,
      thumbnailUrl: file.thumbnailUrl,
      thumbnailPath: file.thumbnailPath,
      previewUrl: file.previewUrl,
      previewPath: file.previewPath,
      originalName: file.originalName,
      originalPath: file.originalPath,
      originalUrl: file.originalUrl,
    }
    return singleImage
  }
}
