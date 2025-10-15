import { cn, cva, type VariantProps } from '@compo/utils'
import React from 'react'

/**
 * Container
 */

export type ContainerProps = React.ComponentPropsWithoutRef<'div'> &
  VariantProps<typeof containerVariants>
export const Container = ({
  className,
  children,
  size,
  padding,
  twoCols,
  ...props
}: ContainerProps) => {
  return (
    <div className={cn(containerVariants({ size, padding, twoCols }), className)} {...props}>
      {children}
    </div>
  )
}

/**
 * Container
 */
export const containerVariants = cva('w-full', {
  variants: {
    size: {
      default: 'max-w-6xl group-data-[page=projects]/page:max-w-7xl',
      md: 'max-w-3xl',
      wide: 'max-w-[92rem]',
    },
    padding: {
      stretch: 'px-4 @xl/wrapper:px-12 @5xl/wrapper:px-[104px]',
      'stretch-left': 'pl-4 @xl/wrapper:pl-12 @5xl/wrapper:pl-[104px]',
      default: 'px-6 sm:px-8 lg:px-10',
      none: '',
    },
    twoCols: {
      true: 'flex flex-col gap-8 @3xl/wrapper:grid @3xl/wrapper:grid-cols-2 @3xl/wrapper:items-center @4xl/wrapper:gap-x-16',
      false: '',
    },
  },
  defaultVariants: {
    size: 'default',
    padding: 'default',
    twoCols: false,
  },
})
