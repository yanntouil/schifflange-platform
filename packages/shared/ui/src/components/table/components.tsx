import * as React from "react"
import { cn } from "@compo/utils"

/**
 * TableRoot
 */
export type TableRootProps = React.ComponentPropsWithoutRef<"table">
const TableRoot = React.forwardRef<HTMLTableElement, TableRootProps>(({ className, ...props }, ref) => (
  <div className='relative w-full overflow-auto'>
    <table ref={ref} className={cn("w-full caption-bottom text-sm", className)} {...props} />
  </div>
))
TableRoot.displayName = "TableRoot"

/**
 * TableHeader
 */
export type TableHeaderProps = React.ComponentPropsWithoutRef<"thead">
const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
)
TableHeader.displayName = "TableHeader"

/**
 * TableBody
 */
export type TableBodyProps = React.ComponentPropsWithoutRef<"tbody">
const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />
))
TableBody.displayName = "TableBody"

/**
 * TableFooter
 */
export type TableFooterProps = React.ComponentPropsWithoutRef<"tfoot">
const TableFooter = React.forwardRef<HTMLTableSectionElement, TableFooterProps>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn("border-t bg-primary-lighter font-medium [&>tr]:last:border-b-0", className)}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

/**
 * TableRow
 */
export type TableRowProps = React.ComponentPropsWithoutRef<"tr">
const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "hover:bg-primary-light data-[state=selected]:bg-primary-light border-b transition-colors",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

/**
 * TableHead
 */
export type TableHeadProps = React.ComponentPropsWithoutRef<"th">
const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

/**
 * TableCell
 */
export type TableCellProps = React.ComponentPropsWithoutRef<"td">
const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", className)}
    {...props}
  />
))
TableCell.displayName = "TableCell"

/**
 * TableCaption
 */
export type TableCaptionProps = React.ComponentPropsWithoutRef<"caption">
const TableCaption = React.forwardRef<HTMLTableCaptionElement, TableCaptionProps>(({ className, ...props }, ref) => (
  <caption ref={ref} className={cn("mt-4 text-sm text-muted-foreground", className)} {...props} />
))
TableCaption.displayName = "TableCaption"

export {
  TableBody as Body,
  TableCaption as Caption,
  TableCell as Cell,
  TableFooter as Footer,
  TableHead as Head,
  TableHeader as Header,
  TableRoot as Root,
  TableRow as Row,
}
