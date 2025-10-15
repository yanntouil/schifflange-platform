import { cn } from "@/lib/utils"
import { Primitives } from "@compo/primitives"

function Breadcrumb({ ...props }: React.ComponentProps<"nav">) {
  return <nav aria-label='breadcrumb' data-slot='breadcrumb' {...props} />
}

function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      data-slot='breadcrumb-list'
      className={cn(
        "text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5",
        className
      )}
      {...props}
    />
  )
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
  return <li data-slot='breadcrumb-item' className={cn("inline-flex items-center gap-1.5", className)} {...props} />
}

function BreadcrumbLink({
  asChild,
  className,
  current = false,
  ...props
}: React.ComponentProps<"a"> & {
  asChild?: boolean
  current?: boolean
}) {
  const Comp = asChild ? Primitives.Slot : "a"

  return (
    <Comp
      data-slot='breadcrumb-link'
      className={cn(
        "text-[14px] leading-normal text-[#5D5F72] font-normal hover:text-foreground transition-colors cursor-pointer",
        current && "text-[#1D1D1B]",
        className
      )}
      {...props}
    />
  )
}

function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot='breadcrumb-page'
      role='link'
      aria-disabled='true'
      aria-current='page'
      className={cn("text-foreground font-normal", className)}
      {...props}
    />
  )
}

function BreadcrumbSeparator({ children, className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot='breadcrumb-separator'
      role='presentation'
      aria-hidden='true'
      className={cn("[&>svg]:size-3.5 text-[14px] leading-normal text-[#5D5F72] font-normal", className)}
      {...props}
    >
      {children ?? "/"}
    </li>
  )
}

export { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator }
