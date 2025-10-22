"use client"

import { useIsMobile, usePersistedState } from "@compo/hooks"
import { cn, z } from "@compo/utils"
import { Slot } from "@radix-ui/react-slot"
import { VariantProps } from "class-variance-authority"
import * as React from "react"
import { Icon, variants } from "../.."
import { Button } from "../button"
import { Collapsible } from "../collapsible"
import { Input } from "../input"
import { DropdownMenu } from "../menu"
import { Separator } from "../separator"
import { Sheet } from "../sheet"
import { Skeleton } from "../skeleton"
import { SrOnly } from "../sr-only"
import { Tooltip } from "../tooltip"
import { SidebarContext, SidebarContextType, useSidebar } from "./context"
import { sidebarMenuButtonVariants } from "./variants"

const SIDEBAR_COOKIE_NAME = "sidebar_state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = "20rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"
const SIDEBAR_WIDTH_ICON = "3rem"
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

/**
 * SidebarProvider
 * this is the provider for the sidebar
 */
type SidebarProviderProps = React.ComponentProps<"div"> & {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  sidebarWidth?: string
  sidebarWidthIcon?: string
  sidebarWidthMobile?: string
}
const SidebarProvider: React.FC<SidebarProviderProps> = ({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  sidebarWidth = SIDEBAR_WIDTH,
  sidebarWidthIcon = SIDEBAR_WIDTH_ICON,
  sidebarWidthMobile = SIDEBAR_WIDTH_MOBILE,
  children,
  ...props
}) => {
  const isMobile = useIsMobile()
  const [openMobile, setOpenMobile] = React.useState(false)

  // This is the internal state of the sidebar.
  // We use openProp and setOpenProp for control from outside the component.
  const [_open, _setOpen] = React.useState(defaultOpen)
  const open = openProp ?? _open
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value
      if (setOpenProp) {
        setOpenProp(openState)
      } else {
        _setOpen(openState)
      }

      // This sets the cookie to keep the sidebar state.
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
    },
    [setOpenProp, open]
  )

  // Helper to toggle the sidebar.
  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open)
  }, [isMobile, setOpen, setOpenMobile])

  // Adds a keyboard shortcut to toggle the sidebar.
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        toggleSidebar()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [toggleSidebar])

  // We add a state so that we can do data-state="expanded" or "collapsed".
  // This makes it easier to style the sidebar with Tailwind classes.
  const state = open ? "expanded" : "collapsed"

  const contextValue = React.useMemo<SidebarContextType>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
      sidebarWidth,
      sidebarWidthIcon,
      sidebarWidthMobile,
    }),
    [
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
      sidebarWidth,
      sidebarWidthIcon,
      sidebarWidthMobile,
    ]
  )

  return (
    <SidebarContext.Provider value={contextValue}>
      <Tooltip.Provider delayDuration={0}>
        <div
          data-slot='sidebar-wrapper'
          style={
            {
              "--sidebar-width": sidebarWidth,
              "--sidebar-width-icon": sidebarWidthIcon,
              ...style,
            } as React.CSSProperties
          }
          className={cn("group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full", className)}
          {...props}
        >
          {children}
        </div>
      </Tooltip.Provider>
    </SidebarContext.Provider>
  )
}

/**
 * Sidebar
 * this is the main component for the sidebar
 */
