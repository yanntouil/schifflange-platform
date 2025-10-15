'use client'

import IconArrow from '@/assets/arrow.svg'
import { CardContent } from '@/cms/features/cards/components/card-content'
import { CardImage } from '@/cms/features/cards/components/card-image'
import { Button } from '@/components/button'
import { ComponentHead } from '@/components/component-head'
import { Container } from '@/components/container'
import { Wrapper } from '@/components/wrapper'
import { makeMediaImage } from '@/utils/image'
import { A } from '@compo/utils'
import React from 'react'
import { CardGrid } from './components/card-grid'
import type { TemplateProps } from './index'

/**
 * Template 2
 * A simple template with a title, description, and image.
 */

export function Template2({ props }: TemplateProps) {
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
 */

type CardProps = TemplateProps['props']['cards'][number]
const Card: React.FC<{ card: CardProps; level: number }> = ({ card, level }) => {
  return (
    <article className='group group/card flex flex-col gap-y-3 h-full'>
      <CardImage image={makeMediaImage(card.image, 'preview')} />

      <CardContent
        card={card}
        placeholderTitle
        level={level}
        style={{ '--description-clamp': 4 } as React.CSSProperties}
      />
    </article>
  )
}
