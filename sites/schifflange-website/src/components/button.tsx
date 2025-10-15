import { MarkRequired } from '@compo/utils'
import { MadeLinkProps } from '@/utils/links'
import React from 'react'
import { Reference } from '@/components/reference'
import { cva, cx, VariantProps } from 'class-variance-authority'

/**
 * Button
 */

type LinkButtonProps =
  | (MarkRequired<React.ComponentProps<'button'>, 'type'> & { link?: undefined })
  | ({ link: MadeLinkProps; type?: 'link' } & Omit<React.ComponentProps<'a'>, 'type'>)

export const Button = (props: LinkButtonProps & ButtonVariants) => {
  const { scheme, icon, sized, className, ...attributes } = props
  const element = attributes as LinkButtonProps

  const classNames = button({ scheme, icon, sized, className })

  if (element.link) {
    return <Reference {...element} className={classNames} />
  }

  return <button {...element} className={classNames} />
}

/**1
 * Variants
 */

export type ButtonVariants = VariantProps<typeof button>

const button = cva(
  'flex gap-x-2 justify-center truncate transition-colors duration-100 items-center font-medium text-default rounded-[8px] border-(length:--thin) border-transparent cursor-pointer',
  {
    variants: {
      scheme: {
        variable: cx('bg-(--theme-100) busy:bg-(--theme-60)'),
        'variable-outline': cx(
          '!border-(--theme-readable)/17 hover:!border-(--theme-readable)/30 !text-(--theme-readable)'
        ),
        golden: cx('bg-golden-100 busy:bg-golden-60'),
        moss: cx('bg-moss-100 busy:bg-moss-60'),
        glacier: cx('bg-glacier-100 busy:bg-glacier-60'),
        white: cx('bg-white busy:bg-linen'),
        outline: cx('!border-almond hover:!border-tan'),
      },
      sized: {
        sm: cx('px-3 min-h-10 min-w-10 text-xs icon:size-4'),
        default: cx('px-5 min-h-12 min-w-12 text-xs icon:size-5'),
      },
      icon: {
        true: cx('!px-0'),
        false: cx(''),
      },
    },
    defaultVariants: {
      scheme: 'golden',
      sized: 'default',
      icon: false,
    },
  }
)
