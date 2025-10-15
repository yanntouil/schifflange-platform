import { MultipartFile } from '@adonisjs/core/bodyparser'
import { cuid } from '@adonisjs/core/helpers'
import { A, D, G, O, S } from '@mobily/ts-belt'
import { drive, driveDeleteSafe, driveMakeAbsolutePath, makePath } from './drive.js'
import SharpService, { Transform } from './sharp.js'

/**
 * FileService
 * @description this service is used to manage file operations
 */
export default class FileService {
  /**
   * makeFile
   * @description make a single file
   * @param file - the file to make
   * @param options - the options for the file
   * @returns the single file or an empty single file if the file is not provided
   */
  public static makeFile = async (
    file?: MultipartFile,
    options: Partial<SingleFileOptions> = {}
  ): Promise<SingleFile> => {
    if (!file) return FileService.emptyFile
    const opt: SingleFileOptions = D.merge(this.makeFileDefaultOptions, options)

    const name = cuid()
    const path = makePath(opt.folder, name + this.dottedExt(file.extname))

    // move file form temp path to storage path
    await file.move(driveMakeAbsolutePath(opt.folder), {
      name: name + this.dottedExt(file.extname),
    })

    // get signed url
    const url = await drive.getUrl(path)

    return {
      name,
      path,
      url,
      size: file.size,
      extension: file.extname ?? '',
      originalName: file.clientName,
    }
  }

  /**
   * makeFileDefaultOptions
   * @description make the default options for a single file
   * @returns the default options for a single file
   */
  protected static get makeFileDefaultOptions(): SingleFileOptions {
    return {
      folder: '',
    }
  }

  /**
   * emptyFile
   * @description make an empty single file
   * @returns the empty single file
   */
  public static get emptyFile(): SingleFile {
    return {
      name: '',
      path: '',
      url: '',
      size: 0,
      extension: '',
      originalName: '',
    }
  }

  /**
   * deleteFile
   * @description delete a single file
   * @param file - the file to delete
   * @returns the empty single file
   */
  public static deleteFile = async (file: SingleFile): Promise<SingleFile> => {
    await driveDeleteSafe(file.path)
    return FileService.emptyFile
  }

  /**
   * serializeFile
   * @description serialize a single file in model serializable format
   * @param value - the file to serialize
   * @returns the serialized file
   */
  public static serializeFile(value: SingleFile) {
    return S.isNotEmpty(value.url)
      ? D.selectKeys(value, ['url', 'size', 'extension', 'originalName'])
      : null
  }

  /**
   * serializeMultipleFiles
   * @description serialize multiple files in model serializable format
   * @param value - the files to serialize
   * @returns the serialized files
   */
  public static serializeMultipleFiles(value: MultipleFile[]) {
    return A.map(value, (file) =>
      D.selectKeys(file, ['id', 'url', 'size', 'extension', 'originalName'])
    )
  }

  /**
   * makeImage
   * @description make a single image
   * @param file - the file to make
   * @param options - the options for the image
   * @returns the single image or an empty single image if the file is not provided
   */
  public static makeImage = async (
    file?: MultipartFile,
    options: Partial<SingleImageOptions> = {}
  ): Promise<SingleImage> => {
    if (!file) return FileService.emptyImage
    const opt: SingleImageOptions = D.merge(this.makeImageDefaultOptions, options)
    const singleFile = await this.makeFile(file, opt)

    // create thumbnail or leave empty
    const [thumbnailPath, thumbnailUrl] = (opt.thumbnail &&
      (await this.createResizedImage(
        singleFile.path,
        makePath(opt.folder, `${singleFile.name}-thumbnail${this.dottedExt(file.extname)}`),
        opt.thumbnailSize,
        opt.thumbnailFit
      ))) || ['', '']

    // create preview or leave empty
    const [previewPath, previewUrl] = (opt.preview &&
      (await this.createResizedImage(
        singleFile.path,
        makePath(opt.folder, `${singleFile.name}-preview${this.dottedExt(file.extname)}`),
        opt.previewSize,
        opt.previewFit
      ))) || ['', '']

    return {
      ...singleFile,
      thumbnailUrl,
      thumbnailPath,
      previewUrl,
      previewPath,
      originalPath: singleFile.path,
      originalUrl: singleFile.url,
    }
  }

  /**
   * makeImageDefaultOptions
   * @description make the default options for a single image
   * @returns the default options for a single image
   */
  protected static get makeImageDefaultOptions(): SingleImageOptions {
    return {
      ...this.makeFileDefaultOptions,
      preview: true,
      previewSize: [1920],
      previewFit: 'inside',
      thumbnail: true,
      thumbnailSize: [400],
      thumbnailFit: 'inside',
    }
  }

