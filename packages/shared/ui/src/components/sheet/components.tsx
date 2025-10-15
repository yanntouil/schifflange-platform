import * as SheetPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import * as React from "react"
import { cn, VariantProps } from "@compo/utils"
import { sheetVariants } from "./variants"

const SheetRoot = SheetPrimitive.Root
const SheetTrigger = SheetPrimitive.Trigger
const SheetClose = SheetPrimitive.Close
const SheetPortal = SheetPrimitive.Portal

/**
 * SheetOverlay
 */
export type SheetOverlayProps = React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
const SheetOverlay = React.forwardRef<React.ElementRef<typeof SheetPrimitive.Overlay>, SheetOverlayProps>(
  ({ className, ...props }, ref) => (
    <SheetPrimitive.Overlay
      className={cn(
        "fixed inset-0 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      {...props}
      ref={ref}
    />
  )
)
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName

/**
 * SheetContent
 */
export type SheetContentProps = React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content> &
  VariantProps<typeof sheetVariants>
const SheetContent = React.forwardRef<React.ElementRef<typeof SheetPrimitive.Content>, SheetContentProps>(
  ({ side = "right", className, children, ...props }, ref) => (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content ref={ref} className={cn(sheetVariants({ side }), className)} {...props}>
        <SheetPrimitive.Close className='absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity data-[state=open]:bg-secondary hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none'>
          <X className='size-4' />
          <span className='sr-only'>Close</span>
        </SheetPrimitive.Close>
        {children}
      </SheetPrimitive.Content>
    </SheetPortal>
  )
)
SheetContent.displayName = SheetPrimitive.Content.displayName

/**
 * SheetHeader
 */
export type SheetHeader = React.HTMLAttributes<HTMLDivElement>
const SheetHeader = React.forwardRef<React.ElementRef<"div">, SheetHeader>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-2 text-center sm:text-left", className)} {...props} />
))
SheetHeader.displayName = "SheetHeader"

/**
 * SheetFooter
 */
export type SheetFooter = React.HTMLAttributes<HTMLDivElement>
const SheetFooter = React.forwardRef<React.ElementRef<"div">, SheetFooter>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
    {...props}
  />
))
SheetFooter.displayName = "SheetFooter"

/**
 * SheetTitle
 */
export type SheetTitle = React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
const SheetTitle = React.forwardRef<React.ElementRef<typeof SheetPrimitive.Title>, SheetTitle>(
  ({ className, ...props }, ref) => (
    <SheetPrimitive.Title ref={ref} className={cn("text-lg font-semibold text-foreground", className)} {...props} />
  )
)
SheetTitle.displayName = SheetPrimitive.Title.displayName

/**
 * SheetDescription
 */
export type SheetDescription = React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
const SheetDescription = React.forwardRef<React.ElementRef<typeof SheetPrimitive.Description>, SheetDescription>(
  ({ className, ...props }, ref) => (
    <SheetPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  )
)
SheetDescription.displayName = SheetPrimitive.Description.displayName

export {
  SheetClose as Close,
  SheetContent as Content,
  SheetDescription as Description,
  SheetFooter as Footer,
  SheetHeader as Header,
  SheetOverlay as Overlay,
  SheetPortal as Portal,
  SheetRoot as Root,
  SheetTitle as Title,
  SheetTrigger as Trigger,
}
