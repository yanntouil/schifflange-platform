import { ChevronRight, Loader2, MoreHorizontal } from "lucide-react"
import * as React from "react"
import { Primitives } from "../.."
import { cxm } from "@compo/utils"

/**
 * BreadcrumbRoot
 */
export type BreadcrumbRootProps = React.ComponentPropsWithoutRef<"nav"> & {
  separator?: React.ReactNode
}
const BreadcrumbRoot = React.forwardRef<HTMLElement, BreadcrumbRootProps>(({ separator, ...props }, ref) => (
  <nav ref={ref} aria-label='breadcrumb' {...props} />
))
BreadcrumbRoot.displayName = "BreadcrumbRoot"

/**
 * BreadcrumbList
 */
export type BreadcrumbListProps = React.ComponentPropsWithoutRef<"ol">
const BreadcrumbList = React.forwardRef<HTMLOListElement, BreadcrumbListProps>(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    className={cxm(
      "flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5",
      className
    )}
    {...props}
  />
))
BreadcrumbList.displayName = "BreadcrumbList"

/**
 * BreadcrumbItem
 */
export type BreadcrumbItemProps = React.ComponentPropsWithoutRef<"li">
const BreadcrumbItem = React.forwardRef<HTMLLIElement, BreadcrumbItemProps>(({ className, ...props }, ref) => (
  <li ref={ref} className={cxm("inline-flex items-center gap-1.5", className)} {...props} />
))
BreadcrumbItem.displayName = "BreadcrumbItem"

/**
 * BreadcrumbLink
 */
export type BreadcrumbLinkProps = React.ComponentPropsWithoutRef<"a"> & {
  asChild?: boolean
}
const BreadcrumbLink = React.forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  ({ asChild, className, ...props }, ref) => {
    const Comp = asChild ? Primitives.Slot : "a"

    return <Comp ref={ref} className={cxm("transition-colors hover:text-foreground", className)} {...props} />
  }
)
BreadcrumbLink.displayName = "BreadcrumbLink"

/**
 * BreadcrumbPage
 */
const BreadcrumbPage = React.forwardRef<HTMLSpanElement, React.ComponentPropsWithoutRef<"span">>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      role='link'
      aria-disabled='true'
      aria-current='page'
      className={cxm("font-normal text-foreground", className)}
      {...props}
    />
  )
)
BreadcrumbPage.displayName = "BreadcrumbPage"

/**
 * BreadcrumbSeparator
 */
const BreadcrumbSeparator = ({ children, className, ...props }: React.ComponentProps<"li">) => (
  <li role='presentation' aria-hidden className={cxm("[&>svg]:h-3.5 [&>svg]:w-3.5", className)} {...props}>
    {children ?? <ChevronRight className='h-4 w-4' />}
  </li>
)
BreadcrumbSeparator.displayName = "BreadcrumbSeparator"

/**
 * BreadcrumbEllipsis
 */
const BreadcrumbEllipsis = ({ className, ...props }: React.ComponentProps<"span">) => (
  <span role='presentation' className={cxm("flex h-9 w-9 items-center justify-center", className)} {...props}>
    <MoreHorizontal className='size-4' />
    <span className='sr-only'>More</span>
  </span>
)
BreadcrumbEllipsis.displayName = "BreadcrumbElipssis"

/**
 * BreadcrumbLoading
 */
const BreadcrumbLoading = ({ className, ...props }: React.ComponentProps<"span">) => (
  <span role='presentation' className={cxm("flex h-9 w-9 items-center justify-center", className)} {...props}>
    <Loader2 className='size-4 animate-spin' />
    <span className='sr-only'>Loading</span>
  </span>
)
BreadcrumbLoading.displayName = "BreadcrumbLoading"

export {
  BreadcrumbEllipsis as Ellipsis,
  BreadcrumbItem as Item,
  BreadcrumbLink as Link,
  BreadcrumbList as List,
  BreadcrumbLoading as Loading,
  BreadcrumbPage as Page,
  BreadcrumbRoot as Root,
  BreadcrumbSeparator as Separator,
}
