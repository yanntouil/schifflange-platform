import { ImagePlaceholder, MediaImage } from '@/components/image'
import { MediaImageProps } from '@/utils/image'

/**
 * CardImage
 */

export const CardImage = (props: { image?: MediaImageProps | null; placeholder?: boolean }) => {
  const { image, placeholder } = props

  return (
    <ImagePlaceholder
      placeholder={placeholder}
      className='aspect-[2/1.3] backdrop-brightness-[.92] w-full object-cover rounded-2xl'
    >
      {image ? <MediaImage image={image} /> : null}
    </ImagePlaceholder>
  )
}
