import { G } from "@mobily/ts-belt"
import React from "react"
import { cxm } from "@compo/utils"
import * as Dialog from "./components"
import { QuickDialogContext } from "./quick.context"

/**
 * Quick
 */
type QuickDialogRootProps = {
  open?: boolean
  onCloseAutoFocus?: () => void
  onOpenChange: (state: boolean) => void
  children: React.ReactNode
}

const QuickDialogRoot: React.FC<QuickDialogRootProps> = (props) => {
  const { open = true, onOpenChange, children, ...rest } = props

  return (
    <QuickDialogContext.Provider
      value={{
        open,
        onOpenChange,
        close: () => onOpenChange(false),
      }}
    >
      <Dialog.Root open={open} onOpenChange={onOpenChange} {...rest}>
        {children}
      </Dialog.Root>
    </QuickDialogContext.Provider>
  )
}
QuickDialogRoot.displayName = "QuickDialogRoot"

/**
 * Quick
 */
type QuickDialogContentProps = {
  className?: string
  classNames?: {
    header?: string
    title?: string
    description?: string
  } & Dialog.DialogContentProps["classNames"]
  sticky?: boolean
  stickyHeader?: boolean
  stickyFooter?: boolean
  title?: React.ReactNode
  description?: React.ReactNode
  children: React.ReactNode
}

const QuickDialogContent = React.forwardRef<HTMLDivElement, QuickDialogContentProps>((props, ref) => {
  const {
    className,
    classNames = {},
    sticky = false,
    stickyHeader = sticky,
    stickyFooter = sticky,
    title,
    description,
    children,
    ...rest
  } = props

  const headerRef = React.useRef<HTMLDivElement>(null)

  return (
    <Dialog.Content
      ref={ref}
      className={className}
      classNames={{
        overlay: cxm(classNames.overlay),
        content: cxm(classNames.content),
        wrapper: cxm(stickyHeader && "pt-0", stickyFooter && "pb-0", classNames.wrapper),
        close: cxm(classNames.close),
      }}
    >
      {(G.isNotNullable(title) || G.isNotNullable(description)) && (
        <Dialog.Header
          className={cxm(stickyHeader && "sticky top-0 py-6 bg-card/50 backdrop-blur-[1px]", classNames.header)}
          ref={headerRef}
        >
          {G.isNotNullable(title) && <Dialog.Title className={cxm(classNames.title)}>{title}</Dialog.Title>}
          {G.isNotNullable(description) && (
            <Dialog.Description className={cxm(classNames.description)}>{description}</Dialog.Description>
          )}
        </Dialog.Header>
      )}
      {children}
    </Dialog.Content>
  )
})
QuickDialogContent.displayName = "QuickDialogContent"

/**
 * QuickDialog
 */
type QuickDialogProps = {
  open?: boolean
  animate?: boolean
  onCloseAutoFocus?: () => void
  onOpenChange: (state: boolean) => void
  className?: string
  classNames?: {
    header?: string
    title?: string
    description?: string
  } & Dialog.DialogContentProps["classNames"]
  sticky?: boolean
  stickyHeader?: boolean
  stickyFooter?: boolean
  title?: React.ReactNode
  description?: React.ReactNode
  children: React.ReactNode
}

const QuickDialog = React.forwardRef<HTMLDivElement, QuickDialogProps>((props, ref) => {
  const {
    open = true,
    onOpenChange,
    className,
    classNames = {},
    sticky = false,
    stickyHeader = sticky,
    stickyFooter = sticky,
    title,
    description,
    children,
    ...rest
  } = props

  const headerRef = React.useRef<HTMLDivElement>(null)

  return (
    <QuickDialogContext.Provider
      value={{
        open,
        onOpenChange,
        close,
      }}
    >
      <Dialog.Root open={open} onOpenChange={onOpenChange} {...rest}>
        <Dialog.Content
          ref={ref}
          className={className}
          classNames={{
            overlay: cxm(classNames.overlay),
            content: cxm(classNames.content),
            wrapper: cxm(stickyHeader && "pt-0", stickyFooter && "pb-0", classNames.wrapper),
            close: cxm(classNames.close),
          }}
        >
          {(G.isNotNullable(title) || G.isNotNullable(description)) && (
            <Dialog.Header
              className={cxm(stickyHeader && "sticky top-0 py-6 bg-card/90 backdrop-blur-[2px]", classNames.header)}
              ref={headerRef}
            >
              {G.isNotNullable(title) && <Dialog.Title className={cxm(classNames.title)}>{title}</Dialog.Title>}
              {G.isNotNullable(description) && (
                <Dialog.Description className={cxm(classNames.description)}>{description}</Dialog.Description>
              )}
            </Dialog.Header>
          )}
          {children}
        </Dialog.Content>
      </Dialog.Root>
    </QuickDialogContext.Provider>
  )
})
QuickDialog.displayName = "QuickDialog"

const QuickDialogStickyFooter: React.FC<React.ComponentProps<typeof Dialog.Footer>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <Dialog.Footer className={cxm("sticky bottom-0 py-6 bg-card/90 backdrop-blur-[2px]", className)} {...props}>
      {children}
    </Dialog.Footer>
  )
}
QuickDialogStickyFooter.displayName = "QuickDialogStickyFooter"

export { QuickDialog, QuickDialogContent, QuickDialogRoot, QuickDialogStickyFooter }
