import { Ui } from "@compo/ui"
import { isNotEmptyString } from "@compo/utils"
import React from "react"

/**
 * AuthDialogHeader
 * Header component for the dialog with title and description
 */
type AuthDialogHeaderProps = {
  title: string
  description?: string
  sticky?: boolean
  classNames?: {
    header?: string
    title?: string
    description?: string
  }
} & React.HTMLAttributes<HTMLDivElement>
export const AuthDialogHeader: React.FC<AuthDialogHeaderProps> = ({
  title,
  description,
  sticky = false,
  className,
  classNames,
  ...props
}) => {
  return (
    <Ui.Dialog.Header
      className={cxm(
        "px-8 py-6 pb-3 md:px-16",
        sticky && "supports-[backdrop-filter]:bg-background/80 sticky top-0 z-10 backdrop-blur-xs",
        className,
        classNames?.header
      )}
      {...props}
    >
      <Ui.Dialog.Title className={classNames?.title}>{title}</Ui.Dialog.Title>
      {isNotEmptyString(description) && <Ui.Dialog.Description className={classNames?.description}>{description}</Ui.Dialog.Description>}
      <div className="border-b" />
    </Ui.Dialog.Header>
  )
}
