'use client'

import { ComponentHead } from '@/components/component-head'
import { Container } from '@/components/container'
import { Hn } from '@/components/hn'
import { ImagePlaceholder, MediaImage } from '@/components/image'
import { Wrapper } from '@/components/wrapper'
import { makeMediaImage } from '@/utils/image'
import React from 'react'
import type { TemplateProps } from './index'
import { AutoGrid } from '@/components/auto-grid'
import { Reference } from '@/components/reference'

/**
 * TemplateDefault
 * A simple template with a title, description, and image.
 */

export function TemplateDefault({
  props,
  variant = 'default',
}: TemplateProps & { variant?: 'default' | 'alt' }) {
  const { cards, contentLevel, ...head } = props

  return (
    <Wrapper paddingY>
      <Container>
        <ComponentHead {...head} />

        <AutoGrid min={140} shrink className='gap-x-10 gap-y-9'>
          {cards.map(card => (
            <li key={card.id}>
              {variant === 'default' ? (
                <Card card={card} level={contentLevel} />
              ) : (
                <CardAlt card={card} level={contentLevel} />
              )}
            </li>
          ))}
        </AutoGrid>
      </Container>
    </Wrapper>
  )
}

/**
 * Card
 * A card component for the carousel.
 */

type CardProps = TemplateProps['props']['cards'][number]

const Card: React.FC<{ card: CardProps; level: number }> = ({ card, level }) => {
  return (
    <article className='group/card rounded-2xl bg-white p-4'>
      <div className='flex items-center'>
        <ImagePlaceholder className='size-18'>
          {card.image && (
            <MediaImage
              image={makeMediaImage(card.image, 'thumbnail')}
              className='size-full object-contain'
            />
          )}
        </ImagePlaceholder>
      </div>

      <Reference link={card.link} className='group/card-anchor'>
        <Hn level={level} className='text-xs font-medium mt-4'>
          {card.title}
        </Hn>
      </Reference>
    </article>
  )
}

/**
 * CardAlt
 */

const CardAlt: React.FC<{ card: CardProps; level: number }> = ({ card, level }) => {
  return (
    <article className='group/card'>
      <ImagePlaceholder className='aspect-square rounded-2xl w-full backdrop-brightness-[.92]'>
        {card.image && (
          <MediaImage
            image={makeMediaImage(card.image, 'thumbnail')}
            className='size-full object-cover'
          />
        )}
      </ImagePlaceholder>

      <Reference link={card.link} className='group/card-anchor'>
        <Hn level={level} className='text-xs font-medium mt-3'>
          {card.title}
        </Hn>
      </Reference>
    </article>
  )
}
