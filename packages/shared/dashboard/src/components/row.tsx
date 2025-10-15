import { Selectable, useShiftPressed } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { Ui, variants } from "@compo/ui"
import { cxm, G } from "@compo/utils"
import { MoreHorizontalIcon } from "lucide-react"
import React from "react"

/**
 * Row
 */
type RowRootProps<T extends { id: string }> = React.ComponentProps<"div"> & {
  selected?: boolean
  item?: T
  menu?: React.ReactNode
  selectable?: Selectable<T>["selectable"]
}
const RowRoot: React.FC<RowRootProps<any>> = ({ children, menu, item, selectable, ...props }) => {
  const { _ } = useTranslation(dictionary)
  const hasNoAside = G.isNullable(menu) && G.isNullable(selectable) && G.isNullable(item)
  const scrollRef = React.useRef<HTMLDivElement>(null)
  useScrollableReset(scrollRef)
  const isSelected = React.useMemo(
    () => selectable?.selected.some((current) => current.id === item?.id),
    [selectable, item]
  )
  const shiftKey = useShiftPressed()

  return (
    <Ui.ContextMenu.Quick menu={menu} className='min-w-[16rem]'>
      <div
        className={cxm(
          "group/item bg-card @container/item relative flex w-full items-center overflow-hidden rounded-sm border select-none",
          "ring-offset-card ring-offset-2",
          "hover:ring-ring hover:ring-1",
          "focus-within:ring-ring focus-within:ring-1",
          isSelected && "ring-primary hover:ring-primary focus-within:ring-primary ring-1",
          (shiftKey || selectable?.hasSelection) && "cursor-pointer select-none"
        )}
        {...props}
      >
        <div
          className={cxm(
            variants.scrollbar({ variant: "thin" }),
            "scrollbar-none flex min-w-0 flex-1 items-start gap-4 overflow-x-auto py-2 pr-[74px] pl-2"
          )}
          ref={scrollRef}
        >
          {children}
        </div>
        {!hasNoAside && (
          <div
            className='absolute inset-y-0 right-0 flex items-start justify-end px-2 py-2'
            style={{ backgroundImage: "linear-gradient(to right, transparent, var(--card) 10%)" }}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
          >
            <div className='flex h-8 items-center justify-end gap-2'>
              {G.isNotNullable(selectable) && G.isNotNullable(item) && (
                <RowSelection item={item} selectable={selectable} />
              )}
              <RowMenu menu={menu} />
            </div>
          </div>
        )}
      </div>
    </Ui.ContextMenu.Quick>
  )
}

/**
 * RowImage
 */
type RowImageProps = React.ComponentProps<typeof Ui.Image>
const RowImage: React.FC<RowImageProps> = ({ classNames, ...props }) => {
  return (
    <Ui.Image
      {...props}
      classNames={{ wrapper: cxm("flex-none size-8 rounded-md [&_svg]:size-4", classNames?.wrapper) }}
    />
  )
}

/**
 * RowHeader
 */
type RowHeaderProps = React.ComponentProps<"div">
const RowHeader: React.FC<RowHeaderProps> = ({ className, ...props }) => {
  return <div className={cxm("flex grow flex-col gap-0.5 @lg/item:min-w-[28rem]", className)} {...props} />
}

/**
 * RowTitle
 */
type RowTitleProps = React.ComponentProps<typeof Ui.Hn>
const RowTitle: React.FC<RowTitleProps> = ({ className, ...props }) => {
  return <Ui.Hn className={cxm("text-sm/none font-medium", className)} {...props} />
}

/**
 * RowDescription
 */
type RowDescriptionProps = React.ComponentProps<"p">
const RowDescription: React.FC<RowDescriptionProps> = ({ className, ...props }) => {
  return <p className={cxm("text-muted-foreground line-clamp-1 text-xs", className)} {...props} />
}

/**
 * RowContent
 */
type RowContentProps = React.ComponentProps<"div">
const RowContent: React.FC<RowContentProps> = ({ className, ...props }) => {
  return <div className={cxm("hidden h-8 items-center gap-2 whitespace-nowrap @lg/item:flex", className)} {...props} />
}

/**
 * RowBadge
 */