type SidebarProps = React.ComponentProps<"div"> & {
  side?: "left" | "right"
  variant?: "sidebar" | "floating" | "inset"
  collapsible?: "offcanvas" | "icon" | "none" | "forceIcon"
}
const Sidebar: React.FC<SidebarProps> = ({
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  className,
  children,
  ...props
}) => {
  const { isMobile, state, openMobile, setOpenMobile, sidebarWidthMobile } = useSidebar()

  if (collapsible === "none") {
    return (
      <div
        data-slot='sidebar'
        className={cn("bg-sidebar text-sidebar-foreground flex h-full w-(--sidebar-width) flex-col", className)}
        {...props}
      >
        {children}
      </div>
    )
  }

  if (isMobile) {
    return (
      <Sheet.Root open={openMobile} onOpenChange={setOpenMobile} {...props}>
        <Sheet.Content
          data-sidebar='sidebar'
          data-slot='sidebar'
          data-mobile='true'
          className='bg-sidebar text-sidebar-foreground w-(--sidebar-width) p-0 [&>button]:hidden'
          style={
            {
              "--sidebar-width": sidebarWidthMobile,
            } as React.CSSProperties
          }
          side={side}
        >
          <Sheet.Header className='sr-only'>
            <Sheet.Title>Sidebar</Sheet.Title>
            <Sheet.Description>Displays the mobile sidebar.</Sheet.Description>
          </Sheet.Header>
          <div className='flex h-full w-full flex-col'>{children}</div>
        </Sheet.Content>
      </Sheet.Root>
    )
  }

  return (
    <div
      className='group peer text-sidebar-foreground hidden md:block'
      data-state={state}
      data-collapsible={state === "collapsed" ? collapsible : ""}
      data-variant={variant}
      data-side={side}
      data-slot='sidebar'
    >
      {/* This is what handles the sidebar gap on desktop */}
      <div
        data-slot='sidebar-gap'
        className={cn(
          "relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear",
          "group-data-[collapsible=offcanvas]:w-0",
          "group-data-[side=right]:rotate-180",
          variant === "floating" || variant === "inset"
            ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]"
            : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)"
        )}
      />
      <div
        data-slot='sidebar-container'
        className={cn(
          "fixed inset-y-0 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex",
          side === "left"
            ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
            : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
          // Adjust the padding for floating and inset variants.
          variant === "floating" || variant === "inset"
            ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]"
            : "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l",
          className
        )}
        {...props}
      >
        <div
          data-sidebar='sidebar'
          data-slot='sidebar-inner'
          className='bg-sidebar group-data-[variant=floating]:border-sidebar-border flex h-full w-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow-sm'
        >
          {children}
        </div>
      </div>
    </div>
  )
}

/**
 * SidebarTrigger
 * this is the trigger for the sidebar
 */
type SidebarTriggerProps = React.ComponentProps<typeof Button>
const SidebarTrigger: React.FC<SidebarTriggerProps> = ({
  className,
  variant = "ghost",
  size = "default",
  onClick,
  ...props
}) => {
  const { toggleSidebar, open } = useSidebar()
  const iconRef = React.useRef<Icon.PanelLeftOpenIconHandle | Icon.PanelLeftCloseIconHandle>(null)
  return (
    <Button
      data-sidebar='trigger'
      data-slot='sidebar-trigger'
      variant={variant}
      size={size}
      icon
      className={cn("size-7", className)}
      onMouseEnter={() => iconRef.current?.startAnimation()}
      onMouseLeave={() => iconRef.current?.stopAnimation()}
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      {...props}
    >
      {open ? <Icon.PanelLeftClose ref={iconRef} /> : <Icon.PanelLeftOpen ref={iconRef} />}
      <span className='sr-only'>Toggle Sidebar</span>
    </Button>
  )
}

/**
 * SidebarRail
 * this is the rail for the sidebar
 */
type SidebarRailProps = React.ComponentProps<"button">
const SidebarRail: React.FC<SidebarRailProps> = ({ className, ...props }) => {
  const { toggleSidebar } = useSidebar()

  return (
    <button
      data-sidebar='rail'
      data-slot='sidebar-rail'
      aria-label='Toggle Sidebar'
      tabIndex={-1}
      onClick={toggleSidebar}
      title='Toggle Sidebar'
      className={cn(
        "hover:after:bg-sidebar-border absolute inset-y-0 hidden w-4 -translate-x-1/2 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] sm:flex",
        "in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        "hover:group-data-[collapsible=offcanvas]:bg-sidebar group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full",
        "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        className
      )}
      {...props}
    />
  )
}

/**
 * SidebarInset
 * this is the inset for the sidebar
 */
type SidebarInsetProps = React.ComponentProps<"main">
const SidebarInset: React.FC<SidebarInsetProps> = ({ className, ...props }) => {
  return (
    <main
      data-slot='sidebar-inset'
      className={cn(
        "bg-background relative flex w-full flex-1 flex-col",
        "md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2",
        className
      )}
      {...props}
    />
  )
}

/**
 * SidebarInput
 * this is the input for the sidebar
 */
