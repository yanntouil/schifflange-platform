import * as AlertDialog from "@radix-ui/react-alert-dialog"
import * as React from "react"
import { VariantProps } from "tailwind-variants"
import { cn } from "@compo/utils"
import { buttonVariants } from "../button"

/**
 * AlertDialogRoot
 */
const AlertDialogRoot = AlertDialog.Root

/**
 * AlertDialogTrigger
 */
const AlertDialogTrigger = AlertDialog.Trigger

/**
 * AlertDialogPortal
 */
const AlertDialogPortal = AlertDialog.Portal

/**
 * AlertDialogOverlay
 */
export type AlertDialogOverlayProps = React.ComponentPropsWithoutRef<typeof AlertDialog.Overlay>
const AlertDialogOverlay = React.forwardRef<React.ElementRef<typeof AlertDialog.Overlay>, AlertDialogOverlayProps>(
  ({ className, ...props }, ref) => (
    <AlertDialog.Overlay
      className={cn(
        "fixed inset-0 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      {...props}
      ref={ref}
    />
  )
)

/**
 * AlertDialogContent
 */
export type AlertDialogContentProps = React.ComponentPropsWithoutRef<typeof AlertDialog.Content>
const AlertDialogContent = React.forwardRef<React.ElementRef<typeof AlertDialog.Content>, AlertDialogContentProps>(
  ({ className, ...props }, ref) => (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialog.Content
        ref={ref}
        className={cn(
          "fixed left-[50%] top-[50%] grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
          className
        )}
        {...props}
      />
    </AlertDialogPortal>
  )
)

/**
 * AlertDialogHeader
 */
export type AlertDialogHeaderProps = React.HTMLAttributes<HTMLDivElement>
const AlertDialogHeader = React.forwardRef<React.ElementRef<"div">, AlertDialogHeaderProps>(
  ({ className, ...props }, ref) => (
    <div className={cn("flex flex-col space-y-2 text-center sm:text-left", className)} {...props} />
  )
)

/**
 * AlertDialogFooter
 */
export type AlertDialogFooterProps = React.HTMLAttributes<HTMLDivElement>
const AlertDialogFooter = React.forwardRef<React.ElementRef<"div">, AlertDialogFooterProps>(
  ({ className, ...props }, ref) => (
    <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
  )
)

/**
 * AlertDialogTitle
 */
export type AlertDialogTitleProps = React.ComponentPropsWithoutRef<typeof AlertDialog.Title>
const AlertDialogTitle = React.forwardRef<React.ElementRef<typeof AlertDialog.Title>, AlertDialogTitleProps>(
  ({ className, ...props }, ref) => (
    <AlertDialog.Title ref={ref} className={cn("text-lg font-semibold", className)} {...props} />
  )
)

/**
 * AlertDialogDescription
 */
export type AlertDialogDescriptionProps = React.ComponentPropsWithoutRef<typeof AlertDialog.Description>
const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialog.Description>,
  AlertDialogDescriptionProps
>(({ className, ...props }, ref) => (
  <AlertDialog.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
))

/**
 * AlertDialogAction
 */
export type AlertDialogActionProps = React.ComponentPropsWithoutRef<typeof AlertDialog.Action> &
  VariantProps<typeof buttonVariants>
const AlertDialogAction = React.forwardRef<React.ElementRef<typeof AlertDialog.Action>, AlertDialogActionProps>(
  ({ className, variant, size, icon, type = "button", ...props }, ref) => (
    <AlertDialog.Action ref={ref} className={cn(buttonVariants({ variant, size, icon }), className)} {...props} />
  )
)

/**
 * AlertDialogCancel
 */
export type AlertDialogCancelProps = React.ComponentPropsWithoutRef<typeof AlertDialog.Cancel>
const AlertDialogCancel = React.forwardRef<React.ElementRef<typeof AlertDialog.Cancel>, AlertDialogCancelProps>(
  ({ className, ...props }, ref) => (
    <AlertDialog.Cancel
      ref={ref}
      className={cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className)}
      {...props}
    />
  )
)

export {
  AlertDialogAction as Action,
  AlertDialogCancel as Cancel,
  AlertDialogContent as Content,
  AlertDialogDescription as Description,
  AlertDialogFooter as Footer,
  AlertDialogHeader as Header,
  AlertDialogOverlay as Overlay,
  AlertDialogPortal as Portal,
  AlertDialogRoot as Root,
  AlertDialogTitle as Title,
  AlertDialogTrigger as Trigger,
}
