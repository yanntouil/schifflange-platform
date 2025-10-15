'use client'

import IconExternal from '@/assets/external.svg'
import IconPlayback from '@/assets/playback.svg'
import { ComponentHead } from '@/components/component-head'
import { Container } from '@/components/container'
import { Dialog, DialogHead } from '@/components/dialog'
import { Hn } from '@/components/hn'
import { ImagePlaceholder, MediaImage } from '@/components/image'
import { textVariants } from '@/components/variants'
import { Video } from '@/components/video'
import { Wrapper } from '@/components/wrapper'
import { makeMediaImage } from '@/utils/image'
import { prose } from '@compo/ui/src/variants'
import { A } from '@compo/utils'
import React from 'react'
import type { TemplateProps } from './index'
import { AutoGrid } from '@/components/auto-grid'

/**
 * Template 1
 * A simple template with a title, description, and image.
 */

export function Template1({ props }: TemplateProps) {
  const { cards, contentLevel, ...head } = props

  return (
    <Wrapper paddingY>
      <Container>
        <ComponentHead {...head} />

        <AutoGrid min={250} shrink className='gap-x-10 gap-y-9'>
          {A.map(cards, card => (
            <Card key={card.id} card={card} level={contentLevel} />
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
  // const { _ } = useTranslation(dictionary)

  return (
    <article className='group'>
      <Dialog
        className='max-w-[1024px] rounded-3xl overflow-hidden !p-0'
        trigger={
          <button className='group/card relative rounded-2xl aspect-video w-full cursor-pointer'>
            <ImagePlaceholder className='w-full'>
              {card.cover && (
                <MediaImage
                  image={makeMediaImage(card.cover, 'thumbnail')}
                  className='size-full object-cover rounded-[16px]'
                />
              )}
            </ImagePlaceholder>

            <div className='absolute duration-100 bottom-[12px] right-[12px] size-12 icons:size-7 flex items-center justify-center rounded-full bg-transparent text-white group-busy/card:bg-black/40'>
              <IconPlayback className='absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 opacity-100 group-busy/card:opacity-0' />
              <IconExternal className='absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 opacity-0 group-busy/card:opacity-100' />
            </div>
          </button>
        }
      >
        <div className='bg-pampas'>
          {card.video && <Video url={card.video} controls={false} className='rounded-t-[8px]' />}
        </div>

        <div className='p-6'>
          <DialogHead title={card.title} description={card.description} />
        </div>
      </Dialog>

      <div className='mt-4 space-y-2'>
        <Hn level={level} className={textVariants({ variant: 'cardTitleSmall' })}>
          {card.title}
        </Hn>
        <div className={prose({})} dangerouslySetInnerHTML={{ __html: card.description }} />
      </div>
    </article>
  )
}

/**
 * translations
 */

const dictionary = {
  fr: {
    imagePlaceholder: 'Image de couverture',
  },
  en: {
    imagePlaceholder: 'Cover image',
  },
  de: {
    imagePlaceholder: 'Coverbild',
  },
}