type SidebarInputProps = React.ComponentProps<typeof Input>
const SidebarInput: React.FC<SidebarInputProps> = ({ className, ...props }) => {
  return (
    <Input
      data-slot='sidebar-input'
      data-sidebar='input'
      className={cn("bg-background h-8 w-full shadow-none", className)}
      {...props}
    />
  )
}

/**
 * SidebarHeader
 * this is the header for the sidebar
 */
type SidebarHeaderProps = React.ComponentProps<"div">
const SidebarHeader: React.FC<SidebarHeaderProps> = ({ className, ...props }) => {
  return (
    <div
      data-slot='sidebar-header'
      data-sidebar='header'
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props}
    />
  )
}

/**
 * SidebarFooter
 * this is the footer for the sidebar
 */
type SidebarFooterProps = React.ComponentProps<"div">
const SidebarFooter: React.FC<SidebarFooterProps> = ({ className, ...props }) => {
  return (
    <div
      data-slot='sidebar-footer'
      data-sidebar='footer'
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props}
    />
  )
}

/**
 * SidebarSeparator
 * this is the separator for the sidebar
 */
type SidebarSeparatorProps = React.ComponentProps<typeof Separator>
const SidebarSeparator: React.FC<SidebarSeparatorProps> = ({ className, ...props }) => {
  return (
    <Separator
      data-slot='sidebar-separator'
      data-sidebar='separator'
      className={cn("bg-sidebar-border mx-2 w-auto", className)}
      {...props}
    />
  )
}

/**
 * SidebarContent
 * this is the content for the sidebar
 */
type SidebarContentProps = React.ComponentProps<"div">
const SidebarContent: React.FC<SidebarContentProps> = ({ className, ...props }) => {
  return (
    <div
      data-slot='sidebar-content'
      data-sidebar='content'
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
        variants.scrollbar({ variant: "thin" }),
        className
      )}
      {...props}
    />
  )
}

/**
 * SidebarGroup
 * this is the group for the sidebar
 */
type SidebarGroupProps = React.ComponentProps<"div">
const SidebarGroup: React.FC<SidebarGroupProps> = ({ className, ...props }) => {
  return (
    <div
      data-slot='sidebar-group'
      data-sidebar='group'
      className={cn("relative flex w-full min-w-0 flex-col p-2", className)}
      {...props}
    />
  )
}

/**
 * SidebarGroupLabel
 * this is the label for the sidebar
 */
type SidebarGroupLabelProps = React.ComponentProps<"div"> & { asChild?: boolean }
const SidebarGroupLabel: React.FC<SidebarGroupLabelProps> = ({ className, asChild = false, ...props }) => {
  const Comp = asChild ? Slot : "div"

  return (
    <Comp
      data-slot='sidebar-group-label'
      data-sidebar='group-label'
      className={cn(
        "text-sidebar-foreground/70 ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
        className
      )}
      {...props}
    />
  )
}

/**
 * SidebarGroupAction
 * this is the action for the sidebar
 */
