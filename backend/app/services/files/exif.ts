import { drive } from '#services/drive'
import { D, G } from '@mobily/ts-belt'
import { Option } from '@mobily/ts-belt/Option'
import {
  ImageSize as ExifImageSize,
  ExifParserFactory,
  ExifTags,
  ThumbnailTypes as ExifThumbnailTypes,
} from 'ts-exif-parser'

/**
 * ExifService
 * @description this service is used to manage exif operations
 */
export default class ExifService {
  /**
   * generateExif
   */
  public static generateExif = async (filePath: Option<string>): Promise<Partial<FileExif>> => {
    if (G.isNullable(filePath) || (await drive.exists(filePath))) return {}
    try {
      // get file buffer
      const fileBuffer = await drive.getBytes(filePath)
      // parse exif
      const exifData = ExifParserFactory.create(Buffer.from(fileBuffer)).parse()
      // prepare exif
      const exif: Partial<FileExif> = {
        ...D.selectKeys(exifData, [
          'startMarker',
          'tags',
          'imageSize',
          'thumbnailOffset',
          'thumbnailLength',
          'thumbnailType',
          'app1Offset',
        ]),
        thumbnailSize: exifData.getThumbnailSize ? exifData.getThumbnailSize() : undefined,
      }
      return exif
    } catch (error) {}
    return {}
  }
}

/**
 * types
 */
export interface FileExif {
  startMarker: any
  tags: ExifTags
  imageSize: ExifImageSize
  thumbnailOffset: number
  thumbnailLength: number
  thumbnailType: ExifThumbnailTypes
  app1Offset: number
  thumbnailSize: any
}
