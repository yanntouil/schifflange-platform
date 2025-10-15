"use client"

import * as HoverCardPrimitive from "@radix-ui/react-hover-card"
import * as React from "react"
import { cxm } from "@compo/utils"
import { scrollbarVariants } from "../../variants"

/**
 * HoverCard
 * @see https://ui.shadcn.com/docs/components/hover-card
 */
const HoverCard = HoverCardPrimitive.Root

/**
 * HoverCardTrigger
 */
const HoverCardTrigger = HoverCardPrimitive.Trigger

/**
 * HoverCardContent
 */
const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(({ className, style, align = "center", sideOffset = 4, ...props }, ref) => (
  <HoverCardPrimitive.Portal>
    <HoverCardPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cxm(
        "w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
        "max-h-[min(calc(100vh-2rem),720px)] overflow-y-auto overflow-x-auto",
        scrollbarVariants({ variant: "thin" }),
        className
      )}
      style={{
        maxWidth: "var(--radix-popper-available-width)",
        maxHeight: "var(--radix-popper-available-height)",
        ...style,
      }}
      {...props}
    />
  </HoverCardPrimitive.Portal>
))
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName

export { HoverCardContent as Content, HoverCard as Root, HoverCardTrigger as Trigger }
