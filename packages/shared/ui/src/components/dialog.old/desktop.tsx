import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import * as React from "react"
import { cn, cxm } from "@compo/utils"
import { disabledVariants, focusVisibleVariants, scrollbarVariants } from "../../variants"

/**
 * DialogRoot
 */
const DialogRoot = DialogPrimitive.Root

/**
 * DialogTrigger
 */
const DialogTrigger = DialogPrimitive.Trigger

/**
 * DialogPortal
 */
const DialogPortal = DialogPrimitive.Portal

/**
 * DialogClose
 */
const DialogClose = DialogPrimitive.Close

/**
 * DialogOverlay
 */
const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

/**
 * DialogContent
 */
export type DialogContentProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
  classNames?: {
    overlay?: string
    content?: string
    contentScrollable?: string
    close?: string
  }
}
const DialogContent = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Content>, DialogContentProps>(
  ({ className, classNames, children, ...props }, ref) => (
    <DialogPortal>
      <DialogOverlay className={classNames?.overlay}>
        <DialogPrimitive.Content
          ref={ref}
          className={cn(
            "fixed left-[50%] top-[50%]",
            "isolate grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%]",
            "border bg-card shadow-lg sm:rounded-lg",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
            "duration-200",
            className,
            classNames?.content
          )}
          {...props}
        >
          <div className={classNames?.contentScrollable}>{children}</div>
          <DialogPrimitive.Close
            className={cn(
              "absolute right-4 top-4",
              "rounded-sm opacity-70 transition-opacity hover:opacity-100",
              "data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
              focusVisibleVariants(),
              disabledVariants(),
              classNames?.close
            )}
          >
            <X className='size-4' aria-hidden />
            <span className='sr-only'>Close</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogOverlay>
    </DialogPortal>
  )
)
DialogContent.displayName = DialogPrimitive.Content.displayName

/**
 * DialogHeader
 */
const DialogHeader = React.forwardRef<React.ElementRef<"div">, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 px-6 pb-4 pt-6 text-center sm:text-left", className)}
      {...props}
    />
  )
)
DialogHeader.displayName = "DialogHeader"

/**
 * Dialog body
 */
const DialogScrollArea = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cxm(
        "-mx-6 max-h-[calc(100vh-10rem)] min-h-0 space-y-4 overflow-y-auto px-6 py-6 text-center sm:text-left",
        scrollbarVariants({ variant: "thin" }),
        className
      )}
      {...props}
    />
  )
)
DialogScrollArea.displayName = "DialogScrollArea"

/**
 * DialogFooter
 */
const DialogFooter = React.forwardRef<React.ElementRef<"div">, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col-reverse gap-y-2 px-6 pb-6 pt-4 sm:flex-row sm:justify-end sm:space-x-2", className)}
      {...props}
    />
  )
)
DialogFooter.displayName = "DialogFooter"

/**
 * DialogTitle
 */
const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

/**
 * DialogDescription
 */
const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  DialogClose as Close,
  DialogContent as Content,
  DialogDescription as Description,
  DialogFooter as Footer,
  DialogHeader as Header,
  DialogOverlay as Overlay,
  DialogPortal as Portal,
  DialogRoot as Root,
  DialogScrollArea as ScrollArea,
  DialogTitle as Title,
  DialogTrigger as Trigger,
}
