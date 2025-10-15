import { cxm } from "@compo/utils"
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu"
import { Check, ChevronRight } from "lucide-react"
import * as React from "react"
import { MenuContext } from "../context"

/**
 * ContextMenu
 */
export type ContextMenuRootProps = React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Root>
const ContextMenuRoot: React.FC<ContextMenuRootProps> = ({ children, ...props }) => {
  return (
    <MenuContext.Provider value={{ type: "context-menu" }}>
      <ContextMenuPrimitive.Root {...props}>{children}</ContextMenuPrimitive.Root>
    </MenuContext.Provider>
  )
}

/**
 * ContextMenuTrigger
 */
export type ContextMenuTriggerProps = React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Trigger>
const ContextMenuTrigger = ContextMenuPrimitive.Trigger

/**
 * ContextMenuGroup
 */
export type ContextMenuGroupProps = React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Group>
const ContextMenuGroup = ContextMenuPrimitive.Group

/**
 * ContextMenuPortal
 */
export type ContextMenuPortalProps = React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Portal>
const ContextMenuPortal = ContextMenuPrimitive.Portal

/**
 * ContextMenuSub
 */
export type ContextMenuSubProps = React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Sub>
const ContextMenuSub = ContextMenuPrimitive.Sub

/**
 * ContextMenuRadioGroup
 */
export type ContextMenuRadioGroupProps = React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioGroup>
const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup

/**
 * ContextMenuSubTrigger
 */
export type ContextMenuSubTriggerProps = React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubTrigger> & {
  inset?: boolean
}
const ContextMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubTrigger>,
  ContextMenuSubTriggerProps
