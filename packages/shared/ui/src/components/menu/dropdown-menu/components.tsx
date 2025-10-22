import { cxm } from "@compo/utils"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { Check, ChevronRight, Circle, CircleCheckBig } from "lucide-react"
import * as React from "react"
import { variants } from "../../.."
import { MenuContext } from "../context"

/**
 * DropdownMenuRoot
 */
export type DropdownMenuRootProps = React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Root>
const DropdownMenuRoot: React.FC<DropdownMenuRootProps> = ({ children, ...props }) => {
  return (
    <MenuContext.Provider value={{ type: "dropdown-menu" }}>
      <DropdownMenuPrimitive.Root {...props}>{children}</DropdownMenuPrimitive.Root>
    </MenuContext.Provider>
  )
}

/**
 * DropdownMenuTrigger
 */
export type DropdownMenuTriggerProps = React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Trigger>
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

/**
 * DropdownMenuGroup
 */
export type DropdownMenuGroupProps = React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Group>
const DropdownMenuGroup = DropdownMenuPrimitive.Group

/**
 * DropdownMenuPortal
 */
export type DropdownMenuPortalProps = React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Portal>
const DropdownMenuPortal = DropdownMenuPrimitive.Portal

/**
 * DropdownMenuSub
 */
export type DropdownMenuSubProps = React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Sub>
const DropdownMenuSub = DropdownMenuPrimitive.Sub

/**
 * DropdownMenuRadioGroup
 */
export type DropdownMenuRadioGroupProps = React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioGroup>
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

/**
 * DropdownMenuSubTrigger
 */
export type DropdownMenuSubTriggerProps = React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
  inset?: boolean
}
const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  DropdownMenuSubTriggerProps
>(({ className, inset, children, disabled, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    disabled={disabled}
    className={cxm(
      "flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none data-[state=open]:bg-accent focus:bg-accent [&>svg]:size-4 [&>svg]:shrink-0",
      disabled && "pointer-events-none opacity-50",

      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    {!disabled && <ChevronRight className='ml-auto !size-3 shrink-0' />}
  </DropdownMenuPrimitive.SubTrigger>
))
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName

/**
 * DropdownMenuSubContent
 */
export type DropdownMenuSubContentProps = React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  DropdownMenuSubContentProps
>(({ className, style, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cxm(
      "min-w-[8rem] overflow-hidden rounded-md border border-border/60 bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      "overflow-y-auto",
      variants.scrollbar({ variant: "thin" }),
      className
    )}
    style={{ maxHeight: "var(--radix-popper-available-height)", ...style }}
    {...props}
  />
))
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName

/**
 * DropdownMenuContent
 */
export type DropdownMenuContentProps = React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content> & {
  sideOffset?: number
}
const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  DropdownMenuContentProps
>(({ className, sideOffset = 4, style, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cxm(
        "min-w-[8rem] overflow-hidden rounded-md border border-border/60 bg-popover p-1 text-popover-foreground shadow-md",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        "overflow-y-auto",
        variants.scrollbar({ variant: "thin" }),
        className
      )}
      style={{ maxHeight: "var(--radix-popper-available-height)", ...style }}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

/**
 * DropdownMenuItem
 */
export type DropdownMenuItemProps = React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
  inset?: boolean
  active?: boolean
}
const DropdownMenuItem = React.forwardRef<React.ElementRef<typeof DropdownMenuPrimitive.Item>, DropdownMenuItemProps>(
  ({ className, inset, active, ...props }, ref) => (
    <DropdownMenuPrimitive.Item
      ref={ref}
      className={cxm(
        "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0",
        inset && "pl-8",
        active && "bg-accent text-accent-foreground",
        className
      )}
      {...props}
    />
  )
)
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

/**
 * DropdownMenuCheckboxItem
 */
export type DropdownMenuCheckboxItemProps = React.ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.CheckboxItem
> & {
  side?: "left" | "right"
}
const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  DropdownMenuCheckboxItemProps
>(({ className, children, checked, side = "left", ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cxm(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground",
      side === "left" ? "pl-8 pr-2" : "pr-8 pl-2",
      className
    )}
    checked={checked}
    {...props}
  >
    <span
      className={cxm("absolute flex h-3.5 w-3.5 items-center justify-center", side === "left" ? "left-2" : "right-2")}
    >
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className='!size-4 shrink-0' />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
))
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName

/**
 * DropdownMenuRadioItem
 */
export type DropdownMenuRadioItemProps = React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  DropdownMenuRadioItemProps
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cxm(
      "group relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[state=checked]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground",
      className
    )}
    {...props}
  >
    <span className='absolute left-2 flex size-3.5 items-center justify-center' aria-hidden>
      <DropdownMenuPrimitive.ItemIndicator forceMount>
        <CircleCheckBig className='!size-4 shrink-0 group-data-[state=checked]:block hidden' />
        <Circle className='!size-4 shrink-0 group-data-[state=unchecked]:block hidden text-muted group-hover:text-muted-foreground group-focus:text-muted-foreground transition-colors duration-300 ease-in-out' />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
))
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName

/**
 * DropdownMenuLabel
 */
export type DropdownMenuLabelProps = React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
  inset?: boolean
}
const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  DropdownMenuLabelProps
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cxm("px-2 py-1.5 text-sm font-semibold text-foreground", inset && "pl-8", className)}
    {...props}
  />
))
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

/**
 * DropdownMenuSeparator
 */
export type DropdownMenuSeparatorProps = React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  DropdownMenuSeparatorProps
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator ref={ref} className={cxm("-mx-1 my-1 h-px bg-border/60", className)} {...props} />
))
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

/**
 * DropdownMenuShortcut
 */
export type DropdownMenuShortcutProps = React.HTMLAttributes<HTMLSpanElement> & {
  mac?: string
  windows?: string
}
const DropdownMenuShortcut = React.forwardRef<React.ElementRef<"span">, DropdownMenuShortcutProps>(
  ({ className, mac, windows, children, ...props }, ref) => {
    const isMac = navigator.userAgent.includes("Mac")
    const isWindows = navigator.userAgent.includes("Windows")
    return (
      <span ref={ref} className={cxm("ml-auto text-xs tracking-widest text-muted-foreground", className)} {...props}>
        {isMac && mac}
        {isWindows && windows}
        {children}
      </span>
    )
  }
)
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

/**
 * shortcut for quick dropdown menu
 */
export const DropdownMenuQuick: React.FC<
  React.ComponentProps<typeof DropdownMenuContent> & {
    menu: React.ReactNode
  }
> = ({ menu, children, align = "end", side = "bottom", ...props }) => {
  if (!menu) return
  return (
    <DropdownMenuRoot>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        side={side}
        className={cxm("max-w-xs empty:hidden", props.className)}
        sideOffset={6}
        {...props}
      >
        {menu}
      </DropdownMenuContent>
    </DropdownMenuRoot>
  )
}

export {
  DropdownMenuCheckboxItem as CheckboxItem,
  DropdownMenuContent as Content,
  DropdownMenuGroup as Group,
  DropdownMenuItem as Item,
  DropdownMenuLabel as Label,
  DropdownMenuPortal as Portal,
  DropdownMenuQuick as Quick,
  DropdownMenuRadioGroup as RadioGroup,
  DropdownMenuRadioItem as RadioItem,
  DropdownMenuRoot as Root,
  DropdownMenuSeparator as Separator,
  DropdownMenuShortcut as Shortcut,
  DropdownMenuSub as Sub,
  DropdownMenuSubContent as SubContent,
  DropdownMenuSubTrigger as SubTrigger,
  DropdownMenuTrigger as Trigger,
}
