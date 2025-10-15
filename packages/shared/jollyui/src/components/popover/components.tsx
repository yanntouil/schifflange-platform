"use client"

import { cn } from "@compo/utils"
import * as React from "react"
import {
  Dialog as AriaDialog,
  DialogProps as AriaDialogProps,
  DialogTrigger as AriaDialogTrigger,
  Popover as AriaPopover,
  PopoverProps as AriaPopoverProps,
  composeRenderProps,
} from "react-aria-components"

/**
 * PopoverTrigger
 */
const PopoverTrigger = AriaDialogTrigger

/**
 * Popover
 */
const Popover: React.FC<AriaPopoverProps> = ({ className, offset = 4, ...props }) => (
  <AriaPopover
    offset={offset}
    className={composeRenderProps(className, (className) =>
      cn(
        "rounded-md border bg-popover text-popover-foreground shadow-md outline-none pointer-events-auto",
        /* Entering */
        "data-[entering]:animate-in data-[entering]:fade-in-0 data-[entering]:zoom-in-95",
        /* Exiting */
        "data-[exiting]:animate-out data-[exiting]:fade-out-0 data-[exiting]:zoom-out-95",
        /* Placement */
        "data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2",
        className
      )
    )}
    {...props}
  />
)

/**
 * PopoverDialog
 */
const PopoverDialog: React.FC<AriaDialogProps> = ({ className, ...props }) => {
  return <AriaDialog className={cn("p-4 outline outline-0", className)} {...props} />
}

export { Popover, PopoverDialog, PopoverTrigger }
