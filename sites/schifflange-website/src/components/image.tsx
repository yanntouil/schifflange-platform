import { useTranslation } from '@/lib/localize'
import { MediaImageProps } from '@/utils/image'
import { isNullable } from '@compo/utils'
import { cx } from 'class-variance-authority'
import Image from 'next/image'
import React from 'react'

/**
 * MediaImage
 */

export const MediaImage = (
  props: React.ComponentProps<'img'> & { image: MediaImageProps | null | undefined }
) => {
  const { image, ...imgProps } = props
  if (!image) return

  return (
    <Image
      alt={image.alt}
      {...imgProps}
      className={cx('peer object-cover', imgProps.className)}
      width={image.width}
      height={image.height}
      src={image.src}
    />
  )
}

/**
 * ImagePlaceholder
 */

export const ImagePlaceholder = (
  props: React.ComponentProps<'div'> & { placeholder?: boolean }
) => {
  const { children, placeholder, ...divProps } = props
  const { _ } = useTranslation(dictionary)

  return (
    <div
      {...divProps}
      className={cx('overflow-hidden [&_img]:object-cover [&_img]:size-full', divProps.className)}
    >
      {children}

      {/* {placeholder && (
        <div className='size-full flex items-center p-6 justify-center' aria-hidden>
          <p className='text-default/40 text-sm'>{_('image-placeholder')}</p>
        </div>
      )} */}
    </div>
  )
}

/**
 * Translations
 */

const dictionary = {
  fr: {
    'image-placeholder': 'Image à venir',
  },
  en: {
    'image-placeholder': 'Image to come',
  },
  de: {
    'image-placeholder': 'Bild zu kommen',
  },
}
