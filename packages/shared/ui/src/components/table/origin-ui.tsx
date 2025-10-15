import * as React from "react"
import { variants } from "../.."
import { cn } from "@compo/utils"

type TableRootProps = React.ComponentProps<"table"> & {
  classNames?: {
    wrapper?: string
    table?: string
  }
}
const TableRoot = React.forwardRef<HTMLTableElement, TableRootProps>(({ className, classNames, ...props }, ref) => {
  return (
    <div className={cn("relative w-full overflow-auto", variants.scrollbar({ variant: "thin" }), classNames?.wrapper)}>
      <table
        ref={ref}
        data-slot='table'
        className={cn("w-full caption-bottom text-sm", classNames?.table, className)}
        {...props}
      />
    </div>
  )
})
TableRoot.displayName = "TableRoot"

const TableHeader = React.forwardRef<HTMLTableSectionElement, React.ComponentProps<"thead">>(
  ({ className, ...props }, ref) => {
    return <thead ref={ref} data-slot='table-header' className={cn(className)} {...props} />
  }
)
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<HTMLTableSectionElement, React.ComponentProps<"tbody">>(
  ({ className, ...props }, ref) => {
    return <tbody ref={ref} data-slot='table-body' className={cn("[&_tr:last-child]:border-0", className)} {...props} />
  }
)
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<HTMLTableSectionElement, React.ComponentProps<"tfoot">>(
  ({ className, ...props }, ref) => {
    return (
      <tfoot
        ref={ref}
        data-slot='table-footer'
        className={cn("bg-muted/50 border-t font-medium [&>tr]:last:border-b-0", className)}
        {...props}
      />
    )
  }
)
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<HTMLTableRowElement, React.ComponentProps<"tr">>(({ className, ...props }, ref) => {
  return (
    <tr
      data-slot='table-row'
      className={cn("hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors", className)}
      {...props}
    />
  )
})
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<HTMLTableCellElement, React.ComponentProps<"th">>(({ className, ...props }, ref) => {
  return (
    <th
      data-slot='table-head'
      className={cn(
        "text-muted-foreground h-12 px-3 text-left align-middle font-medium has-[role=checkbox]:w-px [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  )
})
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<HTMLTableCellElement, React.ComponentProps<"td">>(({ className, ...props }, ref) => {
  return (
    <td data-slot='table-cell' className={cn("p-3 align-middle [&:has([role=checkbox])]:pr-0", className)} {...props} />
  )
})
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.ComponentProps<"caption">>(
  ({ className, ...props }, ref) => {
    return (
      <caption data-slot='table-caption' className={cn("text-muted-foreground mt-4 text-sm", className)} {...props} />
    )
  }
)
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
