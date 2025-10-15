'use client'

import TagBackground from '@/assets/tag-background.svg'
import { CardContent } from '@/cms/features/cards/components/card-content'
import { CardImage } from '@/cms/features/cards/components/card-image'
import { ComponentHead } from '@/components/component-head'
import { Container } from '@/components/container'
import { Wrapper } from '@/components/wrapper'
import { makeMediaImage } from '@/utils/image'
import { A, S, stripHtml } from '@compo/utils'
import React from 'react'
import type { TemplateProps } from './index'
import { CardGrid } from '@/cms/features/cards/components/card-grid'

/**
 * Template 3
 * A simple template with a title, description, and image.
 */

export function Template3({ props }: TemplateProps) {
  const { cards, contentLevel, ...head } = props

  return (
    <Wrapper paddingY>
      <Container>
        <ComponentHead {...head} />

        <CardGrid>
          {A.map(cards, card => (
            <li key={card.id}>
              <Card card={card} level={contentLevel} />
            </li>
          ))}
        </CardGrid>
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
    <article className='group group/card h-full flex flex-col gap-y-3'>
      <div className='relative'>
        <CardImage image={makeMediaImage(card.image, 'preview')} placeholder />

        {/* Tag */}
        {card.subtitle && (
          <div className='absolute -top-4 -right-2'>
            <div className='max-w-52 relative flex justify-center items-center text-sm text-powder-100 pb-2 pt-3 px-3'>
              <TagBackground
                preserveAspectRatio='none'
                className='absolute inset-0 w-full h-full text-golden-100'
              />
              <span className='relative truncate'>{card.subtitle}</span>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <CardContent card={card} placeholderTitle level={level} />
    </article>
  )
}

/**
 * utils
 */
const isNotEmptyHtml = (html: string) => S.isNotEmpty(S.trim(stripHtml(html)))
