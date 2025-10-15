"use client"

import { Translation, useTranslation } from "@compo/localize"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { XIcon } from "lucide-react"
import React from "react"
import { variants } from "../.."
import { cn } from "@compo/utils"
import { DialogContext } from "./context"

// Context for dialog header state
const DialogHeaderContext = React.createContext<{
  isSticky: boolean
}>({
  isSticky: false,
})

/**
 * DialogRoor
 */
export type DialogProviderProps = Omit<React.ComponentProps<typeof DialogPrimitive.Root>, "open" | "onOpenChange">
const DialogUncontrolled: React.FC<DialogProviderProps> = ({ ...props }) => {
  const [open, onOpenChange] = React.useState(false)
  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      <DialogPrimitive.Root data-slot='dialog' {...props} {...{ open, onOpenChange }} />
    </DialogContext.Provider>
  )
}

/**
 * DialogRoot
 */
export type DialogRootProps = Omit<React.ComponentProps<typeof DialogPrimitive.Root>, "open" | "onOpenChange"> & {
  open: boolean
  onOpenChange: (open: boolean) => void
}
const DialogRoot: React.FC<DialogRootProps> = ({ open, onOpenChange, ...props }) => {
  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      <DialogPrimitive.Root data-slot='dialog' {...{ open, onOpenChange }} {...props} />
    </DialogContext.Provider>
  )
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
const DialogPortal: React.FC<DialogPortalProps> = ({ ...props }) => {
  return <DialogPrimitive.Portal data-slot='dialog-portal' {...props} />
}

/**
 * DialogClose
 */
export type DialogCloseProps = React.ComponentProps<typeof DialogPrimitive.Close>
const DialogClose = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Close>, DialogCloseProps>(
  ({ ...props }, ref) => {
    return <DialogPrimitive.Close ref={ref} data-slot='dialog-close' {...props} />
  }
)

/**
 * DialogOverlay
 */
export type DialogOverlayProps = React.ComponentProps<typeof DialogPrimitive.Overlay>
const DialogOverlay = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Overlay>, DialogOverlayProps>(
  ({ className, ...props }, ref) => {
    return (
      <DialogPrimitive.Overlay
        ref={ref}
        data-slot='dialog-overlay'
        className={cn(
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 bg-black/50",
          className
        )}
        {...props}
      />
    )
  }
)

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
const DialogContent = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Content>, DialogContentProps>(
  ({ className, classNames, children, showCloseButton = true, ...props }, ref) => {
    const { _ } = useTranslation(dictionary)
    const isFirefox = React.useMemo(() => typeof navigator !== 'undefined' && navigator.userAgent.toLowerCase().includes('firefox'), [])

    return (
      <DialogPortal data-slot='dialog-portal'>
        <DialogOverlay className={classNames?.overlay} />
        <DialogPrimitive.Content
          ref={ref}
          data-slot='dialog-content'
          className={cn(
            "fixed isolate",
            "top-0 left-0 sm:top-[50%] sm:left-[50%] sm:translate-x-[-50%] sm:translate-y-[-50%]",
            "w-full sm:max-w-[calc(100%-2rem)]",
            "h-auto max-h-[100vh] sm:max-h-[calc(100%-2rem)]",
            "pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]",
            // "grid w-full overflow-hidden",
            "grid w-full sm:grid-rows-[auto_minmax(0,1fr)]",
            // Firefox fix: use overflow-y-auto instead of overflow-hidden when Firefox is detected
            isFirefox ? "overflow-y-auto" : "overflow-hidden",
            "bg-background sm:rounded-lg border shadow-lg",
            "data-[state=open]:animate-in  data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            "duration-200",
            classNames?.content,
            className
          )}
          {...props}
        >
          <div className={cn(
            isFirefox ? "p-6" : "overflow-y-auto p-6",
            variants.scrollbar({ variant: "thin" }),
            classNames?.wrapper
          )}>
            {children}
          </div>
          {showCloseButton && (
            <DialogPrimitive.Close
              data-slot='dialog-close'
              className={cn(
                "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                classNames?.close
              )}
            >
              <XIcon />
              <span className='sr-only'>{_("close")}</span>
            </DialogPrimitive.Close>
          )}
        </DialogPrimitive.Content>
      </DialogPortal>
    )
  }
)

/**
 * DialogHeader
 */
export type DialogHeaderProps = React.ComponentProps<"div">
const DialogHeader = React.forwardRef<HTMLDivElement, DialogHeaderProps>(({ className, ...props }, ref) => {
  const internalRef = React.useRef<HTMLDivElement>(null)

  // Calculate and set the header height as CSS variable on the dialog content
  React.useEffect(() => {
    const element = internalRef.current
    if (!element) return

    const updateHeight = () => {
      const height = element.offsetHeight || 0
      // Find the dialog content parent and set the variable there
      const dialogContent = element.closest('[data-slot="dialog-content"]') as HTMLElement
      if (dialogContent) {
        dialogContent.style.setProperty("--dialog-header-height", `${height}px`)
      }
    }

    // Set initial height
    updateHeight()

    // Update on resize
    const resizeObserver = new ResizeObserver(updateHeight)
    resizeObserver.observe(element)

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  // Combine refs with useImperativeHandle
  React.useImperativeHandle(ref, () => internalRef.current!, [])

  return (
    <div
      ref={internalRef}
      data-slot='dialog-header'
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  )
})

/**
 * DialogFooter
 */
export type DialogFooterProps = React.ComponentProps<"div">
const DialogFooter = React.forwardRef<HTMLDivElement, DialogFooterProps>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot='dialog-footer'
      className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  )
})

/**
 * DialogTitle
 */
export type DialogTitleProps = React.ComponentProps<typeof DialogPrimitive.Title>
const DialogTitle = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Title>, DialogTitleProps>(
  ({ className, ...props }, ref) => {
    return (
      <DialogPrimitive.Title
        ref={ref}
        data-slot='dialog-title'
        className={cn("text-lg/none font-semibold", className)}
        {...props}
      />
    )
  }
)

/**
 * DialogDescription
 */
export type DialogDescriptionProps = React.ComponentProps<typeof DialogPrimitive.Description>
const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  DialogDescriptionProps
>(({ className, ...props }, ref) => {
  return (
    <DialogPrimitive.Description
      ref={ref}
      data-slot='dialog-description'
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
})

export {
  DialogClose as Close,
  DialogContent as Content,
  DialogDescription as Description,
  DialogFooter as Footer,
  DialogHeader as Header,
  DialogOverlay as Overlay,
  DialogPortal as Portal,
  DialogRoot as Root,
  DialogTitle as Title,
  DialogTrigger as Trigger,
  DialogUncontrolled as Uncontrolled,
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
} satisfies Translation
