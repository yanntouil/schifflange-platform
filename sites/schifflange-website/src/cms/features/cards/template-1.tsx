'use client'

import { CardContent } from '@/cms/features/cards/components/card-content'
import { Carousel, useCarousel } from '@/components/carousel'
import { ComponentHead } from '@/components/component-head'
import { Container } from '@/components/container'
import { MediaImage } from '@/components/image'
import { Wrapper, WrapperConcealer } from '@/components/wrapper'
import { makeMediaImage } from '@/utils/image'
import { A, cn, match } from '@compo/utils'
import React from 'react'
import type { TemplateProps } from './index'
import IconArrowLeft from '@/assets/arrow-left.svg'
import IconArrowRight from '@/assets/arrow-right.svg'

/**
 * Template 1
 * A simple template with a title, description, and image.
 */

export function Template1({ props }: TemplateProps) {
  const { cards, contentLevel, ...head } = props

  return (
    <WrapperConcealer style={{ '--concealer-color': 'var(--color-pampas)' } as React.CSSProperties}>
      <Wrapper paddingY>
        <Container>
          <Carousel.Root
            className={cn(
              'grid gap-8 min-w-0 grid-cols-1',
              head.displayHeading && 'xl:grid-cols-[320px_1fr]'
            )}
          >
            <ComponentHead inline {...head}>
              <Control slideCount={cards.length} />
            </ComponentHead>

            <Carousel.Content
              containerClassName='xl:overflow-hidden rounded-2xl'
              className='select-none -mr-5'
              overflow='visible'
            >
              {A.map(cards, card => (
                <Carousel.Item
                  key={card.id}
                  className='grid pr-6 w-[310px] max-w-[310px] h-[400px]'
                >
                  <Card card={card} level={contentLevel} />
                </Carousel.Item>
              ))}
            </Carousel.Content>
          </Carousel.Root>
        </Container>
      </Wrapper>
    </WrapperConcealer>
  )
}

/**
 * Card
 * A card component for the carousel.
 */

type CardProps = TemplateProps['props']['cards'][number]
const Card: React.FC<{ card: CardProps; level: number }> = ({ card, level }) => {
  return (
    <article
      className={cn(
        match(card.type)
          .with('gold', () => 'theme-golden')
          .with('finch', () => 'theme-finch')
          .with('glacier', () => 'theme-glacier')
          .with('moss', () => 'theme-moss')
          .otherwise(() => ''),
        'relative flex flex-col rounded-2xl bg-(--theme-100) text-(--theme-readable)'
      )}
    >
      {match(card.type)
        .with('white', () => (
          <>
            {card.image && (
              <div className='absolute inset-0 size-full rounded-[16px] bg-white overflow-hidden'>
                <MediaImage
                  image={makeMediaImage(card.image, 'preview')}
                  className='size-full object-cover object-center'
                />
              </div>
            )}

            <div className='bg-white relative rounded-[8px] p-4 m-4 mt-auto'>
              <CardContent card={card} level={level} linkScheme='outline' />
            </div>
          </>
        ))
        .otherwise(() => (
          <div className='p-6 mt-auto'>
            <CardContent card={card} level={level} linkScheme='variable-outline' />
          </div>
        ))}
    </article>
  )
}

/**
 * Control
 * A control component for the carousel.
 */
const Control: React.FC<{ slideCount: number }> = () => {
  const { canScrollPrev, canScrollNext, scrollPrev, scrollNext } = useCarousel()
  if (!canScrollNext && !canScrollPrev) return null
  return (
    <div className='flex items-center gap-2' onClick={e => e.stopPropagation()}>
      <button
        type='button'
        className='size-[47px] rounded-[8px] disabled:bg-white bg-[#98C5D5] flex items-center justify-center cursor-pointer icon:size-5'
        disabled={!canScrollPrev}
        onClick={scrollPrev}
      >
        <IconArrowLeft aria-hidden />
      </button>

      <button
        type='button'
        className='size-[47px] rounded-[8px] disabled:bg-white bg-[#98C5D5] flex items-center justify-center cursor-pointer icon:size-5'
        disabled={!canScrollNext}
        onClick={scrollNext}
      >
        <IconArrowRight aria-hidden />
      </button>
    </div>
  )
}
