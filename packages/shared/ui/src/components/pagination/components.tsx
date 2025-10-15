import { Translation, useTranslation } from "@compo/localize"
import { ChevronLeftIcon, ChevronRightIcon, Ellipsis } from "lucide-react"
import * as React from "react"
import { Link } from "wouter"
import { A, cn, cxm, VariantProps } from "@compo/utils"
import { Button, buttonVariants } from "../button"
import { type Pagination } from "./hook"

/**
 * Pagination
 */
export type PaginationProps = React.ComponentProps<"nav">
const PaginationRoot = React.forwardRef<HTMLDivElement, PaginationProps>(({ className, ...props }, ref) => (
  <nav
    ref={ref}
    role='navigation'
    aria-label='pagination'
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
))
PaginationRoot.displayName = "PaginationRoot"

/**
 * PaginationContent
 */
export type PaginationContentProps = React.ComponentProps<"ul">
const PaginationContent = React.forwardRef<HTMLUListElement, PaginationContentProps>(({ className, ...props }, ref) => (
  <ul ref={ref} className={cn("flex flex-row items-center gap-1", className)} {...props} />
))
PaginationContent.displayName = "PaginationContent"

/**
 * PaginationItem
 */
export type PaginationItemProps = React.ComponentProps<"li"> & { hide?: boolean }
const PaginationItem = React.forwardRef<HTMLLIElement, PaginationItemProps>(({ hide, className, ...props }, ref) =>
  hide ? null : <li ref={ref} className={cn("", className)} {...props} />
)
PaginationItem.displayName = "PaginationItem"

/**
 * PaginationLink
 * no props are forwarded to the Link component (ts compatibility problems)
 */
export type PaginationLinkProps = VariantProps<typeof buttonVariants> & {
  isActive?: boolean
  className?: string
  href: string
  children?: React.ReactNode
}
const PaginationLink = React.forwardRef<HTMLAnchorElement, PaginationLinkProps>(
  ({ className, isActive, size, icon, children, href }, ref) => (
    <Link
      ref={ref}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size,
          icon,
        }),
        className
      )}
      href={href}
    >
      {children}
    </Link>
  )
)
PaginationLink.displayName = "PaginationLink"

/**
 * PaginationLinkPrevious
 */
const PaginationLinkPrevious = ({ className, ...props }: React.ComponentProps<typeof PaginationLink>) => {
  const { _ } = useTranslation(dictionary)
  return (
    <PaginationLink
      aria-label='Go to previous page'
      size='default'
      className={cn("gap-1 pl-2.5", className)}
      {...props}
    >
      <ChevronLeftIcon className='h-4 w-4' />
      <span>{_("previous")}</span>
    </PaginationLink>
  )
}
PaginationLinkPrevious.displayName = "PaginationPrevious"

/**
 * PaginationLinkNext
 */
const PaginationLinkNext = ({ className, ...props }: React.ComponentProps<typeof PaginationLink>) => {
  const { _ } = useTranslation(dictionary)
  return (
    <PaginationLink aria-label='Go to next page' size='default' className={cn("gap-1 pr-2.5", className)} {...props}>
      <span>{_("next")}</span>
      <ChevronRightIcon className='h-4 w-4' />
    </PaginationLink>
  )
}
PaginationLinkNext.displayName = "PaginationNext"

/**
 * PaginationLink
 * no props are forwarded to the Link component (ts compatibility problems)
 */
export type PaginationButtonProps = React.ComponentProps<typeof Button> & {
  isActive?: boolean
}
const PaginationButton = React.forwardRef<HTMLButtonElement, PaginationButtonProps>(
  ({ className, isActive, ...props }, ref) => (
    <Button
      ref={ref}
      aria-current={isActive ? "page" : undefined}
      variant={isActive ? "outline" : "ghost"}
      className={cxm(className)}
      {...props}
    />
  )
)
PaginationLink.displayName = "PaginationLink"

/**
 * PaginationPrevious
 */
const PaginationButtonPrevious = ({ className, ...props }: React.ComponentProps<typeof PaginationButton>) => {
  const { _ } = useTranslation(dictionary)
  return (
    <PaginationButton
      aria-label={_("previous-aria")}
      size='default'
      className={cn("gap-1 pl-2.5", className)}
      {...props}
    >
      <ChevronLeftIcon className='h-4 w-4' />
      <span>{_("previous")}</span>
    </PaginationButton>
  )
}
PaginationButtonPrevious.displayName = "PaginationButtonPrevious"

