import * as React from "react"
import { Drawer as DrawerPrimitive } from "vaul"
import { cn, cxm } from "@compo/utils"

/**
 * DrawerRoot
 */
const DrawerRoot: React.FC<React.ComponentProps<typeof DrawerPrimitive.Root>> = ({
  shouldScaleBackground = true,
  ...props
}) => <DrawerPrimitive.Root shouldScaleBackground={shouldScaleBackground} {...props} />
DrawerRoot.displayName = "DrawerRoot"

/**
 * DrawerTrigger
 */
const DrawerTrigger = DrawerPrimitive.Trigger

/**
 * DrawerPortal
 */
const DrawerPortal: React.FC<React.ComponentProps<typeof DrawerPrimitive.Portal>> = (props) => (
  <DrawerPrimitive.Portal {...props} />
)
DrawerPortal.displayName = "DrawerPortal"

/**
 * DrawerClose
 */
const DrawerClose = DrawerPrimitive.Close

/**
 * DrawerOverlay
 */
const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay ref={ref} className={cn("fixed inset-0 bg-black/80", className)} {...props} />
))
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName

/**
 * DrawerContent
 */
export type DrawerContentProps = React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content> & {
  classNames?: {
    overlay?: string
    content?: string
  }
}
const DrawerContent = React.forwardRef<React.ElementRef<typeof DrawerPrimitive.Content>, DrawerContentProps>(
  ({ className, classNames, children, ...props }, ref) => (
    <DrawerPortal>
      <DrawerOverlay className={classNames?.overlay} />
      <DrawerPrimitive.Content
        ref={ref}
        className={cn(
          "fixed inset-x-0 bottom-0 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-card",
          className,
          classNames?.content
        )}
        {...props}
      >
        <div className='mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted' />
        {children}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  )
)
DrawerContent.displayName = "DrawerContent"

/**
 * DrawerHeader
 */
const DrawerHeader = React.forwardRef<React.ElementRef<"div">, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("grid gap-1.5 p-4 text-center sm:text-left", className)} {...props} />
  )
)
DrawerHeader.displayName = "DrawerHeader"

/**
 * DrawerScrollArea
 */
const DrawerScrollArea = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cxm(
        "flex max-h-[calc(100vh-8.25rem-4rem)] flex-col space-y-1.5 overflow-y-auto px-5 py-[1.1rem]",
        "scrollbar-thin scrollbar-track-background scrollbar-thumb-muted scrollbar-thumb-rounded-full scrollbar-w-1",
        className
      )}
      {...props}
    />
  )
)
DrawerScrollArea.displayName = "DrawerScrollArea"

/**
 * DrawerFooter
 */
const DrawerFooter = React.forwardRef<React.ElementRef<"div">, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("mt-auto flex flex-col gap-2 p-4", className)} {...props} />
  )
)
DrawerFooter.displayName = "DrawerFooter"

/**
 * DrawerTitle
 */
const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
DrawerTitle.displayName = DrawerPrimitive.Title.displayName

/**
 * DrawerDescription
 */
const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
))
DrawerDescription.displayName = DrawerPrimitive.Description.displayName

export {
  DrawerClose as Close,
  DrawerContent as Content,
  DrawerDescription as Description,
  DrawerFooter as Footer,
  DrawerHeader as Header,
  DrawerOverlay as Overlay,
  DrawerPortal as Portal,
  DrawerRoot as Root,
  DrawerScrollArea as ScrollArea,
  DrawerTitle as Title,
  DrawerTrigger as Trigger,
}
