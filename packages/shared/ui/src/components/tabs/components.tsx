import * as TabsPrimitive from "@radix-ui/react-tabs"
import * as React from "react"
import { cn } from "@compo/utils"

/**
 * TabsRoot
 */
const TabsRoot = TabsPrimitive.Root

/**
 * TabsList
 */
export type TabsListProps = React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
const TabsList = React.forwardRef<React.ElementRef<typeof TabsPrimitive.List>, TabsListProps>(
  ({ className, ...props }, ref) => (
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        "inline-flex h-9 items-center justify-center rounded-md bg-background p-1 text-muted-foreground",
        className
      )}
      {...props}
    />
  )
)
TabsList.displayName = TabsPrimitive.List.displayName

/**
 * TabsTrigger
 */
export type TabsTriggerProps = React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
const TabsTrigger = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Trigger>, TabsTriggerProps>(
  ({ className, ...props }, ref) => (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-md px-3 py-1",
        "whitespace-nowrap text-sm font-medium",
        "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
        "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        "transition-all",
        className
      )}
      {...props}
    />
  )
)
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

/**
 * TabsContent
 */
export type TabsContentProps = React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
const TabsContent = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Content>, TabsContentProps>(
  ({ className, ...props }, ref) => (
    <TabsPrimitive.Content
      ref={ref}
      className={cn(
        "mt-2 w-full ring-offset-background data-[state=inactive]:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      {...props}
    />
  )
)
TabsContent.displayName = TabsPrimitive.Content.displayName

export { TabsContent as Content, TabsList as List, TabsRoot as Root, TabsTrigger as Trigger }
