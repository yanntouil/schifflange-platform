import { Reference } from '@/components/reference'
import { Hn } from '@/components/hn'
import { prose } from '@compo/ui/src/variants'
import { cx } from 'class-variance-authority'
import React from 'react'
import type { TemplateProps } from '../index'
import { Placeholder } from '@/components/placeholder'
import { Button, ButtonVariants } from '@/components/button'
import IconArrow from '@/assets/arrow.svg'

/**
 * Card content
 */

type CardProps = TemplateProps['props']['cards'][number]

export const CardContent = (
  props: React.ComponentProps<'div'> & {
    card: Partial<CardProps>
    placeholderTitle?: boolean
    level: number
    linkScheme?: ButtonVariants['scheme']
  }
) => {
  const { card, placeholderTitle, level, linkScheme = 'outline', ...divProps } = props

  return (
    <div {...divProps} className={cx('my-trim flex flex-col gap-y-3 flex-1', divProps.className)}>
      <div>
        <Reference link={card.link} className='group/card-anchor'>
          <Hn level={level} className='empty:hidden my-2 text-lg/[1.5] font-semibold line-clamp-3'>
            {card.title || (placeholderTitle ? <Placeholder>No title</Placeholder> : null)}
          </Hn>
        </Reference>

        <div
          dangerouslySetInnerHTML={{ __html: card.description || '' }}
          className={prose({
            className: 'my-2 line-clamp-(--description-clamp,6) empty:hidden',
          })}
        />
      </div>

      {card.link && (
        <div className='mt-auto empty:hidden'>
          <Button link={card.link} scheme={linkScheme} sized='sm' className='w-fit'>
            <span>{card.link.text}</span>
            <IconArrow
              aria-hidden
              className='group-busy/link:-translate-y-0.5 group-hover/link:translate-x-0.5 transition-all duration-100'
            />
          </Button>
        </div>
      )}
    </div>
  )
}
