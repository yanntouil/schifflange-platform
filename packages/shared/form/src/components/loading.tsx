import { Icon } from "@compo/ui"
import { cx } from "@compo/utils"
import React from "react"

/**
 * FormAssertive
 */
export type FormLoadingProps = React.ComponentProps<"div"> & {
  loading: boolean
  label?: React.ReactNode
}
export const FormLoading: React.FC<FormLoadingProps> = ({ className, loading, label, ...props }) => {
  if (!loading) return null
  return (
    <div
      className={cx(
        "bg-card/50 absolute inset-0 flex flex-col items-center justify-center gap-1 backdrop-blur-sm",
        className
      )}
      {...props}
    >
      <Icon.Loader variant='dots' className='size-10' aria-hidden />
      <span className='animate-pulse text-sm font-semibold'>{label}</span>
    </div>
  )
}
