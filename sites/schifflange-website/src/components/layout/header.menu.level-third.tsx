"use client"

import { match } from "@compo/utils"
import { A } from "@mobily/ts-belt"
import * as Primitive from "@radix-ui/react-navigation-menu"
import React from "react"
import { Api } from "../../service"
import { ItemLink } from "./header.menu.item-link"
import { NavigationContext, navigationItemCx } from "./header.menu.level-second"

/**
 * render a second level
 */
type LevelThirdProps = {
  items: Api.MenuItemWithRelations[]
  navigation: NavigationContext
}
export const LevelThirdList: React.FC<LevelThirdProps> = ({ items, navigation }) => {
  return (
    <ul className='flex flex-col gap-1'>
      {A.map(items, (item) =>
        match(item)
          .with({ type: "group" }, (item) => <LevelThirdGroup key={item.id} item={item} navigation={navigation} />)
          .otherwise((item) => <LevelThirdItem key={item.id} item={item} navigation={navigation} />)
      )}
    </ul>
  )
}

/**
 * render a third level as a group
 */
type LevelThirdGroupProps = {
  item: Api.MenuItemGroup
  navigation: NavigationContext
}
const LevelThirdGroup: React.FC<LevelThirdGroupProps> = (props) => {
  // not supported yet
  return null
}

/**
 * render a third level as a item
 */
type LevelThirdItemProps = {
  item: Api.MenuItemLink | Api.MenuItemResource | Api.MenuItemUrl
  navigation: NavigationContext
}
const LevelThirdItem: React.FC<LevelThirdItemProps> = (props) => {
  const { item, navigation } = props
  const linkRef = React.useRef<HTMLAnchorElement>(null)

  // Focus si cet item a le focusId
  React.useEffect(() => {
    if (navigation.focusId === item.id) {
      linkRef.current?.focus()
    }
  }, [navigation.focusId, item.id])

  return (
    <Primitive.Item
      data-state={navigation.focusId === item.id ? "active" : "inactive"}
      className='group/item'
      onMouseEnter={() => navigation.setFocusId(item.id)}
    >
      <Primitive.Link asChild className={navigationItemCx}>
        <ItemLink item={item} ref={linkRef} />
      </Primitive.Link>
    </Primitive.Item>
  )
}