type RowBadgeProps = React.ComponentPropsWithoutRef<"span"> & {
  tooltip?: React.ReactNode
}
const RowBadge: React.FC<RowBadgeProps> = ({ className, tooltip, children, ...props }) => {
  return (
    <Ui.Tooltip.Quick tooltip={tooltip} side='left' asChild>
      <span
        className={cxm(
          "text-primary shrink-0 items-center rounded-md px-4 py-2 text-sm leading-4 font-medium [&>svg]:mr-2 [&>svg]:inline-block [&>svg]:size-3.5 [&>svg]:stroke-[2.6]",
          className
        )}
        {...props}
      >
        {children}
      </span>
    </Ui.Tooltip.Quick>
  )
}

/**
 * RowSelection
 */
type RowSelectionProps<T extends { id: string } = { id: string }> = React.ComponentPropsWithRef<typeof Ui.Checkbox> & {
  item: T
  selectable: Selectable<T>["selectable"]
}
const RowSelection = React.forwardRef<React.ElementRef<typeof Ui.Checkbox>, RowSelectionProps>(
  ({ item, selectable, className, ...props }, ref) => {
    const { hasSelection, multiple, select, unselect, selected } = selectable
    const isSelected = React.useMemo(() => selected.some((current) => current.id === item.id), [selected, item])
    const onCheckedChange = (value: boolean) => (value ? select(item) : unselect(item))
    return (
      <span className='flex shrink-0 items-center justify-center'>
        <Ui.Checkbox
          ref={ref}
          checked={isSelected}
          onCheckedChange={onCheckedChange}
          {...props}
          className={cxm(
            "transition-opacity duration-300 ease-in-out",
            "group-focus-within/item:opacity-100",
            "group-hover/item:opacity-100",
            isSelected && "opacity-100",
            hasSelection && multiple ? "opacity-100" : "@2xl/item:opacity-0",
            className
          )}
          variant='outline'
          size='sm'
        />
      </span>
    )
  }
)

/**
 * RowMenu
 */
type RowMenuProps = React.ComponentProps<typeof Ui.ContextMenu.Quick> & {
  tooltip?: string
}
const RowMenu: React.FC<RowMenuProps> = ({ ...props }) => {
  const { _ } = useTranslation(dictionary)
  const { children, tooltip = _("menu-tooltip"), menu, ...rest } = props
  if (G.isNullable(menu)) return null

  return (
    <span className='flex shrink-0 items-center justify-center'>
      <Ui.DropdownMenu.Quick menu={menu} className='min-w-[16rem]'>
        <Ui.Tooltip.Quick tooltip={_("menu-tooltip")} side='left' asChild>
          <Ui.Button variant='ghost' icon size='sm'>
            <MoreHorizontalIcon aria-hidden />
            <Ui.SrOnly>{_("menu-tooltip")}</Ui.SrOnly>
          </Ui.Button>
        </Ui.Tooltip.Quick>
      </Ui.DropdownMenu.Quick>
    </span>
  )
}

export {
  RowBadge as Badge,
  RowContent as Content,
  RowDescription as Description,
  RowHeader as Header,
  RowImage as Image,
  RowMenu as Menu,
  RowRoot as Root,
  RowSelection as Selection,
  RowTitle as Title,
}

/**
 * hooks
 */
type ScrollableResetOptions = {
  delay?: number
}
const useScrollableReset = (ref: React.RefObject<HTMLElement>, options: ScrollableResetOptions = {}) => {
  const { delay = 3000 } = options
  const timeoutRef = React.useRef<number>()

  React.useEffect(() => {
    const el = ref.current
    if (!el) return

    const resetScroll = () => {
      const isHovered = el.matches(":hover")
      const isFocused = el.matches(":focus-within")

      if (!isHovered && !isFocused && el.scrollLeft > 0) {
        el.scrollTo({ left: 0, behavior: "smooth" })
      }
    }

    const handleScroll = () => {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = window.setTimeout(resetScroll, delay)
    }

    el.addEventListener("scroll", handleScroll)
    return () => {
      el.removeEventListener("scroll", handleScroll)
      window.clearTimeout(timeoutRef.current)
    }
  }, [ref, delay])
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
