import { Dashboard } from "@compo/dashboard"
import { A } from "@compo/utils"
import { Api } from "@services/dashboard"
import React from "react"
import { MenusCard } from "./menus.card"

/**
 * MenusCards
 */
export const MenusCards: React.FC<{ menus: (Api.Menu & Api.WithMenuItems)[] }> = ({ menus }) => {
  return (
    <section className={Dashboard.collectionCards()}>
      {A.map(menus, (menu) => (
        <MenusCard key={menu.id} menu={menu} />
      ))}
    </section>
  )
}
