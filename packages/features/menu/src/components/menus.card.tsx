import { Dashboard } from "@compo/dashboard"
import { smartClick } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { match } from "@compo/utils"
import { Api } from "@services/dashboard"
import { MapPin } from "lucide-react"
import React from "react"
import { useMenus } from "../menus.context"
import { MenusMenu } from "./menus.menu"

/**
 * MenusCard
 */
export const MenusCard: React.FC<{ menu: Api.Menu & Api.WithMenuItems }> = ({ menu }) => {
  const { _, formatDistance } = useTranslation(dictionary)
  const { selectable, displayMenu } = useMenus()

  return (
    <Dashboard.Card.Root
      key={menu.id}
      menu={<MenusMenu menu={menu} />}
      item={menu}
      // selectable={selectable}
      {...smartClick(menu, selectable, () => displayMenu(menu))}
    >
      <Dashboard.Card.Header>
        <Dashboard.Card.Title>{menu.name}</Dashboard.Card.Title>
        <Dashboard.Card.Description>{_("items-count", { count: menu.items.length })}</Dashboard.Card.Description>
      </Dashboard.Card.Header>
      <Dashboard.Card.Content>
        <Dashboard.Card.Field>
          <MapPin aria-hidden className='text-muted-foreground' />
          {match(menu.location)
            .with("header", () => _("location-header"))
            .with("footer", () => _("location-footer"))
            .otherwise(() => menu.location)}
        </Dashboard.Card.Field>
      </Dashboard.Card.Content>
    </Dashboard.Card.Root>
  )
}

/**
 * translations
 */
const dictionary = {
  fr: {
    "items-count": "{{count}} éléments de menu",
    "location-header": "En-tête",
    "location-footer": "Pied de page",
  },
  de: {
    "items-count": "{{count}} Menüelemente",
    "location-header": "Kopfzeile",
    "location-footer": "Fußzeile",
  },
  en: {
    "items-count": "{{count}} menu items",
    "location-header": "Header",
    "location-footer": "Footer",
  },
}
