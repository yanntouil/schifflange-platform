"use client"

import { Primitives } from "@compo/primitives"
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react"
import * as React from "react"

import { cn } from "@/lib/utils"

const DropdownMenu = Primitives.DropdownMenu.Root

const DropdownMenuPortal = Primitives.DropdownMenu.Portal

const DropdownMenuTrigger = React.forwardRef<
  React.ElementRef<typeof Primitives.DropdownMenu.Trigger>,
  React.ComponentPropsWithoutRef<typeof Primitives.DropdownMenu.Trigger>
>(({ ...props }, ref) => <Primitives.DropdownMenu.Trigger ref={ref} data-slot='dropdown-menu-trigger' {...props} />)
DropdownMenuTrigger.displayName = Primitives.DropdownMenu.Trigger.displayName

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof Primitives.DropdownMenu.Content>,
  React.ComponentPropsWithoutRef<typeof Primitives.DropdownMenu.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <Primitives.DropdownMenu.Portal>
    <Primitives.DropdownMenu.Content
      ref={ref}
      data-slot='dropdown-menu-content'
      sideOffset={sideOffset}
      /*
border-radius: 8px;
background: var(--White, #FFF);
box-shadow: 4px 4px 16px 0 rgba(48, 55, 80, 0.08);

      */
      className={cn(
        "rounded-[8px] py-2 bg-popover shadow-[4px_4px_16px_0_rgba(48,55,80,0.08)] text-popover-foreground",
        "min-w-[8rem] overflow-hidden",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </Primitives.DropdownMenu.Portal>
))
DropdownMenuContent.displayName = Primitives.DropdownMenu.Content.displayName

function DropdownMenuGroup({ ...props }: React.ComponentProps<typeof Primitives.DropdownMenu.Group>) {
  return <Primitives.DropdownMenu.Group data-slot='dropdown-menu-group' {...props} />
}

function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: React.ComponentProps<typeof Primitives.DropdownMenu.Item> & {
  inset?: boolean
  variant?: "default" | "destructive"
}) {
  return (
    <Primitives.DropdownMenu.Item
      data-slot='dropdown-menu-item'
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "relative flex cursor-default items-center gap-2 py-2 px-4 text-xs outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      {...props}
    />
  )
}

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof Primitives.DropdownMenu.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof Primitives.DropdownMenu.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <Primitives.DropdownMenu.CheckboxItem
    ref={ref}
    data-slot='dropdown-menu-checkbox-item'
    className={cn(
      "relative flex cursor-default items-center gap-2 py-2 pr-2 pl-[58px] text-xs outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className='pointer-events-none absolute left-[34.25px] flex size-3.5 items-center justify-center'>
      <span className='border-[1.25px] border-powder-40 rounded-[2px] size-[13.5px] flex items-center justify-center'>
        <Primitives.DropdownMenu.ItemIndicator>
          <CheckIcon className='size-2.5 text-powder-80' />
        </Primitives.DropdownMenu.ItemIndicator>
      </span>
    </span>
    {children}
  </Primitives.DropdownMenu.CheckboxItem>
))
DropdownMenuCheckboxItem.displayName = Primitives.DropdownMenu.CheckboxItem.displayName

function DropdownMenuRadioGroup({ ...props }: React.ComponentProps<typeof Primitives.DropdownMenu.RadioGroup>) {
  return <Primitives.DropdownMenu.RadioGroup data-slot='dropdown-menu-radio-group' {...props} />
}

function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Primitives.DropdownMenu.RadioItem>) {
  return (
    <Primitives.DropdownMenu.RadioItem
      data-slot='dropdown-menu-radio-item'
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <span className='pointer-events-none absolute left-2 flex size-3.5 items-center justify-center'>
        <Primitives.DropdownMenu.ItemIndicator>
          <CircleIcon className='size-2 fill-current' />
        </Primitives.DropdownMenu.ItemIndicator>
      </span>
      {children}
    </Primitives.DropdownMenu.RadioItem>
  )
}

const TriangleSvg = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox='0 0 6 8' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
    <path
      d='M5.1 3.48039C5.5 3.71133 5.5 4.28868 5.1 4.51962L0.899999 6.94449C0.5 7.17543 -3.01029e-07 6.88675 -2.8084e-07 6.42487L-6.8851e-08 1.57513C-4.86616e-08 1.11325 0.5 0.824573 0.9 1.05551L5.1 3.48039Z'
      fill='#1D1D1B'
    />
  </svg>
)

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof Primitives.DropdownMenu.Label>,
  React.ComponentPropsWithoutRef<typeof Primitives.DropdownMenu.Label> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <Primitives.DropdownMenu.Label
    ref={ref}
    data-slot='dropdown-menu-label'
    data-inset={inset}
    className={cn(
      "px-4 py-2 gap-2 inline-flex items-center text-xs font-semibold data-[inset]:pl-8 text-tuna",
      className
    )}
    {...props}
  >
    <TriangleSvg className='size-2' aria-hidden />
    {children}
  </Primitives.DropdownMenu.Label>
))
DropdownMenuLabel.displayName = Primitives.DropdownMenu.Label.displayName

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof Primitives.DropdownMenu.Separator>,
  React.ComponentPropsWithoutRef<typeof Primitives.DropdownMenu.Separator>
>(({ className, ...props }, ref) => (
  <Primitives.DropdownMenu.Separator
    ref={ref}
    data-slot='dropdown-menu-separator'
    className={cn("bg-border my-2 h-[1px]", className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = Primitives.DropdownMenu.Separator.displayName

function DropdownMenuShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot='dropdown-menu-shortcut'
      className={cn("text-muted-foreground ml-auto text-xs tracking-widest", className)}
      {...props}
    />
  )
}

function DropdownMenuSub({ ...props }: React.ComponentProps<typeof Primitives.DropdownMenu.Sub>) {
  return <Primitives.DropdownMenu.Sub data-slot='dropdown-menu-sub' {...props} />
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof Primitives.DropdownMenu.SubTrigger> & {
  inset?: boolean
}) {
  return (
    <Primitives.DropdownMenu.SubTrigger
      data-slot='dropdown-menu-sub-trigger'
      data-inset={inset}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[inset]:pl-8",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className='ml-auto size-4' />
    </Primitives.DropdownMenu.SubTrigger>
  )
}

function DropdownMenuSubContent({
  className,
  ...props
}: React.ComponentProps<typeof Primitives.DropdownMenu.SubContent>) {
  return (
    <Primitives.DropdownMenu.SubContent
      data-slot='dropdown-menu-sub-content'
      className={cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-lg",
        className
      )}
      {...props}
    />
  )
}

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
}
