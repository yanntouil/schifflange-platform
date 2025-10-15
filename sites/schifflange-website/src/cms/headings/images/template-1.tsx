'use client'

import { Carousel, useCarousel } from '@/components/carousel'
import { Container } from '@/components/container'
import { Hn } from '@/components/hn'
import { Lightbox } from '@/components/lightbox'
import { DecorationFinch2, DecorationGlacier2, DecorationMoss2 } from '@/components/svgs/decoration'
import { Button } from '@/components/ui/button'
import { textVariants } from '@/components/variants'
import { Wrapper } from '@/components/wrapper'
import { useTranslation } from '@/lib/localize'
import { prose } from '@compo/ui/src/variants'
import { A, match, S, stripHtml } from '@compo/utils'
import Image from 'next/image'
import type { TemplateProps } from './index'

/**
 * Template 1
 * A simple template with a title, description, and video.
 * @max todo
 */
export function Template1({ props }: TemplateProps) {
  const { _ } = useTranslation(dictionary)

  const { title, level, subtitle, description, slides } = props
  const hasDescription = S.isNotEmpty(S.trim(stripHtml(description)))
  return (
    <Lightbox.Root>
      <Wrapper paddingY>
        <Container>
          <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
            <div className='flex flex-col justify-start'>
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
            <div>
              <Carousel.Root>
                <Carousel.Content>
                  {A.map(slides, slide => (
                    <Carousel.Item
                      className='group/image relative flex aspect-video max-h-full max-w-full items-center justify-center'
                      key={slide.id}
                    >
                      {/* <Lightbox.Trigger
                        data={slide}
                        className={cn(
                          buttonVariants({ scheme: "secondary", variant: "icon" }),
                          "absolute right-2 top-2 group-focus-within/image:opacity-100 group-hover/image:opacity-100 sm:opacity-0 size-8 [&>svg]:size-4 transition-all"
                        )}
                      >
                        <Expand aria-hidden />
                        <span className='sr-only'>{_("lightbox-trigger", { name: slide?.alt ?? slide.id })}</span>
                      </Lightbox.Trigger> */}
                      {match(slide)
                        .with({ type: 'image' }, slide => (
                          <Image
                            src={slide.previewUrl}
                            alt={slide.alt}
                            width={slide.width}
                            height={slide.height}
                            className='size-full rounded-t-[16px] object-cover object-center'
                          />
                        ))
                        .otherwise(() => null)}
                    </Carousel.Item>
                  ))}
                </Carousel.Content>
                <Control />
              </Carousel.Root>
              <div className='flex'>
                <DecorationFinch2 className='w-1/3 aspect-square' aria-hidden />
                <DecorationMoss2 className='w-1/3 aspect-square' aria-hidden />
                <DecorationGlacier2 className='w-1/3 aspect-square' aria-hidden />
              </div>
            </div>
          </div>
        </Container>
      </Wrapper>
    </Lightbox.Root>
  )
}

/**
 * Control
 * A control component for the carousel.
 */
const Control: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { canScrollPrev, canScrollNext, scrollPrev, scrollNext } = useCarousel()
  // if (!canScrollNext && !canScrollPrev) return null
  return (
    <div
      className='absolute bottom-[11px] right-[11px] grid grid-cols-2 gap-2'
      onClick={e => e.stopPropagation()}
    >
      <Button
        scheme={canScrollPrev ? 'default' : 'secondary'}
        variant='icon'
        disabled={!canScrollPrev}
        onClick={scrollPrev}
      >
        <span className='sr-only'>{_('lightbox-trigger', { name: 'previous' })}</span>
        <ArrowLeftSvg aria-hidden className='size-5' />
      </Button>
      <Button
        scheme={canScrollNext ? 'default' : 'secondary'}
        variant='icon'
        disabled={!canScrollNext}
        onClick={scrollNext}
      >
        <span className='sr-only'>{_('lightbox-trigger', { name: 'next' })}</span>
        <ArrowRightSvg aria-hidden className='size-5' />
      </Button>
    </div>
  )
}

/**
 * assets
 */
const ArrowLeftSvg = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg viewBox='0 0 21 21' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
      <path
        d='M10.5 16.3334L4.66669 10.5001M4.66669 10.5001L10.5 4.66675M4.66669 10.5001H16.3334'
        stroke='#35374F'
        strokeWidth='1.25'
        strokeLinecap='square'
        strokeLinejoin='round'
      />
    </svg>
  )
}
const ArrowRightSvg = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg viewBox='0 0 21 21' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
      <path
        d='M4.66669 10.5001H16.3334M16.3334 10.5001L10.5 4.66675M16.3334 10.5001L10.5 16.3334'
        stroke='#1D1D1B'
        strokeWidth='1.25'
        strokeLinecap='square'
        strokeLinejoin='round'
      />
    </svg>
  )
}

/**
 * translations
 */
const dictionary = {
  fr: {
    'lightbox-trigger': 'Ouvrir dans la lightbox',
    'lightbox-trigger-previous': 'Précédent',
    'lightbox-trigger-next': 'Suivant',
  },
  en: {
    'lightbox-trigger': 'Open in lightbox',
    'lightbox-trigger-previous': 'Previous',
    'lightbox-trigger-next': 'Next',
  },
  de: {
    'lightbox-trigger': 'In Lightbox öffnen',
    'lightbox-trigger-previous': 'Vorheriges',
    'lightbox-trigger-next': 'Nächstes',
  },
}
