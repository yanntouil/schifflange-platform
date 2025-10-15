import * as AvatarPrimitive from "@radix-ui/react-avatar"
import * as React from "react"
import { cn } from "@compo/utils"

/**
 * AvatarRoot
 */
export type AvatarRootProps = React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
const AvatarRoot = React.forwardRef<React.ElementRef<typeof AvatarPrimitive.Root>, AvatarRootProps>(
  ({ className, ...props }, ref) => {
    return (
      <AvatarPrimitive.Root
        ref={ref}
        className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}
        {...props}
      />
    )
  }
)
AvatarRoot.displayName = "AvatarRoot"

/**
 * AvatarImage
 */
export type AvatarImageProps = React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
const AvatarImage = React.forwardRef<React.ElementRef<typeof AvatarPrimitive.Image>, AvatarImageProps>(
  ({ className, ...props }, ref) => (
    <AvatarPrimitive.Image ref={ref} className={cn("aspect-square h-full w-full", className)} {...props} />
  )
)
AvatarImage.displayName = "AvatarImage"

/**
 * AvatarFallback
 */
export type AvatarFallbackProps = React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
const AvatarFallback = React.forwardRef<React.ElementRef<typeof AvatarPrimitive.Fallback>, AvatarFallbackProps>(
  ({ className, ...props }, ref) => (
    <AvatarPrimitive.Fallback
      ref={ref}
      className={cn("flex h-full w-full items-center justify-center rounded-full bg-muted", className)}
      {...props}
    />
  )
)
AvatarFallback.displayName = "AvatarFallback"

export { AvatarFallback as Fallback, AvatarImage as Image, AvatarRoot as Root }
