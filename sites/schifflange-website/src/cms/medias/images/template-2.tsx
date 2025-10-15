'use client'

import { Container } from '@/components/container'
import { Hn } from '@/components/hn'
import { Lightbox } from '@/components/lightbox'
import { buttonVariants } from '@/components/ui/button'
import { textVariants } from '@/components/variants'
import { Wrapper } from '@/components/wrapper'
import { useTranslation } from '@/lib/localize'
import { cn } from '@/lib/utils'
import { prose } from '@compo/ui/src/variants'
import { A, match, S, stripHtml } from '@compo/utils'
import { Expand } from 'lucide-react'
import Image from 'next/image'
import type { TemplateProps } from './index'

/**
 * Template 2
 * A simple template with a title, description, and image.
 */
export function Template2({ props }: TemplateProps) {
  const { _ } = useTranslation(dictionary)

  const { title, level, subtitle, description, displayHeading, slides } = props
  const hasDescription = isNotEmptyHtml(description)
  return (
    <Lightbox.Root>
      <Wrapper paddingY>
        <Container>
          {displayHeading && (
            <div className='grid grid-cols-1 gap-8 md:grid-cols-2 pb-[24px]'>
              <div className='flex flex-col justify-center'>
                {title && (
                  <Hn level={level} className={textVariants({ variant: 'title', color: 'tuna' })}>
                    {title}
                  </Hn>
                )}
                {subtitle && (
                  <p className={textVariants({ variant: 'subtitle', color: 'tuna' })}>{subtitle}</p>
                )}
                {hasDescription && (
                  <div
                    className={prose({ variant: 'heading' })}
                    dangerouslySetInnerHTML={{ __html: description }}
                  />
                )}
              </div>
            </div>
          )}
          <div className='grid grid-cols-2 gap-[40px]'>
            {A.map(slides, slide => (
              <div key={slide.id} className='relative'>
                <Lightbox.Trigger
                  data={slide}
                  className={cn(
                    buttonVariants({ scheme: 'secondary', variant: 'icon' }),
                    'absolute right-2 top-2 group-focus-within/image:opacity-100 group-hover/image:opacity-100 sm:opacity-0 size-8 [&>svg]:size-4 transition-all'
                  )}
                >
                  <Expand aria-hidden />
                  <span className='sr-only'>
                    {_('lightbox-trigger', { name: slide?.alt ?? slide.id })}
                  </span>
                </Lightbox.Trigger>
                {match(slide)
                  .with({ type: 'image' }, slide => (
                    <Image
                      src={slide.previewUrl}
                      alt={slide.alt}
                      width={slide.width}
                      height={slide.height}
                      className='aspect-video w-full rounded-[16px] object-cover object-center'
                    />
                  ))
                  .otherwise(() => null)}
              </div>
            ))}
          </div>
        </Container>
      </Wrapper>
    </Lightbox.Root>
  )
}

/**
 * utils
 */
const isNotEmptyHtml = (html: string) => S.isNotEmpty(S.trim(stripHtml(html)))

/**
 * translations
 */
const dictionary = {
  fr: {
    'lightbox-trigger': 'Ouvrir dans la lightbox',
  },
  en: {
    'lightbox-trigger': 'Open in lightbox',
  },
  de: {
    'lightbox-trigger': 'In Lightbox öffnen',
  },
}
