'use client'

import { Hn } from '@/components/hn'
import { Button } from '@/components/ui/button'
import { textVariants } from '@/components/variants'
import { useTranslation } from '@/lib/localize'
import { cn } from '@/lib/utils'
import { prose } from '@compo/ui/src/variants'
import { A } from '@compo/utils'
import { PlusIcon } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { CardsProps } from './utils'

/**
 * components
 */
export type ActivitiesProps = {
  cards: CardsProps
}
export const Activities = ({ cards }: ActivitiesProps) => {
  const [current, setCurrent] = React.useState<string | null>(null)
  return (
    <div className='flex flex-col gap-4'>
      {A.map(cards, card => (
        <Activity
          key={card.id}
          card={card}
          toggle={() => setCurrent(id => (id === card.id ? null : card.id))}
          isOpen={current === card.id}
        />
      ))}
    </div>
  )
}

const Activity = ({
  card,
  toggle,
  isOpen,
}: {
  card: CardsProps[number]
  toggle: () => void
  isOpen: boolean
}) => {
  const { _ } = useTranslation(dictionary)
  return (
    <article className='rounded-[16px] h-[260px] grid grid-cols-[1fr_390px] w-full border border-moss-100'>
      <div className='relative grid'>
        {!isOpen ? (
          <div className='p-6 bg-moss-100 rounded-l-[16px]'>
            <Hn
              level={card.level}
              className={textVariants({ variant: 'cardTitle', color: 'tuna' })}
            >
              {card.title}
            </Hn>
            <p className='text-powder-100 text-[18px] font-normal leading-normal'>
              {card.subtitle}
            </p>
          </div>
        ) : (
          <div className='p-6 bg-white rounded-l-[16px]'>
            <div
              className={prose({ variant: 'card', color: 'tuna', className: '-my-2' })}
              dangerouslySetInnerHTML={{ __html: card.description }}
            />
          </div>
        )}
        <Button
          scheme='secondary'
          size='icon'
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
      <div className='overflow-hidden rounded-r-[16px]'>
        {card.image ? (
          <Image
            src={card.image.url}
            alt={card.image.alt}
            width={card.image.width}
            height={card.image.height}
            className='object-cover object-center size-full'
          />
        ) : (
          <div className='size-full bg-powder-20 text-powder-80 text-center text-sm flex items-center justify-center'>
            {_('no-image')}
          </div>
        )}
      </div>
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
