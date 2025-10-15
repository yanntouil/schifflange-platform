import { cva } from '@compo/utils'

/**
 * Text variants
 */

export const textVariants = cva(['text-inherit'], {
  variants: {
    variant: {
      default: '',
      title: 'text-3xl/[1.3] font-semibold my-0 py-2',
      subtitle: 'text-lg/[1.2] font-medium my-0 py-2',
      cardTitle: 'text-xl/[1.2] font-semibold my-0 py-2',
      cardTitleSmall: 'text-base/[1.2] font-semibold my-0 py-2',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

/**
 * disabled variants
 */

export const disabledVariants = cva([], {
  variants: {
    variant: {
      default: 'disabled:pointer-events-none disabled:opacity-50',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

/**
 * invalid variants
 */

export const invalidVariants = cva([], {
  variants: {
    variant: {
      default:
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

/**
 * focus variants
 */

export const focusVariants = cva([], {
  variants: {
    variant: {
      visible:
        'transition-all outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
    },
  },
  defaultVariants: {
    variant: 'visible',
  },
})