type SidebarGroupActionProps = React.ComponentProps<"button"> & { asChild?: boolean }
const SidebarGroupAction: React.FC<SidebarGroupActionProps> = ({ className, asChild = false, ...props }) => {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot='sidebar-group-action'
      data-sidebar='group-action'
      className={cn(
        "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-transform focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 md:after:hidden",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  )
}

/**
 * SidebarGroupContent
 * this is the content for the sidebar
 */
type SidebarGroupContentProps = React.ComponentProps<"div">
const SidebarGroupContent: React.FC<SidebarGroupContentProps> = ({ className, ...props }) => {
  return (
    <div
      data-slot='sidebar-group-content'
      data-sidebar='group-content'
      className={cn("w-full text-sm", className)}
      {...props}
    />
  )
}

/**
 * SidebarMenu
 * this is the menu for the sidebar
 */
type SidebarMenuProps = React.ComponentProps<"ul">
const SidebarMenu: React.FC<SidebarMenuProps> = ({ className, ...props }) => {
  return (
    <ul
      data-slot='sidebar-menu'
      data-sidebar='menu'
      className={cn("flex w-full min-w-0 flex-col gap-1", className)}
      {...props}
    />
  )
}

/**
 * SidebarMenuItem
 * this is the item for the sidebar
 */
type SidebarMenuItemProps = React.ComponentProps<"li">
const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({ className, ...props }) => {
  return (
    <li
      data-slot='sidebar-menu-item'
      data-sidebar='menu-item'
      className={cn("group/menu-item relative", className)}
      {...props}
    />
  )
}

/**
 * SidebarMenuButton
 * this is the button for the sidebar
 */
type SidebarMenuButtonProps = React.ComponentProps<"button"> & {
  asChild?: boolean
  isActive?: boolean
  tooltip?: string | React.ComponentProps<typeof Tooltip.Content>
} & VariantProps<typeof sidebarMenuButtonVariants>
const SidebarMenuButton: React.FC<SidebarMenuButtonProps> = ({
  asChild = false,
  isActive = false,
  variant = "default",
  size = "default",
  tooltip,
  className,
  ...props
}) => {
  const Comp = asChild ? Slot : "button"
  const { isMobile, state } = useSidebar()

  const button = (
    <Comp
      data-slot='sidebar-menu-button'
      data-sidebar='menu-button'
      data-size={size}
      data-active={isActive}
      className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
      {...props}
    />
  )

  if (!tooltip) {
    return button
  }

  if (typeof tooltip === "string") {
    tooltip = {
      children: tooltip,
    }
  }

  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>{button}</Tooltip.Trigger>
      <Tooltip.Content side='right' align='center' hidden={state !== "collapsed" || isMobile} {...tooltip} />
    </Tooltip.Root>
  )
}

/**
 * SidebarMenuAction
 * this is the action for the sidebar
 */
type SidebarMenuActionProps = React.ComponentProps<"button"> & {
  asChild?: boolean
  showOnHover?: boolean
}
const SidebarMenuAction: React.FC<SidebarMenuActionProps> = ({
  asChild = false,
  showOnHover = false,
  className,
  ...props
}) => {
  return (
    <button
      data-slot='sidebar-menu-action'
      data-sidebar='menu-action'
      className={cn(
        "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground peer-hover/menu-button:text-sidebar-accent-foreground absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-transform focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 md:after:hidden",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        showOnHover &&
          "peer-data-[active=true]/menu-button:text-sidebar-accent-foreground group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 md:opacity-0",
        className
      )}
      {...props}
    />
  )
}
/**
 * ContactPlusButton
 * This button is used to create a contact. It is only visible if the sidebar is expanded.
 */
type SidebarMenuSubActionProps = {
  tooltip: string
  onClick: () => void
  className?: string
  children: React.ReactNode
}
const SidebarMenuSubAction: React.FC<SidebarMenuSubActionProps> = ({ tooltip, onClick, className, children }) => {
  const { state } = useSidebar()
  const isExpanded = state === "expanded"
  if (!isExpanded) return null
  return (
    <Tooltip.Quick tooltip={tooltip} asChild side='right'>
      <Button
        variant='ghost'
        icon
        size='xs'
        className={cn(
          "-mr-[21px] flex opacity-0 transition-opacity duration-300 group-focus-within/button:opacity-100 group-hover/button:opacity-100",
          className
        )}
        onClick={onClick}
      >
        {children}
        <SrOnly>{tooltip}</SrOnly>
      </Button>
    </Tooltip.Quick>
  )
}

/**
 * SidebarMenuBadge
 * this is the badge for the sidebar
 */
