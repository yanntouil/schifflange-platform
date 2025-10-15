import { Selectable, useShiftPressed } from "@compo/hooks"
import { DictionaryFn, useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { cxm, G, ImplicitAny } from "@compo/utils"
import { Cell, flexRender, HeaderGroup, Row, Table } from "@tanstack/react-table"
import { MoreHorizontalIcon } from "lucide-react"
import React from "react"
import { getPinningStyles } from "./table.utils"

/**
 * TableRoot
 */
type TableRootProps = React.ComponentProps<typeof Ui.OITable.Root> & {
  fixed?: boolean
  table: Table<any>
  classNames?: {
    wrapper?: string
    table?: string
  }
}
const TableRoot: React.FC<TableRootProps> = ({ children, className, fixed = false, table, classNames, ...props }) => {
  return (
    <Ui.OITable.Root
      {...props}
      className={cxm(
        "group/table",
        "[&_td]:border-border [&_th]:border-border table-fixed border-separate border-spacing-0 select-none [&_tfoot_td]:border-t [&_th]:border-b [&_tr]:border-none [&_tr:not(:last-child)_td]:border-b",
        className
      )}
      classNames={classNames}
      style={{
        width: fixed ? table.getTotalSize() : undefined,
      }}
    >
      {children}
    </Ui.OITable.Root>
  )
}

/**
 * TableHeader
 */
type TableHeaderProps = React.ComponentProps<typeof Ui.OITable.Header> & {
  headerGroups: HeaderGroup<ImplicitAny>[]
  t: DictionaryFn
  classNames?: {
    header?: string
    headerRow?: string
    head?: string
  }
}
const TableHeader: React.FC<TableHeaderProps> = ({ children, className, headerGroups, t, classNames, ...props }) => {
  return (
    <Ui.OITable.Header
      {...props}
      className={cxm("group/header", "bg-transparent hover:bg-transparent", classNames?.header, className)}
    >
      {headerGroups.map((headerGroup) => (
        <Ui.OITable.Row
          key={headerGroup.id}
          className={cxm("bg-transparent hover:bg-transparent", classNames?.headerRow)}
        >
          {headerGroup.headers.map((header) => {
            const { column } = header
            const rawHeader = column.columnDef.header
            const isPinned = column.getIsPinned()
            const isLastLeftPinned = isPinned === "left" && column.getIsLastColumn("left")
            const isFirstRightPinned = isPinned === "right" && column.getIsFirstColumn("right")
            const headerLabel = G.isString(rawHeader) ? t(rawHeader) : rawHeader
            return (
              <Ui.OITable.Head
                key={header.id}
                className={cxm(
                  // "[&[data-pinned][data-last-col]]:border-border data-pinned:bg-muted/90 border-t data-pinned:backdrop-blur-xs [&[data-pinned=left][data-last-col=left]]:border-r [&[data-pinned=right][data-last-col=right]]:border-l",
                  "relative h-10 truncate [&:not([data-pinned]):has(+[data-pinned])_div.cursor-col-resize:last-child]:opacity-0 [&[data-last-col=left]_div.cursor-col-resize:last-child]:opacity-0 [&[data-pinned=right]:last-child_div.cursor-col-resize:last-child]:opacity-0",
                  classNames?.head
                )}
                colSpan={header.colSpan}
                data-pinned={isPinned || undefined}
                data-last-col={isLastLeftPinned ? "left" : isFirstRightPinned ? "right" : undefined}
                style={{
                  width: header.getSize(),
                }}
              >
                <div className='flex items-center justify-between gap-2'>
                  <span className='truncate'>
                    {header.isPlaceholder ? null : flexRender(headerLabel, header.getContext())}
                  </span>
                  {header.column.getCanResize() && (
                    <span
                      onDoubleClick={() => header.column.resetSize()}
                      onMouseDown={header.getResizeHandler()}
                      onTouchStart={header.getResizeHandler()}
                      className={cxm(
                        "group-hover/header:before:bg-border",
                        "user-select-none absolute top-0 -right-2 z-10 flex h-full w-4 cursor-col-resize touch-none justify-center",
                        "before:absolute before:inset-y-2 before:w-px before:-translate-x-px"
                      )}
                    />
                  )}
                </div>
              </Ui.OITable.Head>
            )
          })}
        </Ui.OITable.Row>
      ))}
    </Ui.OITable.Header>
  )
}

/**
 * TableBody
 */
const TableBody: React.FC<React.ComponentProps<typeof Ui.OITable.Body>> = ({ children, className, ...props }) => {
  return (
    <Ui.OITable.Body {...props} className={cxm(className)}>
      {children}
    </Ui.OITable.Body>
  )
}

/**
 * TableRow
 */
type TableRowProps<T extends { id: string }> = React.ComponentProps<typeof Ui.OITable.Row> & {
  selected?: boolean
  item?: T
  menu?: React.ReactNode
  selectable?: Selectable<T>["selectable"]
  cells: Cell<ImplicitAny, ImplicitAny>[]
  disabled?: boolean
}
const TableRow: React.FC<TableRowProps<any>> = ({
  children,
  menu,
  item,
  selectable,
  className,
  cells,
  disabled,
  ...props
}) => {
  const shiftKey = useShiftPressed()
  const isSelected = selectable?.selected.some((current) => current.id === item?.id)
  return (
    <Ui.ContextMenu.Quick menu={disabled ? undefined : menu}>
      <Ui.OITable.Row
        {...props}
        className={cxm(
          "group/item hover:bg-muted bg-card @container/item",
          "duration-300 ease-in-out",
          isSelected && "bg-primary/2",
          (shiftKey || selectable?.hasSelection) && "cursor-pointer select-none",
          disabled && "opacity-50",
          className
        )}
        data-disabled={disabled || undefined}
      >
        {cells.map((cell) => {
          const { column } = cell
          const isPinned = column.getIsPinned()
          const isLastLeftPinned = isPinned === "left" && column.getIsLastColumn("left")
          const isFirstRightPinned = isPinned === "right" && column.getIsFirstColumn("right")

          return (
            <Ui.OITable.Cell
              key={cell.id}
              className={cxm(
                // "[&[data-pinned][data-last-col]]:border-border [&[data-pinned=left][data-last-col=left]]:border-r [&[data-pinned=right][data-last-col=right]]:border-l",
                "data-pinned:bg-card/80 data-pinned:backdrop-blur-[1px]",
                "truncate"
              )}
              style={{ ...getPinningStyles(column) }}
              data-disabled={disabled || undefined}
              data-pinned={isPinned || undefined}
              data-last-col={isLastLeftPinned ? "left" : isFirstRightPinned ? "right" : undefined}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </Ui.OITable.Cell>
          )
        })}
      </Ui.OITable.Row>
    </Ui.ContextMenu.Quick>
  )
}

/**
 * TableRowCheckbox
 */
type TableRowCheckboxProps<T extends { id: string } = { id: string }> = React.ComponentPropsWithRef<
  typeof Ui.Checkbox
> & {
  item: T
  selectable: Selectable<T>["selectable"]
}
const TableRowCheckbox = React.forwardRef<React.ElementRef<typeof Ui.Checkbox>, TableRowCheckboxProps>(
  ({ item, selectable, className, ...props }, ref) => {
    const { select, unselect, selected } = selectable
    const isSelected = React.useMemo(() => selected.some((current) => current.id === item.id), [selected, item])
    const onCheckedChange = (value: boolean) => (value ? select(item) : unselect(item))
    return (
      <span
        onClick={(e) => {
          e.stopPropagation()
          e.preventDefault()
        }}
      >
        <Ui.Checkbox
          checked={isSelected}
          onCheckedChange={onCheckedChange}
          variant='outline'
          size='sm'
          className='group-data-disabled:pointer-events-none'
        />
      </span>
    )
  }
)

/**
 * TableRowMenu
 */
type TableRowMenuProps = React.ComponentProps<typeof Ui.ContextMenu.Quick> & {
  tooltip?: string
}
const TableRowMenu: React.FC<TableRowMenuProps> = ({ ...props }) => {
  const { _ } = useTranslation(dictionary)
  const { children, tooltip = _("menu-tooltip"), menu, ...rest } = props
  if (!menu) return null
  return (
    <span className='flex shrink-0 items-center justify-center'>
      <Ui.DropdownMenu.Quick menu={menu} className='min-w-[16rem]'>
        <Ui.Tooltip.Quick tooltip={_("menu-tooltip")} side='left' asChild>
          <Ui.Button variant='ghost' icon size='sm' className='bg-card/80 backdrop-blur-[1px]'>
            <MoreHorizontalIcon aria-hidden />
            <Ui.SrOnly>{_("menu-tooltip")}</Ui.SrOnly>
          </Ui.Button>
        </Ui.Tooltip.Quick>
      </Ui.DropdownMenu.Quick>
    </span>
  )
}

/**
 * table
 */
type TableProps<T extends { id: string }> = {
  table: Table<T>
  t: DictionaryFn
  children: (row: Row<T>) => React.ReactNode
  fixed?: boolean
  classNames?: {
    wrapper?: string
    table?: string
    header?: string
    headerRow?: string
    head?: string
    body?: string
  }
}
const Tanstack: React.FC<TableProps<any>> = <T extends { id: string }>({
  table,
  t,
  children,
  fixed = false,
  classNames,
}: TableProps<T>) => {
  return (
    <TableRoot fixed={fixed} table={table} classNames={classNames}>
      <TableHeader headerGroups={table.getHeaderGroups()} t={t} classNames={classNames} />
      <TableBody className={classNames?.body}>
        {table.getRowModel().rows.map((row) => (
          <React.Fragment key={row.id}>{children(row)}</React.Fragment>
        ))}
      </TableBody>
    </TableRoot>
  )
}

export {
  TableBody as Body,
  TableRowCheckbox as Checkbox,
  TableHeader as Header,
  TableRowMenu as Menu,
  TableRoot as Root,
  TableRow as Row,
  Tanstack,
}

/**
 * translation
 */
const dictionary = {
  fr: {
    "menu-tooltip": "Menu",
  },
  en: {
    "menu-tooltip": "Menu",
  },
  de: {
    "menu-tooltip": "Menü",
  },
}
