import { Slot } from '@radix-ui/react-slot'
import { cva, cx, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/lib/utils'
import { disabledVariants, focusVariants, invalidVariants } from '../variants'

const buttonVariants = cva(
  [
    "inline-flex items-center cursor-pointer justify-center gap-2 whitespace-nowrap font-medium [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0",
    disabledVariants,
    focusVariants,
    invalidVariants,
  ],
  {
    variants: {
      scheme: {
        default: 'bg-glacier-100 hover:bg-glacier-60 text-tuna',
        secondary: 'bg-white hover:bg-linen text-tuna',
        golden: 'bg-golden-100 hover:bg-golden-60 text-tuna',
        moss: 'bg-moss-100 hover:bg-moss-60 text-tuna',
        finch: 'bg-finch-100 hover:bg-finch-60 text-tuna',
        outline: 'bg-transparent border border-almond hover:border-tan text-tuna',
        ghost: 'bg-transparent border border-transparent hover:border-tan text-tuna',
        link: 'text-primary underline-offset-4 hover:underline',
        filter:
          'flex px-6 py-4 justify-between items-center flex-shrink-0 rounded-lg border border-tan bg-pampas text-tuna text-xs font-medium leading-normal hover:bg-tan/5 hover:border-tan',
      },
      size: {
        none: '',
        sm: 'min-h-7 min-w-7 px-4 icon:size-[18px] text-xs leading-[16px] rounded-[6px]',
        default: 'min-h-12 min-w-12 px-5 icon:size-[20px] text-xs leading-[18px] rounded-[8px]',
      },
      variant: {
        default: '',
        icon: 'w-min !px-0 !py-0 shrink-0 h-min',
      },
    },
    compoundVariants: [
      {
        variant: 'icon',
        size: 'default',
        class: '',
      },
    ],
    defaultVariants: {
      scheme: 'default',
      size: 'default',
      variant: 'default',
    },
  }
)

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<'button'> &
    VariantProps<typeof buttonVariants> & {
      asChild?: boolean
    }
>(({ className, scheme, variant, size, type = 'button', asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      ref={ref}
      data-slot='button'
      className={cn(buttonVariants({ scheme, variant, size, className }))}
      type={type}
      {...props}
    />
  )
})
Button.displayName = 'Button'

export { Button, buttonVariants }
