import * as PopoverPrimitive from "@radix-ui/react-popover"
import * as React from "react"
import { cxm } from "@compo/utils"
import { scrollbarVariants } from "../../variants"

/**
 * PopoverRoot
 */
const PopoverRoot: React.FC<React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Root>> = ({
  modal = true,
  children,
  ...props
}) => (
  <PopoverPrimitive.Root modal={modal} {...props}>
    {children}
  </PopoverPrimitive.Root>
)
PopoverRoot.displayName = PopoverPrimitive.Root.displayName

/**
 * PopoverTrigger
 */
const PopoverTrigger = PopoverPrimitive.Trigger

/**
 * PopoverAnchor
 */
const PopoverAnchor = PopoverPrimitive.Anchor

/**
 * PopoverContent
 */
export type PopoverContentProps = React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
const PopoverContent = React.forwardRef<React.ElementRef<typeof PopoverPrimitive.Content>, PopoverContentProps>(
  ({ className, align = "center", sideOffset = 4, ...props }, ref) => (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        className={cxm(
          "w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          "max-h-[min(calc(100vh-2rem),720px)] overflow-y-auto",
          scrollbarVariants({ variant: "thin" }),
          className
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  )
)
PopoverContent.displayName = PopoverPrimitive.Content.displayName

/**
 * PopoverQuick
 */
export type PopoverQuickProps = {
  children: React.ReactNode
  content: React.ReactNode
  align?: PopoverContentProps["align"]
  side?: PopoverContentProps["side"]
  asChild?: boolean
  className?: string
  classNames?: {
    trigger?: string
    content?: string
  }
}
const PopoverQuick: React.FC<PopoverQuickProps> = ({
  children,
  content,
  align,
  side,
  className,
  classNames,
  asChild,
}) => {
  return (
    <PopoverRoot>
      <PopoverTrigger className={cxm(classNames?.trigger, className)} asChild={asChild}>
        {children}
      </PopoverTrigger>
      <PopoverContent align={align} side={side} className={cxm("max-w-xl", classNames?.content)}>
        {content}
      </PopoverContent>
    </PopoverRoot>
  )
}

export {
  PopoverAnchor as Anchor,
  PopoverContent as Content,
  PopoverQuick as Quick,
  PopoverRoot as Root,
  PopoverTrigger as Trigger,
}
