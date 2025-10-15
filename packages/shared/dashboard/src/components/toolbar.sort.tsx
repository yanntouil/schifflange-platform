import { DictionaryFn, useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { A, D, MatchableSize, match } from "@compo/utils"
import {
  ArrowDown01,
  ArrowDown10,
  ArrowDownAZ,
  ArrowDownNarrowWide,
  ArrowDownWideNarrow,
  ArrowDownZA,
  LucideProps,
} from "lucide-react"
import React from "react"
import { useToolbar } from "./toolbar.context"

/**
 * Toolbar sort
 */
type ToolbarSortProps<T extends Sort> = React.ComponentPropsWithoutRef<"div"> & {
  size?: MatchableSize
  sort: T
  sortBy: MakeSortBy<keyof T>
  setSortBy: (sortBy: MakeSortBy<keyof T>) => void
  t: DictionaryFn
}
const ToolbarSort: React.FC<ToolbarSortProps<Sort>> = ({ t, ...props }) => {
  const { _ } = useTranslation(dictionary)
  const { size: toolbarSize } = useToolbar()
  const { size = toolbarSize, className, sort, sortBy, setSortBy, ...rest } = props
  const list = useSortOptions(sort, sortBy, setSortBy)
  const { field, direction } = sortBy
  return (
    <Ui.DropdownMenu.Root>
      <Ui.Tooltip.Quick
        asChild
        tooltip={_("sort", {
          field: t(`${field}-${direction}`, { defaultValue: t(field, { defaultValue: field }) }),
        })}
        side='top'
        align='center'
      >
        <Ui.DropdownMenu.Trigger asChild>
          <Ui.Button variant='outline' icon size={size}>
            <SortIcon direction={sortBy.direction} type='default' />
          </Ui.Button>
        </Ui.DropdownMenu.Trigger>
      </Ui.Tooltip.Quick>
      <Ui.DropdownMenu.Content side='left' align='start' className={className} {...rest}>
        {A.map(list, ({ key, direction, isActive, type, onClick }) => (
          <Ui.DropdownMenu.Item key={key} onClick={onClick} active={isActive}>
            <SortIcon direction={direction} type={type} />
            {t(`${key}-${direction}`, { defaultValue: t(key, { defaultValue: key }) })}
          </Ui.DropdownMenu.Item>
        ))}
      </Ui.DropdownMenu.Content>
    </Ui.DropdownMenu.Root>
  )
}

/**
 * types
 */
type SortType = "alphabet" | "number" | "default"
type SortDirection = "asc" | "desc"
type Sort = Record<string, [SortDirection, SortType]>
type MakeSortBy<T> = {
  field: T
  direction: SortDirection
}

/**
 * prepare list of sort options
 */
const useSortOptions = <T extends Sort>(
  sort: T,
  sortBy: MakeSortBy<keyof T>,
  setSortBy: (sortBy: MakeSortBy<keyof T>) => void
) => {
  return A.map(D.toPairs(sort), ([key, [direction, type]]) => {
    const isActive = sortBy.field === key
    const nextDirection = isActive ? (sortBy.direction === "asc" ? "desc" : "asc") : direction
    const onClick = () => setSortBy({ field: key, direction: nextDirection })
    return {
      key,
      direction: nextDirection,
      isActive,
      type,
      onClick,
    }
  })
}

/**
 * Sort icon
 */
export const SortIcon: React.FC<{ direction: SortDirection; type: SortType } & LucideProps> = ({
  type,
  direction,
  ...props
}) => {
  const { _ } = useTranslation(dictionary)
  const label = _(`${type}-${direction}`)
  return match({ type, direction })
    .with({ type: "alphabet", direction: "asc" }, () => <ArrowDownAZ aria-label={label} {...props} />)
    .with({ type: "alphabet", direction: "desc" }, () => <ArrowDownZA aria-label={label} {...props} />)
    .with({ type: "number", direction: "asc" }, () => <ArrowDown01 aria-label={label} {...props} />)
    .with({ type: "number", direction: "desc" }, () => <ArrowDown10 aria-label={label} {...props} />)
    .with({ type: "default", direction: "asc" }, () => <ArrowDownNarrowWide aria-label={label} {...props} />)
    .with({ type: "default", direction: "desc" }, () => <ArrowDownWideNarrow aria-label={label} {...props} />)
    .otherwise(() => null)
}

/**
 * Translations
 */
const dictionary = {
  fr: {
    sort: "Trier par {{field}}",
    "default-asc": "Ordre ascendant",
    "default-desc": "Ordre descendant",
    "alphabet-asc": "De A à Z",
    "alphabet-desc": "De Z à A",
    "number-asc": "De 0 à 9",
    "number-desc": "De 9 à 0",
  },
  en: {
    sort: "Sort by {{field}}",
    "default-asc": "Ascending",
    "default-desc": "Descending",
    "alphabet-asc": "From A to Z",
    "alphabet-desc": "From Z to A",
    "number-asc": "From 0 to 9",
    "number-desc": "From 9 to 0",
  },
  de: {
    sort: "Sortieren nach {{field}}",
    "default-asc": "Aufsteigend",
    "default-desc": "Absteigend",
    "alphabet-asc": "Von A bis Z",
    "alphabet-desc": "Von Z bis A",
    "number-asc": "Von 0 bis 9",
    "number-desc": "Von 9 bis 0",
  },
}

export { ToolbarSort as Sort }
