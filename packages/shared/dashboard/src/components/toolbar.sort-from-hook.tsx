import { UseSortableProps } from "@compo/hooks"
import { DictionaryFn, useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { A, MatchableSize } from "@compo/utils"
import React from "react"
import { useToolbar } from "./toolbar.context"
import { SortIcon } from "./toolbar.sort"

/**
 * ToolbarSort
 */
type Props = UseSortableProps & {
  t: DictionaryFn
  size?: MatchableSize
}
export const SortFromHook: React.FC<Props> = (props) => {
  const { _ } = useTranslation(dictionary)
  const { size: toolbarSize } = useToolbar()
  const { size = toolbarSize, sort, toggle, isActive, getIcon, nextDirection, list, t } = props
  const { field, direction } = sort
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
            <SortIcon direction={direction} type='default' />
          </Ui.Button>
        </Ui.DropdownMenu.Trigger>
      </Ui.Tooltip.Quick>
      <Ui.DropdownMenu.Content align='end' side='bottom'>
        {A.map(list, ([item]) => {
          const direction = nextDirection(item)
          return (
            <Ui.DropdownMenu.Item onClick={() => toggle(item)} active={isActive(item)} key={item}>
              <SortIcon direction={direction} type={getIcon(item)} />
              {t(`${item}-${direction}`, { defaultValue: t(item, { defaultValue: item }) })}
            </Ui.DropdownMenu.Item>
          )
        })}
      </Ui.DropdownMenu.Content>
    </Ui.DropdownMenu.Root>
  )
}

const dictionary = {
  fr: {
    sort: "Trier par {{field}}",
    asc: "Ascendant",
    desc: "Descendant",
    "default-asc": "Ordre ascendant",
    "default-desc": "Ordre descendant",
    "alphabet-asc": "De A à Z",
    "alphabet-desc": "De Z à A",
    "number-asc": "De 0 à 9",
    "number-desc": "De 9 à 0",
  },
  en: {
    sort: "Sort by {{field}}",
    asc: "Ascending",
    desc: "Descending",
    "default-asc": "Ascending",
    "default-desc": "Descending",
    "alphabet-asc": "From A to Z",
    "alphabet-desc": "From Z to A",
    "number-asc": "From 0 to 9",
    "number-desc": "From 9 to 0",
  },
  de: {
    sort: "Sortieren nach {{field}}",
    asc: "Aufsteigend",
    desc: "Absteigend",
    "default-asc": "Aufsteigend",
    "default-desc": "Absteigend",
    "alphabet-asc": "Von A bis Z",
    "alphabet-desc": "Von Z bis A",
    "number-asc": "Von 0 bis 9",
    "number-desc": "Von 9 bis 0",
  },
}
