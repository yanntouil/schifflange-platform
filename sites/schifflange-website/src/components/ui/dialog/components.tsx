"use client"

import { cn } from "@/lib/utils"
// import { useTranslation } from "@compo/localize"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { XIcon } from "lucide-react"
import * as React from "react"

/**
 * Dialog
 */
export type DialogRootProps = React.ComponentProps<typeof DialogPrimitive.Root>
const DialogRoot: React.FC<DialogRootProps> = ({ ...props }: DialogRootProps) => {
  return <DialogPrimitive.Root data-slot='dialog-root' {...props} />
}

/**
 * DialogTrigger
 */
export type DialogTriggerProps = React.ComponentProps<typeof DialogPrimitive.Trigger>
const DialogTrigger = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Trigger>, DialogTriggerProps>(
  ({ ...props }, ref) => {
    return <DialogPrimitive.Trigger ref={ref} data-slot='dialog-trigger' {...props} />
  }
)

/**
 * DialogPortal
 */
export type DialogPortalProps = React.ComponentProps<typeof DialogPrimitive.Portal>
const DialogPortal: React.FC<DialogPortalProps> = ({ ...props }: DialogPortalProps) => {
  return <DialogPrimitive.Portal data-slot='dialog-portal' {...props} />
}

/**
 * DialogClose
 */
export type DialogCloseProps = React.ComponentProps<typeof DialogPrimitive.Close>
const DialogClose: React.FC<DialogCloseProps> = ({ ...props }: DialogCloseProps) => {
  return <DialogPrimitive.Close data-slot='dialog-close' {...props} />
}

/**
 * DialogOverlay
 */
export type DialogOverlayProps = React.ComponentProps<typeof DialogPrimitive.Overlay>
const DialogOverlay: React.FC<DialogOverlayProps> = ({ className, ...props }: DialogOverlayProps) => {
  return (
    <DialogPrimitive.Overlay
      data-slot='dialog-overlay'
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      )}
      {...props}
    />
  )
}

/**
 * DialogContent
 */
export type DialogContentProps = React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean
  classNames?: {
    overlay?: string
    content?: string
    wrapper?: string
    close?: string
  }
}
const DialogContent: React.FC<DialogContentProps> = ({
  className,
  children,
  showCloseButton = true,
  classNames,
  ...props
}: DialogContentProps) => {
  // const { _ } = useTranslation(dictionary)
  return (
    <DialogPortal data-slot='dialog-portal'>
      <DialogOverlay className={classNames?.overlay} />
      <DialogPrimitive.Content
        data-slot='dialog-content'
        className={cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          classNames?.content,
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot='dialog-close'
            className={cn(
              "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
              classNames?.close
            )}
          >
            <XIcon />
            <span className='sr-only'>
              {/* {_("close")} */}
              Close
            </span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

/**
 * DialogHeader
 */
export type DialogHeaderProps = React.ComponentProps<"div">
const DialogHeader: React.FC<DialogHeaderProps> = ({ className, ...props }: DialogHeaderProps) => {
  return (
    <div
      data-slot='dialog-header'
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  )
}

/**
 * DialogFooter
 */
export type DialogFooterProps = React.ComponentProps<"div">
const DialogFooter: React.FC<DialogFooterProps> = ({ className, ...props }: DialogFooterProps) => {
  return (
    <div
      data-slot='dialog-footer'
      className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  )
}

/**
 * DialogTitle
 */
export type DialogTitleProps = React.ComponentProps<typeof DialogPrimitive.Title>
const DialogTitle: React.FC<DialogTitleProps> = ({ className, ...props }: DialogTitleProps) => {
  return (
    <DialogPrimitive.Title
      data-slot='dialog-title'
      className={cn("text-lg leading-none font-semibold", className)}
      {...props}
    />
  )
}

/**
 * DialogDescription
 */
export type DialogDescriptionProps = React.ComponentProps<typeof DialogPrimitive.Description>
const DialogDescription: React.FC<DialogDescriptionProps> = ({ className, ...props }: DialogDescriptionProps) => {
  return (
    <DialogPrimitive.Description
      data-slot='dialog-description'
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

/**
 * DialogQuick
 */
export type DialogQuickProps = {
  title?: string
  description?: string
  children: React.ReactNode
  trigger?: React.ReactNode
  showCloseButton?: boolean
  classNames?: {
    trigger?: string
    header?: string
    title?: string
    description?: string
  } & DialogContentProps["classNames"]
} & DialogRootProps
const DialogQuick: React.FC<DialogQuickProps> = ({
  title,
  description,
  children,
  trigger,
  showCloseButton = true,
  classNames,
  ...props
}: DialogQuickProps) => {
  return (
    <DialogRoot {...props}>
      {trigger && <DialogTrigger className={classNames?.trigger}>{trigger}</DialogTrigger>}
      <DialogContent showCloseButton={showCloseButton} classNames={classNames}>
        {(title || description) && (
          <DialogHeader className={classNames?.header}>
            {title && <DialogTitle className={classNames?.title}>{title}</DialogTitle>}
            {description && <DialogDescription className={classNames?.description}>{description}</DialogDescription>}
          </DialogHeader>
        )}
        {children}
      </DialogContent>
    </DialogRoot>
  )
}

/**
 * exports components
 */
export {
  DialogClose as Close,
  DialogContent as Content,
  DialogDescription as Description,
  DialogFooter as Footer,
  DialogHeader as Header,
  DialogOverlay as Overlay,
  DialogPortal as Portal,
  DialogQuick as Quick,
  DialogRoot as Root,
  DialogTitle as Title,
  DialogTrigger as Trigger,
}

/**
 * translations
 */
const dictionary = {
  fr: {
    close: "Fermer la boîte de dialogue",
  },
  en: {
    close: "Close dialog",
  },
  de: {
    close: "Dialog schließen",
  },
  lb: {
    close: "Dialog schließen",
  },
}