  /**
   * emptyImage
   * @description make an empty single image
   * @returns the empty single image
   */
  public static get emptyImage(): SingleImage {
    return {
      ...FileService.emptyFile,
      thumbnailUrl: '',
      thumbnailPath: '',
      previewUrl: '',
      previewPath: '',
      originalPath: '',
      originalUrl: '',
    }
  }

  /**
   * deleteImage
   * @description delete a single image
   * @param image - the image to delete
   * @returns the empty single image
   */
  public static deleteImage = async (image: SingleImage | null) => {
    if (!image) return FileService.emptyImage
    await Promise.all([
      driveDeleteSafe(image.path),
      driveDeleteSafe(image.previewPath),
      driveDeleteSafe(image.thumbnailPath),
    ])
    return FileService.emptyImage
  }

  /**
   * serializeImage
   * @description serialize a single image in model serializable format
   * @param value - the image to serialize
   * @returns the serialized image
   */
  public static serializeImage(value: SingleImage) {
    return S.isNotEmpty(value.url)
      ? D.selectKeys(value, [
          'url',
          'size',
          'extension',
          'thumbnailUrl',
          'previewUrl',
          'originalUrl',
          'originalName',
        ])
      : null
  }

  /**
   * createResizedImage
   * @description create a resized image
   * @param from - the path to the original image
   * @param to - the path to the resized image
   * @param size - the size of the resized image
   * @param fit - the fit of the resized image
   * @returns the path to the resized image and the url to the resized image
   */
  public static createResizedImage = async (
    from: string,
    to: string,
    size: [number] | [number, number],
    fit: ImageFit = 'inside'
  ): Promise<[string, string]> => {
    if (!SharpService.isImage(from)) return ['', '']
    const isResized = await SharpService.resize(
      from,
      to,
      { width: size[0], height: size[1] ?? size[0] },
      fit
    )
    if (isResized) return [to, await drive.getUrl(to)]
    return ['', '']
  }
  /**
   * cropImage
   * @description crop an image
   * @param image - the image to crop
   * @param transform - the transform to apply to the image
   * @param folder - the folder to crop the image to
   * @returns the cropped image
   */
  public static async cropImage(
    file: SingleImage,
    transform: Transform,
    options: Partial<SingleImageOptions> = {}
  ) {
    const opt: SingleImageOptions = D.merge(this.makeImageDefaultOptions, options)
    const name = cuid()

    const isAllreadyModified = file.path !== file.originalPath
    if (isAllreadyModified) await driveDeleteSafe(file.path)

    const path = makePath(opt.folder, `${name}-modified${FileService.dottedExt(file.extension)}`)
    const url = await drive.getUrl(path)

    if (!(await SharpService.crop(file.originalPath, path, transform)))
      throw new Error('Failed to crop image')

    // create new thumbnail from modified or leave empty
    await driveDeleteSafe(file.thumbnailPath)
    const [thumbnailPath, thumbnailUrl] = (opt.thumbnail &&
      (await FileService.createResizedImage(
        path,
        makePath(opt.folder, `${name}-thumbnail${FileService.dottedExt(file.extension)}`),
        opt.thumbnailSize,
        opt.thumbnailFit
      ))) || ['', '']

    // create new preview from modified or leave empty
    await driveDeleteSafe(file.previewPath)
    const [previewPath, previewUrl] = (opt.preview &&
      (await FileService.createResizedImage(
        path,
        makePath(opt.folder, `${name}-preview${FileService.dottedExt(file.extension)}`),
        opt.previewSize,
        opt.previewFit
      ))) || ['', '']

    return D.merge(file, {
      path,
      url,
      thumbnailUrl,
      thumbnailPath,
      previewUrl,
      previewPath,
    })
  }

  /**
   * uncropImage
   * @description uncrop an image
   * @param image - the image to uncrop
   * @returns the uncropped image
   */
  public static uncropImage = async (
    file: SingleImage,
    options: Partial<SingleImageOptions> = {}
  ) => {
    const opt: SingleImageOptions = D.merge(this.makeImageDefaultOptions, options)
    const isNotModified = file.path === file.originalPath
    if (isNotModified) return file

    const name = cuid()
    const { originalPath, originalUrl } = file

    const path = originalPath
    const url = originalUrl

    // create new thumbnail from original or leave empty
    await driveDeleteSafe(file.thumbnailPath)
    const [thumbnailPath, thumbnailUrl] = (opt.thumbnail &&
      (await FileService.createResizedImage(
        path,
        makePath(opt.folder, `${name}-thumbnail${FileService.dottedExt(file.extension)}`),
        opt.thumbnailSize,
        opt.thumbnailFit
      ))) || ['', '']

    // create new preview from original or leave empty
    await driveDeleteSafe(file.previewPath)
    const [previewPath, previewUrl] = (opt.preview &&
      (await FileService.createResizedImage(
        path,
        makePath(opt.folder, `${name}-preview${FileService.dottedExt(file.extension)}`),
        opt.previewSize,
        opt.previewFit
      ))) || ['', '']

    return D.merge(file, {
      path,
      url,
      thumbnailUrl,
      thumbnailPath,
      previewUrl,
      previewPath,
    })
  }

  /**
   * copyImage
   * @description copy an image
   * @param image - the image to copy
   * @param folder - the folder to copy the image to
   * @returns the copied image
   */
  public static copyImage = async (image: SingleImage, folder: string): Promise<SingleImage> => {
    const name = cuid()

    // copy thumbnail or leave empty
    const [originalPath, originalUrl] = S.isNotEmpty(image.originalPath)
      ? await FileService.createFileCopy(
          image.originalPath,
          makePath(folder, `${name}${FileService.dottedExt(image.extension)}`)
        )
      : ['', '']

    // copy modified file or keep original
    const isModified = image.path !== image.originalPath
    const [path, url] = isModified
      ? await FileService.createFileCopy(
          image.path,
          makePath(folder, `${name}-modified${FileService.dottedExt(image.extension)}`)
        )
      : [originalPath, originalUrl]

    // copy thumbnail or leave empty
    const [thumbnailPath, thumbnailUrl] = S.isNotEmpty(image.thumbnailPath)
      ? await FileService.createFileCopy(
          image.thumbnailPath,
          makePath(folder, `${name}-thumbnail${FileService.dottedExt(image.extension)}`)
        )
      : ['', '']

    // copy preview or leave empty
    const [previewPath, previewUrl] = S.isNotEmpty(image.previewPath)
      ? await FileService.createFileCopy(
          image.previewPath,
          makePath(folder, `${name}-preview${FileService.dottedExt(image.extension)}`)
        )
      : ['', '']

    return D.merge(image, {
      path,
      url,
      thumbnailUrl,
      thumbnailPath,
      previewUrl,
      previewPath,
      originalPath,
      originalUrl,
    })
  }

  /**
   * createFileCopy
   * @description create a copy of a file
   * @param from - the path to the original file
   * @param to - the path to the copied file
   * @returns the path to the copied file and the url to the copied file
   */
  public static createFileCopy = async (from: string, to: string): Promise<[string, string]> => {
    await drive.copy(from, to)
    return [to, await drive.getUrl(to)]
  }

  /**
   * extractCopyCount
   * @description extract the copy count from a file name
   * @param input - the file name
   * @param noun - the noun to extract the copy count from
   * @returns the copy count and the name
   */
  protected static extractCopyCount = (input: string, noun: string) => {
    const regex = new RegExp(`\\(${noun}(?: (\\d+))?\\)$`)
    const name = input
      .replace(regex, '')
      .replace(/ +(?= )/g, '')
      .trim()

    const match = input.trim().match(regex)

    if (match) {
      if (match[1]) {
        return { copy: parseInt(match[1], 10) + 1, name }
      } else {
        return { copy: 2, name }
      }
    }

    return { copy: 1, name }
  }

  /**
   * copyName
   * @description copy the name of a file
   * @param name - the name of the file
   * @param noun - the noun to copy the name from
   * @returns the copied name
   */
  public static copyName = (name: string, noun = 'copy') => {
    const extracted = this.extractCopyCount(name, noun)
    return `${extracted.name} (${noun}${extracted.copy === 1 ? '' : ` ${extracted.copy}`})`
  }

  /**
   * dottedExt
   * @description get the dotted extension of a file
   * @param extension - the extension of the file
   * @returns the dotted extension of the file
   */
  protected static dottedExt = (extension: O.Option<string>) =>
    G.isNullable(extension) ? '' : S.startsWith('.', extension) ? extension : '.' + extension
}

/**
 * types
 */
export interface SingleFileOptions {
  folder: string
}
interface SingleImageOptions extends SingleFileOptions {
  preview: boolean
  previewSize: ImageSize
  previewFit: ImageFit
  thumbnail: boolean
  thumbnailSize: ImageSize
  thumbnailFit: ImageFit
}
export type ImageSize = [number] | [number, number]
export type ImageFit = 'cover' | 'contain' | 'fill' | 'inside' | 'outside'
export interface SingleFile {
  name: string
  originalName: string
  path: string
  url: string
  size: number
  extension: string
}
export interface MultipleFile extends SingleFile {
  id: string
}
export interface SingleImage extends SingleFile {
  thumbnailUrl: string
  thumbnailPath: string
  previewUrl: string
  previewPath: string
  originalUrl: string
  originalPath: string
}
export interface FileTranslation {
  languageId: string
  name: string
  alt: string
  caption: string
}
