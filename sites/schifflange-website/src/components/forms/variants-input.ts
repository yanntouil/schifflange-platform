import { cva } from 'class-variance-authority'
import { cx } from 'class-variance-authority'

export const inputVariants = cva(
  cx(
    'flex w-full rounded-[22px] py-3 px-5 placeholder:text-default/50 resize-none',
    'data-error:outline-(length:--thin) data-error:outline-tan data-error:text-tan '
  ),
  {
    variants: {
      variant: {
        default: cx('bg-pampas'),
        ghost: cx('bg-transparent'),
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)
