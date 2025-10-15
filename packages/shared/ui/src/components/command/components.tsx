import { cn, cxm } from "@compo/utils"
import { type DialogProps } from "@radix-ui/react-dialog"
import { Command as CommandPrimitive } from "cmdk"
import { Search } from "lucide-react"
import * as React from "react"
import { Dialog } from "../dialog.old"

/**
 * CommandRoot
 */
export type CommandRootProps = React.ComponentPropsWithoutRef<typeof CommandPrimitive>
const CommandRoot = React.forwardRef<React.ElementRef<typeof CommandPrimitive>, CommandRootProps>(
  ({ className, ...props }, ref) => (
    <CommandPrimitive
      ref={ref}
      className={cn(
        "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
        className
      )}
      {...props}
    />
  )
)
CommandRoot.displayName = CommandPrimitive.displayName

/**
 * CommandDialog
 */
export type CommandDialogProps = DialogProps
const CommandDialog = React.forwardRef<React.ElementRef<typeof Dialog.Content>, CommandDialogProps>(
  ({ children, ...props }, ref) => {
    return (
      <Dialog.Root {...props}>
        <Dialog.Content className='overflow-hidden p-0' ref={ref}>
          <CommandRoot className='[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5'>
            {children}
          </CommandRoot>
        </Dialog.Content>
      </Dialog.Root>
    )
  }
)
CommandDialog.displayName = Dialog.Content.displayName

/**
 * CommandInput
 */
export type CommandInputProps = React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
const CommandInput = React.forwardRef<React.ElementRef<typeof CommandPrimitive.Input>, CommandInputProps>(
  ({ className, ...props }, ref) => (
    <div className='flex items-center border-b px-3' cmdk-input-wrapper=''>
      <Search className='mr-2 h-4 w-4 shrink-0 opacity-50' />
      <CommandPrimitive.Input
        ref={ref}
        className={cn(
          "flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    </div>
  )
)
CommandInput.displayName = CommandPrimitive.Input.displayName

/**
 * CommandList
 */
export type CommandListProps = React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
const CommandList = React.forwardRef<React.ElementRef<typeof CommandPrimitive.List>, CommandListProps>(
  ({ className, ...props }, ref) => (
    <CommandPrimitive.List
      ref={ref}
      className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)}
      {...props}
    />
  )
)
CommandList.displayName = CommandPrimitive.List.displayName

/**
 * CommandEmpty
 */
export type CommandEmptyProps = React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
const CommandEmpty = React.forwardRef<React.ElementRef<typeof CommandPrimitive.Empty>, CommandEmptyProps>(
  ({ className, ...props }, ref) => (
    <CommandPrimitive.Empty ref={ref} className={cxm("py-6 text-center text-sm", className)} {...props} />
  )
)
CommandEmpty.displayName = CommandPrimitive.Empty.displayName

/**
 * CommandGroup
 */
export type CommandGroupProps = React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
const CommandGroup = React.forwardRef<React.ElementRef<typeof CommandPrimitive.Group>, CommandGroupProps>(
  ({ className, ...props }, ref) => (
    <CommandPrimitive.Group
      ref={ref}
      className={cn(
        "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
        className
      )}
      {...props}
    />
  )
)
CommandGroup.displayName = CommandPrimitive.Group.displayName

/**
 * CommandSeparator
 */
export type CommandSeparatorProps = React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
const CommandSeparator = React.forwardRef<React.ElementRef<typeof CommandPrimitive.Separator>, CommandSeparatorProps>(
  ({ className, ...props }, ref) => (
    <CommandPrimitive.Separator ref={ref} className={cn("-mx-1 h-px bg-border", className)} {...props} />
  )
)
CommandSeparator.displayName = CommandPrimitive.Separator.displayName

/**
 * CommandItem
 */
export type CommandItemProps = React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  CommandItemProps & { selected?: boolean }
>(({ className, selected, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    data-state={selected ? "selected" : "unselected"}
    className={cn(
      "group/item relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      className
    )}
    {...props}
  />
))
CommandItem.displayName = CommandPrimitive.Item.displayName

/**
 * CommandShortcut
 */
export type CommandShortcutProps = React.HTMLAttributes<HTMLSpanElement>
const CommandShortcut = React.forwardRef<React.ElementRef<"span">, CommandShortcutProps>(
  ({ className, ...props }, ref) => {
    return (
      <span ref={ref} className={cn("ml-auto text-xs tracking-widest text-muted-foreground", className)} {...props} />
    )
  }
)
CommandShortcut.displayName = "CommandShortcut"

export {
  CommandDialog as Dialog,
  CommandEmpty as Empty,
  CommandGroup as Group,
  CommandInput as Input,
  CommandItem as Item,
  CommandList as List,
  CommandRoot as Root,
  CommandSeparator as Separator,
  CommandShortcut as Shortcut,
}
