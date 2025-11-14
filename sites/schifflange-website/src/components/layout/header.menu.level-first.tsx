"use client"

import { cxm, match } from "@compo/utils"
import { A } from "@mobily/ts-belt"
import * as Primitive from "@radix-ui/react-navigation-menu"
import { ChevronDownIcon } from "lucide-react"
import React from "react"
import { Api } from "../../service"
import { Ui } from "../ui"
import { ItemLink } from "./header.menu.item-link"
import { SecondLevelList } from "./header.menu.level-second"

/**
 * render a first level
 */
type LevelFirstListProps = {
  items: Api.MenuItemWithRelations[]
}
export const LevelFirstList: React.FC<LevelFirstListProps> = ({ items }) => {
  return (
    <Primitive.List className='group/list flex flex-1 list-none items-center justify-center gap-1 py-3'>
      {A.map(items, (item) =>
        match(item)
          .with({ type: "group" }, (item) => <LevelFirstGroup key={item.id} item={item} />)
          .otherwise((item) => <LevelFirstItem key={item.id} item={item} />)
      )}
    </Primitive.List>
  )
}

/**
 * Render a first level group
 */
type LevelFirstGroupProps = {
  item: Api.MenuItemGroup
}
const LevelFirstGroup: React.FC<LevelFirstGroupProps> = (props) => {
  const { items, translations } = props.item
  const isNotEmpty = !A.isEmpty(items)
  return (
    <Primitive.Item>
      <Primitive.Trigger className={cxm(levelFirstCx, isNotEmpty && "relative pr-5")}>
        <span className='relative'>{translations?.name || ""}</span>
        <LevelFirstUnderline />
        {isNotEmpty && (
          <>
            <ChevronDownIcon
              className='absolute right-0 top-[14px] size-3 transition duration-300 group-data-[state=open]/first-level:rotate-180'
              aria-hidden='true'
            />
            <span
              className={cxm(
                "absolute left-[calc(50%-2px-5px)] top-[calc(100%+8px)] size-6 bg-white rotate-45",
                "group-data-[state=open]/first-level:transition-opacity group-data-[state=open]/first-level:duration-300",
                "group-data-[state=open]/first-level:delay-100 group-data-[state=open]/first-level:opacity-100",
                "opacity-0"
              )}
              aria-hidden='true'
            />
          </>
        )}
      </Primitive.Trigger>
      {isNotEmpty && (
        <Primitive.Content
          className={cxm(
            "bg-white border-b-[1.5px] border-b-secondary text-foreground p-8",
            "data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 top-0 left-0 w-full md:absolute md:w-auto",
            "**:data-[slot=navigation-menu-link]:focus:ring-0 **:data-[slot=navigation-menu-link]:focus:outline-none"
          )}
        >
          <SecondLevelList items={items} />
        </Primitive.Content>
      )}
    </Primitive.Item>
  )
}

/**
 * Render a first level item as a link
 */
type LevelFirstItemProps = {
  item: Api.MenuItemLink | Api.MenuItemResource | Api.MenuItemUrl
}
const LevelFirstItem: React.FC<LevelFirstItemProps> = (props) => {
  const { item } = props
  return (
    <Primitive.Item>
      <Primitive.Link asChild className={levelFirstCx}>
        <ItemLink item={item}>
          <span>{item.translations?.name || ""}</span>
          <LevelFirstUnderline />
        </ItemLink>
      </Primitive.Link>
    </Primitive.Item>
  )
}

/**
 * Styles for the first level item
 */
const levelFirstCx = cxm(
  "group/first-level inline-flex flex-col gap-2 h-12 w-max items-center justify-center rounded-xs px-5 py-2 text-sm font-bold",
  Ui.variants.disabled(),
  Ui.variants.focus({ variant: "visible" })
)

/**
 * display a underline that animates when the parent is focused, hovered or active
 */
const LevelFirstUnderline: React.FC = () => (
  <span aria-hidden className='block h-[2px] w-full'>
    <span
      className={cxm(
        "block w-0 h-full bg-secondary",
        "group-data-[state=open]/first-level:w-full group-data-[active=true]/first-level:w-full group-hover/first-level:w-full group-focus-visible/first-level:w-full",
        "transition-all duration-300 ease-in-out"
      )}
    />
  </span>
)
