import { cn } from '@compo/utils'
import { cx } from 'class-variance-authority'
import React from 'react'

export type WrapperProps = React.ComponentPropsWithoutRef<'div'> & {
  paddingY?: boolean
}
export const Wrapper = ({ className, children, paddingY = false, ...props }: WrapperProps) => {
  return (
    <div
      className={cn(
        'lg:pl-(--layout-sidebar-width) relative',
        paddingY && 'py-12 @[640px]/preview:py-16',
        className
      )}
      {...props}
    >
      <div className='flex flex-col items-center justify-center @container/wrapper'>{children}</div>
    </div>
  )
}

export const WrapperConcealer = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div {...props} className={cx('relative', className)}>
      <div
        aria-hidden='true'
        className='hidden lg:flex absolute w-[calc(var(--layout-sidebar-width)+2rem)] h-full bg-[linear-gradient(90deg,var(--concealer-color,transparent)_0%,transparent_100%),linear-gradient(90deg,var(--concealer-color,transparent)_0%,transparent_100%),linear-gradient(90deg,var(--concealer-color,transparent)_0%,transparent_100%)] z-20'
      ></div>

      {children}
    </div>
  )
}
