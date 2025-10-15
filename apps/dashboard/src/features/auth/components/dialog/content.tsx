import React from "react"

/**
 * AuthDialogContent
 * Content component for the dialog
 */
type AuthDialogContentProps = {
  children?: React.ReactNode
} & React.HTMLAttributes<HTMLDivElement>
export const AuthDialogContent: React.FC<AuthDialogContentProps> = ({ children, className, ...props }) => {
  return (
    <div className={cxm("px-8 md:px-16", className)} {...props}>
      {children}
    </div>
  )
}
