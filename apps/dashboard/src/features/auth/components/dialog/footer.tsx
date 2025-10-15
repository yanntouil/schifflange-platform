import React from "react"

/**
 * AuthDialogFooter
 * Footer component for the dialog with actions
 */
type AuthDialogFooterProps = {
  sticky?: boolean
} & React.HTMLAttributes<HTMLDivElement>
export const AuthDialogFooter: React.FC<AuthDialogFooterProps> = ({ children, sticky = false, className, ...props }) => {
  return (
    <footer
      className={cxm(
        "flex flex-row-reverse items-center justify-start gap-2 px-8 py-4 md:px-16",
        sticky && "supports-[backdrop-filter]:bg-background/80 sticky bottom-0 z-10 backdrop-blur-xs",
        className
      )}
      {...props}
    >
      {children}
    </footer>
  )
}
