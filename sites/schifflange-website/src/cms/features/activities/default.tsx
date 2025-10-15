'use client'

import { ComponentHead } from '@/components/component-head'
import { Container } from '@/components/container'
import { Hn } from '@/components/hn'
import { textVariants } from '@/components/variants'
import { Wrapper } from '@/components/wrapper'
import { useTranslation } from '@/lib/localize'
import { prose } from '@compo/ui/src/variants'
import { cn } from '@compo/utils'
import { PlusIcon } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import type { TemplateProps } from './index'
import { cx } from 'class-variance-authority'
import { ImagePlaceholder, MediaImage } from '@/components/image'
import { makeMediaImage } from '@/utils/image'
import { Button } from '@/components/button'

/**
 * TemplateDefault
 * A simple template with a title, description, and image.
 */

export function TemplateDefault({
  props,
  theme,
}: TemplateProps & { theme: 'theme-finch' | 'theme-moss' | 'theme-glacier' }) {
  const { cards, contentLevel, ...head } = props
  const [current, setCurrent] = React.useState<string | null>(null)

  return (
    <Wrapper paddingY>
      <Container>
        <ComponentHead {...head} />

        <ul className={cx('flex flex-col gap-4', theme)}>
          {cards.map(card => (
            <li key={card.id}>
              <Activity
                card={card}
                toggle={() => setCurrent(id => (id === card.id ? null : card.id))}
                isOpen={current === card.id}
              />
            </li>
          ))}
        </ul>
      </Container>
    </Wrapper>
  )
}

/**
 * Activity
 * A activity component
 */

type ActivityProps = TemplateProps['props']['cards'][number]
const Activity: React.FC<{ card: ActivityProps; toggle: () => void; isOpen: boolean }> = ({
  card,
  toggle,
  isOpen,
}) => {
  const { _ } = useTranslation(dictionary)

  return (
    <article className='rounded-2xl @4xl/wrapper:h-[260px] flex flex-col @4xl/wrapper:flex-row overflow-hidden min-h-0 items-stretch w-full border border-(--theme-100) text-(--theme-readable) bg-(--theme-100)'>
      <div className='relative grid h-full flex-1 @4xl/wrapper:pb-0'>
        {!isOpen ? (
          <div className='p-6 rounded-l-2xl my-trim h-full pb-17'>
            <Hn level={card.level} className='text-xl/[1.4] font-semibold my-2.5'>
              {card.title}
            </Hn>

            <p>{card.subtitle}</p>
          </div>
        ) : (
          <div className='p-6 bg-white h-full overflow-y-scroll pb-17 text-default'>
            <div className={prose({})} dangerouslySetInnerHTML={{ __html: card.description }} />
          </div>
        )}

        <Button
          type='button'
          scheme='white'
          icon
          className='absolute bottom-2 right-2'
          onClick={toggle}
        >
          <PlusIcon
            aria-hidden
            className={cn(isOpen ? 'rotate-45' : '', 'transition-transform duration-200')}
          />
          <span className='sr-only'>{_(isOpen ? 'close' : 'open')}</span>
        </Button>
      </div>

      <ImagePlaceholder
        placeholder
        className='overflow-hidden @4xl/wrapper:rounded-r-[16px] backdrop-brightness-[.94] aspect-video @4xl/wrapper:w-[400px] @4xl/wrapper:aspect-auto'
      >
        <MediaImage
          image={makeMediaImage(card.image, 'preview')}
          className='object-cover object-center size-full'
        />
      </ImagePlaceholder>
    </article>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    'no-image': 'No image available',
    open: 'Open description',
    close: 'Close description',
  },
  fr: {
    'no-image': 'Aucune image disponible',
    open: 'Ouvrir la description',
    close: 'Fermer la description',
  },
  de: {
    'no-image': 'Keine Bild verfügbar',
    open: 'Beschreibung öffnen',
    close: 'Beschreibung schließen',
  },
}
