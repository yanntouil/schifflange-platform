'use client'

import { CardContent } from '@/cms/features/cards/components/card-content'
import { Container } from '@/components/container'
import { ImagePlaceholder, MediaImage } from '@/components/image'
import { Wrapper } from '@/components/wrapper'
import { makeMediaImage } from '@/utils/image'
import { S, stripHtml } from '@compo/utils'
import React from 'react'
import type { TemplateProps } from './index'
import Decoration1 from '@/assets/decoration/decoration-1.svg'
import Decoration2 from '@/assets/decoration/decoration-2.svg'
import Decoration3 from '@/assets/decoration/decoration-3.svg'
import { ComponentHead } from '@/components/component-head'
import { CardGrid } from '@/cms/features/cards/components/card-grid'

const decorations = [Decoration3, Decoration2, Decoration1]

/**
 * Template 4
 * A simple template with a title, description, and image.
 */

export function Template4({ props }: TemplateProps) {
  const { cards, contentLevel, ...head } = props

  return (
    <Wrapper paddingY>
      <Container>
        <ComponentHead {...head} />

        <CardGrid>
          {cards.map((card, i) => (
            <li key={card.id}>
              <Card card={card} index={i} level={contentLevel} />
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
const Card: React.FC<{ card: CardProps; index: number; level: number }> = ({
  card,
  index,
  level,
}) => {
  const image = makeMediaImage(card.image, 'preview')
  const Decoration = decorations[index % decorations.length]

  return (
    <article className='group group/card h-full flex flex-col gap-y-3'>
      <div className='relative'>
        <ImagePlaceholder
          placeholder
          className='aspect-square relative backdrop-brightness-[.92] w-full'
        >
          {image ? (
            <>
              <MediaImage image={image} />
              <Decoration className='absolute size-full inset-0' />
            </>
          ) : null}
        </ImagePlaceholder>
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
