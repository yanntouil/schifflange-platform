import React from "react"
import { useIsContextMenu } from "./context"
import { ContextMenu } from "./context-menu"
import { DropdownMenu } from "./dropdown-menu"

/**
 * MenuRoot
 */
export type MenuGroupProps = DropdownMenu.DropdownMenuGroupProps | ContextMenu.ContextMenuGroupProps
const MenuGroup = React.forwardRef<HTMLDivElement, MenuGroupProps>((props, ref) => {
  const isContextMenu = useIsContextMenu()
  return isContextMenu ? <ContextMenu.Group ref={ref} {...props} /> : <DropdownMenu.Group ref={ref} {...props} />
})
MenuGroup.displayName = "MenuGroup"

/**
 * MenuCheckboxItem
 */
export type MenuCheckboxItemProps = DropdownMenu.DropdownMenuCheckboxItemProps | ContextMenu.ContextMenuCheckboxItemProps
const MenuCheckboxItem = React.forwardRef<HTMLDivElement, MenuCheckboxItemProps>((props, ref) => {
  const isContextMenu = useIsContextMenu()
  return isContextMenu ? <ContextMenu.CheckboxItem ref={ref} {...props} /> : <DropdownMenu.CheckboxItem ref={ref} {...props} />
})
MenuCheckboxItem.displayName = "MenuCheckboxItem"

/**
 * MenuContent
 */
export type MenuContentProps = DropdownMenu.DropdownMenuContentProps | ContextMenu.ContextMenuContentProps
const MenuContent = React.forwardRef<HTMLDivElement, MenuContentProps>((props, ref) => {
  const isContextMenu = useIsContextMenu()
  return isContextMenu ? <ContextMenu.Content ref={ref} {...props} /> : <DropdownMenu.Content ref={ref} {...props} />
})
MenuContent.displayName = "MenuContent"

/**
 * MenuItem
 */
export type MenuItemProps = DropdownMenu.DropdownMenuItemProps | ContextMenu.ContextMenuItemProps
const MenuItem = React.forwardRef<HTMLDivElement, MenuItemProps>((props, ref) => {
  const isContextMenu = useIsContextMenu()
  return isContextMenu ? <ContextMenu.Item ref={ref} {...props} /> : <DropdownMenu.Item ref={ref} {...props} />
})
MenuItem.displayName = "MenuItem"

/**
 * MenuLabel
 */
export type MenuLabelProps = DropdownMenu.DropdownMenuLabelProps | ContextMenu.ContextMenuLabelProps
const MenuLabel = React.forwardRef<HTMLDivElement, MenuLabelProps>((props, ref) => {
  const isContextMenu = useIsContextMenu()
  return isContextMenu ? <ContextMenu.Label ref={ref} {...props} /> : <DropdownMenu.Label ref={ref} {...props} />
})
MenuLabel.displayName = "MenuLabel"

/**
 * MenuSeparator
 */
export type MenuSeparatorProps = DropdownMenu.DropdownMenuSeparatorProps | ContextMenu.ContextMenuSeparatorProps
const MenuSeparator = React.forwardRef<HTMLDivElement, MenuSeparatorProps>((props, ref) => {
  const isContextMenu = useIsContextMenu()
  return isContextMenu ? <ContextMenu.Separator ref={ref} {...props} /> : <DropdownMenu.Separator ref={ref} {...props} />
})
MenuSeparator.displayName = "MenuSeparator"

/**
 * MenuPortal
 */
export type MenuPortalProps = DropdownMenu.DropdownMenuPortalProps | ContextMenu.ContextMenuPortalProps
const MenuPortal: React.FC<MenuPortalProps> = (props) => {
  const isContextMenu = useIsContextMenu()
  return isContextMenu ? <ContextMenu.Portal {...props} /> : <DropdownMenu.Portal {...props} />
}

/**
 * MenuRadioGroup
 */
export type MenuRadioGroupProps = ContextMenu.ContextMenuRadioGroupProps | DropdownMenu.DropdownMenuRadioGroupProps
const MenuRadioGroup = React.forwardRef<HTMLDivElement, MenuRadioGroupProps>((props, ref) => {
  const isContextMenu = useIsContextMenu()
  return isContextMenu ? <ContextMenu.RadioGroup ref={ref} {...props} /> : <DropdownMenu.RadioGroup ref={ref} {...props} />
})
MenuRadioGroup.displayName = "MenuRadioGroup"

/**
 * MenuRadioItem
 */
export type MenuRadioItemProps = ContextMenu.ContextMenuRadioItemProps | DropdownMenu.DropdownMenuRadioItemProps
const MenuRadioItem = React.forwardRef<HTMLDivElement, MenuRadioItemProps>((props, ref) => {
  const isContextMenu = useIsContextMenu()
  return isContextMenu ? <ContextMenu.RadioItem ref={ref} {...props} /> : <DropdownMenu.RadioItem ref={ref} {...props} />
})
MenuRadioItem.displayName = "MenuRadioItem"

/**
 * MenuShortcut
 */
export type MenuShortcutProps = ContextMenu.ContextMenuShortcutProps | DropdownMenu.DropdownMenuShortcutProps
const MenuShortcut: React.FC<MenuShortcutProps> = (props) => {
  const isContextMenu = useIsContextMenu()
  return isContextMenu ? <ContextMenu.Shortcut {...props} /> : <DropdownMenu.Shortcut {...props} />
}

/**
 * MenuSub
 */
export type MenuSubProps = ContextMenu.ContextMenuSubProps | DropdownMenu.DropdownMenuSubProps
const MenuSub: React.FC<MenuSubProps> = (props) => {
  const isContextMenu = useIsContextMenu()
  return isContextMenu ? <ContextMenu.Sub {...props} /> : <DropdownMenu.Sub {...props} />
}

/**
 * MenuSubContent
 */
export type MenuSubContentProps = ContextMenu.ContextMenuSubContentProps | DropdownMenu.DropdownMenuSubContentProps
const MenuSubContent = React.forwardRef<HTMLDivElement, MenuSubContentProps>((props, ref) => {
  const isContextMenu = useIsContextMenu()
  return isContextMenu ? <ContextMenu.SubContent ref={ref} {...props} /> : <DropdownMenu.SubContent ref={ref} {...props} />
})
MenuSubContent.displayName = "MenuSubContent"

/**
 * MenuSubTrigger
 */
export type MenuSubTriggerProps = ContextMenu.ContextMenuSubTriggerProps | DropdownMenu.DropdownMenuSubTriggerProps
const MenuSubTrigger = React.forwardRef<HTMLDivElement, MenuSubTriggerProps>((props, ref) => {
  const isContextMenu = useIsContextMenu()
  return isContextMenu ? <ContextMenu.SubTrigger ref={ref} {...props} /> : <DropdownMenu.SubTrigger ref={ref} {...props} />
})
MenuSubTrigger.displayName = "MenuSubTrigger"

export {
  MenuCheckboxItem as CheckboxItem,
  MenuContent as Content,
  MenuGroup as Group,
  MenuItem as Item,
  MenuLabel as Label,
  MenuPortal as Portal,
  MenuRadioGroup as RadioGroup,
  MenuRadioItem as RadioItem,
  MenuSeparator as Separator,
  MenuShortcut as Shortcut,
  MenuSub as Sub,
  MenuSubContent as SubContent,
  MenuSubTrigger as SubTrigger,
}