type SidebarMenuBadgeProps = React.ComponentProps<"div">
const SidebarMenuBadge: React.FC<SidebarMenuBadgeProps> = ({ className, ...props }) => {
  return (
    <div
      data-slot='sidebar-menu-badge'
      data-sidebar='menu-badge'
      className={cn(
        "text-sidebar-foreground pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums select-none",
        "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  )
}

/**
 * SidebarMenuSkeleton
 * this is the skeleton for the sidebar
 */
type SidebarMenuSkeletonProps = React.ComponentProps<"div"> & {
  showIcon?: boolean
}
const SidebarMenuSkeleton: React.FC<SidebarMenuSkeletonProps> = ({ className, showIcon = false, ...props }) => {
  // Random width between 50 to 90%.
  const width = React.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`
  }, [])

  return (
    <div
      data-slot='sidebar-menu-skeleton'
      data-sidebar='menu-skeleton'
      className={cn("flex h-8 items-center gap-2 rounded-md px-2", className)}
      {...props}
    >
      {showIcon && <Skeleton className='size-4 rounded-md' data-sidebar='menu-skeleton-icon' />}
      <Skeleton
        className='h-4 max-w-(--skeleton-width) flex-1'
        data-sidebar='menu-skeleton-text'
        style={
          {
            "--skeleton-width": width,
          } as React.CSSProperties
        }
      />
    </div>
  )
}

/**
 * SidebarMenuSub
 * this is the sub for the sidebar
 */
type SidebarMenuSubProps = React.ComponentProps<"ul">
const SidebarMenuSub: React.FC<SidebarMenuSubProps> = ({ className, ...props }) => {
  return (
    <ul
      data-slot='sidebar-menu-sub'
      data-sidebar='menu-sub'
      className={cn(
        "border-sidebar-border mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l px-2.5 py-0.5",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  )
}

/**
 * SidebarMenuSubItem
 * this is the sub item for the sidebar
 */
type SidebarMenuSubItemProps = React.ComponentProps<"li">
const SidebarMenuSubItem: React.FC<SidebarMenuSubItemProps> = ({ className, ...props }) => {
  return (
    <li
      data-slot='sidebar-menu-sub-item'
      data-sidebar='menu-sub-item'
      className={cn("group/menu-sub-item relative", className)}
      {...props}
    />
  )
}

/**
 * SidebarMenuSubButton
 * this is the sub button for the sidebar
 */
type SidebarMenuSubButtonProps = React.ComponentProps<"a"> & {
  asChild?: boolean
  size?: "sm" | "md"
  isActive?: boolean
}
const SidebarMenuSubButton: React.FC<SidebarMenuSubButtonProps> = ({
  asChild = false,
  size = "md",
  isActive = false,
  className,
  ...props
}) => {
  const Comp = asChild ? Slot : "a"

  return (
    <Comp
      data-slot='sidebar-menu-sub-button'
      data-sidebar='menu-sub-button'
      data-size={size}
      data-active={isActive}
      className={cn(
        "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground [&>svg]:text-sidebar-accent-foreground flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 outline-hidden focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
        "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
        size === "sm" && "text-xs",
        size === "md" && "text-sm",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  )
}

/**
 * SidebarCollapsibleMenuItem
 * this is the collapsible menu item for the sidebar
 */
type SidebarCollapsibleMenuItemProps = {
  defaultOpen?: boolean
  persistKey: string
  children: React.ReactNode
} & React.ComponentProps<typeof SidebarMenuItem>
const SidebarCollapsibleMenuItem: React.FC<SidebarCollapsibleMenuItemProps> = ({
  defaultOpen = true,
  persistKey,
  children,
  ...props
}) => {
  const [open, onOpenChange] = usePersistedState(
    defaultOpen,
    persistKey,
    z.boolean(),
    typeof window !== "undefined" ? localStorage : undefined
  )
  const { state } = useSidebar()
  return (
    <SidebarMenuItem {...props}>
      <Collapsible.Root open={open} onOpenChange={onOpenChange} className='group/collapsible'>
        {state === "expanded" ? children : <DropdownMenu.Root>{children}</DropdownMenu.Root>}
      </Collapsible.Root>
    </SidebarMenuItem>
  )
}

/**
 * SidebarCollapsibleMenuButton
 * this is the content for the sidebar
 */
type SidebarCollapsibleMenuButtonProps = {
  tooltip?: string
  children: React.ReactNode
} & React.ComponentProps<typeof SidebarMenuButton>
const SidebarCollapsibleMenuButton: React.FC<SidebarCollapsibleMenuButtonProps> = ({ children, tooltip, ...props }) => {
  const { state, isMobile } = useSidebar()
  const iconRef = React.useRef<Icon.ChevronDownHandle>(null)
  if (state === "expanded")
    return (
      <Collapsible.Trigger asChild>
        <SidebarMenuButton
          tooltip={tooltip}
          {...props}
          onMouseEnter={(e) => {
            iconRef.current?.startAnimation()
            props.onMouseEnter?.(e)
          }}
          onMouseLeave={(e) => {
            iconRef.current?.stopAnimation()
            props.onMouseLeave?.(e)
          }}
        >
          {children}
          <Icon.ChevronDown
            ref={iconRef}
            className='ml-auto size-4 transition-transform group-data-[state=open]/collapsible:rotate-180'
          />
        </SidebarMenuButton>
      </Collapsible.Trigger>
    )
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <DropdownMenu.Trigger className={sidebarMenuButtonVariants({ variant: "default", size: "default" })} {...props}>
          {children}
          <Icon.ChevronDown
            ref={iconRef}
            className='ml-auto size-4 transition-transform group-data-[state=open]/collapsible:rotate-180'
          />
        </DropdownMenu.Trigger>
      </Tooltip.Trigger>
      {tooltip && (
        <Tooltip.Content side='right' align='center' hidden={state !== "collapsed" || isMobile}>
          {tooltip}
        </Tooltip.Content>
      )}
    </Tooltip.Root>
  )
}
/**
 * SidebarCollapsibleMenuSub
 * this is the content for the sidebar
 */
type SidebarCollapsibleMenuSubProps = {
  children: React.ReactNode
}
const SidebarCollapsibleMenuSub: React.FC<SidebarCollapsibleMenuButtonProps> = ({ children }) => {
  const { state } = useSidebar()
  if (state === "expanded")
    return (
      <Collapsible.Content>
        <SidebarMenuSub>{children}</SidebarMenuSub>
      </Collapsible.Content>
    )
  return (
    <DropdownMenu.Content side='right' align='start'>
      {children}
    </DropdownMenu.Content>
  )
}

type SidebarCollapsibleMenuSubButtonProps = {
  children: React.ReactNode
  action?: React.ReactNode
} & (React.ComponentProps<typeof SidebarMenuSubButton> & React.ComponentProps<typeof DropdownMenu.Item>)
const SidebarCollapsibleMenuSubButton: React.FC<SidebarCollapsibleMenuSubButtonProps> = ({
  children,
  className,
  action,
  ...props
}) => {
  const { state } = useSidebar()

  if (state === "expanded") {
    if (!!action) {
      return (
        <div className='group/button flex items-center gap-1'>
          <SidebarMenuSubItem className={cn("grow", className)}>
            <SidebarMenuSubButton asChild {...props}>
              {children}
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
          {action}
        </div>
      )
    }
    return (
      <SidebarMenuSubItem className={className}>
        <SidebarMenuSubButton asChild {...props}>
          {children}
        </SidebarMenuSubButton>
      </SidebarMenuSubItem>
    )
  }
  return (
    <DropdownMenu.Item asChild {...props}>
      {children}
    </DropdownMenu.Item>
  )
}
export {
  SidebarCollapsibleMenuButton as CollapsibleMenuButton,
  SidebarCollapsibleMenuItem as CollapsibleMenuItem,
  SidebarCollapsibleMenuSub as CollapsibleMenuSub,
  SidebarCollapsibleMenuSubButton as CollapsibleMenuSubButton,
  SidebarContent as Content,
  SidebarFooter as Footer,
  SidebarGroup as Group,
  SidebarGroupAction as GroupAction,
  SidebarGroupContent as GroupContent,
  SidebarGroupLabel as GroupLabel,
  SidebarHeader as Header,
  SidebarInput as Input,
  SidebarInset as Inset,
  SidebarMenu as Menu,
  SidebarMenuAction as MenuAction,
  SidebarMenuBadge as MenuBadge,
  SidebarMenuButton as MenuButton,
  SidebarMenuItem as MenuItem,
  SidebarMenuSkeleton as MenuSkeleton,
  SidebarMenuSub as MenuSub,
  SidebarMenuSubAction as MenuSubAction,
  SidebarMenuSubButton as MenuSubButton,
  SidebarMenuSubItem as MenuSubItem,
  SidebarProvider as Provider,
  SidebarRail as Rail,
  Sidebar as Root,
  SidebarSeparator as Separator,
  SidebarTrigger as Trigger,
}