/**
 * PaginationNext
 */
const PaginationButtonNext = ({ className, ...props }: React.ComponentProps<typeof PaginationButton>) => {
  const { _ } = useTranslation(dictionary)
  return (
    <PaginationButton aria-label={_("next-aria")} size='default' className={cn("gap-1 pr-2.5", className)} {...props}>
      <span>{_("next")}</span>
      <ChevronRightIcon className='h-4 w-4' />
    </PaginationButton>
  )
}
PaginationButtonNext.displayName = "PaginationButtonNext"

/**
 * PaginationEllipsis
 */
const PaginationEllipsis = ({ className, ...props }: React.ComponentProps<"span">) => {
  const { _ } = useTranslation(dictionary)
  return (
    <span aria-hidden className={cn("flex h-9 w-9 items-center justify-center", className)} {...props}>
      <Ellipsis className='h-4 w-4' />
      <span className='sr-only'>{_("more")}</span>
    </span>
  )
}
PaginationEllipsis.displayName = "PaginationEllipsis"

/**
 * Pagination
 */
type PaginationSize = VariantProps<typeof buttonVariants>["size"]
export type PaginationQuickProps = Pagination & {
  before?: number
  after?: number
  enabled?: boolean
  className?: string
  size?: PaginationSize
}
const PaginationQuick: React.FC<PaginationQuickProps> = (props) => {
  const { page, setPage, pages, before = 2, after = 2, className, size = "default" } = props

  const buttons = React.useMemo(() => Array.from({ length: pages }, (_, i) => i + 1), [pages])

  // set last page if page is greater than the number of pages
  React.useEffect(() => {
    if (page > pages) setPage(pages)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pages, setPage])

  if (pages <= 1) return null

  const hasBefore = page > before + 1
  const hasALotBefore = page > before + 2
  const hasAfter = page < pages - after
  const hasALotAfter = page < pages - after - 1
  const hasPrev = page > 1
  const hasNext = pages > page

  return (
    <PaginationRoot className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationButtonPrevious onClick={() => setPage(page - 1)} disabled={!hasPrev} size={size} />
        </PaginationItem>
        <PaginationItem hide={!hasBefore}>
          <PaginationButton onClick={() => setPage(1)} size={size} style={{ minWidth: `var(--input-${size}-height)` }}>
            1
          </PaginationButton>
        </PaginationItem>
        <PaginationItem hide={!hasALotBefore}>
          <PaginationEllipsis />
        </PaginationItem>
        {A.map(buttons, (number) => (
          <PaginationItem key={number} hide={!(page >= number - before && page <= number + after)}>
            <PaginationButton
              onClick={() => setPage(number)}
              isActive={page === number}
              size={size}
              style={{ minWidth: `var(--input-${size}-height)` }}
            >
              {number}
            </PaginationButton>
          </PaginationItem>
        ))}
        <PaginationItem hide={!hasALotAfter}>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem hide={!hasAfter}>
          <PaginationButton
            onClick={() => setPage(pages)}
            size={size}
            style={{ minWidth: `var(--input-${size}-height)` }}
          >
            {pages}
          </PaginationButton>
        </PaginationItem>
        <PaginationItem>
          <PaginationButtonNext onClick={() => setPage(page + 1)} disabled={!hasNext} size={size} />
        </PaginationItem>
      </PaginationContent>
    </PaginationRoot>
  )
}

export {
  PaginationButton as Button,
  PaginationButtonNext as ButtonNext,
  PaginationButtonPrevious as ButtonPrevious,
  PaginationContent as Content,
  PaginationEllipsis as Ellipsis,
  PaginationItem as Item,
  PaginationLink as Link,
  PaginationLinkNext as LinkNext,
  PaginationLinkPrevious as LinkPrevious,
  PaginationQuick as Quick,
  PaginationRoot as Root,
}

/**
 * translation
 */
const dictionary = {
  fr: {
    previous: "Précédent",
    "previous-aria": "Aller à la page précédente",
    next: "Suivant",
    "next-aria": "Aller à la page suivante",
    more: "Plus de pages",
  },
  en: {
    previous: "Previous",
    "previous-aria": "Go to previous page",
    next: "Next",
    "next-aria": "Go to next page",
    more: "More pages",
  },
  de: {
    previous: "Vorherige",
    "previous-aria": "Zur vorherigen Seite",
    next: "Nächste",
    "next-aria": "Zur nächsten Seite",
    more: "Mehr Seiten",
  },
} satisfies Translation
