import { A, G, S } from '@mobily/ts-belt'
import path from 'path'
import sharp from 'sharp'
import { drive, driveDeleteSafe } from './drive.js'

/**
 * SharpService
 * @description this service is used to manage image operations
 */
export default class SharpService {
  /**
   * sharpMetadata
   * get image metadata with sharp
   */
  public static getMetadata = async (from: string): Promise<ImageMetadata> => {
    if (!this.isImage(from)) return {}

    try {
      // get buffer from file
      const fileBuffer = await drive.getBytes(from)

      // generate sharp image
      const image = sharp(fileBuffer)

      // get metadata
      const metadata = await sharp(await image.toBuffer()).metadata()

      return metadata
    } catch (error) {}
    return {}
  }

  /**
   * resize
   * resize image with sharp
   */
  public static resize = async (from: string, to: string, size: Size, fit: ImageFit = 'inside') => {
    if (!this.isImage(from)) return false
    try {
      // get buffer from file
      const fileBuffer = await drive.getBytes(from)

      // resize file
      const width = size.width
      const height = size.height
      const previewBuffer = await sharp(fileBuffer)
        .resize(width, height, {
          fit: sharp.fit[fit],
          withoutEnlargement: true,
        })
        .toBuffer()

      // clear in case it already exists
      await driveDeleteSafe(to)

      // save resized file
      await drive.put(to, previewBuffer)

      return true
    } catch (e) {}
    return false
  }

  /**
   * sharpCrop
   * crop image with sharp
   */
  public static crop = async (from: string, to: string, transform: Size & Coord) => {
    if (!this.isImage(from)) return false
    try {
      const fileBuffer = await drive.getBytes(from)
      const image = sharp(fileBuffer)
      const meta = await sharp(await image.toBuffer()).metadata()
      if (G.isNullable(meta.height) || G.isNullable(meta.width)) return false

      // apply transform
      const region = {
        top: Math.round((transform.y / 100) * meta.height),
        left: Math.round((transform.x / 100) * meta.width),
        width: Math.round((transform.width / 100) * meta.width),
        height: Math.round((transform.height / 100) * meta.height),
      }
      const imgBuffer = await image.extract(region).toBuffer()

      // save croped file
      await drive.put(to, imgBuffer)

      return true
    } catch (error) {}
    return false
  }

  /**
   * sharpExtensions
   * list of image extensions that are supported by sharp
   */
  public static extensions = [
    'jpeg',
    'jpg',
    'png',
    'webp',
    'tiff',
    'tif',
    'gif',
    'heif',
    'heic',
    'raw',
  ]

  /**
   * isExtension
   * check if a given extension is supported by sharp
   */
  public static isExtension = (extension: string) =>
    A.includes(this.extensions, S.toLowerCase(extension))

  /**
   * isImage
   * check if a given file path is an image
   */
  public static isImage = (filePath: string) =>
    this.isExtension(S.toLowerCase(path.extname(filePath).split('.').pop() ?? ''))

  /**
   * isSvgImage
   * check if a given file path is an svg image
   */
  public static isSvg = (filePath: string) =>
    S.toLowerCase(path.extname(filePath).split('.').pop() ?? '') === 'svg'

  /**
   * getInitialTransform
   */
  public static getInitialTransform: () => Transform = () => ({
    width: 100,
    height: 100,
    x: 0,
    y: 0,
    rotate: 0,
    cropper: this.getInitialCropper(),
  })

  /**
   * getInitialCropper
   */
  public static getInitialCropper: () => Cropper = () => ({
    zoom: 1,
    crop: {
      x: 0,
      y: 0,
    },
    aspect: {
      w: 16,
      h: 9,
    },
  })
}

/**
 * types
 */
export type Transform = Size &
  Coord & {
    rotate: number
    cropper: Cropper
  }
export type Cropper = {
  zoom: number
  crop: Coord
  aspect: Aspect
}
export type Coord = {
  x: number
  y: number
}
export type Size = {
  width: number
  height: number
}
export type Aspect = {
  w: number
  h: number
}
export type ImageFit = 'cover' | 'contain' | 'fill' | 'inside' | 'outside'
export type ImageMetadata = Partial<sharp.Metadata>
