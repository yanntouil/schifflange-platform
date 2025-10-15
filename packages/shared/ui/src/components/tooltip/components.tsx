import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import * as React from "react"
import { cxm } from "@compo/utils"

/**
 * TooltipProvider
 */
const TooltipProvider = TooltipPrimitive.Provider

/**
 * TooltipRoot
 */
const TooltipRoot = TooltipPrimitive.Root

/**
 * TooltipTrigger
 */
const TooltipTrigger = TooltipPrimitive.Trigger

/**
 * TooltipContent
 */
export type TooltipContentProps = React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
const TooltipContent = React.forwardRef<React.ElementRef<typeof TooltipPrimitive.Content>, TooltipContentProps>(
  ({ className, sideOffset = 4, ...props }, ref) => (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cxm(
          "overflow-hidden rounded-md bg-black/80 px-3 py-1.5 text-xs text-white animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className
        )}
        {...props}
      />
    </TooltipPrimitive.Portal>
  )
)
TooltipContent.displayName = TooltipPrimitive.Content.displayName

/**
 * TooltipQuick
 */
export type TooltipQuickProps = React.ComponentPropsWithoutRef<typeof TooltipTrigger> & {
  tooltip: React.ReactNode
  disabled?: boolean
  side?: TooltipContentProps["side"]
  align?: TooltipContentProps["align"]
  classNames?: {
    trigger?: string
    content?: string
  }
}
const TooltipQuick = React.forwardRef<React.ElementRef<typeof TooltipTrigger>, TooltipQuickProps>(
  ({ children, className, classNames, tooltip, side, align, disabled, ...props }, ref) => {
    if (!tooltip || disabled) return children
    return (
      <TooltipRoot disableHoverableContent>
        <TooltipTrigger {...props} ref={ref} className={cxm(classNames?.trigger, className)}>
          {children}
        </TooltipTrigger>
        <TooltipContent side={side} align={align} className={cxm(classNames?.content)}>
          {tooltip}
        </TooltipContent>
      </TooltipRoot>
    )
  }
)
TooltipQuick.displayName = "TooltipQuick"

export type Side = TooltipContentProps["side"]
export type Align = TooltipContentProps["align"]

export {
  TooltipContent as Content,
  TooltipProvider as Provider,
  TooltipQuick as Quick,
  TooltipRoot as Root,
  TooltipTrigger as Trigger,
}
