'use client'

import IconMore from '@/assets/more.svg'
import IconPlus from '@/assets/plus.svg'
import { Button } from '@/components/button'
import { ComponentHead } from '@/components/component-head'
import { Container } from '@/components/container'
import { Hn } from '@/components/hn'
import { Wrapper } from '@/components/wrapper'
import { useTranslation } from '@/lib/localize'
import { prose } from '@compo/ui/src/variants'
import { A } from '@compo/utils'
import * as Primitive from '@radix-ui/react-accordion'
import React from 'react'
import type { TemplateProps } from './index'

/**
 * Template Default
 * A simple template with a title, description, and image.
 */

export function TemplateDefault({ props, anchor }: TemplateProps & { anchor?: string }) {
  const { _ } = useTranslation(dictionary)
  const { cards, contentLevel, ...head } = props
  const [limit, setLimit] = React.useState(props.limit)
  const result = React.useMemo(() => A.take(cards, limit), [cards, limit])
  const hasMore = cards.length > limit

  return (
    <Wrapper paddingY>
      <Container>
        {anchor ? <span id={anchor} aria-hidden='true' className='flex'></span> : null}

        <ComponentHead {...head} />

        <div className='flex flex-col gap-8'>
          <ul className='flex flex-col gap-y-6'>
            {result.map(card => (
              <li key={card.id}>
                <FAQSection card={card} level={contentLevel} />
              </li>
            ))}
          </ul>

          {hasMore && (
            <div className='flex justify-center'>
              <Button
                type='button'
                scheme='glacier'
                onClick={() => setLimit(limit => limit + props.limit)}
              >
                {_('more')}
                <IconMore aria-hidden className='size-[18px] shrink-0' />
              </Button>
            </div>
          )}
        </div>
      </Container>
    </Wrapper>
  )
}

/**
 * FAQSection
 */

type CardProps = TemplateProps['props']['cards'][number]
const FAQSection = (props: { card: CardProps; level: number }) => {
  const { card, level } = props

  return (
    <article className='grid grid-cols-1 @4xl/wrapper:grid-cols-[342px_1fr] gap-8 p-6 @4xl/wrapper:p-8 bg-white text-[#1D1D1B] rounded-3xl'>
      <div className='my-trim'>
        <Hn level={level} className='text-xl/[1.4] font-semibold my-'>
          {card.title}
        </Hn>

        <div
          className={prose({ theme: 'glacier', className: 'empty:hidden' })}
          dangerouslySetInnerHTML={{ __html: card.description }}
        />
      </div>

      <Primitive.Root type='single' collapsible asChild>
        <ul className='flex flex-col gap-4 items-stretch'>
          {A.map(card.faq, faq => (
            <li key={faq.id}>
              <FAQItem item={faq} />
            </li>
          ))}
        </ul>
      </Primitive.Root>
    </article>
  )
}

/**
 * FAQItem
 */

type ItemProps = CardProps['faq'][number]

const FAQItem = (props: { item: ItemProps }) => {
  const { item } = props

  return (
    <Primitive.Item
      value={item.id}
      className='bg-glacier-40 rounded-xl flex flex-col items-stretch'
    >
      <Primitive.Trigger className='group rounded-xl px-4 py-4 flex items-center justify-between cursor-pointer'>
        <span className='text-[18px] leading-normal font-medium px-1.5'>{item.title}</span>
        <span className='flex items-center justify-center gap-2 bg-white rounded-[8px] size-[40px]'>
          <IconPlus
            aria-hidden
            className='size-6 shrink-0 group-data-[state=open]:rotate-45 rotate-0 transition-transform duration-200'
          />
        </span>
      </Primitive.Trigger>

      <Primitive.Content className='overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down'>
        <div className='flex flex-col px-5 pb-2.5'>
          <div className='max-w-lg'>
            <div
              className={prose({ theme: 'glacier' })}
              dangerouslySetInnerHTML={{ __html: item.description }}
            />
          </div>
        </div>
      </Primitive.Content>
    </Primitive.Item>
  )
}

/**
 * translations
 */
const dictionary = {
  fr: {
    more: 'Voir plus',
  },
  en: {
    more: 'See more',
  },
  de: {
    more: 'Mehr anzeigen',
  },
}