>(({ className, inset, children, disabled, ...props }, ref) => (
  <ContextMenuPrimitive.SubTrigger
    ref={ref}
    disabled={disabled}
    className={cxm(
      "flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none data-[state=open]:bg-accent data-[state=open]:text-accent-foreground focus:bg-accent focus:text-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0",
      disabled && "pointer-events-none opacity-50",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    {!disabled && <ChevronRight className='ml-auto !size-3 shrink-0' />}
  </ContextMenuPrimitive.SubTrigger>
))
ContextMenuSubTrigger.displayName = ContextMenuPrimitive.SubTrigger.displayName

/**
 * ContextMenuSubContent
 */
export type ContextMenuSubContentProps = React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubContent>
const ContextMenuSubContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubContent>,
  ContextMenuSubContentProps
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.SubContent
    ref={ref}
    className={cxm(
      "min-w-[8rem] overflow-hidden rounded-md border border-border/60 bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
ContextMenuSubContent.displayName = ContextMenuPrimitive.SubContent.displayName

/**
 * ContextMenuContent
 */
export type ContextMenuContentProps = React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content>
const ContextMenuContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Content>,
  ContextMenuContentProps
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Portal>
    <ContextMenuPrimitive.Content
      ref={ref}
      className={cxm(
        "min-w-[8rem] overflow-hidden rounded-md border border-border/60 bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </ContextMenuPrimitive.Portal>
))
ContextMenuContent.displayName = ContextMenuPrimitive.Content.displayName

/**
 * ContextMenuItem
 */
export type ContextMenuItemProps = React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item> & {
  inset?: boolean
}
const ContextMenuItem = React.forwardRef<React.ElementRef<typeof ContextMenuPrimitive.Item>, ContextMenuItemProps>(
  ({ className, inset, ...props }, ref) => (
    <ContextMenuPrimitive.Item
      ref={ref}
      className={cxm(
        "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0",
        inset && "pl-8",
        className
      )}
      {...props}
    />
  )
)
ContextMenuItem.displayName = ContextMenuPrimitive.Item.displayName

/**
 * ContextMenuCheckboxItem
 */
export type ContextMenuCheckboxItemProps = React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.CheckboxItem>
const ContextMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.CheckboxItem>,
  ContextMenuCheckboxItemProps
>(({ className, children, checked, ...props }, ref) => (
  <ContextMenuPrimitive.CheckboxItem
    ref={ref}
    className={cxm(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className='absolute left-2 flex h-3.5 w-3.5 items-center justify-center'>
      <ContextMenuPrimitive.ItemIndicator>
        <Check className='!size-4 shrink-0' />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.CheckboxItem>
))
ContextMenuCheckboxItem.displayName = ContextMenuPrimitive.CheckboxItem.displayName

/**
 * ContextMenuRadioItem
 */
export type ContextMenuRadioItemProps = React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioItem>
const ContextMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.RadioItem>,
  ContextMenuRadioItemProps
>(({ className, children, ...props }, ref) => (
  <ContextMenuPrimitive.RadioItem
    ref={ref}
    className={cxm(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground",
      className
    )}
    {...props}
  >
    <span className='absolute left-2 flex h-3.5 w-3.5 items-center justify-center'>
      <ContextMenuPrimitive.ItemIndicator>
        <Check className='!size-4 shrink-0' />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.RadioItem>
))
ContextMenuRadioItem.displayName = ContextMenuPrimitive.RadioItem.displayName

/**
 * ContextMenuLabel
 */
export type ContextMenuLabelProps = React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label> & {
  inset?: boolean
}
const ContextMenuLabel = React.forwardRef<React.ElementRef<typeof ContextMenuPrimitive.Label>, ContextMenuLabelProps>(
  ({ className, inset, ...props }, ref) => (
    <ContextMenuPrimitive.Label
      ref={ref}
      className={cxm("px-2 py-1.5 text-sm font-semibold text-foreground", inset && "pl-8", className)}
      {...props}
    />
  )
)
ContextMenuLabel.displayName = ContextMenuPrimitive.Label.displayName

/**
 * ContextMenuSeparator
 */
export type ContextMenuSeparatorProps = React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator>
const ContextMenuSeparator = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Separator>,
  ContextMenuSeparatorProps
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Separator ref={ref} className={cxm("-mx-1 my-1 h-px bg-border/60", className)} {...props} />
))
ContextMenuSeparator.displayName = ContextMenuPrimitive.Separator.displayName

/**
 * ContextMenuShortcut
 */
export type ContextMenuShortcutProps = React.HTMLAttributes<HTMLSpanElement> & {
  mac?: string
  windows?: string
}
const ContextMenuShortcut = ({ className, mac, windows, children, ...props }: ContextMenuShortcutProps) => {
  const isMac = navigator.userAgent.includes("Mac")
  const isWindows = navigator.userAgent.includes("Windows")
  return (
    <span className={cxm("ml-auto text-xs tracking-widest text-muted-foreground", className)} {...props}>
      {isMac && mac}
      {isWindows && windows}
      {children}
    </span>
  )
}
ContextMenuShortcut.displayName = "ContextMenuShortcut"

/**
 * shortcut for quick dropdown menu
 */
export type ContextMenuQuickProps = React.ComponentProps<typeof ContextMenuContent> & {
  menu: React.ReactNode
}
export const ContextMenuQuick: React.FC<ContextMenuQuickProps> = ({ menu, children, ...props }) => {
  if (!menu) return children
  return (
    <ContextMenuRoot>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className={cxm("max-w-xs empty:hidden", props.className)} {...props}>
        {menu}
      </ContextMenuContent>
    </ContextMenuRoot>
  )
}

export {
  ContextMenuCheckboxItem as CheckboxItem,
  ContextMenuContent as Content,
  ContextMenuGroup as Group,
  ContextMenuItem as Item,
  ContextMenuLabel as Label,
  ContextMenuPortal as Portal,
  ContextMenuQuick as Quick,
  ContextMenuRadioGroup as RadioGroup,
  ContextMenuRadioItem as RadioItem,
  ContextMenuRoot as Root,
  ContextMenuSeparator as Separator,
  ContextMenuShortcut as Shortcut,
  ContextMenuSub as Sub,
  ContextMenuSubContent as SubContent,
  ContextMenuSubTrigger as SubTrigger,
  ContextMenuTrigger as Trigger,
}
