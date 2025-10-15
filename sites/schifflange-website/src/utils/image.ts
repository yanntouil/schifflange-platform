import { Api, service } from '@/service'

/**
 * makeMediaImage:
 * Make image object from api media in using provided size
 */

export const makeMediaImage = <T extends Api.MediaFile | null | undefined>(
  image: T,
  size: 'original' | 'preview' | 'thumbnail'
): T extends Api.MediaFile ? MediaImageProps : null => {
  if (!image) return null as any

  return {
    src: service.getImageUrl(image, size) ?? '',
    alt: image.translations.alt,
    width: image.width,
    height: image.height,
  } as any
}

export type MediaImageProps = {
  src: string
  alt: string
  width: number
  height: number
}
