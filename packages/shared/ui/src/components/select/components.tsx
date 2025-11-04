import { A, cn } from "@compo/utils"
import * as SelectPrimitive from "@radix-ui/react-select"
import { VariantProps } from "class-variance-authority"
import { Check, ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react"
import * as React from "react"
import { MultiSelect, MultiSelectProps } from "./multiple"
import { selectVariants } from "./variants"

/**
 * SelectRoot
 */
const SelectRoot = SelectPrimitive.Root

/**
 * SelectGroup
 */
const SelectGroup = SelectPrimitive.Group

/**
 * SelectValue
 */
const SelectValue = SelectPrimitive.Value

/**
 * SelectTrigger
 */
export type SelectTriggerProps = React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> &
  VariantProps<typeof selectVariants>
const SelectTrigger = React.forwardRef<React.ElementRef<typeof SelectPrimitive.Trigger>, SelectTriggerProps>(
  ({ className, size, variant, children, ...props }, ref) => (
    <SelectPrimitive.Trigger ref={ref} className={cn(selectVariants({ size, variant }), className)} {...props}>
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronsUpDown className='ml-1 size-3.5 opacity-50' />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
)
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

/**
 * SelectScrollUpButton
 */
const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn("flex cursor-default items-center justify-center py-1", className)}
    {...props}
  >
    <ChevronUp />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

/**
 * SelectScrollDownButton
 */
const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn("flex cursor-default items-center justify-center py-1", className)}
    {...props}
  >
    <ChevronDown />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName

/**
 * SelectContent
 */
const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

/**
 * SelectLabel
 */
const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label ref={ref} className={cn("px-2 py-1.5 text-sm font-semibold", className)} {...props} />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

/**
 * SelectItem
 */
const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground",
      className
    )}
    {...props}
  >
    <span className='absolute right-2 flex h-3.5 w-3.5 items-center justify-center'>
      <SelectPrimitive.ItemIndicator>
        <Check className='h-4 w-4' />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

/**
 * SelectSeparator
 */
const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator ref={ref} className={cn("-mx-1 my-1 h-px bg-muted", className)} {...props} />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

/**
 * SelectQuick
 */
export type SelectQuickProps = {
  id?: string
  lang?: string
  placeholder?: string
  value: string
  defaultValue?: string
  onValueChange: (value: string) => void
  options?: (React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> & {
    label: React.ReactNode
  })[]
  classNames?: {
    trigger?: string
    content?: string
    item?: string
  }
  disabled?: boolean
  children?: React.ReactNode
}

const SelectQuick: React.FC<SelectQuickProps> = ({
  id,
  placeholder,
  value,
  defaultValue,
  onValueChange,
  options = [],
  classNames,
  disabled,
  children,
  lang,
}) => {
  return (
    <SelectRoot disabled={disabled} defaultValue={defaultValue} value={value} onValueChange={onValueChange}>
      <SelectTrigger className={cn(classNames?.trigger)} id={id}>
        <SelectValue placeholder={placeholder} lang={lang} />
      </SelectTrigger>
      <SelectContent className={classNames?.content}>
        {children ||
          A.map(options, (option) => (
            <SelectItem key={option.value} {...option} className={classNames?.item} lang={lang}>
              {option.label}
            </SelectItem>
          ))}
      </SelectContent>
    </SelectRoot>
  )
}

export {
  SelectContent as Content,
  SelectGroup as Group,
  SelectItem as Item,
  SelectLabel as Label,
  MultiSelect as Multiple,
  SelectQuick as Quick,
  SelectRoot as Root,
  SelectScrollDownButton as ScrollDownButton,
  SelectScrollUpButton as ScrollUpButton,
  SelectSeparator as Separator,
  SelectTrigger as Trigger,
  SelectValue as Value,
}

export type { MultiSelectProps as MultipleProps }
