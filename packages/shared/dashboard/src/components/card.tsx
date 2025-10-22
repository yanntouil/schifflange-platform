import { Selectable, useShiftPressed } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { cxm, G } from "@compo/utils"
import { MoreHorizontalIcon } from "lucide-react"
import React from "react"

const CardContext = React.createContext<{
  isSelected?: boolean
  item?: { id: string }
  menu?: React.ReactNode
  selectable?: Selectable<{ id: string }>["selectable"]
  hasNoMenu?: boolean
  hasNoSelection?: boolean
  disabled?: boolean
  canSelect?: boolean
}>({})

/**
 * Card
 */
type CardRootProps<T extends { id: string }> = React.ComponentProps<"div"> & {
  selected?: boolean
  item?: T
  menu?: React.ReactNode
  selectable?: Selectable<T>["selectable"]
  disabled?: boolean
  canSelect?: boolean
}
const CardRoot: React.FC<CardRootProps<any>> = ({
  children,
  menu,
  item,
  selectable,
  className,
  disabled,
  canSelect,
  ...props
}) => {
  const { _ } = useTranslation(dictionary)
  const hasNoMenu = G.isNullable(menu) && G.isNullable(selectable) && G.isNullable(item)
  const hasNoSelection = G.isNullable(selectable) && G.isNullable(item)
  const isSelected = React.useMemo(
    () => selectable?.selected.some((current) => current.id === item?.id),
    [selectable, item]
  )
  const shiftKey = useShiftPressed()

  return (
    <CardContext.Provider
      value={{ isSelected, item, menu, selectable, hasNoMenu, hasNoSelection, disabled, canSelect }}
    >
      <Ui.ContextMenu.Quick menu={menu} className='min-w-[16rem]'>
        <div
          className={cxm(
            "group/item bg-card @container/item relative flex w-full flex-col items-center overflow-hidden rounded-sm border select-none",
            "ring-offset-card ring-offset-2",
            "hover:ring-ring hover:ring-1",
            "focus-within:ring-ring focus-within:ring-1",
            isSelected && "ring-primary hover:ring-primary focus-within:ring-primary ring-1",
            (shiftKey || selectable?.hasSelection) && "cursor-pointer",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </Ui.ContextMenu.Quick>
    </CardContext.Provider>
  )
}

/**
 * CardImage
 */
type CardImageProps = React.ComponentProps<typeof Ui.Image>
const CardImage: React.FC<CardImageProps> = ({ classNames, ...props }) => {
  return (
    <Ui.Image
      {...props}
      classNames={{
        wrapper: cxm("flex-none w-full aspect-[3/2] rounded-t-sm [&_svg]:size-8 [&_svg]:stroke-1", classNames?.wrapper),
        image: cxm("rounded-t-sm object-cover aspect-[3/2] object-center size-full", classNames?.image),
        fallback: cxm("flex items-center justify-center size-full rounded-t-sm bg-muted/30", classNames?.fallback),
      }}
    />
  )
}

/**
 * RowHeader
 */
type CardHeaderProps = React.ComponentProps<"div"> & {
  classNames?: { header?: string; aside?: string }
}
const CardHeader: React.FC<CardHeaderProps> = ({ className, children, ...props }) => {
  const { item, menu, selectable, hasNoMenu, hasNoSelection } = React.useContext(CardContext)
  const hasAside = !hasNoMenu || !hasNoSelection
  return (
    <div className={cxm("relative flex w-full flex-col gap-0.5 px-4 py-4", className)} {...props}>
      {children}
      {hasAside && (
        <div
          className='absolute top-2 right-2 flex items-start justify-end'
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
        >
          <div className='flex h-8 items-center justify-end gap-2'>
            {G.isNotNullable(selectable) && G.isNotNullable(item) && (
              <CardSelection item={item} selectable={selectable} />
            )}
            <CardMenu menu={menu} />
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * RowTitle
 */
type CardTitleProps = React.ComponentProps<typeof Ui.Hn>
const CardTitle: React.FC<CardTitleProps> = ({ className, style, children, ...props }) => {
  const { hasNoMenu, hasNoSelection } = React.useContext(CardContext)
  const menu = hasNoMenu ? 0 : 7
  const selection = hasNoSelection ? 0 : 4
  const aside = menu + selection
  const asideStyle = { "--aside": aside ? `calc(var(--spacing)*${aside + 2})` : "0px" } as React.CSSProperties
  return (
    <Ui.Hn
      className={cxm("text-sm leading-tight font-medium mr--[var(--aside)]", className)}
      style={{ ...asideStyle, ...style }}
      {...props}
    >
      <span
        /* replace the margin right by a float right block */
        className='block float-right h-6 w-[var(--aside)]'
        aria-hidden
      />
      {children}
    </Ui.Hn>
  )
}

/**
 * RowDescription
 */
type CardDescriptionProps = React.ComponentProps<"p">
const CardDescription: React.FC<CardDescriptionProps> = ({ className, ...props }) => {
  return <p className={cxm("text-muted-foreground text-xs", className)} {...props} />
}

/**
 * RowContent
 */
type CardContentProps = React.ComponentProps<"div">
const CardContent: React.FC<CardContentProps> = ({ className, ...props }) => {
  return <div className={cxm("flex w-full grow flex-col px-4 pb-4", className)} {...props} />
}

/**
 * RowBadge
 */
type CardFieldProps = React.ComponentPropsWithoutRef<"span"> & {
  tooltip?: React.ReactNode
}
const CardField: React.FC<CardFieldProps> = ({ className, tooltip, children, ...props }) => {
  return (
    <Ui.Tooltip.Quick tooltip={tooltip} side='left' asChild>
      <span
        className={cxm(
          "text-primary w-full shrink-0 items-center rounded-md py-1 text-xs leading-4 font-light tracking-tight [&>svg]:mr-1 [&>svg]:inline-block [&>svg]:size-3.5 [&>svg]:stroke-[1.5]",
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
 * CardSelection
 */
type CardSelectionProps<T extends { id: string }> = React.ComponentPropsWithRef<typeof Ui.Checkbox> & {
  item: T
  selectable: Selectable<T>["selectable"]
  classNames?: {
    wrapper?: string
    checkbox?: string
  }
}
const CardSelection = React.forwardRef<React.ElementRef<typeof Ui.Checkbox>, CardSelectionProps<{ id: string }>>(
  ({ item, selectable, className, classNames, ...props }, ref) => {
    const { disabled, canSelect } = React.useContext(CardContext)
    const { hasSelection, multiple, select, unselect, selected, isSelected } = selectable
    const onCheckedChange = (value: boolean) => (value ? select(item) : unselect(item))
    if (canSelect === false) return null
    return (
      <span
        className={cxm("flex shrink-0 items-center justify-center", classNames?.wrapper)}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
      >
        <Ui.Checkbox
          ref={ref}
          checked={isSelected(item)}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
          {...props}
          className={cxm(
            "transition-opacity duration-300 ease-in-out",
            "group-focus-within/item:opacity-100",
            "group-hover/item:opacity-100",
            hasSelection && multiple ? "opacity-100" : "opacity-0",
            isSelected(item) && "opacity-100",
            className,
            classNames?.checkbox
          )}
          variant='outline'
          size='sm'
        />
      </span>
    )
  }
)

/**
 * CardMenu
 */
type CardMenuProps = React.ComponentProps<typeof Ui.ContextMenu.Quick> & {
  tooltip?: string
  classNames?: {
    wrapper?: string
    button?: string
    trigger?: string
    content?: string
  }
}
const CardMenu: React.FC<CardMenuProps> = ({ ...props }) => {
  const { _ } = useTranslation(dictionary)
  const { disabled } = React.useContext(CardContext)
  const { children, tooltip = _("menu-tooltip"), menu, classNames, ...rest } = props
  if (G.isNullable(menu)) return null

  return (
    <span
      className={cxm("flex shrink-0 items-center justify-center", classNames?.wrapper)}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
      }}
    >
      <Ui.DropdownMenu.Quick menu={menu} className='min-w-[16rem]' side='left' align='start' {...rest}>
        <Ui.Tooltip.Quick
          tooltip={_("menu-tooltip")}
          side='top'
          align='center'
          asChild
          classNames={classNames}
          disabled={disabled}
        >
          <Ui.Button variant='ghost' icon size='xs' className={classNames?.button}>
            <MoreHorizontalIcon aria-hidden />
            <Ui.SrOnly>{_("menu-tooltip")}</Ui.SrOnly>
          </Ui.Button>
        </Ui.Tooltip.Quick>
      </Ui.DropdownMenu.Quick>
    </span>
  )
}

export {
  CardContent as Content,
  CardDescription as Description,
  CardField as Field,
  CardHeader as Header,
  CardImage as Image,
  CardMenu as Menu,
  CardRoot as Root,
  CardSelection as Selection,
  CardTitle as Title,
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
