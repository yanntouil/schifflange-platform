import { cn } from '@compo/utils'
import { CheckIcon } from '@phosphor-icons/react/dist/ssr'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { cva, cx, VariantProps } from 'class-variance-authority'
import * as React from 'react'

/**
 * Checkbox
 */
export type CheckboxProps = React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> &
  VariantProps<typeof checkboxVariants>

export const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ size, variant, className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    onCheckedChange={e => props.onCheckedChange?.(e)}
    className={cn(checkboxVariants({ size, variant }), className)}
    {...props}
  >
    <CheckboxPrimitive.Indicator className={cx('flex items-center justify-center text-current')}>
      <CheckIcon />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))

Checkbox.displayName = CheckboxPrimitive.Root.displayName

/**
 * checkboxVariants
 */
export const checkboxVariants = cva(['peer shrink-0 border'], {
  variants: {
    variant: {
      default:
        'border-powder rounded-sm data-[state=checked]:bg-golden-100 data-[state=checked]:border-golden-100 data-[state=checked]:text-default',
    },
    size: {
      default: 'size-5 icon:size-3',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
})
